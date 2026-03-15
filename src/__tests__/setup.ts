// packages/expo/src/__tests__/setup.ts
/**
 * @fileoverview Test setup for Expo package
 * @description Mocks React Native APIs and sets up test environment
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React from 'react';

// Mock React Native modules - return React elements for @testing-library/react-native
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('View', { ...props, ref }, children)
    ),
    Text: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('Text', { ...props, ref }, children)
    ),
    TouchableOpacity: React.forwardRef(
      ({ children, onPress, ...props }: any, ref: any) =>
        React.createElement(
          'TouchableOpacity',
          { ...props, ref, onPress },
          children
        )
    ),
    ScrollView: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('ScrollView', { ...props, ref }, children)
    ),
    TextInput: React.forwardRef((props: any, ref: any) =>
      React.createElement('TextInput', { ...props, ref })
    ),
    Modal: ({ children, ...props }: any) =>
      React.createElement('Modal', props, children),
    ActivityIndicator: (props: any) =>
      React.createElement('ActivityIndicator', props),
    Switch: (props: any) => React.createElement('Switch', props),
    Image: React.forwardRef((props: any, ref: any) =>
      React.createElement('Image', { ...props, ref })
    ),
    Platform: {
      OS: 'ios',
      select: jest.fn((obj: any) => obj.ios || obj.default),
    },
    Linking: {
      openURL: jest.fn(() => Promise.resolve()),
    },
    Clipboard: {
      setString: jest.fn(() => Promise.resolve()),
      getString: jest.fn(() => Promise.resolve('')),
    },
    StyleSheet: {
      create: jest.fn((styles: any) => styles),
      absoluteFill: {},
    },
    Animated: {
      View: 'Animated.View',
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn((callback: any) => callback?.()),
      })),
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) =>
        Promise.resolve(store.get(key) || null)
      ),
      setItem: jest.fn((key: string, value: string) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        store.delete(key);
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Array.from(store.keys()))),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach((key) => store.delete(key));
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve();
      }),
    },
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    setParams: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  Link: 'Link',
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Video: 'Video',
}));

// Mock expo-audio
jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn((_uri: string) => ({
    loop: false,
    muted: false,
    volume: 1,
    play: jest.fn(),
    pause: jest.fn(),
  })),
}));

// Mock expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));

// Mock expo-document-picker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [
        {
          uri: 'file://test.pdf',
          name: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
        },
      ],
    })
  ),
}));

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => ({
  default: 'DateTimePicker',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })),
}));

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  initializeAuth: jest.fn(() => ({})),
  getReactNativePersistence: jest.fn(() => ({})),
}));

jest.mock('firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}));

// Reset global config before each test
beforeEach(() => {
  delete (globalThis as any)._DNDEV_CONFIG_;
  delete (globalThis as any)._DNDEV_STORES_;
});
