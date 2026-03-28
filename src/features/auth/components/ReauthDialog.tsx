// packages/expo/src/features/auth/components/ReauthDialog.tsx
/**
 * @fileoverview ReauthDialog component for Expo
 * @description Re-authentication dialog for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useTranslation } from '@donotdev/core';

import MultipleAuthProviders from './MultipleAuthProviders';
import { Dialog, Button, Stack, Text } from '../../../atomic';

/** Props for the ReauthDialog component. */
export interface ReauthDialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Whether re-authentication is in progress */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Re-authentication handler */
  onReauth?: (password: string) => Promise<void>;
  /** Cancel handler */
  onCancel?: () => void;
  /** Open state change handler */
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ReauthDialog - Re-authentication dialog
 */
function ReauthDialog({
  open,
  isLoading,
  error,
  onReauth,
  onCancel,
  onOpenChange,
  onSuccess,
  onError,
}: ReauthDialogProps) {
  const { t } = useTranslation('auth');

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('reauth', 'Re-authentication Required')}
      description={t('reauthDescription', 'Please sign in again to continue')}
    >
      <Stack gap={16}>
        {error && (
          <Text level="body" variant="destructive" testID="reauth-error">
            {error}
          </Text>
        )}
        <MultipleAuthProviders
          layout="vertical"
          showLabels={true}
          method="popup"
          onSuccess={onSuccess}
          onError={onError}
        />
        {onCancel && (
          <Button variant="outline" onPress={onCancel} testID="reauth-cancel">
            {t('cancel', 'Cancel')}
          </Button>
        )}
      </Stack>
    </Dialog>
  );
}

export default ReauthDialog;
