// packages/expo/src/features/auth/components/LoginModal.tsx
/**
 * @fileoverview LoginModal component for Expo
 * @description Modal dialog for authentication on React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useTranslation } from '@donotdev/core';

import MultipleAuthProviders from './MultipleAuthProviders';
import { Dialog } from '../../../atomic';

/** Props for the LoginModal component. */
export interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal dialog for authentication
 */
function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation('auth');

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('signIn', 'Sign In')}
      description={t('choosePlatform', 'Choose a platform to sign in with')}
    >
      <MultipleAuthProviders
        layout="vertical"
        showLabels={true}
        method="popup"
      />
    </Dialog>
  );
}

export default LoginModal;
