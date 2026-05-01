// packages/expo/src/crud/components/DisplayFieldRenderer.tsx
/**
 * @fileoverview DisplayFieldRenderer component
 * @description Renders field values as read-only display
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View } from 'react-native';

import { handleError, getI18nInstance } from '@donotdev/core';
import type { FieldType, EntityField } from '@donotdev/core';
import { translateFieldLabel } from '@donotdev/crud';
import { getDisplayFormatter } from '@donotdev/crud';

import { Text, Stack } from '../../atomic';

import type { ReactElement } from 'react';

/** Props for the DisplayFieldRenderer component. */
export interface DisplayFieldRendererProps<T extends FieldType = FieldType> {
  name: string;
  config: EntityField<T>;
  value: any;
  t: (key: string, options?: Record<string, any>) => string;
}

/**
 * Formats a value for display based on field type
 */
export function formatValue(
  value: any,
  config: EntityField,
  t: (key: string, options?: Record<string, any>) => string,
  options?: { compact?: boolean; asString?: boolean; locale?: string }
): string | ReactElement {
  // Auto-resolve locale from i18n singleton when not explicitly provided
  if (options && !options.locale) {
    options.locale = getI18nInstance()?.language;
  } else if (!options) {
    options = { locale: getI18nInstance()?.language };
  }
  const compact = options?.compact ?? false;
  if (value === null || value === undefined || value === '') {
    return compact ? '—' : <Text variant="muted">—</Text>;
  }

  const formatter = getDisplayFormatter(config.type);
  if (formatter) {
    try {
      return formatter(value, config, t, options);
    } catch (error) {
      console.warn(
        `[DisplayFieldRenderer] Formatter error for field "${config.label || config.name}" (type: ${config.type}):`,
        error
      );
      handleError(error as Error, {
        userMessage: `Error formatting field "${config.label || config.name}"`,
        context: {
          fieldType: config.type,
          fieldName: config.label || 'unknown',
          operation: 'display_format',
        },
        severity: 'warning',
      });
      return compact ? (
        String(value)
      ) : (
        <Text variant="muted">{String(value)}</Text>
      );
    }
  }

  handleError(
    new Error(
      `Display formatter not registered for field type: ${config.type}`
    ),
    {
      userMessage: `Field type "${config.type}" is missing display formatter`,
      context: {
        fieldType: config.type,
        fieldName: config.label || 'unknown',
        operation: 'display_format',
      },
      severity: 'warning',
    }
  );
  return compact ? String(value) : <Text variant="muted">{String(value)}</Text>;
}

/**
 * DisplayFieldRenderer - Renders a field value as read-only display
 */
export function DisplayFieldRenderer<T extends FieldType = FieldType>({
  name,
  config,
  value,
  t,
}: DisplayFieldRendererProps<T>): ReactElement {
  const formattedValue = formatValue(value, config, t, { compact: false });
  const label = translateFieldLabel(name, config, t);

  return (
    <Stack
      direction="row"
      align="center"
      gap={8}
      style={{ paddingVertical: 8 }}
    >
      <Text level="small" variant="muted" style={{ minWidth: 120 }}>
        {label}:
      </Text>
      <View style={{ flex: 1 }}>
        {typeof formattedValue === 'string' ? (
          <Text level="body">{formattedValue}</Text>
        ) : (
          formattedValue
        )}
      </View>
    </Stack>
  );
}

export default DisplayFieldRenderer;
