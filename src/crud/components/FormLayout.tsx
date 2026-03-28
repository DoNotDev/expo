// packages/expo/src/crud/components/FormLayout.tsx
/**
 * @fileoverview FormLayout component
 * @description Enhanced form layout for Expo
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { useTranslation } from '@donotdev/core';

import { Button, Spinner, Stack, Text } from '../../atomic';

import type { ReactNode } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { ViewStyle } from 'react-native';

/** Props for the FormLayout component. */
export interface FormLayoutProps<T extends FieldValues> {
  title: string;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  formMethods: UseFormReturn<T>;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  variant?: 'default' | 'card' | 'minimal';
  columns?: 1 | 2 | 3 | 4;
  description?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Enhanced FormLayout with modern UX features
 */
const FormLayout = <T extends FieldValues>({
  title,
  onSubmit,
  children,
  formMethods,
  loading = false,
  submitText,
  cancelText,
  showCancel = false,
  onCancel,
  variant = 'default',
  columns = 1,
  description,
  style,
  testID,
}: FormLayoutProps<T>) => {
  const { t } = useTranslation('dndev');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultSubmitText = submitText || t('form.submit', 'Submit');
  const defaultCancelText = cancelText || t('form.cancel', 'Cancel');

  // Use handleSubmit to run react-hook-form validation before calling onSubmit (Item 97)
  const handleSubmit = formMethods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...formMethods}>
      <Stack gap={24} style={style} testID={testID}>
        {/* Header */}
        <Stack gap={8}>
          <Text level="h2">{title}</Text>
          {description && (
            <Text level="body" variant="muted">
              {description}
            </Text>
          )}
        </Stack>

        {/* Form Fields */}
        <Stack gap={16}>{children}</Stack>

        {/* Action Buttons */}
        <Stack direction="row" align="center" justify="flex-end" gap={8}>
          {showCancel && (
            <Button
              variant="outline"
              onPress={onCancel}
              disabled={loading || isSubmitting}
              testID={testID ? `${testID}-cancel` : undefined}
            >
              {defaultCancelText}
            </Button>
          )}
          <Button
            onPress={handleSubmit}
            disabled={loading || isSubmitting}
            loading={loading || isSubmitting}
            testID={testID ? `${testID}-submit` : undefined}
          >
            {loading || isSubmitting ? (
              <Stack direction="row" gap={8} align="center">
                <Spinner />
                <Text level="body">
                  {isSubmitting
                    ? t('form.submitting', 'Submitting...')
                    : t('form.loading', 'Loading...')}
                </Text>
              </Stack>
            ) : (
              defaultSubmitText
            )}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default FormLayout;
