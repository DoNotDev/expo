/**
 * @fileoverview AsyncStorageStrategy tests
 * @description Tests for AsyncStorageStrategy storage adapter
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AsyncStorageStrategy } from '../../storage/AsyncStorageStrategy';

describe('AsyncStorageStrategy', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe('construction', () => {
    it('creates instance without userId', () => {
      const strategy = new AsyncStorageStrategy();
      expect(strategy).toBeDefined();
    });

    it('creates instance with userId', () => {
      const strategy = new AsyncStorageStrategy('user123');
      expect(strategy).toBeDefined();
    });

    it('allows setting userId after construction', () => {
      const strategy = new AsyncStorageStrategy();
      strategy.setUserId('user123');
      expect(strategy).toBeDefined();
    });
  });

  describe('get', () => {
    it('retrieves stored value', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await AsyncStorage.setItem(
        'dndev:user:user123:testKey',
        JSON.stringify({ value: 'hello', expiresAt: null })
      );

      const result = await strategy.get('testKey');
      expect(result).toBe('hello');
    });

    it('returns null for non-existent key', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      const result = await strategy.get('nonExistent');
      expect(result).toBeNull();
    });

    it('handles expired values', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      const expiredDate = new Date(Date.now() - 1000).toISOString();
      await AsyncStorage.setItem(
        'dndev:user:user123:expiredKey',
        JSON.stringify({ value: 'old', expiresAt: expiredDate })
      );

      const result = await strategy.get('expiredKey');
      expect(result).toBeNull();
    });

    it('handles global scope', async () => {
      const strategy = new AsyncStorageStrategy();
      await AsyncStorage.setItem(
        'dndev:global:globalKey',
        JSON.stringify({ value: 'global', expiresAt: null })
      );

      const result = await strategy.get('globalKey', { scope: 'global' });
      expect(result).toBe('global');
    });

    it('returns null gracefully when userId missing for user scope', async () => {
      const strategy = new AsyncStorageStrategy();
      const result = await strategy.get('testKey');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('stores value with user scope', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await strategy.set('testKey', 'testValue');

      const stored = await AsyncStorage.getItem('dndev:user:user123:testKey');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.value).toBe('testValue');
    });

    it('stores value with global scope', async () => {
      const strategy = new AsyncStorageStrategy();
      await strategy.set('testKey', 'testValue', { scope: 'global' });

      const stored = await AsyncStorage.getItem('dndev:global:testKey');
      expect(stored).toBeTruthy();
    });

    it('handles expiry', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await strategy.set('testKey', 'testValue', { expiry: 5 }); // expiry in seconds

      const stored = await AsyncStorage.getItem('dndev:user:user123:testKey');
      const parsed = JSON.parse(stored!);
      expect(parsed.expiresAt).toBeTruthy();
      expect(new Date(parsed.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('silently skips when userId missing for user scope', async () => {
      const strategy = new AsyncStorageStrategy();
      // Should not throw
      await strategy.set('testKey', 'testValue');
    });
  });

  describe('remove', () => {
    it('removes value from user scope', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await AsyncStorage.setItem(
        'dndev:user:user123:testKey',
        JSON.stringify({ value: 'hello', expiresAt: null })
      );

      await strategy.remove('testKey');
      const result = await AsyncStorage.getItem('dndev:user:user123:testKey');
      expect(result).toBeNull();
    });

    it('removes from all scopes', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await AsyncStorage.setItem(
        'dndev:global:testKey',
        JSON.stringify({ value: 'global', expiresAt: null })
      );

      // remove() tries all scopes automatically
      await strategy.remove('testKey');
      const result = await AsyncStorage.getItem('dndev:global:testKey');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('clears all app keys when no scope specified', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await AsyncStorage.setItem('dndev:user:user123:key1', 'value1');
      await AsyncStorage.setItem('dndev:global:key2', 'value2');
      await AsyncStorage.setItem('other:key3', 'value3'); // Should not be cleared

      await strategy.clear();

      expect(await AsyncStorage.getItem('dndev:user:user123:key1')).toBeNull();
      expect(await AsyncStorage.getItem('dndev:global:key2')).toBeNull();
      expect(await AsyncStorage.getItem('other:key3')).toBe('value3'); // Preserved
    });

    it('clears specific user scope', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await AsyncStorage.setItem('dndev:user:user123:key1', 'value1');
      await AsyncStorage.setItem('dndev:user:user456:key2', 'value2');
      await AsyncStorage.setItem('dndev:global:key3', 'value3');

      await strategy.clear('user');

      expect(await AsyncStorage.getItem('dndev:user:user123:key1')).toBeNull();
      // user456 keys preserved — clear('user') only affects current userId
      expect(await AsyncStorage.getItem('dndev:user:user456:key2')).toBe(
        'value2'
      );
      expect(await AsyncStorage.getItem('dndev:global:key3')).toBe('value3'); // Preserved
    });

    it('clears global scope', async () => {
      const strategy = new AsyncStorageStrategy();
      await AsyncStorage.setItem('dndev:global:key1', 'value1');
      await AsyncStorage.setItem('dndev:user:user123:key2', 'value2');

      await strategy.clear('global');

      expect(await AsyncStorage.getItem('dndev:global:key1')).toBeNull();
      expect(await AsyncStorage.getItem('dndev:user:user123:key2')).toBe(
        'value2'
      ); // Preserved
    });
  });

  describe('compatibility', () => {
    it('works as drop-in replacement for LocalStorageStrategy', () => {
      const strategy = new AsyncStorageStrategy('user123');
      expect(typeof strategy.get).toBe('function');
      expect(typeof strategy.set).toBe('function');
      expect(typeof strategy.remove).toBe('function');
      expect(typeof strategy.clear).toBe('function');
    });

    it('handles user updates correctly', async () => {
      const strategy = new AsyncStorageStrategy('user123');
      await strategy.set('testKey', 'forUser123');

      strategy.setUserId('user456');
      await strategy.set('testKey', 'forUser456');

      // Both values should exist under different user scopes
      expect(
        await AsyncStorage.getItem('dndev:user:user123:testKey')
      ).toBeTruthy();
      expect(
        await AsyncStorage.getItem('dndev:user:user456:testKey')
      ).toBeTruthy();
    });
  });
});
