// packages/expo/src/features/auth/index.ts
/**
 * @fileoverview Auth package exports for Expo
 * @description Re-exports auth hooks and components with Expo-compatible components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Re-export hooks (they work as-is since Firebase works on React Native)
export { useAuth } from '@donotdev/auth';
export { useDeleteAccount } from '@donotdev/auth';
export type { DeleteAccountState } from '@donotdev/auth';
export { getAuthState, subscribeToAuth } from '@donotdev/auth';

// Export Expo-compatible hooks
export {
  useUserRole,
  useHasRole,
  useAuthState,
  useCanAccess,
  useCanAccessFeature,
} from './hooks';

// Export Expo-compatible components
export * from './components';

// Re-export types
export type {
  AuthError,
  AuthUser as User,
  UserRole,
  SubscriptionTier,
} from '@donotdev/core';
