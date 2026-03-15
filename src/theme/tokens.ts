// packages/expo/src/theme/tokens.ts
/**
 * @fileoverview Design Tokens for React Native
 * @description Extracted from @donotdev/components variables.css - single source of truth
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

/**
 * Design tokens matching @donotdev/components/src/styles/variables.css
 * These values are the single source of truth - React Native components use these
 * instead of hardcoded colors to match web components exactly.
 */

// ===========================
// SPACING SYSTEM
// ===========================
export const spacing = {
  none: 0,
  sm: 8, // 0.5rem = 8px
  md: 16, // 1rem = 16px
  lg: 32, // 2rem = 32px
} as const;

// ===========================
// BORDER RADIUS
// ===========================
export const radius = {
  none: 0,
  md: 12, // 0.75rem = 12px
  full: 9999, // pill shape
  interactive: 0, // Buttons, links = square
  surface: 12, // Cards, dialogs = rounded
  floating: 0, // Dropdowns, popovers = square
} as const;

// ===========================
// TYPOGRAPHY
// ===========================
export const typography = {
  fontSize: {
    xs: 12, // 0.75rem
    sm: 14, // 0.875rem
    base: 16, // 1rem
    lg: 20, // 1.25rem
    xl: 25, // 1.563rem
    '2xl': 31, // 1.953rem
    '3xl': 39, // 2.441rem
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    base: 1.25, // Major Third
  },
} as const;

// ===========================
// INTERACTIVE ELEMENTS
// ===========================
export const interactive = {
  touchTarget: 48, // --touch-target
  iconMd: 24, // --icon-md
  iconTouch: 32, // --icon-touch
} as const;

// ===========================
// Z-INDEX SYSTEM
// ===========================
export const zIndex = {
  header: 100,
  sidebar: 90,
  footer: 1,
  overlay: 40,
  breadcrumbs: 10,
  dropdown: 50,
  modal: 1000,
  tooltip: 1100,
  toast: 1200,
} as const;

// ===========================
// OPACITY SYSTEM
// ===========================
export const opacity = {
  subtle: 0.3,
  muted: 0.6,
  strong: 0.9,
} as const;

// ===========================
// ANIMATION DURATIONS
// ===========================
export const duration = {
  fast: 150, // 0.15s in ms
  normal: 300, // 0.3s in ms
  slow: 500, // 0.5s in ms
  heavy: 700, // 0.7s in ms
  hero: 1000, // 1s in ms
} as const;

// ===========================
// COLOR TOKENS - LIGHT THEME (DEFAULT)
// Matching @donotdev/components/src/styles/variables.css and themes.css
// ===========================
export const colorsLight = {
  // Base colors
  background: '#ffffff',
  foreground: '#000000',
  textColor: '#000000',

  // Brand colors
  primary: '#00bcd4', // Cyan
  primaryForeground: '#000000',
  secondary: '#047857', // Emerald-700 - WCAG AA compliant
  secondaryForeground: '#ffffff',
  accent: '#ff9800', // Orange
  accentForeground: '#000000',

  // Status colors
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  success: '#047857', // Emerald-700 - WCAG AA compliant
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#000000',

  // UI colors (computed from base colors)
  muted: '#f3f4f6', // Approximate color-mix(foreground 5%, background)
  mutedForeground: '#4b5563', // Approximate color-mix(foreground 75%, background)
  border: '#e5e7eb', // Approximate color-mix(foreground 15%, background)
  input: '#f3f4f6', // Same as muted
  ring: '#00bcd4', // Same as primary

  // Containers
  card: '#ffffff', // Same as background
  cardForeground: '#000000', // Same as foreground
  popover: '#ffffff', // Same as card
  popoverForeground: '#000000', // Same as cardForeground
} as const;

// ===========================
// COLOR TOKENS - DARK THEME
// ===========================
export const colorsDark = {
  // Base colors
  background: '#000000',
  foreground: '#ffffff',
  textColor: '#ffffff',

  // Brand colors
  primary: '#00bcd4', // Cyan (same in dark)
  primaryForeground: '#000000', // Black on cyan passes WCAG AA (~5.4:1)
  secondary: '#10b981', // Emerald-500 (lighter for dark bg)
  secondaryForeground: '#ffffff',
  accent: '#ff9800', // Orange (same in dark)
  accentForeground: '#ffffff',

  // Status colors
  destructive: '#ef4444', // Red-500 (lighter for dark bg)
  destructiveForeground: '#ffffff',
  success: '#10b981', // Emerald-500 (lighter for dark bg)
  successForeground: '#ffffff',
  warning: '#f59e0b', // Same
  warningForeground: '#000000',

  // UI colors (computed for dark theme)
  muted: '#1f2937', // Dark gray
  mutedForeground: '#d1d5db', // Light gray
  border: '#374151', // Medium gray
  input: '#1f2937', // Same as muted
  ring: '#00bcd4', // Same as primary

  // Containers
  card: '#111827', // Dark gray
  cardForeground: '#ffffff',
  popover: '#111827', // Same as card
  popoverForeground: '#ffffff',
} as const;

/**
 * Theme configuration
 */
export interface Theme {
  colors: typeof colorsLight | typeof colorsDark;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  interactive: typeof interactive;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
  duration: typeof duration;
}

/**
 * Light theme (default)
 */
export const lightTheme: Theme = {
  colors: colorsLight,
  spacing,
  radius,
  typography,
  interactive,
  zIndex,
  opacity,
  duration,
};

/**
 * Dark theme
 */
export const darkTheme: Theme = {
  colors: colorsDark,
  spacing,
  radius,
  typography,
  interactive,
  zIndex,
  opacity,
  duration,
};

/**
 * Default theme (light)
 */
export const defaultTheme = lightTheme;
