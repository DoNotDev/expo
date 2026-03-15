// packages/expo/src/features/oauth/components/MultipleOAuthProviders.tsx
/**
 * @fileoverview MultipleOAuthProviders component for Expo
 * @description Display multiple OAuth provider buttons
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { getEnabledOAuthPartners, type OAuthPartnerId } from '@donotdev/core';

import OAuthPartnerButton from './OAuthPartnerButton';
import { Stack } from '../../../atomic';

import type { ViewStyle } from 'react-native';

export interface MultipleOAuthProvidersProps {
  /** OAuth providers to display */
  providers?: OAuthPartnerId[];
  /** Purpose for OAuth connections */
  purpose?: 'api-access' | 'authentication';
  /** Button variant to use */
  variant?: string;
  /** Layout of the provider buttons */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Whether to show text labels on buttons */
  showLabels?: boolean;
  /** Whether buttons should take full width */
  fullWidth?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Callbacks */
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * MultipleOAuthProviders - Display multiple OAuth provider buttons
 */
function MultipleOAuthProviders({
  providers,
  purpose,
  variant,
  layout = 'vertical',
  showLabels = true,
  ariaLabel,
  fullWidth,
  onSuccess,
  onError,
  style,
  testID,
}: MultipleOAuthProvidersProps & { style?: ViewStyle; testID?: string }) {
  const providersToShow: OAuthPartnerId[] =
    providers || getEnabledOAuthPartners();

  return (
    <Stack
      direction={layout === 'horizontal' ? 'row' : 'column'}
      gap={12}
      style={style}
      testID={testID}
    >
      {providersToShow.map((providerId) => (
        <OAuthPartnerButton
          key={providerId}
          partnerId={providerId}
          purpose={purpose}
          showLabel={showLabels}
          onSuccess={onSuccess}
          onError={onError}
          testID={testID ? `${testID}-${providerId}` : undefined}
        />
      ))}
    </Stack>
  );
}

export default MultipleOAuthProviders;
