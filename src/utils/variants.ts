// packages/expo/src/utils/variants.ts
/**
 * @fileoverview Variant utilities for Expo components
 * @description Style variant helpers for React Native components using design tokens
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { type ViewStyle, type TextStyle } from 'react-native';

import { THEME_VARIANT, SURFACE_VARIANT } from './constants';

import type { Theme } from '../theme/tokens';

/**
 * Button variant styles factory - uses theme tokens
 * Note: These are functions that take theme and return styles
 * Components should use useTheme() to get current theme
 */
export function getButtonVariants(theme: Theme): Record<string, ViewStyle> {
  const { colors, radius } = theme;
  return {
    default: {
      backgroundColor: colors.muted,
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondary,
    },
    accent: {
      backgroundColor: colors.accent,
    },
    success: {
      backgroundColor: colors.success,
    },
    warning: {
      backgroundColor: colors.warning,
    },
    destructive: {
      backgroundColor: colors.destructive,
    },
    muted: {
      backgroundColor: colors.muted,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    link: {
      backgroundColor: 'transparent',
    },
  };
}

/**
 * Button text variant styles factory - uses theme tokens
 */
export function getButtonTextVariants(theme: Theme): Record<string, TextStyle> {
  const { colors } = theme;
  return {
    default: {
      color: colors.foreground,
    },
    primary: {
      color: colors.primaryForeground,
    },
    secondary: {
      color: colors.secondaryForeground,
    },
    accent: {
      color: colors.accentForeground,
    },
    success: {
      color: colors.successForeground,
    },
    warning: {
      color: colors.warningForeground,
    },
    destructive: {
      color: colors.destructiveForeground,
    },
    muted: {
      color: colors.mutedForeground,
    },
    ghost: {
      color: colors.foreground,
    },
    outline: {
      color: colors.foreground,
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'underline' as const,
    },
  };
}

/**
 * Surface variant styles factory - uses theme tokens
 */
export function getSurfaceVariants(theme: Theme): Record<string, ViewStyle> {
  const { colors, radius } = theme;
  return {
    default: {
      backgroundColor: colors.card,
    },
    primary: {
      backgroundColor: colors.primary + '1A', // 10% opacity
    },
    secondary: {
      backgroundColor: colors.secondary + '1A',
    },
    accent: {
      backgroundColor: colors.accent + '1A',
    },
    success: {
      backgroundColor: colors.success + '1A',
    },
    warning: {
      backgroundColor: colors.warning + '1A',
    },
    destructive: {
      backgroundColor: colors.destructive + '1A',
    },
    muted: {
      backgroundColor: colors.muted,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    glass: {
      backgroundColor: colors.card + 'CC', // ~80% opacity
    },
  };
}
