// packages/expo/src/features/auth/hooks/useAuthState.ts
/**
 * @fileoverview useAuthState hook for Expo
 * @description Hook to get all auth state for debugging/display
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { SUBSCRIPTION_TIERS } from '@donotdev/core';

import { useAuthSafe } from '../../../utils/useAuthSafe';

/**
 * Hook to get all auth state for debugging
 * Returns comprehensive auth state object
 *
 * @returns Auth state object with authenticated, role, tier, loading, userId
 *
 * @example
 * ```tsx
 * const authState = useAuthState();
 * console.log('User:', authState.userId, 'Role:', authState.role);
 * ```
 */
export function useAuthState() {
  const user = useAuthSafe('user');
  const userSubscription = useAuthSafe('userSubscription');
  const loading = useAuthSafe('loading');

  return {
    authenticated: !!user,
    role: user?.role,
    tier: userSubscription?.tier || SUBSCRIPTION_TIERS.FREE,
    loading,
    userId: user?.id,
  };
}
