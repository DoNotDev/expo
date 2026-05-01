/**
 * @fileoverview Zustand AsyncStorage adapter tests
 * @description Tests for zustandAsyncStorage StateStorage adapter
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { zustandAsyncStorage } from '../../storage/zustandAsyncStorage';

describe('zustandAsyncStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('getItem', () => {
    it('retrieves stored item', async () => {
      await AsyncStorage.setItem('testKey', 'testValue');
      const value = await zustandAsyncStorage.getItem('testKey');
      expect(value).toBe('testValue');
    });

    it('returns null for non-existent key', async () => {
      const value = await zustandAsyncStorage.getItem('nonExistent');
      expect(value).toBeNull();
    });

    it('handles errors gracefully', async () => {
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockRejectedValueOnce(new Error('Storage error'));
      const value = await zustandAsyncStorage.getItem('testKey');
      expect(value).toBeNull();
    });
  });

  describe('setItem', () => {
    it('stores item', async () => {
      await zustandAsyncStorage.setItem('testKey', 'testValue');
      const value = await AsyncStorage.getItem('testKey');
      expect(value).toBe('testValue');
    });

    it('throws on error', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('Storage error'));
      await expect(
        zustandAsyncStorage.setItem('testKey', 'testValue')
      ).rejects.toThrow();
    });
  });

  describe('removeItem', () => {
    it('removes item', async () => {
      await AsyncStorage.setItem('testKey', 'testValue');
      await zustandAsyncStorage.removeItem('testKey');
      const value = await AsyncStorage.getItem('testKey');
      expect(value).toBeNull();
    });

    it('handles errors gracefully (non-critical)', async () => {
      jest
        .spyOn(AsyncStorage, 'removeItem')
        .mockRejectedValueOnce(new Error('Storage error'));
      // Should not throw
      await expect(
        zustandAsyncStorage.removeItem('testKey')
      ).resolves.toBeUndefined();
    });
  });

  describe('integration with zustand persist', () => {
    it('implements StateStorage interface correctly', () => {
      expect(zustandAsyncStorage.getItem).toBeDefined();
      expect(zustandAsyncStorage.setItem).toBeDefined();
      expect(zustandAsyncStorage.removeItem).toBeDefined();
      expect(typeof zustandAsyncStorage.getItem).toBe('function');
      expect(typeof zustandAsyncStorage.setItem).toBe('function');
      expect(typeof zustandAsyncStorage.removeItem).toBe('function');
    });

    it('works with createDoNotDevStore persistOptions', async () => {
      // This is a smoke test - actual integration would require zustand
      const testData = JSON.stringify({ count: 42 });
      await zustandAsyncStorage.setItem('testStore', testData);
      const retrieved = await zustandAsyncStorage.getItem('testStore');
      expect(retrieved).toBe(testData);
    });
  });
});
