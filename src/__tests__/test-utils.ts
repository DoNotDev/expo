// packages/expo/src/__tests__/test-utils.ts
/**
 * @fileoverview Test utilities for Expo package
 * @description Shared utilities for testing Expo components and utilities
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Create a mock AsyncStorage with in-memory storage
 */
export function createMockAsyncStorage(): typeof AsyncStorage {
  const store = new Map<string, string>();

  return {
    getItem: async (key: string) => store.get(key) || null,
    setItem: async (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: async (key: string) => {
      store.delete(key);
    },
    getAllKeys: async () => Array.from(store.keys()),
    multiRemove: async (keys: string[]) => {
      keys.forEach((key) => store.delete(key));
    },
    clear: async () => {
      store.clear();
    },
    multiGet: async (keys: string[]) => {
      return keys.map((key) => [key, store.get(key) || null]);
    },
    multiSet: async (keyValuePairs: [string, string][]) => {
      keyValuePairs.forEach(([key, value]) => store.set(key, value));
    },
  } as unknown as typeof AsyncStorage;
}

/**
 * Clear all mocks and reset state
 */
export function resetMocks() {
  jest.clearAllMocks();
  delete (globalThis as any)._DNDEV_CONFIG_;
  delete (globalThis as any)._DNDEV_STORES_;
}

/**
 * Wait for async operations
 */
export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
