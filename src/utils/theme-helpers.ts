// packages/expo/src/utils/theme-helpers.ts
/**
 * @fileoverview Theme Helper Utilities
 * @description Utilities to help components use theme tokens consistently
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { Theme } from '../theme/tokens';
import type { ViewStyle, TextStyle } from 'react-native';

/**
 * Get variant color from theme
 */
export function getVariantColor(
  theme: Theme,
  variant:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'muted'
): string {
  const colorMap: Record<string, keyof typeof theme.colors> = {
    default: 'foreground',
    primary: 'primary',
    secondary: 'secondary',
    accent: 'accent',
    success: 'success',
    warning: 'warning',
    destructive: 'destructive',
    muted: 'muted',
  };
  return theme.colors[colorMap[variant] || 'foreground'];
}

/**
 * Get variant foreground color from theme
 */
export function getVariantForegroundColor(
  theme: Theme,
  variant:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'muted'
): string {
  const colorMap: Record<string, keyof typeof theme.colors> = {
    default: 'foreground',
    primary: 'primaryForeground',
    secondary: 'secondaryForeground',
    accent: 'accentForeground',
    success: 'successForeground',
    warning: 'warningForeground',
    destructive: 'destructiveForeground',
    muted: 'mutedForeground',
  };
  return theme.colors[colorMap[variant] || 'foreground'];
}

/**
 * Get overlay background color (for modals, dialogs)
 */
export function getOverlayBackground(theme: Theme): string {
  // Use rgba with opacity for overlay
  const bg = theme.colors.background;
  // Convert hex to rgba with 0.5 opacity
  if (bg.startsWith('#')) {
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }
  return bg;
}

/**
 * Get shadow color from theme
 */
export function getShadowColor(theme: Theme): string {
  return theme.colors.foreground;
}

/**
 * Get shadow opacity from theme
 */
export function getShadowOpacity(theme: Theme): number {
  return theme.opacity.subtle;
}
