// packages/expo/src/crud/components/EntityFormRenderer.tsx
/**
 * @fileoverview EntityFormRenderer component
 * @description Renders a form from entity definition with navigation support.
 * Supports cancelPath/successPath for optimistic navigation after submit/cancel.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect, useId, useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { Alert } from 'react-native';

import { useTranslation } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import type { ViewerRole, InferEntityData } from '@donotdev/crud';

import { DisplayFieldRenderer } from './DisplayFieldRenderer';
import { FormFieldRenderer } from './FormFieldRenderer';
import { Stack, Spinner, Button } from '../../atomic';
import { useNavigate } from '../../routing';
import { useAuthSafe } from '../../utils/useAuthSafe';
import { UploadProvider } from '../contexts/UploadContext';
import { useEntityForm } from '../forms/hooks/useEntityForm';
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning';
import { useFormStore } from '../stores';

import type { ViewStyle } from 'react-native';

/** Props for the EntityFormRenderer component. */
export interface EntityFormRendererProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Entity definition */
  entity: Entity;
  /** Form submission handler */
  onSubmit: (data: T) => void | Promise<void>;
  /** Translation function */
  t?: (key: string, options?: Record<string, unknown>) => string;
  /** Additional style */
  style?: ViewStyle;
  /** Submit button text */
  submitText?: string;
  /** Whether form data is loading */
  loading?: boolean;
  /** Initial form values */
  defaultValues?: Partial<T>;
  /** Submit button variant */
  submitVariant?: 'primary' | 'destructive' | 'outline' | 'ghost' | 'link';
  /** Secondary button text */
  secondaryButtonText?: string;
  /** Secondary button variant */
  secondaryButtonVariant?:
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  /** Secondary button submission handler */
  onSecondarySubmit?: (data: T) => void | Promise<void>;
  /** Current viewer's role */
  viewerRole?: ViewerRole;
  /** Form operation type */
  operation?: 'create' | 'edit';
  /** Optional form ID */
  formId?: string;
  /** Cancel button text */
  cancelText?: string | null;
  /** Path to navigate to on cancel (uses navigate('back') if not set) */
  cancelPath?: string;
  /** Path to navigate to after successful submit (uses navigate('back') if not set) */
  successPath?: string;
  /** Callback when cancel is clicked (takes precedence over cancelPath) */
  onCancel?: () => void;
  /** Whether to show unsaved changes warning */
  warnOnUnsavedChanges?: boolean;
  /** Custom message for unsaved changes */
  unsavedChangesMessage?: string;
  /** Whether to hide visibility info */
  hideVisibilityInfo?: boolean;
  /** Test ID for testing */
  testID?: string;
}

/**
 * EntityFormRenderer - Renders a form from entity definition
 */
export function EntityFormRenderer<T extends Record<string, any> = any>({
  entity,
  onSubmit,
  t,
  style,
  submitText,
  loading = false,
  defaultValues,
  submitVariant = 'primary',
  secondaryButtonText,
  secondaryButtonVariant = 'outline',
  onSecondarySubmit,
  viewerRole: viewerRoleProp,
  operation = defaultValues !== undefined ? 'edit' : 'create',
  formId: externalFormId,
  cancelText,
  cancelPath,
  successPath,
  onCancel,
  warnOnUnsavedChanges = true,
  unsavedChangesMessage,
  hideVisibilityInfo = false,
  testID,
}: EntityFormRendererProps<T>) {
  const navigate = useNavigate();

  // Auto-detect role from auth; prop overrides
  const authRole = useAuthSafe('userRole');
  const viewerRole = viewerRoleProp ?? authRole;

  const generatedFormId = useId();
  const formId =
    externalFormId ?? `entity-form-${entity.name}-${generatedFormId}`;

  const { t: translationFn } = useTranslation([entity.namespace, 'crud']);
  const { t: tCrud } = useTranslation('crud');
  const translate = t || translationFn;

  const form = useEntityForm(entity, {
    formId,
    operation,
    defaultValues,
    viewerRole,
    t: translate,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    fields: renderableFields,
    formStatus,
    uploadProgress,
    cleanup,
    isDirty,
    hasUserInteracted,
    resetForm,
  } = form;

  const isDirtyForBlocking = isDirty && hasUserInteracted;

  useEffect(() => {
    if (formId) {
      useFormStore.getState().setIsDirty(formId, isDirtyForBlocking);
    }
  }, [formId, isDirtyForBlocking]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const goBack = useCallback(() => {
    if (cancelPath) {
      navigate(cancelPath);
    } else {
      navigate('back');
    }
  }, [navigate, cancelPath]);

  useUnsavedChangesWarning(
    warnOnUnsavedChanges && isDirtyForBlocking,
    unsavedChangesMessage,
    goBack
  );

  // Handle cancel — auto-save ensures draft is persisted, no confirm needed
  const handleCancel = useCallback(() => {
    resetForm();
    if (onCancel) {
      onCancel();
    } else if (cancelPath) {
      navigate(cancelPath);
    } else {
      navigate('back');
    }
  }, [resetForm, onCancel, cancelPath, navigate]);

  const handleFormSubmit = async (data: InferEntityData<typeof entity>) => {
    try {
      await onSubmit(data as T);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong'
      );
      return;
    }
    if (successPath) {
      navigate(successPath);
    } else {
      navigate('back');
    }
  };

  if (loading) {
    return (
      <Stack style={style} testID={testID}>
        <Spinner overlay />
      </Stack>
    );
  }

  return (
    <UploadProvider formId={formId}>
      <FormProvider {...form}>
        <Stack gap={16} style={style} testID={testID}>
          {renderableFields.map((field) => (
            <FormFieldRenderer
              key={field.name}
              name={field.name}
              config={field.config}
              control={control}
              errors={errors}
              t={translate}
              viewerRole={viewerRole}
            />
          ))}
          <Stack direction="row" gap={8} justify="flex-end">
            {cancelText !== null && (cancelText || cancelPath || onCancel) && (
              <Button
                variant="outline"
                onPress={handleCancel}
                testID={testID ? `${testID}-cancel` : undefined}
              >
                {cancelText || tCrud('form.cancel', { defaultValue: 'Cancel' })}
              </Button>
            )}
            {secondaryButtonText && onSecondarySubmit && (
              <Button
                variant={secondaryButtonVariant}
                onPress={handleSubmit(
                  (data: InferEntityData<typeof entity>) => {
                    onSecondarySubmit(data as T);
                  }
                )}
                testID={testID ? `${testID}-secondary` : undefined}
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button
              variant={submitVariant}
              onPress={handleSubmit(handleFormSubmit)}
              loading={formStatus === 'submitting'}
              testID={testID ? `${testID}-submit` : undefined}
            >
              {submitText ||
                (operation === 'create'
                  ? tCrud('form.create', { defaultValue: 'Create' })
                  : tCrud('form.save', { defaultValue: 'Save' }))}
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </UploadProvider>
  );
}

export default EntityFormRenderer;
