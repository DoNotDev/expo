// packages/expo/src/features/auth/components/GoogleOneTap.tsx
/**
 * @fileoverview GoogleOneTap component for Expo
 * @description Google One Tap is web-only, shows fallback on mobile
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { Text } from '../../../atomic';

interface GoogleOneTapProps {
  style?: ViewStyle;
  testID?: string;
}

/**
 * GoogleOneTap - Not available on mobile, shows fallback
 */
function GoogleOneTap({ style, testID }: GoogleOneTapProps) {
  // Google One Tap is web-only, show nothing on mobile
  // Users can use regular Google OAuth button instead
  return null;
}

export default GoogleOneTap;
