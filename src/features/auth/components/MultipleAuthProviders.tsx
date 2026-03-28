// packages/expo/src/features/auth/components/MultipleAuthProviders.tsx
/**
 * @fileoverview MultipleAuthProviders component for Expo
 * @description Display multiple authentication provider buttons
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  AUTH_PARTNERS,
  useTranslation,
  type AuthPartnerId,
} from '@donotdev/core';

import AuthPartnerButton from './AuthPartnerButton';
import { Stack } from '../../../atomic';

import type { ViewStyle } from 'react-native';

/** Props for the MultipleAuthProviders component. */
export interface MultipleAuthProvidersProps {
  /** Providers to display (alias: enabledPartners) */
  providers?: AuthPartnerId[];
  /** @deprecated Use providers instead */
  enabledPartners?: AuthPartnerId[];
  /** Button layout */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Whether to show text labels on buttons */
  showLabels?: boolean;
  /** Auth method */
  method?: 'popup' | 'redirect' | null;
  /** Whether buttons should take full width */
  fullWidth?: boolean;
  /** Callback when authentication succeeds */
  onSuccess?: () => void;
  /** Callback when authentication fails */
  onError?: (error: Error) => void;
}

/**
 * MultipleAuthProviders - Display multiple authentication provider buttons
 */
function MultipleAuthProviders({
  providers,
  enabledPartners,
  layout = 'vertical',
  showLabels = true,
  method = 'popup',
  fullWidth,
  onSuccess,
  onError,
  style,
  testID,
}: MultipleAuthProvidersProps & { style?: ViewStyle; testID?: string }) {
  const { t } = useTranslation('auth');

  const partnersToShow: AuthPartnerId[] =
    providers ||
    enabledPartners ||
    (Object.keys(AUTH_PARTNERS) as AuthPartnerId[]);

  return (
    <Stack
      direction={layout === 'horizontal' ? 'row' : 'column'}
      gap={12}
      style={style}
      testID={testID}
    >
      {partnersToShow.map((partnerId) => {
        const partner = AUTH_PARTNERS[partnerId];
        if (!partner) return null;

        return (
          <AuthPartnerButton
            key={partnerId}
            partnerId={partnerId}
            method={method}
            onSuccess={onSuccess}
            onError={onError}
            testID={testID ? `${testID}-${partnerId}` : undefined}
          >
            {showLabels ? partner.name || partnerId : undefined}
          </AuthPartnerButton>
        );
      })}
    </Stack>
  );
}

export default MultipleAuthProviders;
