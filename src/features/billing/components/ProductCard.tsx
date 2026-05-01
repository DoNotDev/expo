// packages/expo/src/features/billing/components/ProductCard.tsx
/**
 * @fileoverview ProductCard component for Expo
 * @description Product card component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { StyleSheet, type ViewStyle } from 'react-native';

import {
  useTranslation,
  maybeTranslate,
  translateArray,
  type CheckoutMode,
} from '@donotdev/core';

import { StripeCheckoutButton } from './StripeCheckoutButton';
import { Card, Badge, Stack, Text, Button } from '../../../atomic';

/** Props for the ProductCard component. */
export interface ProductCardProps {
  namespace?: string;
  configKey: string;
  id: string;
  name: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  limitedTime?: boolean;
  mode: CheckoutMode;
  priceId: string;
  allowPromotionCodes?: boolean;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * ProductCard - Displays a product with features and purchase/subscription button
 */
export function ProductCard({
  namespace = 'billing',
  configKey,
  id,
  name,
  price,
  currency,
  description,
  features,
  popular = false,
  limitedTime = false,
  mode,
  priceId,
  allowPromotionCodes = true,
  metadata = {},
  successUrl = '/billing/success',
  cancelUrl = '/purchase',
  style,
  testID,
}: ProductCardProps & { style?: ViewStyle; testID?: string }) {
  const { t } = useTranslation([namespace, 'billing']);
  const priceDisplay = price === 'Free' ? 'Free' : price;
  const intervalText = mode === 'subscription' ? '/month' : '';

  const translatedName = maybeTranslate(t, name);
  const translatedDescription = maybeTranslate(t, description);
  const translatedFeatures = Array.isArray(features)
    ? features.map((f) => maybeTranslate(t, f))
    : features
      ? translateArray(t, features, 10)
      : [];

  const cardStyle = StyleSheet.flatten(
    [
      style,
      popular && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    ].filter(Boolean)
  );

  return (
    <Card
      variant={popular ? 'primary' : 'default'}
      style={cardStyle}
      testID={testID}
    >
      <Stack gap={16}>
        {/* Header */}
        <Stack gap={8}>
          {popular && (
            <Badge
              variant="primary"
              testID={testID ? `${testID}-popular-badge` : undefined}
            >
              {t('popular', 'Popular')}
            </Badge>
          )}
          {limitedTime && (
            <Badge
              variant="warning"
              testID={testID ? `${testID}-limited-badge` : undefined}
            >
              {t('limitedTime', 'Limited Time')}
            </Badge>
          )}
          <Text level="h3">{translatedName}</Text>
          <Stack direction="row" align="baseline" gap={4}>
            <Text level="h2">{priceDisplay}</Text>
            {intervalText && (
              <Text level="body" variant="muted">
                {intervalText}
              </Text>
            )}
          </Stack>
          {translatedDescription && (
            <Text level="body" variant="muted">
              {translatedDescription}
            </Text>
          )}
        </Stack>

        {/* Features */}
        {translatedFeatures.length > 0 && (
          <Stack gap={8}>
            {translatedFeatures.map((feature, index) => (
              <Stack key={index} direction="row" gap={8} align="center">
                <Text level="body">✓</Text>
                <Text level="body">{feature}</Text>
              </Stack>
            ))}
          </Stack>
        )}

        {/* CTA Button */}
        <StripeCheckoutButton
          configKey={configKey}
          priceId={priceId}
          mode={mode}
          allowPromotionCodes={allowPromotionCodes}
          metadata={metadata}
          successUrl={successUrl}
          cancelUrl={cancelUrl}
          variant={popular ? 'primary' : 'outline'}
          testID={testID ? `${testID}-checkout` : undefined}
        >
          {mode === 'subscription'
            ? t('subscribe', 'Subscribe')
            : t('purchase', 'Purchase')}
        </StripeCheckoutButton>
      </Stack>
    </Card>
  );
}

export default ProductCard;
