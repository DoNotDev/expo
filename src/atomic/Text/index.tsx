// packages/expo/src/atomic/Text/index.tsx
/**
 * @fileoverview Text component
 * @description Typography component for consistent text styling. Supports headings, body text, and semantic elements.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Text as RNText, StyleSheet, type TextStyle } from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import {
  getVariantColor,
  getVariantForegroundColor,
} from '../../utils/theme-helpers';

import type { ReactNode } from 'react';

/**
 * Text variant constants - THEME_VARIANT + CODE (Text-specific)
 */
export const TEXT_VARIANT = {
  ...THEME_VARIANT,
  CODE: 'code',
} as const;

/**
 * Text level constants for typography hierarchy
 */
export const TEXT_LEVEL = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  BODY: 'body',
  SMALL: 'small',
  CAPTION: 'caption',
} as const;

/** Text typography level type. */
export type TextLevel = (typeof TEXT_LEVEL)[keyof typeof TEXT_LEVEL];
/** Text color variant type. */
export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];

/**
 * Text component props interface
 */
export interface TextProps {
  /**
   * Typography level
   * @default 'body'
   */
  level?: TextLevel;
  /**
   * Color variant
   * @default 'default'
   */
  variant?: TextVariant;
  /**
   * Text alignment (RTL-safe)
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Font weight override
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /**
   * Whether text is italic
   * @default false
   */
  italic?: boolean;
  /**
   * Text content
   */
  children: ReactNode;
  /**
   * Additional style
   */
  style?: TextStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

function getTextStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    h1: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight:
        theme.typography.fontSize['3xl'] * theme.typography.lineHeight.base,
    },
    h2: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight:
        theme.typography.fontSize['2xl'] * theme.typography.lineHeight.base,
    },
    h3: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight:
        theme.typography.fontSize.xl * theme.typography.lineHeight.base,
    },
    h4: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight:
        theme.typography.fontSize.lg * theme.typography.lineHeight.base,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      lineHeight:
        theme.typography.fontSize.base * theme.typography.lineHeight.base,
    },
    small: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight:
        theme.typography.fontSize.sm * theme.typography.lineHeight.base,
    },
    caption: {
      fontSize: theme.typography.fontSize.xs,
      lineHeight:
        theme.typography.fontSize.xs * theme.typography.lineHeight.base,
    },
  };
}

function getVariantStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    default: {
      color: theme.colors.foreground,
    },
    muted: {
      color: theme.colors.mutedForeground,
    },
    primary: {
      color: theme.colors.primary,
    },
    secondary: {
      color: theme.colors.secondary,
    },
    accent: {
      color: theme.colors.accent,
    },
    success: {
      color: theme.colors.success,
    },
    warning: {
      color: theme.colors.warning,
    },
    destructive: {
      color: theme.colors.destructive,
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: theme.colors.muted,
      paddingHorizontal: theme.spacing.sm / 2,
      paddingVertical: theme.spacing.sm / 4,
      borderRadius: theme.radius.md / 3,
    },
  };
}

/**
 * Typography component for consistent text styling.
 *
 * @component
 * @example
 * ```tsx
 * <Text level="h1">Heading</Text>
 * <Text level="body" variant="muted">Body text</Text>
 * <Text level="small" variant="code">Code snippet</Text>
 * ```
 */
const ALIGN_MAP = { start: 'left', center: 'center', end: 'right' } as const;
const WEIGHT_MAP = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

const Text = ({
  level = TEXT_LEVEL.BODY,
  variant = TEXT_VARIANT.DEFAULT,
  align,
  weight,
  italic,
  children,
  style,
  testID,
}: TextProps) => {
  const { theme } = useTheme();
  const textStyles = getTextStyles(theme);
  const variantStyles = getVariantStyles(theme);

  const levelStyle = textStyles[level];
  const variantStyle = variantStyles[variant];

  const extraStyle: TextStyle = {};
  if (align) extraStyle.textAlign = ALIGN_MAP[align];
  if (weight) extraStyle.fontWeight = WEIGHT_MAP[weight];
  if (italic) extraStyle.fontStyle = 'italic';

  return (
    <RNText
      style={mergeStyles(levelStyle, variantStyle, extraStyle, style)}
      testID={testID}
    >
      {children}
    </RNText>
  );
};

export default Text;
