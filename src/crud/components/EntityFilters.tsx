// packages/expo/src/crud/components/EntityFilters.tsx
/**
 * @fileoverview EntityFilters component
 * @description Auto-generates filters based on entity field types
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useMemo } from 'react';

import { useTranslation, handleError } from '@donotdev/core';
import type { AnyEntity } from '@donotdev/core';
import type { FilterState } from '@donotdev/crud';
import { translateFieldLabel } from '@donotdev/crud';
import { getFilterType, isFilterable } from '@donotdev/crud';
import { useCrudFilters } from '@donotdev/crud';
import { useCrudCardList } from '@donotdev/crud';

import { DateFilter, type DateFilterValue } from './DateFilter';
import {
  Button,
  Combobox,
  RangeInput,
  Slider,
  Stack,
  Text,
} from '../../atomic';

import type { ViewStyle } from 'react-native';

/**
 * Shared filter utility - checks if an item matches a filter value
 */
export function matchesFilter(
  itemValue: any,
  filterValue:
    | string
    | { min?: string; max?: string }
    | string[]
    | DateFilterValue,
  fieldType: string
): boolean {
  if (!filterValue) return true;

  if (Array.isArray(filterValue)) {
    if (filterValue.length === 0) return true;
    return filterValue.some((fv) => String(itemValue) === String(fv));
  }

  if (typeof filterValue === 'object' && 'min' in filterValue) {
    const filterType = getFilterType(fieldType);
    const isDate =
      filterType === 'range' &&
      (fieldType === 'date' ||
        fieldType === 'datetime-local' ||
        fieldType === 'timestamp');

    if (isDate) {
      const dateObj =
        itemValue instanceof Date ? itemValue : new Date(itemValue);
      if (isNaN(dateObj.getTime())) return true;
      const itemDateStr = dateObj.toISOString().split('T')[0]!;
      const min = filterValue.min;
      const max = filterValue.max;
      if (min && max) {
        return itemDateStr >= min && itemDateStr <= max;
      }
      if (min) {
        return itemDateStr >= min;
      }
      if (max) {
        return itemDateStr <= max;
      }
      return true;
    }

    const isNumber = filterType === 'range' && !isDate;
    if (isNumber) {
      const numValue = Number(itemValue);
      const min = filterValue.min ? Number(filterValue.min) : undefined;
      const max = filterValue.max ? Number(filterValue.max) : undefined;
      if (min !== undefined && max !== undefined) {
        return numValue >= min && numValue <= max;
      }
      if (min !== undefined) {
        return numValue >= min;
      }
      if (max !== undefined) {
        return numValue <= max;
      }
      return true;
    }
  }

  if (typeof filterValue === 'string') {
    return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
  }

  return true;
}

/** Props for the EntityFilters component. */
export interface EntityFiltersProps<
  T extends Record<string, any> & { id: string } = Record<string, any> & {
    id: string;
  },
> {
  entity: AnyEntity;
  data?: T[];
  fieldsToFilter?: string[];
  variant?: 'inline' | 'sidebar';
  style?: ViewStyle;
  testID?: string;
}

/**
 * EntityFilters - Auto-generates filter UI based on entity field types
 */
export function EntityFilters<
  T extends Record<string, any> & { id: string } = Record<string, any> & {
    id: string;
  },
>({
  entity,
  data: dataProp,
  fieldsToFilter,
  variant = 'inline',
  style,
  testID,
}: EntityFiltersProps<T>) {
  const { t: tCrud, i18n } = useTranslation('crud');
  const { t } = useTranslation([entity.namespace, 'crud']);
  const locale = i18n?.language || 'en';

  const { data: fetchedData } = useCrudCardList(entity, {
    enabled: !dataProp,
  });
  const data = (dataProp ?? (fetchedData?.items || [])) as T[];

  const { filters, setFilters } = useCrudFilters({
    collection: entity.collection,
  });

  const fieldsToShow = useMemo(() => {
    if (fieldsToFilter) {
      return fieldsToFilter.filter((fieldName) => {
        const fieldConfig = entity.fields[fieldName];
        return fieldConfig && isFilterable(fieldConfig.type);
      });
    }
    return Object.keys(entity.fields).filter((fieldName) => {
      const fieldConfig = entity.fields[fieldName];
      return fieldConfig && isFilterable(fieldConfig.type);
    });
  }, [entity.fields, fieldsToFilter]);

  const filterElements = useMemo(() => {
    if (fieldsToShow.length === 0) return null;

    return fieldsToShow.map((fieldName) => {
      const fieldConfig = entity.fields[fieldName];
      if (!fieldConfig) return null;

      const label = translateFieldLabel(fieldName, fieldConfig, t);
      const fieldType = fieldConfig.type || 'text';
      const filterType = getFilterType(fieldType);

      if (!filterType) {
        handleError(
          new Error(
            `Field type "${fieldType}" not registered in field type registry`
          ),
          {
            userMessage: `Field type "${fieldType}" is missing from registry`,
            context: { fieldType, fieldName, operation: 'filter_ui_render' },
            severity: 'warning',
          }
        );
        return null;
      }

      const isDate =
        filterType === 'range' &&
        (fieldType === 'date' ||
          fieldType === 'datetime-local' ||
          fieldType === 'timestamp');

      const isNumber = filterType === 'range' && !isDate;
      const isSelect = filterType === 'select';

      const filterValue = filters[fieldName];

      if (isSelect) {
        const uniqueValues = Array.from(
          new Set(data.map((item) => item[fieldName]).filter(Boolean))
        );
        return (
          <Combobox
            key={fieldName}
            label={label}
            value={filterValue as string | string[]}
            onValueChange={(value) => {
              setFilters({ ...filters, [fieldName]: value });
            }}
            options={uniqueValues.map((val) => ({
              value: String(val),
              label: String(val),
            }))}
            testID={testID ? `${testID}-${fieldName}` : undefined}
          />
        );
      }

      if (isDate) {
        return (
          <DateFilter
            key={fieldName}
            label={label}
            fieldType={fieldType as 'date'}
            value={filterValue as DateFilterValue}
            onChange={(value: DateFilterValue | undefined) => {
              if (value) {
                setFilters({ ...filters, [fieldName]: value });
              } else {
                const { [fieldName]: _, ...rest } = filters;
                setFilters(rest);
              }
            }}
            tCrud={tCrud}
            locale={locale}
            testID={testID ? `${testID}-${fieldName}` : undefined}
          />
        );
      }

      if (isNumber) {
        const rangeFilter =
          typeof filterValue === 'object' &&
          filterValue !== null &&
          'min' in filterValue
            ? (filterValue as { min?: string; max?: string })
            : { min: '', max: '' };

        return (
          <Stack
            key={fieldName}
            gap={8}
            testID={testID ? `${testID}-${fieldName}` : undefined}
          >
            <RangeInput
              label={label}
              minValue={rangeFilter.min}
              maxValue={rangeFilter.max}
              onChange={(min: string, max: string) => {
                const clampedMin =
                  min && Math.abs(Number(min)) > Number.MAX_SAFE_INTEGER
                    ? String(Math.sign(Number(min)) * Number.MAX_SAFE_INTEGER)
                    : min;
                const clampedMax =
                  max && Math.abs(Number(max)) > Number.MAX_SAFE_INTEGER
                    ? String(Math.sign(Number(max)) * Number.MAX_SAFE_INTEGER)
                    : max;
                setFilters({
                  ...filters,
                  [fieldName]: { min: clampedMin, max: clampedMax },
                });
              }}
              onClear={() => {
                const { [fieldName]: _, ...rest } = filters;
                setFilters(rest);
              }}
              testID={testID ? `${testID}-${fieldName}-range` : undefined}
            />
            <Slider
              value={rangeFilter.min ? Number(rangeFilter.min) : 0}
              onValueChange={(value) => {
                const clamped =
                  Math.min(Math.abs(value), Number.MAX_SAFE_INTEGER) *
                  Math.sign(value);
                setFilters({
                  ...filters,
                  [fieldName]: { ...rangeFilter, min: String(clamped) },
                });
              }}
              testID={testID ? `${testID}-${fieldName}-slider` : undefined}
            />
          </Stack>
        );
      }

      return null;
    });
  }, [
    fieldsToShow,
    entity.fields,
    filters,
    setFilters,
    data,
    t,
    tCrud,
    locale,
    testID,
  ]);

  return (
    <Stack gap={16} style={style} testID={testID}>
      {filterElements}
      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          onPress={() => {
            setFilters({});
          }}
          testID={testID ? `${testID}-clear` : undefined}
        >
          {tCrud('filter.clearAll', { defaultValue: 'Clear all filters' })}
        </Button>
      )}
    </Stack>
  );
}

export default EntityFilters;
