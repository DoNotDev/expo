// packages/expo/src/storage/zustandAsyncStorage.ts
/**
 * @fileoverview Zustand AsyncStorage adapter
 * @description StateStorage adapter for zustand persist middleware using AsyncStorage
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StateStorage } from 'zustand/middleware';

/**
 * Zustand StateStorage adapter for AsyncStorage
 *
 * Provides persistence for zustand stores using React Native AsyncStorage.
 * Drop-in replacement for localStorage-based persistence on mobile platforms.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const zustandAsyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.warn(
        `[zustandAsyncStorage] Failed to get item "${name}":`,
        error
      );
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      if (__DEV__) {
        console.error(
          `[zustandAsyncStorage] Failed to set item "${name}":`,
          error
        );
      }
      throw error;
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      if (__DEV__) {
        console.error(
          `[zustandAsyncStorage] Failed to remove item "${name}":`,
          error
        );
      }
      // Don't throw - removal failures are non-critical
    }
  },
};

export default zustandAsyncStorage;
