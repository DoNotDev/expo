// packages/expo/src/atomic/Button/index.tsx
/**
 * @fileoverview Button component
 * @description Accessible, type-safe button component with behavioral variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import { getButtonVariants, getButtonTextVariants } from '../../utils/variants';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Button variant constants - THEME_VARIANT + Button-specific variants
 */
export const BUTTON_VARIANT = {
  ...THEME_VARIANT,
  GHOST: 'ghost',
  OUTLINE: 'outline',
  LINK: 'link',
} as const;

/** Button visual variant type. */
export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

/**
 * Button component props interface
 */
export interface ButtonProps {
  /**
   * Button content
   */
  children: ReactNode;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: ButtonVariant;
  /**
   * Icon element rendered before children
   */
  icon?: ReactNode;
  /**
   * Place icon after children instead of before
   * @default false
   */
  iconEnd?: boolean;
  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether button is loading
   * @default false
   */
  loading?: boolean;
  /**
   * Text to display while loading (replaces children)
   */
  loadingText?: string;
  /**
   * Upload/operation progress (0-100)
   */
  progress?: number;
  /**
   * Whether button takes full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Press handler
   */
  onPress?: () => void;
  /**
   * Additional container style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Button type (for API parity with web)
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Form value attribute (for API parity with web)
   */
  value?: string;
}

const disabledStyle: ViewStyle = {
  opacity: 0.5,
};

/**
 * Accessible button component with behavioral variants.
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" onPress={() => console.log('Pressed')}>
 *   Click me
 * </Button>
 * <Button variant="outline" disabled>
 *   Disabled
 * </Button>
 * <Button variant="primary" loading>
 *   Loading...
 * </Button>
 * ```
 */
const Button = ({
  children,
  variant = BUTTON_VARIANT.DEFAULT,
  icon,
  iconEnd,
  disabled = false,
  loading = false,
  loadingText,
  progress,
  fullWidth,
  onPress,
  style,
  testID,
}: ButtonProps) => {
  const { theme } = useTheme();
  const buttonVariants = getButtonVariants(theme);
  const buttonTextVariants = getButtonTextVariants(theme);

  const variantStyle = buttonVariants[variant];
  const textStyle = buttonTextVariants[variant];

  const baseButtonStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.interactive,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.interactive.touchTarget,
    flexDirection: icon ? 'row' : undefined,
    gap: icon ? theme.spacing.sm : undefined,
  };
  if (fullWidth) baseButtonStyle.width = '100%';

  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <ActivityIndicator
            color={textStyle?.color}
            size="small"
            testID={testID ? `${testID}-loading` : undefined}
          />
          {loadingText && (
            <Text level="body" style={textStyle}>
              {loadingText}
            </Text>
          )}
        </View>
      );
    }

    const iconEl = icon || null;
    const textEl = (
      <Text
        level="body"
        style={textStyle}
        testID={testID ? `${testID}-text` : undefined}
      >
        {children}
      </Text>
    );

    if (iconEl && iconEnd)
      return (
        <>
          {textEl}
          {iconEl}
        </>
      );
    if (iconEl)
      return (
        <>
          {iconEl}
          {textEl}
        </>
      );
    return textEl;
  };

  return (
    <TouchableOpacity
      style={mergeStyles(
        baseButtonStyle,
        variantStyle,
        disabled && disabledStyle,
        style
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {renderContent()}
      {progress !== undefined && progress > 0 && progress < 100 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderBottomLeftRadius: theme.radius.interactive,
            borderBottomRightRadius: theme.radius.interactive,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: textStyle?.color || theme.colors.primary,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
