// packages/expo/src/features/oauth/components/OAuthConnectionModal.tsx
/**
 * @fileoverview OAuthConnectionModal component for Expo
 * @description Modal for OAuth connection
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useTranslation } from '@donotdev/core';

import MultipleOAuthProviders from './MultipleOAuthProviders';
import { Dialog } from '../../../atomic';

/** Props for the OAuthConnectionModal component. */
export interface OAuthConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purpose?: 'api-access' | 'authentication';
  title?: string;
  description?: string;
}

/**
 * OAuthConnectionModal - Modal for OAuth connection
 */
function OAuthConnectionModal({
  open,
  onOpenChange,
  purpose,
  title,
  description,
}: OAuthConnectionModalProps) {
  const { t } = useTranslation('oauth');

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title || t('connectServices')}
      description={description || t('chooseService')}
    >
      <MultipleOAuthProviders
        layout="vertical"
        showLabels={true}
        purpose={purpose}
      />
    </Dialog>
  );
}

export default OAuthConnectionModal;
