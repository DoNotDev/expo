// packages/expo/src/features/billing/components/SubscriptionManager.tsx
/**
 * @fileoverview SubscriptionManager component for Expo
 * @description Subscription management component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ViewStyle } from 'react-native';

import { useAuth } from '@donotdev/auth';
import { useStripeBilling } from '@donotdev/billing';
import { formatDate, useTranslation } from '@donotdev/core';

import { Stack, Text, Button, Card } from '../../../atomic';

/** Numeric date (the `toLocaleDateString()` layout), in the app's zone (`formatDate`), as the web SubscriptionManager. */
const NUMERIC_DATE = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

/** Props for the SubscriptionManager component. */
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
  const { t, language } = useTranslation('billing');
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
            {t('components.subscriptionManager.noSubscription')}
          </Text>
          <Text level="body" variant="muted">
            {t('components.subscriptionManager.subscribeToAccess')}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card style={style} testID={testID}>
      <Stack gap={16}>
        <Text level="h3">{t('components.subscriptionManager.title')}</Text>
        <Stack gap={8}>
          <Text level="body">
            {t('components.subscriptionManager.statusLabel')}:{' '}
            {subscription.status}
          </Text>
          {subscription.subscriptionEnd && (
            <Text level="body" variant="muted">
              {t('components.subscriptionManager.renewsOn')}:{' '}
              {formatDate(subscription.subscriptionEnd, language, NUMERIC_DATE)}
            </Text>
          )}
        </Stack>
        <Button
          variant="outline"
          onPress={handleManage}
          testID={testID ? `${testID}-manage` : undefined}
        >
          {t('components.subscriptionManager.manageSubscription')}
        </Button>
      </Stack>
    </Card>
  );
}

export default SubscriptionManager;
