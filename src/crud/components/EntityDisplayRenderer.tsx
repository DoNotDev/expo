// packages/expo/src/crud/components/EntityDisplayRenderer.tsx
/**
 * @fileoverview EntityDisplayRenderer component
 * @description Automatically fetches and displays entity data in read-only mode
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect, useState, useMemo } from 'react';

import { useTranslation, isFieldVisible } from '@donotdev/core';
import type { AnyEntity } from '@donotdev/core';
import { useCrud } from '@donotdev/crud';

import { DisplayFieldRenderer } from './DisplayFieldRenderer';
import { Stack, Spinner, Text } from '../../atomic';
import { useAuthSafe } from '../../utils/useAuthSafe';

import type { ViewStyle } from 'react-native';

/** Props for the EntityDisplayRenderer component. */
export interface EntityDisplayRendererProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  entity: AnyEntity;
  id: string;
  t?: (key: string, options?: Record<string, unknown>) => string;
  style?: ViewStyle;
  loadingMessage?: string;
  notFoundMessage?: string;
  viewerRole?: string;
  testID?: string;
}

/**
 * EntityDisplayRenderer - Automatically fetches and displays entity data
 */
export function EntityDisplayRenderer<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  entity,
  id,
  t,
  style,
  loadingMessage,
  notFoundMessage,
  viewerRole: viewerRoleProp,
  testID,
}: EntityDisplayRendererProps<T>) {
  // Auto-detect role from auth; prop overrides
  const authRole = useAuthSafe('userRole');
  const viewerRole = viewerRoleProp ?? authRole;
  const {
    get,
    loading,
    data: storeData,
    error: storeError,
    isAvailable,
  } = useCrud(entity);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { t: tDual } = useTranslation([entity.namespace, 'crud']);
  const { t: tCrud } = useTranslation('crud');
  const translate = t || tDual;

  useEffect(() => {
    if (!id) {
      setData(null);
      setFetchError(null);
      setIsFetching(false);
      return;
    }

    if (!isAvailable || !get) {
      return;
    }

    let cancelled = false;
    setIsFetching(true);
    setFetchError(null);

    get(id)
      .then((fetchedData) => {
        if (cancelled) return;
        setIsFetching(false);
        if (fetchedData) {
          setData(fetchedData as T);
          setFetchError(null);
        } else {
          setData(null);
          setFetchError(new Error('Entity not found'));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setIsFetching(false);
        setFetchError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id, get, isAvailable]);

  const displayData = storeData || data;
  const displayError = storeError || fetchError;
  const isLoading = loading || isFetching || !id;

  const visibleFields = useMemo(() => {
    if (!displayData) return [];

    return Object.entries(entity.fields).filter(([fieldName, fieldConfig]) => {
      if (!isFieldVisible(fieldConfig.visibility, viewerRole)) {
        return false;
      }
      if (fieldConfig.visibility === 'hidden') {
        return false;
      }
      const value = (displayData as Record<string, unknown>)[fieldName];
      if (value === null || value === undefined) {
        return false;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null &&
        Object.keys(value).length === 0
      ) {
        return false;
      }
      return true;
    });
  }, [entity.fields, viewerRole, displayData]);

  if (isLoading) {
    return (
      <Stack style={style} testID={testID}>
        <Spinner overlay />
      </Stack>
    );
  }

  if (displayError || !displayData) {
    return (
      <Stack align="center" justify="center" style={style} testID={testID}>
        <Stack gap={8}>
          <Text level="h3" variant="muted">
            {notFoundMessage ||
              tCrud('errors.notFound', {
                defaultValue: `${entity.name} not found`,
              })}
          </Text>
          {displayError && (
            <Text level="body" variant="destructive">
              {displayError instanceof Error
                ? displayError.message
                : String(displayError)}
            </Text>
          )}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={16} style={style} testID={testID}>
      {visibleFields.map(([fieldName, fieldConfig]) => (
        <DisplayFieldRenderer
          key={fieldName}
          name={fieldName}
          config={fieldConfig}
          value={(displayData as Record<string, unknown>)[fieldName]}
          t={translate}
        />
      ))}
    </Stack>
  );
}

export default EntityDisplayRenderer;
