// packages/expo/src/features/auth/components/ConfirmDeleteDialog.tsx
/**
 * @fileoverview ConfirmDeleteDialog component for Expo
 * @description Confirmation dialog for account deletion
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';

import { useDeleteAccount } from '@donotdev/auth';
import { useTranslation } from '@donotdev/core';

import { Dialog, Button, Stack, Text, Input } from '../../../atomic';

export interface ConfirmDeleteDialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Whether deletion is in progress */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Confirm deletion handler (web compat) */
  onConfirm?: () => Promise<void>;
  /** Cancel handler (web compat) */
  onCancel?: () => void;
  /** Open state change handler */
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ConfirmDeleteDialog - Confirmation dialog for account deletion
 */
function ConfirmDeleteDialog({
  open,
  isLoading,
  error,
  onConfirm,
  onCancel,
  onOpenChange,
  onSuccess,
  onError,
}: ConfirmDeleteDialogProps) {
  const { t } = useTranslation('auth');
  const { confirmDelete, isDeleting } = useDeleteAccount();
  const [confirmText, setConfirmText] = useState('');

  // Use external loading/error if provided, otherwise use internal state
  const isDeletingState = isLoading !== undefined ? isLoading : isDeleting;
  const errorState = error !== undefined ? error : null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      return;
    }

    try {
      await confirmDelete();
      await onConfirm?.();
      onSuccess?.();
      onOpenChange?.(false);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deleteAccount', 'Delete Account')}
      description={t('deleteAccountWarning', 'This action cannot be undone')}
    >
      <Stack gap={16}>
        {errorState && (
          <Text level="body" variant="destructive" testID="delete-error">
            {errorState}
          </Text>
        )}
        <Text level="body">
          {t('deleteAccountConfirm', 'Type "DELETE" to confirm')}
        </Text>
        <Input
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="DELETE"
          testID="delete-confirm-input"
        />
        <Stack direction="row" gap={8} justify="flex-end">
          <Button
            variant="outline"
            onPress={() => onOpenChange?.(false)}
            testID="delete-cancel"
          >
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            variant="destructive"
            onPress={handleDelete}
            disabled={confirmText.toLowerCase() !== 'delete' || isDeletingState}
            loading={isDeletingState}
            testID="delete-confirm"
          >
            {t('delete', 'Delete')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;
