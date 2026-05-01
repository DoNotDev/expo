/**
 * @fileoverview Firebase auth persistence tests
 * @description Tests for Firebase auth initialization with AsyncStorage
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';

import { initializeExpoAuth } from '../../firebase/authPersistence';

jest.mock('firebase/auth');
jest.mock('firebase/app');
jest.mock('@react-native-async-storage/async-storage');

describe('initializeExpoAuth', () => {
  const mockApp = {};
  const mockAuth = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (getApp as jest.Mock).mockReturnValue(mockApp);
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (getReactNativePersistence as jest.Mock).mockReturnValue({});
  });

  it('returns existing auth instance if available', () => {
    const auth = initializeExpoAuth();
    expect(getAuth).toHaveBeenCalledWith(mockApp);
    expect(auth).toBe(mockAuth);
  });

  it('creates new auth with AsyncStorage persistence if none exists', () => {
    (getAuth as jest.Mock).mockImplementation(() => {
      throw new Error('No auth instance');
    });

    const auth = initializeExpoAuth();
    expect(initializeAuth).toHaveBeenCalledWith(mockApp, {
      persistence: expect.any(Object),
    });
    expect(getReactNativePersistence).toHaveBeenCalledWith(AsyncStorage);
  });
});
