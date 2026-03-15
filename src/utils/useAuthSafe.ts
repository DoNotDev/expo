// packages/expo/src/utils/useAuthSafe.ts

/**
 * @fileoverview Safe useAuth wrapper for graceful degradation (Expo)
 * @description Mirrors packages/ui/src/utils/useAuthSafe.ts for Expo.
 * Provides auth functionality when @donotdev/auth is installed,
 * gracefully degrades to no-op when not installed.
 *
 * @see packages/ui/src/utils/useAuthSafe.ts
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import * as authModule from '@donotdev/auth';
import { DEGRADED_AUTH_API } from '@donotdev/core';
import type { AuthAPI } from '@donotdev/core';

// Sync import — bundler aliases to empty module if not installed.
// Decision made ONCE at module load time, never changes.

const realUseAuth = authModule?.useAuth as
  | (<K extends keyof AuthAPI>(key: K) => AuthAPI[K])
  | undefined;

function useAuthStub<K extends keyof AuthAPI>(key: K): AuthAPI[K] {
  return DEGRADED_AUTH_API[key];
}

// Selected once at module load — never changes between renders, no conditional hook call.
const useAuthSafe: <K extends keyof AuthAPI>(key: K) => AuthAPI[K] =
  realUseAuth ?? useAuthStub;

/**
 * Check if auth module is available (for conditional UI rendering)
 */
export const isAuthAvailable = typeof realUseAuth === 'function';

export { useAuthSafe };
