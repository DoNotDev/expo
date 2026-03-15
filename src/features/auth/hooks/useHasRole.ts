// packages/expo/src/features/auth/hooks/useHasRole.ts
/**
 * @fileoverview useHasRole hook for Expo
 * @description Hook to check if user has a specific role
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { UserRole } from '@donotdev/core';
import { hasRoleAccess } from '@donotdev/core';

import { useAuthSafe } from '../../../utils/useAuthSafe';

/**
 * Hook to check if user has a specific role (hierarchical)
 *
 * @param role - Minimum required role
 * @returns True if user's role meets or exceeds the required role
 *
 * @example
 * ```tsx
 * const isAdmin = useHasRole(USER_ROLES.ADMIN);
 * if (isAdmin) {
 *   // Admin-only code
 * }
 * ```
 */
export function useHasRole(role: UserRole): boolean {
  const userRole = useAuthSafe('userRole');
  return hasRoleAccess(userRole, role);
}
