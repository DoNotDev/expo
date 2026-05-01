// packages/expo/src/utils/constants.ts
/**
 * @fileoverview Shared constants for Expo components
 * @description DRY constants used across multiple components
 */

/**
 * Theme variant constants - universal color variants used across all components
 * Single source of truth for theme-based color variants
 */
export const THEME_VARIANT = {
  DEFAULT: 'default',
  MUTED: 'muted',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  ACCENT: 'accent',
  SUCCESS: 'success',
  WARNING: 'warning',
  DESTRUCTIVE: 'destructive',
} as const;

/** Universal theme color variant type. */
export type ThemeVariant = (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT];

/**
 * Surface variant constants - matches web surface variants
 * Used by Card, Dialog, Sheet, Alert (all components using surface styling)
 */
export const SURFACE_VARIANT = {
  ...THEME_VARIANT,
  OUTLINE: 'outline',
  GLASS: 'glass',
} as const;

/** Surface component variant type (Card, Dialog, Sheet, Alert). */
export type SurfaceVariant =
  (typeof SURFACE_VARIANT)[keyof typeof SURFACE_VARIANT];

/**
 * Control variant constants (Checkbox, Switch, Slider, RadioGroup)
 * Semantic color variants for form controls
 */
/**
 * Floating variant constants (Tooltip, Popover, HoverCard)
 * Used by overlay components positioned relative to trigger
 */
export const FLOATING_VARIANT = SURFACE_VARIANT;

/** Floating overlay component variant type (Tooltip, Popover, HoverCard). */
export type FloatingVariant =
  (typeof FLOATING_VARIANT)[keyof typeof FLOATING_VARIANT];

/**
 * Control variant constants (Checkbox, Switch, Slider, RadioGroup)
 * Semantic color variants for form controls
 */
export const CONTROL_VARIANT = THEME_VARIANT;

/** Form control variant type (Checkbox, Switch, Slider, RadioGroup). */
export type ControlVariant = ThemeVariant;
