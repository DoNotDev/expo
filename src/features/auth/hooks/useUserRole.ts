// packages/expo/src/features/auth/hooks/useUserRole.ts
/**
 * @fileoverview useUserRole hook for Expo
 * @description Hook to get current user role
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { USER_ROLES } from '@donotdev/core';

import { useAuthSafe } from '../../../utils/useAuthSafe';

/**
 * Hook to get current user role
 * Returns the user's role or GUEST if not authenticated
 *
 * @returns Current user role
 *
 * @example
 * ```tsx
 * const role = useUserRole();
 * if (role === USER_ROLES.ADMIN) {
 *   // Admin-only code
 * }
 * ```
 */
export function useUserRole() {
  return useAuthSafe('userRole') || USER_ROLES.GUEST;
}
