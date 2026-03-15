// packages/expo/src/crud/components/DateFilter.tsx
/**
 * @fileoverview DateFilter Component
 * @description Date filter component for Expo
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo } from 'react';

import { formatDate } from '@donotdev/core';

import { Button, Calendar, Sheet, Text, Stack } from '../../atomic';

export type DateFilterValue = { min?: string; max?: string };

export interface DateFilterProps {
  label: string;
  fieldType: 'date' | 'week' | 'month' | 'year';
  value?: DateFilterValue;
  onChange: (value: DateFilterValue | undefined) => void;
  tCrud: (key: string, opts?: { defaultValue?: string }) => string;
  locale?: string;
  testID?: string;
}

/**
 * DateFilter - Simple date filter component
 */
export function DateFilter({
  label,
  fieldType,
  value,
  onChange,
  tCrud,
  locale = 'en',
  testID,
}: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const [activeRange, setActiveRange] = useState<'start' | 'end' | null>(null);

  const parsedValue = useMemo(() => {
    if (!value) {
      return { min: '', max: '' };
    }
    if (typeof value === 'object' && value !== null && 'min' in value) {
      return {
        min: value.min || '',
        max: value.max || '',
      };
    }
    return { min: '', max: '' };
  }, [value]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Validate YYYY-MM-DD format before parsing
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    try {
      const date = new Date(dateStr + 'T00:00:00');
      if (isNaN(date.getTime())) return dateStr;
      return formatDate(date, locale);
    } catch {
      return dateStr;
    }
  };

  const getPresetDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const l7Year = last7Days.getFullYear();
    const l7Month = String(last7Days.getMonth() + 1).padStart(2, '0');
    const l7Day = String(last7Days.getDate()).padStart(2, '0');
    const last7DaysStr = `${l7Year}-${l7Month}-${l7Day}`;

    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    const l30Year = last30Days.getFullYear();
    const l30Month = String(last30Days.getMonth() + 1).padStart(2, '0');
    const l30Day = String(last30Days.getDate()).padStart(2, '0');
    const last30DaysStr = `${l30Year}-${l30Month}-${l30Day}`;

    return {
      today: todayStr,
      yesterday: yesterdayStr,
      last7Days: last7DaysStr,
      last30Days: last30DaysStr,
    };
  };

  const current = parsedValue;
  const presets = getPresetDates();
  const hasValue = !!(current?.min || current?.max);

  const renderCalendarSheet = (range: 'start' | 'end') => {
    const isMin = range === 'start';
    const currentDate = isMin ? current?.min : current?.max;

    return (
      <Stack gap={16} style={{ padding: 16 }}>
        <Stack direction="row" gap={8} style={{ flexWrap: 'wrap' }}>
          {(isMin
            ? ['today', 'yesterday', 'last7Days', 'last30Days']
            : ['today', 'yesterday', 'last7Days', 'last30Days']
          ).map((preset) => {
            const presetDate = presets[preset as keyof typeof presets];
            return (
              <Button
                key={preset}
                variant="outline"
                onPress={() => {
                  onChange({
                    min: isMin ? presetDate : current?.min || '',
                    max: isMin ? current?.max || '' : presetDate,
                  });
                  setOpen(false);
                }}
                testID={testID ? `${testID}-preset-${preset}` : undefined}
              >
                {tCrud(`filter.${preset}`, { defaultValue: preset })}
              </Button>
            );
          })}
        </Stack>
        <Calendar
          value={currentDate ? new Date(currentDate + 'T00:00:00') : undefined}
          onSelect={(date) => {
            if (!date) return;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            onChange({
              min: isMin ? dateStr : current?.min || '',
              max: isMin ? current?.max || '' : dateStr,
            });
            setOpen(false);
          }}
          testID={testID ? `${testID}-calendar-${range}` : undefined}
        />
        <Button
          variant="ghost"
          onPress={() => {
            onChange({
              min: isMin ? '' : current?.min || '',
              max: isMin ? current?.max || '' : '',
            });
            setOpen(false);
          }}
          testID={testID ? `${testID}-clear-${range}` : undefined}
        >
          {tCrud('filter.clear', { defaultValue: 'Clear' })}
        </Button>
      </Stack>
    );
  };

  return (
    <Stack direction="row" align="center" gap={8} testID={testID}>
      <Text level="small" variant="muted" style={{ minWidth: 80 }}>
        {label}:
      </Text>
      <Sheet
        trigger={
          <Button
            variant="outline"
            onPress={() => {
              setActiveRange('start');
              setOpen(true);
            }}
            style={{ flex: 1 }}
            testID={testID ? `${testID}-min-trigger` : undefined}
          >
            {current?.min
              ? formatDisplayDate(current.min)
              : tCrud('filter.min', { defaultValue: 'Min' })}
          </Button>
        }
        title={`${label} - ${tCrud('filter.min', { defaultValue: 'Min' })}`}
        open={open && activeRange === 'start'}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setActiveRange(null);
        }}
        testID={testID ? `${testID}-min-sheet` : undefined}
      >
        {renderCalendarSheet('start')}
      </Sheet>
      <Text level="small" variant="muted">
        –
      </Text>
      <Sheet
        trigger={
          <Button
            variant="outline"
            onPress={() => {
              setActiveRange('end');
              setOpen(true);
            }}
            style={{ flex: 1 }}
            testID={testID ? `${testID}-max-trigger` : undefined}
          >
            {current?.max
              ? formatDisplayDate(current.max)
              : tCrud('filter.max', { defaultValue: 'Max' })}
          </Button>
        }
        title={`${label} - ${tCrud('filter.max', { defaultValue: 'Max' })}`}
        open={open && activeRange === 'end'}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setActiveRange(null);
        }}
        testID={testID ? `${testID}-max-sheet` : undefined}
      >
        {renderCalendarSheet('end')}
      </Sheet>
      <Button
        variant="ghost"
        onPress={() => {
          onChange(undefined);
        }}
        disabled={!hasValue}
        testID={testID ? `${testID}-clear-all` : undefined}
      >
        ×
      </Button>
    </Stack>
  );
}

export default DateFilter;
