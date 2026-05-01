// packages/expo/src/features/auth/components/index.ts
/**
 * @fileoverview Auth components exports
 * @description Exports for auth components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

export { default as AuthPartnerButton } from './AuthPartnerButton';
export type { AuthPartnerButtonProps } from './AuthPartnerButton';

export { default as LoginModal } from './LoginModal';
export type { LoginModalProps } from './LoginModal';

export { default as MultipleAuthProviders } from './MultipleAuthProviders';
export type { MultipleAuthProvidersProps } from './MultipleAuthProviders';

export { default as FeatureGuard, useCanAccessFeature } from './FeatureGuard';
export type { FeatureGuardProps } from './FeatureGuard';

export { default as GoogleOneTap } from './GoogleOneTap';

export { default as ReauthDialog } from './ReauthDialog';
export type { ReauthDialogProps } from './ReauthDialog';

export { default as ConfirmDeleteDialog } from './ConfirmDeleteDialog';
export type { ConfirmDeleteDialogProps } from './ConfirmDeleteDialog';
