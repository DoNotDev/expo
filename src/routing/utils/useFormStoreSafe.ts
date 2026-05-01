// packages/expo/src/routing/utils/useFormStoreSafe.ts
/**
 * @fileoverview Form store safe navigation check
 * @description Auto-save is always active — navigation is never blocked.
 * Drafts are persisted to localStorage, so navigating away is safe.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

/**
 * Check if navigation is safe.
 * Auto-save is always active — always returns true.
 */
export async function checkFormNavigationSafe(): Promise<boolean> {
  return true;
}
