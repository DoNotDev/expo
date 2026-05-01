// packages/expo/jest.config.ts

import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    // Map @donotdev/* to workspace source
    '^@donotdev/types(.*)$': '<rootDir>/../core/types/src$1',
    '^@donotdev/utils(.*)$': '<rootDir>/../core/utils/src$1',
    '^@donotdev/stores(.*)$': '<rootDir>/../core/stores/src$1',
    '^@donotdev/schemas(.*)$': '<rootDir>/../core/schemas/src$1',
    '^@donotdev/hooks(.*)$': '<rootDir>/../core/hooks/src$1',
    '^@donotdev/i18n(.*)$': '<rootDir>/../core/i18n/src$1',
    '^@donotdev/config(.*)$': '<rootDir>/../core/config/src$1',
    '^@donotdev/components(.*)$': '<rootDir>/../components/src$1',
    '^@donotdev/core/server$': '<rootDir>/../core/server.ts',
    '^@donotdev/core$': '<rootDir>/../core/index.ts',
    '^@donotdev/crud(.*)$': '<rootDir>/../features/crud/src$1',
    '^@donotdev/auth(.*)$': '<rootDir>/../features/auth/src$1',
    '^@donotdev/billing(.*)$': '<rootDir>/../features/billing/src$1',
    '^@donotdev/oauth(.*)$': '<rootDir>/../features/oauth/src$1',
    '^@donotdev/firebase(.*)$': '<rootDir>/../providers/firebase/src$1',
    '^@donotdev/ui(.*)$': '<rootDir>/../ui/src$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@donotdev/.*|@tanstack/.*|valibot|zustand)',
  ],
};

export default config;
