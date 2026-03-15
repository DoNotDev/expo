// packages/expo/src/features/auth/hooks/useCanAccess.ts
/**
 * @fileoverview useCanAccess hook for Expo
 * @description Hook to check if user can access a route/feature based on auth config
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { PageAuth } from '@donotdev/core';

import { useAuthSafe } from '../../../utils/useAuthSafe';

/**
 * Hook to check if user can access a route/feature
 * Uses the same logic as useAuthSafe('can').navigate()
 *
 * @param authConfig - Auth configuration (PageAuth or false)
 * @returns True if user can access, false otherwise
 *
 * @example
 * ```tsx
 * const canAccess = useCanAccess({ role: USER_ROLES.ADMIN });
 * if (!canAccess) return <Redirect />;
 * ```
 */
export function useCanAccess(authConfig: PageAuth | false): boolean {
  const can = useAuthSafe('can');
  return can.navigate(authConfig);
}
