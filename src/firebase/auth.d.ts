// packages/expo/src/firebase/auth.d.ts
/**
 * @fileoverview Firebase Auth type declarations for React Native
 * @description Type declarations for getReactNativePersistence which may not be in firebase/auth types
 */

import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
