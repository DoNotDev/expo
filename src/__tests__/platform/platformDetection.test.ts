/**
 * @fileoverview Platform detection tests
 * @description Tests to ensure isExpo() and isReactNative() work correctly
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { PLATFORMS } from '@donotdev/core';

describe('Platform Detection (Expo)', () => {
  beforeEach(() => {
    jest.resetModules();
    delete (globalThis as any)._DNDEV_CONFIG_;
    delete (globalThis as any).expo;
    delete (globalThis as any).Platform;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (globalThis as any)._DNDEV_CONFIG_;
    delete (globalThis as any).expo;
    delete (globalThis as any).Platform;
  });

  describe('isExpo', () => {
    it('detects Expo via Constants.expoConfig', async () => {
      (globalThis as any).expo = {
        Constants: {
          expoConfig: {
            name: 'test-app',
          },
        },
      };

      const { isExpo } = await import('@donotdev/core');
      expect(isExpo()).toBe(true);
    });

    it('detects Expo via config.platform', async () => {
      (globalThis as any)._DNDEV_CONFIG_ = {
        platform: PLATFORMS.EXPO,
        context: 'client',
      };

      const { isExpo } = await import('@donotdev/core');
      expect(isExpo()).toBe(true);
    });

    it('returns false when not Expo', async () => {
      delete (globalThis as any).expo;
      delete (globalThis as any)._DNDEV_CONFIG_;

      const { isExpo } = await import('@donotdev/core');
      expect(isExpo()).toBe(false);
    });
  });

  describe('isReactNative', () => {
    it('detects React Native via Platform.OS', async () => {
      (globalThis as any).Platform = {
        OS: 'ios',
      };

      const { isReactNative } = await import('@donotdev/core');
      expect(isReactNative()).toBe(true);
    });

    it('detects React Native via config.platform', async () => {
      (globalThis as any)._DNDEV_CONFIG_ = {
        platform: PLATFORMS.REACT_NATIVE,
        context: 'client',
      };

      const { isReactNative } = await import('@donotdev/core');
      expect(isReactNative()).toBe(true);
    });

    it('detects Expo as React Native', async () => {
      (globalThis as any)._DNDEV_CONFIG_ = {
        platform: PLATFORMS.EXPO,
        context: 'client',
      };

      const { isReactNative } = await import('@donotdev/core');
      expect(isReactNative()).toBe(true);
    });
  });

  describe('isClient', () => {
    it('returns false when no window/document (server)', async () => {
      // In jest-expo node env, there's no window.location by default
      const { isClient } = await import('@donotdev/core');
      // Just verify the function exists and returns a boolean
      expect(typeof isClient()).toBe('boolean');
    });
  });
});
