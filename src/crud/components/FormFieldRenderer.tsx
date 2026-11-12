// packages/expo/src/crud/components/FormFieldRenderer.tsx
/**
 * @fileoverview FormFieldRenderer component
 * @description Renders form fields using FieldRegistry
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ReactElement } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

import { handleError } from '@donotdev/core';
import type { EntityField, FieldType, ValueTypeForField } from '@donotdev/core';
import { getFieldRegistry } from '@donotdev/crud';
import type { UncontrolledFieldProps } from '@donotdev/crud';

// Import built-in field types to ensure registration
// Note: Field types are auto-registered via @donotdev/crud exports

const registry = getFieldRegistry();

interface FormFieldRendererBaseProps<T extends FieldType = FieldType> {
  name: string;
  config: EntityField<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: t prop signature shared by field components; narrowing it is a breaking change for callers
  t: (key: string, options?: Record<string, any>) => string;
  viewerRole?: string;
}

interface UncontrolledProps<
  T extends FieldType,
> extends FormFieldRendererBaseProps<T> {
  value: ValueTypeForField<T>;
  onChange: (value: ValueTypeForField<T>) => void;
  error?: string;
  control?: never;
}

interface ControlledProps<
  T extends FieldType,
  TFieldValues extends FieldValues = FieldValues,
> extends FormFieldRendererBaseProps<T> {
  control: Control<TFieldValues>;
  value?: never;
  onChange?: never;
  error?: never;
}

/** Props for the FormFieldRenderer component (uncontrolled or controlled). */
export type FormFieldRendererProps<
  T extends FieldType,
  TFieldValues extends FieldValues = FieldValues,
> = UncontrolledProps<T> | ControlledProps<T, TFieldValues>;

/**
 * FormFieldRenderer - renders fields via registry lookup
 */
export function FormFieldRenderer<
  T extends FieldType,
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  config,
  t,
  viewerRole,
  ...props
}: FormFieldRendererProps<T, TFieldValues>): ReactElement {
  const isControlled = 'control' in props && props.control;
  const isActionButton = config.type === 'submit' || config.type === 'reset';

  if (isControlled && !isActionButton) {
    // why: Control<T> is invariant in react-hook-form; the registry is keyed by field type, not entity shape
    const control = props.control as Control<FieldValues>;
    const fieldSpecific = config.options?.fieldSpecific as
      | Record<string, unknown>
      | undefined;
    const placeholder = fieldSpecific?.placeholder as string | undefined;

    // Use registry to get controlled component
    const Component = registry.getControlledComponent(config.type);
    if (Component) {
      // Note: Controlled components from CRUD package work with react-hook-form
      // They'll use Expo components internally if we create Expo-specific field components
      return (
        <Component
          control={control}
          fieldConfig={{ ...config, label: config.label || name }}
          t={t}
          placeholder={placeholder}
        />
      );
    }

    handleError(new Error(`Unregistered field type: ${config.type}`), {
      userMessage: t('errors.unsupportedFieldType', { type: config.type }),
      context: { fieldName: name, fieldType: config.type },
      severity: 'warning',
    });

    // Fallback to text field
    const TextFieldComponent = registry.getControlledComponent('text');
    return TextFieldComponent ? (
      <TextFieldComponent
        control={control}
        fieldConfig={{ ...config, type: 'text' }}
        t={t}
        placeholder={placeholder}
      />
    ) : (
      <></>
    );
  }

  // Uncontrolled mode
  const { value, onChange, error } = props as UncontrolledProps<T>;
  const UncontrolledComponent = registry.getUncontrolledComponent(config.type);

  if (UncontrolledComponent) {
    return (
      <UncontrolledComponent
        name={name}
        config={config}
        value={value}
        // why: registry components are typed for the FieldType union; this call site is narrowed to T
        onChange={onChange as UncontrolledFieldProps['onChange']}
        error={error}
        t={t}
      />
    );
  }

  handleError(new Error(`Unregistered field type: ${config.type}`), {
    userMessage: t('errors.unsupportedFieldType', { type: config.type }),
    context: { fieldName: name, fieldType: config.type },
    severity: 'warning',
  });

  return <></>;
}

export default FormFieldRenderer;
