// packages/expo/src/features/billing/components/SecurityNotice.tsx
/**
 * @fileoverview SecurityNotice component for Expo
 * @description Security notice component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useTranslation } from '@donotdev/core';

import { Alert } from '../../../atomic';

import type { ViewStyle } from 'react-native';

export interface SecurityNoticeProps {
  /** Whether the notice can be dismissed */
  dismissible?: boolean;
  /** Whether to show the notice */
  show?: boolean;
  /** Callback when notice is dismissed */
  onDismiss?: () => void;
}

/**
 * SecurityNotice - Security notice component
 */
export function SecurityNotice({
  dismissible,
  show = true,
  onDismiss,
  style,
  testID,
}: SecurityNoticeProps & { style?: ViewStyle; testID?: string }) {
  const { t } = useTranslation('billing');

  if (!show) return null;

  return (
    <Alert
      variant="info"
      title={t('security.title', 'Secure Payment')}
      description={t(
        'security.description',
        'Your payment is processed securely by Stripe. We never store your payment information.'
      )}
      style={style}
      testID={testID}
    />
  );
}

export default SecurityNotice;
