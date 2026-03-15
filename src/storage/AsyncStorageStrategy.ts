// packages/expo/src/storage/AsyncStorageStrategy.ts
/**
 * @fileoverview AsyncStorage strategy
 * @description Storage strategy implementation using React Native AsyncStorage
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageOptions } from '@donotdev/core';
import { BaseStorageStrategy, handleError } from '@donotdev/core';

/**
 * Storage strategy using React Native AsyncStorage
 *
 * Provides async storage using React Native's AsyncStorage API.
 * Drop-in replacement for LocalStorageStrategy on mobile platforms.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export class AsyncStorageStrategy extends BaseStorageStrategy {
  /**
   * User ID for user-scoped storage
   * Can be null for non-authenticated users (only global/session storage available)
   */
  private userId: string | null = null;

  /**
   * Create a new AsyncStorageStrategy
   * @param userId Optional user ID for user-scoped storage
   */
  constructor(userId: string | null = null) {
    super();
    this.userId = userId;
  }

  /**
   * Set the current user ID
   * @param userId User ID or null
   */
  public setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * Retrieve data from AsyncStorage
   */
  public async get<T>(
    key: string,
    options: StorageOptions = {}
  ): Promise<T | null> {
    const { scope = 'user', encryption = false } = options;
    // Allow missing userId for graceful degradation during sign out
    const fullKey = this.buildKey(key, scope, this.userId, true);

    // If userId is missing and scope is 'user', return null gracefully
    if (!fullKey) {
      return null;
    }

    let raw: string | null;
    try {
      raw = await AsyncStorage.getItem(fullKey);
    } catch (error: unknown) {
      throw handleError(error, {
        userMessage: 'Failed to read from storage',
        context: { key, options },
      });
    }

    if (!raw) return null;

    let parsed: { value: T; expiresAt?: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Corrupted entry — purge so it doesn't poison every future read
      await AsyncStorage.removeItem(fullKey).catch(() => {});
      return null;
    }

    // Side effect: expired entries are purged on read to prevent stale data accumulation.
    // This is intentional — AsyncStorage has no TTL mechanism, so cleanup happens lazily.
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      await this.remove(key);
      return null;
    }

    const value = parsed.value;

    if (encryption) {
      throw handleError(
        new Error(
          'AsyncStorageStrategy: encryption is not yet supported. Data would be stored in plaintext - refusing to proceed.'
        ),
        {
          userMessage: 'Encryption is not supported on this platform',
          severity: 'error',
          context: { key },
        }
      );
    }

    return value as T;
  }

  /**
   * Store data in AsyncStorage
   */
  public async set<T>(
    key: string,
    value: T,
    options: StorageOptions = {}
  ): Promise<void> {
    const { scope = 'user', encryption = false, expiry = 0 } = options;
    // Allow missing userId for graceful degradation during sign out
    const fullKey = this.buildKey(key, scope, this.userId, true);

    // Fail loud: writing user-scoped data without a userId means data loss
    if (!fullKey) {
      throw handleError(
        new Error(
          'AsyncStorageStrategy.set(): Cannot write user-scoped data without a userId. ' +
            'This usually means set() was called after sign-out or before authentication.'
        ),
        {
          userMessage: 'Cannot save data: no authenticated user',
          severity: 'error',
          context: { key, scope, userId: this.userId },
        }
      );
    }

    try {
      if (encryption) {
        throw handleError(
          new Error(
            'AsyncStorageStrategy: encryption is not yet supported. Data would be stored in plaintext - refusing to proceed.'
          ),
          {
            userMessage: 'Encryption is not supported on this platform',
            severity: 'error',
            context: { key },
          }
        );
      }

      const expiresAt =
        expiry > 0 ? new Date(Date.now() + expiry * 1000).toISOString() : null;

      const data = JSON.stringify({
        value,
        expiresAt,
      });

      await AsyncStorage.setItem(fullKey, data);
    } catch (error: unknown) {
      const msg =
        error instanceof Error && /quota/i.test(error.message)
          ? 'Storage quota exceeded. Please free up space or login to sync to cloud.'
          : 'Failed to store data in storage';

      throw handleError(error, {
        userMessage: msg,
        context: { key, options },
      });
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  public async remove(key: string): Promise<void> {
    // Try to remove from all scopes to be safe
    const scopes: Array<'user' | 'global' | 'session'> = [
      'user',
      'global',
      'session',
    ];

    for (const scope of scopes) {
      try {
        // Allow missing userId for graceful degradation during sign out
        const fullKey = this.buildKey(key, scope, this.userId, true);
        // Skip if userId is missing and scope is 'user'
        if (!fullKey) continue;

        await AsyncStorage.removeItem(fullKey);
      } catch (error) {
        handleError(error, {
          severity: 'warning',
          showNotification: false,
          context: { key, scope },
        });
      }
    }
  }

  /**
   * Clear all data in the specified scope
   */
  public async clear(scope?: 'user' | 'global' | 'session'): Promise<void> {
    // If no scope specified, only clear our app's keys
    if (!scope) {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter((key) => key.startsWith('dndev:'));

      await AsyncStorage.multiRemove(appKeys);
      return;
    }

    // Clear specific scope
    const prefix =
      scope === 'user' && this.userId
        ? `dndev:user:${this.userId}:`
        : `dndev:${scope}:`;

    const allKeys = await AsyncStorage.getAllKeys();
    const scopeKeys = allKeys.filter((key) => key.startsWith(prefix));

    await AsyncStorage.multiRemove(scopeKeys);
  }
}

export default AsyncStorageStrategy;
