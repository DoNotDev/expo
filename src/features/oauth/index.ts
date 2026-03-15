// packages/expo/src/features/oauth/index.ts
/**
 * @fileoverview OAuth package exports for Expo
 * @description Re-exports OAuth hooks and components with Expo-compatible components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Re-export hooks (they work as-is)
export { useOAuth } from '@donotdev/oauth';

// Export Expo-compatible components
export * from './components';
