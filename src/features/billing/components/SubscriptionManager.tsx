// packages/expo/src/features/billing/components/SubscriptionManager.tsx
/**
 * @fileoverview SubscriptionManager component for Expo
 * @description Subscription management component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useAuth } from '@donotdev/auth';
import { useStripeBilling } from '@donotdev/billing';
import { useTranslation } from '@donotdev/core';

import { Stack, Text, Button, Card } from '../../../atomic';

import type { ViewStyle } from 'react-native';

export interface SubscriptionManagerProps {
  availablePlans?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    priceId: string;
    billingConfigKey: string;
  }>;
  allowPlanChange?: boolean;
}

/**
 * SubscriptionManager - Subscription management component
 */
export function SubscriptionManager({
  availablePlans,
  allowPlanChange = true,
  style,
  testID,
}: SubscriptionManagerProps & { style?: ViewStyle; testID?: string }) {
  const { t } = useTranslation('billing');
  const userSubscription = useAuth('userSubscription');
  const openCustomerPortal = useStripeBilling('openCustomerPortal');
  const subscription = userSubscription;

  const handleManage = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      if (__DEV__) console.error('Failed to open subscription portal:', error);
    }
  };

  if (!subscription) {
    return (
      <Card style={style} testID={testID}>
        <Stack gap={16}>
          <Text level="h3">
            {t('noSubscription', 'No Active Subscription')}
          </Text>
          <Text level="body" variant="muted">
            {t('subscribeToAccess', 'Subscribe to access premium features')}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card style={style} testID={testID}>
      <Stack gap={16}>
        <Text level="h3">{t('subscription', 'Subscription')}</Text>
        <Stack gap={8}>
          <Text level="body">
            {t('status', 'Status')}: {subscription.status}
          </Text>
          {subscription.subscriptionEnd && (
            <Text level="body" variant="muted">
              {t('renewsOn', 'Renews on')}:{' '}
              {new Date(subscription.subscriptionEnd).toLocaleDateString()}
            </Text>
          )}
        </Stack>
        <Button
          variant="outline"
          onPress={handleManage}
          testID={testID ? `${testID}-manage` : undefined}
        >
          {t('manageSubscription', 'Manage Subscription')}
        </Button>
      </Stack>
    </Card>
  );
}

export default SubscriptionManager;
