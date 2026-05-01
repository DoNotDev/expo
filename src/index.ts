// packages/expo/src/index.ts
/**
 * @fileoverview Expo package
 * @description React Native/Expo UI component library for DoNotDev framework
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Export all atomic components
export * from './atomic';

// Export utilities
export * from './utils';

// Export CRUD components
export * from './crud';

// Feature packages (auth, billing, oauth) are optional — import from
// @donotdev/expo/features or the individual feature sub-paths instead.
// DO NOT use `export *` here: it crashes if @donotdev/auth is not installed (Item 96).

// Export storage strategies
export { AsyncStorageStrategy } from './storage/AsyncStorageStrategy';
export { zustandAsyncStorage } from './storage/zustandAsyncStorage';

// Export providers
export {
  ExpoAppProviders,
  getZustandAsyncStorage,
} from './providers/ExpoAppProviders';

// Export routing
export * from './routing';

// Export Firebase utilities
export * from './firebase';

// Export theme system
export * from './theme';
