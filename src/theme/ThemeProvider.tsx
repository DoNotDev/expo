// packages/expo/src/theme/ThemeProvider.tsx
/**
 * @fileoverview Theme Provider for React Native
 * @description Provides theme context matching web design tokens
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { lightTheme, darkTheme, type Theme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  themeMode: 'light' | 'dark' | 'auto';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Props for the ThemeProvider component. */
export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Initial theme mode
   * @default 'auto' - follows system preference
   */
  initialTheme?: 'light' | 'dark' | 'auto';
  /**
   * Whether to follow system color scheme
   * @default true
   */
  followSystem?: boolean;
}

/**
 * ThemeProvider - Provides theme context matching web design tokens
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  initialTheme = 'auto',
  followSystem = true,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(
    initialTheme
  );

  // Determine actual theme based on mode and system preference
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'auto' && followSystem && systemColorScheme === 'dark');
  const theme: Theme = isDark ? darkTheme : lightTheme;

  const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * const { theme, isDark } = useTheme();
 * <View style={{ backgroundColor: theme.colors.background }} />
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Hook to get theme colors directly
 *
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * <View style={{ backgroundColor: colors.background }} />
 * ```
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}
