// packages/expo/src/features/billing/components/StripeCheckoutButton.tsx
/**
 * @fileoverview StripeCheckoutButton component for Expo
 * @description Unified Stripe checkout button component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Linking } from 'react-native';

import { useStripeBilling } from '@donotdev/billing';
import { useTranslation, FEATURE_STATUS } from '@donotdev/core';
import type { CheckoutMode } from '@donotdev/core';

import { Button, type ButtonProps } from '../../../atomic';

import type { ViewStyle } from 'react-native';

export interface StripeCheckoutButtonProps extends Omit<
  ButtonProps,
  'onPress' | 'children'
> {
  /** Stripe price ID */
  priceId: string;
  /** Payment mode */
  mode: CheckoutMode;
  /** Configuration key from stripeFrontConfig */
  configKey?: string;
  /** Success redirect URL */
  successUrl?: string;
  /** Cancel redirect URL */
  cancelUrl?: string;
  /** Additional metadata */
  metadata?: Record<string, string>;
  /** Allow promotion codes */
  allowPromotionCodes?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Button content */
  children?: React.ReactNode;
  /** Error callback */
  onError?: (error: Error) => void;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Unified Stripe checkout button component for Expo
 */
export function StripeCheckoutButton({
  configKey,
  priceId,
  mode,
  successUrl,
  cancelUrl,
  metadata = {},
  allowPromotionCodes = true,
  variant = 'primary',
  disabled,
  loadingText,
  children,
  onError,
  style,
  testID,
  ...buttonProps
}: StripeCheckoutButtonProps) {
  const { t } = useTranslation('billing');
  const checkout = useStripeBilling('checkout');
  const status = useStripeBilling('status');
  const loading = status === FEATURE_STATUS.INITIALIZING;

  const defaultLoadingText =
    loadingText || t('components.buttons.processing', 'Processing...');

  const handlePress = async () => {
    if (disabled || loading) return;

    try {
      const checkoutResult = await checkout({
        priceId,
        mode,
        successUrl,
        cancelUrl,
        metadata: {
          ...(configKey && { billingConfigKey: configKey }),
          ...metadata,
        },
        allowPromotionCodes,
      });
      const checkoutUrl = checkoutResult?.sessionUrl;

      if (!checkoutUrl) {
        throw new Error('Checkout session did not return a URL');
      }

      const supported = await Linking.canOpenURL(checkoutUrl);
      if (supported) {
        await Linking.openURL(checkoutUrl);
      } else {
        throw new Error('Cannot open checkout URL on this device');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(err);
      } else {
        console.warn('[StripeCheckoutButton] Checkout failed:', err.message);
      }
    }
  };

  return (
    <Button
      variant={variant}
      onPress={handlePress}
      disabled={disabled || loading}
      loading={loading}
      style={style}
      testID={testID}
      {...buttonProps}
    >
      {loading ? defaultLoadingText : children}
    </Button>
  );
}

export default StripeCheckoutButton;
