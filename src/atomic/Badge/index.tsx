// packages/expo/src/atomic/Badge/index.tsx
/**
 * @fileoverview Badge component
 * @description Status indicator component with semantic variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Badge variant constants - THEME_VARIANT + Badge-specific variants
 */
export const BADGE_VARIANT = {
  ...THEME_VARIANT,
  OUTLINE: 'outline',
} as const;

export type BadgeVariant = (typeof BADGE_VARIANT)[keyof typeof BADGE_VARIANT];

/**
 * Badge component props interface
 */
export interface BadgeProps {
  /**
   * Badge content
   */
  children: ReactNode;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: BadgeVariant;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const badgeBaseStyle: ViewStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  alignSelf: 'flex-start',
};

/**
 * Returns theme-driven variant styles for badge background and text color.
 */
function useBadgeVariantStyles(variant: BadgeVariant) {
  const { theme } = useTheme();
  const c = theme.colors;

  const map: Record<
    BadgeVariant,
    { bg: string; text: string; borderColor?: string; borderWidth?: number }
  > = {
    default: { bg: c.muted, text: c.foreground },
    muted: { bg: c.mutedForeground, text: c.background },
    primary: { bg: c.primary, text: c.primaryForeground },
    secondary: { bg: c.secondary, text: c.secondaryForeground },
    accent: { bg: c.accent, text: c.accentForeground },
    success: { bg: c.success, text: c.successForeground },
    warning: { bg: c.warning, text: c.warningForeground },
    destructive: { bg: c.destructive, text: c.destructiveForeground },
    outline: {
      bg: 'transparent',
      text: c.foreground,
      borderColor: c.border,
      borderWidth: 1,
    },
  };

  const v = map[variant] ?? map.default;
  return {
    container: {
      backgroundColor: v.bg,
      ...(v.borderColor
        ? { borderColor: v.borderColor, borderWidth: v.borderWidth }
        : {}),
    } as ViewStyle,
    text: { color: v.text },
  };
}

/**
 * Status indicator component with semantic variants.
 *
 * @component
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="outline">Draft</Badge>
 * ```
 */
const Badge = ({
  children,
  variant = BADGE_VARIANT.DEFAULT,
  style,
  testID,
}: BadgeProps) => {
  const variantStyles = useBadgeVariantStyles(variant);

  return (
    <View
      style={mergeStyles(badgeBaseStyle, variantStyles.container, style)}
      testID={testID}
    >
      <Text
        level="caption"
        style={variantStyles.text}
        testID={testID ? `${testID}-text` : undefined}
      >
        {children}
      </Text>
    </View>
  );
};

export default Badge;
