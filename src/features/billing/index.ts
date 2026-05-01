// packages/expo/src/features/billing/index.ts
/**
 * @fileoverview Billing package exports for Expo
 * @description Re-exports billing hooks and components with Expo-compatible components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Re-export hooks (they work as-is)
export { useStripeBilling } from '@donotdev/billing';
export type { BillingAuthState } from '@donotdev/billing';

// Export Expo-compatible components
export * from './components';
