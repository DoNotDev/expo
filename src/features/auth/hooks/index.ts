// packages/expo/src/features/auth/hooks/index.ts
/**
 * @fileoverview Auth hooks exports for Expo
 * @description Exports all auth-related hooks
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

export { useUserRole } from './useUserRole';
export { useHasRole } from './useHasRole';
export { useAuthState } from './useAuthState';
export { useCanAccess } from './useCanAccess';
export { useCanAccessFeature } from '../components/FeatureGuard';
