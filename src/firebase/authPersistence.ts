// packages/expo/src/firebase/authPersistence.ts
/**
 * @fileoverview Firebase auth persistence for Expo
 * @description Firebase auth initialization with AsyncStorage persistence
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';

/**
 * Initialize Firebase Auth with AsyncStorage persistence for Expo
 *
 * Use this instead of getAuth() when using Firebase in Expo apps.
 * This ensures auth state persists across app restarts.
 *
 * @example
 * ```ts
 * import { initializeExpoAuth } from '@donotdev/expo/firebase';
 * const auth = initializeExpoAuth();
 * ```
 */
export function initializeExpoAuth() {
  const app = getApp();

  try {
    // Try to get existing auth instance
    return getAuth(app);
  } catch {
    // If no auth instance exists, create one with AsyncStorage persistence
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

export default initializeExpoAuth;
