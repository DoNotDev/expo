// packages/expo/src/features/auth/components/AuthPartnerButton.tsx
/**
 * @fileoverview AuthPartnerButton component for Expo
 * @description Authentication button component for React Native
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { useAuth } from '@donotdev/auth';
import {
  AUTH_PARTNERS,
  useTranslation,
  type AuthPartnerId,
} from '@donotdev/core';

import { Button, Spinner, Stack, Text } from '../../../atomic';

import type { ReactNode } from 'react';

/** Auth method type (popup/redirect are web-only; on mobile, always uses system browser) */
type AuthMethod = 'redirect' | 'popup';

/** Props for the AuthPartnerButton component. */
export interface AuthPartnerButtonProps {
  partnerId: AuthPartnerId;
  method?: AuthMethod | null;
  children?: ReactNode;
  disabled?: boolean;
  /** Display mode: 'compact' (icon-only), 'full' (icon+label), 'auto' (responsive) */
  display?: 'compact' | 'full' | 'auto';
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  style?: ViewStyle;
  testID?: string;
}

/**
 * AuthPartnerButton - Authentication button component for Expo
 */
function AuthPartnerButton({
  partnerId,
  method,
  onSuccess,
  onError,
  children,
  disabled = false,
  style,
  testID,
  ...props
}: AuthPartnerButtonProps) {
  const { t } = useTranslation('auth');
  const user = useAuth('user');
  const signInWithPartner = useAuth('signInWithPartner');
  const linkWithPartner = useAuth('linkWithPartner');
  const isAvailable = useAuth('isAvailable');

  const [isLoading, setIsLoading] = useState(false);

  const partnerConfig = useMemo(() => AUTH_PARTNERS[partnerId], [partnerId]);

  // Email/password handled separately.
  // Intentional hard error: Expo does not support inline email/password forms.
  // Consumer apps must provide their own email/password screen and should not
  // render AuthPartnerButton with partnerId='password' on Expo.
  if (partnerId === 'password') {
    return (
      <Button
        variant="outline"
        onPress={() => {
          onError?.(new Error('Email/password form not implemented for Expo'));
        }}
        disabled={disabled}
        style={style}
        testID={testID}
      >
        {children || t('signInWithEmail', 'Sign in with Email')}
      </Button>
    );
  }

  if (!partnerConfig) {
    return null;
  }

  // On mobile, always treat as OAuth (no email link support)
  const isOAuth = true;
  const isEmailLink = false;

  // Email link not supported on mobile (use OAuth or email/password)
  if (isEmailLink) {
    return (
      <Button variant="outline" disabled style={style} testID={testID}>
        <Text level="body" variant="muted">
          {t('emailLinkNotSupported', 'Email link not supported on mobile')}
        </Text>
      </Button>
    );
  }

  const handlePress = async () => {
    if (!isAvailable || disabled || isLoading) return;

    setIsLoading(true);
    try {
      if (user && isOAuth) {
        await linkWithPartner(partnerId);
      } else {
        await signInWithPartner(partnerId);
      }
      onSuccess?.(null);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const partnerName = partnerConfig?.name;

  const getButtonText = () => {
    if (children) return children;
    if (isLoading)
      return t('buttons.signingIn', {
        partner: partnerName,
        defaultValue: `Signing in with ${partnerName}...`,
      });
    return partnerConfig?.button?.textKey
      ? t(partnerConfig.button.textKey)
      : `Sign in with ${partnerName}`;
  };

  return (
    <Button
      variant="outline"
      onPress={handlePress}
      disabled={disabled || isLoading || !isAvailable}
      loading={isLoading}
      style={style}
      testID={testID}
      {...props}
    >
      {getButtonText()}
    </Button>
  );
}

export default AuthPartnerButton;
