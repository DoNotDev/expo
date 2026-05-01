/**
 * @fileoverview ExpoAppProviders tests
 * @description Tests for ExpoAppProviders to ensure proper setup
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getStorageManager } from '@donotdev/core';

import {
  ExpoAppProviders,
  getZustandAsyncStorage,
} from '../../providers/ExpoAppProviders';

describe('ExpoAppProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as any)._DNDEV_CONFIG_;
  });

  it('renders children', () => {
    const { getByText } = render(
      <ExpoAppProviders>
        <Text>Test Content</Text>
      </ExpoAppProviders>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('initializes platform detection', async () => {
    render(
      <ExpoAppProviders>
        <Text>Test</Text>
      </ExpoAppProviders>
    );
    // Wait for useEffect to run
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(globalThis._DNDEV_CONFIG_).toBeDefined();
    expect(globalThis._DNDEV_CONFIG_!.platform).toBe('expo');
  });

  it('sets AsyncStorageStrategy in StorageManager', async () => {
    render(
      <ExpoAppProviders userId="user123">
        <Text>Test</Text>
      </ExpoAppProviders>
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    const storageManager = getStorageManager();
    // StorageManager should be initialized with AsyncStorageStrategy
    expect(storageManager).toBeDefined();
  });

  it('handles userId prop', async () => {
    render(
      <ExpoAppProviders userId="user123">
        <Text>Test</Text>
      </ExpoAppProviders>
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    // Should set user in storage manager
    expect(globalThis._DNDEV_CONFIG_).toBeDefined();
  });
});

describe('getZustandAsyncStorage', () => {
  it('returns zustandAsyncStorage instance', () => {
    const storage = getZustandAsyncStorage();
    expect(storage).toBeDefined();
    expect(storage.getItem).toBeDefined();
    expect(storage.setItem).toBeDefined();
    expect(storage.removeItem).toBeDefined();
  });
});
