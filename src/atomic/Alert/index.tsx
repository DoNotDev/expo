// packages/expo/src/atomic/Alert/index.tsx
/**
 * @fileoverview Alert component
 * @description Attention-grabbing alert component with semantic variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Alert variant constants - THEME_VARIANT + Alert-specific semantic names
 */
export const ALERT_VARIANT = {
  DEFAULT: THEME_VARIANT.MUTED,
  ERROR: 'error',
  WARNING: THEME_VARIANT.WARNING,
  SUCCESS: THEME_VARIANT.SUCCESS,
  INFO: 'info',
} as const;

export type AlertVariant = (typeof ALERT_VARIANT)[keyof typeof ALERT_VARIANT];

/**
 * Alert component props interface
 */
export interface AlertProps {
  /**
   * The visual style of the alert
   * @default 'default'
   */
  variant?: AlertVariant;
  /**
   * Whether to hide the variant icon
   * @default false
   */
  hideIcon?: boolean;
  /**
   * The title of the alert
   */
  title?: ReactNode;
  /**
   * The main content/description of the alert
   */
  description?: ReactNode;
  /**
   * Custom content (alternative to title/description)
   */
  children?: ReactNode;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const alertBaseStyle: ViewStyle = {
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
};

/**
 * Returns theme-driven variant styles for alert background, border, title, and description.
 */
function useAlertVariantStyles(variant: AlertVariant) {
  const { theme } = useTheme();
  const c = theme.colors;

  const map: Record<
    AlertVariant,
    { bg: string; border: string; title: string; description: string }
  > = {
    muted: {
      bg: c.muted,
      border: c.border,
      title: c.foreground,
      description: c.mutedForeground,
    },
    error: {
      bg: c.destructive + '14', // 8% opacity
      border: c.destructive + '40', // 25% opacity
      title: c.destructive,
      description: c.destructive,
    },
    warning: {
      bg: c.warning + '14',
      border: c.warning + '40',
      title: c.warningForeground,
      description: c.warning,
    },
    success: {
      bg: c.success + '14',
      border: c.success + '40',
      title: c.success,
      description: c.success,
    },
    info: {
      bg: c.primary + '14',
      border: c.primary + '40',
      title: c.primary,
      description: c.primary,
    },
  };

  const v = map[variant] ?? map.muted;
  return {
    container: { backgroundColor: v.bg, borderColor: v.border } as ViewStyle,
    title: { color: v.title },
    description: { color: v.description },
  };
}

/**
 * Attention-grabbing alert component with semantic variants.
 *
 * @component
 * @example
 * ```tsx
 * <Alert variant="error" title="Error" description="Something went wrong" />
 * <Alert variant="success" title="Success" description="Operation completed" />
 * ```
 */
const Alert = ({
  variant = ALERT_VARIANT.DEFAULT,
  hideIcon,
  title,
  description,
  children,
  style,
  testID,
}: AlertProps) => {
  const variantStyles = useAlertVariantStyles(variant);

  return (
    <View
      style={mergeStyles(alertBaseStyle, variantStyles.container, style)}
      testID={testID}
    >
      <Stack gap={4}>
        {title && (
          <Text
            level="h4"
            style={variantStyles.title}
            testID={testID ? `${testID}-title` : undefined}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text
            level="small"
            style={variantStyles.description}
            testID={testID ? `${testID}-description` : undefined}
          >
            {description}
          </Text>
        )}
        {children}
      </Stack>
    </View>
  );
};

export default Alert;
