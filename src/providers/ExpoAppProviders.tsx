// packages/expo/src/providers/ExpoAppProviders.tsx
/**
 * @fileoverview Expo App Providers
 * @description Provider wrapper for Expo apps with all framework providers
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getStorageManager, initializePlatformDetection } from '@donotdev/core';

import { AsyncStorageStrategy } from '../storage/AsyncStorageStrategy';
import { zustandAsyncStorage } from '../storage/zustandAsyncStorage';
import { ThemeProvider } from '../theme';

import type { ReactNode } from 'react';

/**
 * Query client singleton for Expo apps
 */
let queryClient: QueryClient | null = null;

/** Module-level ref to avoid re-creating strategy on every userId change */
let activeStrategy: AsyncStorageStrategy | null = null;

/** Monotonic counter to guard against userId race during fast auth transitions */
let strategyVersion = 0;

function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 30, // 30 minutes
        },
      },
    });
  }
  return queryClient;
}

/**
 * ExpoAppProviders - Provider wrapper for Expo apps
 *
 * Sets up:
 * - AsyncStorageStrategy for StorageManager
 * - Platform detection (Expo)
 * - SafeAreaProvider for safe area handling
 * - TanStack Query client
 * - Zustand AsyncStorage persistence
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function ExpoAppProviders({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string | null;
}) {
  useEffect(() => {
    const version = ++strategyVersion;

    if (typeof globalThis !== 'undefined') {
      const existingConfig = globalThis._DNDEV_CONFIG_;
      globalThis._DNDEV_CONFIG_ = {
        ...existingConfig,
        platform: 'expo',
        context: 'client',
        mode: __DEV__ ? 'development' : 'production',
        version: existingConfig?.version || '0.0.0',
        timestamp: existingConfig?.timestamp || Date.now(),
      };
    }

    initializePlatformDetection();

    const storageManager = getStorageManager();

    if (!activeStrategy) {
      activeStrategy = new AsyncStorageStrategy(userId || null);
      storageManager.setStrategy(activeStrategy);
    } else {
      // Guard: if a newer effect fired while this one was pending, bail out
      if (version !== strategyVersion) return;
      activeStrategy.setUserId(userId || null);
    }

    if (userId) {
      // Guard: stale effect must not push an outdated userId
      if (version !== strategyVersion) return;
      storageManager.updateUser(userId, false);
    }

    return () => {
      // Only clear if this effect is still the current one.
      // Prevents a stale cleanup from wiping the new user's context.
      if (version === strategyVersion) {
        activeStrategy?.setUserId(null);
      }
    };
  }, [userId]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={getQueryClient()}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/**
 * Get Zustand AsyncStorage adapter for store persistence
 * Use this in createDoNotDevStore persistOptions:
 *
 * @example
 * ```ts
 * const useMyStore = createDoNotDevStore({
 *   name: 'myStore',
 *   persistOptions: {
 *     name: 'myStore',
 *     storage: getZustandAsyncStorage(),
 *   },
 *   // ...
 * });
 * ```
 */
export function getZustandAsyncStorage() {
  return zustandAsyncStorage;
}

export default ExpoAppProviders;
