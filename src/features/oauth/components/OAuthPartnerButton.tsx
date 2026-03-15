// packages/expo/src/features/oauth/components/OAuthPartnerButton.tsx
/**
 * @fileoverview OAuthPartnerButton component for Expo
 * @description OAuth provider button component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { type OAuthPartnerId } from '@donotdev/core';
import { useOAuth } from '@donotdev/oauth';

import { Button } from '../../../atomic';

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface OAuthPartnerButtonProps {
  /** Partner/provider ID (web compat alias: partnerId) */
  partnerId?: OAuthPartnerId;
  /** @deprecated Use partnerId instead */
  providerId?: OAuthPartnerId;
  /** Purpose for OAuth connection */
  purpose?: 'api-access' | 'authentication';
  /** Whether to show text label */
  showLabel?: boolean;
  /** Custom button content */
  children?: React.ReactNode;
  /** Whether button is disabled */
  disabled?: boolean;
  onSuccess?: (result?: any) => void;
  onError?: (error: Error) => void;
}

/**
 * OAuthPartnerButton - OAuth provider button component
 */
function OAuthPartnerButton({
  partnerId,
  providerId,
  purpose,
  showLabel = true,
  children,
  disabled,
  onSuccess,
  onError,
  style,
  testID,
}: OAuthPartnerButtonProps & { style?: ViewStyle; testID?: string }) {
  const connect = useOAuth('connect');
  const status = useOAuth('status');
  const loading = status === 'initializing';
  const resolvedId = partnerId || providerId;

  const handlePress = async () => {
    if (!resolvedId) return;
    try {
      await connect(resolvedId);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const getButtonText = () => {
    if (children) return children;
    if (!showLabel) return undefined;
    if (loading) return `Connecting to ${resolvedId}...`;
    return `Connect ${resolvedId}`;
  };

  return (
    <Button
      variant="outline"
      onPress={handlePress}
      disabled={disabled || loading}
      loading={loading}
      style={style}
      testID={testID}
    >
      {getButtonText()}
    </Button>
  );
}

export default OAuthPartnerButton;
