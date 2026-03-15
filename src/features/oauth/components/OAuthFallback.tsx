// packages/expo/src/features/oauth/components/OAuthFallback.tsx
/**
 * @fileoverview OAuthFallback component for Expo
 * @description Fallback component when OAuth is not available
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { Text, Button } from '../../../atomic';

export interface OAuthFallbackProps {
  message?: string;
  showConnectButton?: boolean;
}

/**
 * OAuthFallback - Fallback component when OAuth is not available
 */
export function OAuthFallback({
  message,
  showConnectButton = false,
  style,
  testID,
}: OAuthFallbackProps & { style?: ViewStyle; testID?: string }) {
  return (
    <View style={style} testID={testID}>
      <Text level="body" variant="muted">
        {message || 'OAuth is not available'}
      </Text>
      {showConnectButton && (
        <Button
          variant="outline"
          testID={testID ? `${testID}-connect` : undefined}
        >
          Connect Account
        </Button>
      )}
    </View>
  );
}

export default OAuthFallback;
