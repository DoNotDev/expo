// packages/expo/src/atomic/Input/index.tsx
/**
 * @fileoverview Input component
 * @description Accessible input component with mobile-friendly touch targets and icon support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  TextInput,
  View,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Input component props interface
 */
export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Label text (shown above input)
   */
  label?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Icon rendered alongside the input
   */
  icon?: ReactNode;
  /**
   * Places icon after the input instead of before
   * @default false
   */
  iconEnd?: boolean;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the field is required - shows asterisk on label
   * @default false
   */
  required?: boolean;
  /**
   * Error message (shown below input)
   */
  error?: string;
  /**
   * Additional container style
   */
  containerStyle?: ViewStyle;
  /**
   * Additional input style
   */
  inputStyle?: TextStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Input type (for API parity with web)
   */
  type?: string;
  /**
   * Checked state (for checkbox/radio type - for API parity with web)
   */
  checked?: boolean;
  /**
   * Maximum value (for number type - for API parity with web)
   */
  max?: number | string;
  /**
   * Minimum value (for number type - for API parity with web)
   */
  min?: number | string;
  /**
   * Step value (for number type - for API parity with web)
   */
  step?: number | string;
  /**
   * Style prop (for API parity with web, maps to inputStyle)
   */
  style?: TextStyle;
}

function getInputStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    container: {
      minHeight: theme.interactive.touchTarget,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.input,
    } as ViewStyle,
    text: {
      fontSize: theme.typography.fontSize.base,
      lineHeight:
        theme.typography.fontSize.base * theme.typography.lineHeight.base,
      color: theme.colors.foreground,
    } as TextStyle,
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.sm / 2,
    } as TextStyle,
    error: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.destructive,
      marginTop: theme.spacing.sm / 2,
    } as TextStyle,
    errorContainer: {
      borderColor: theme.colors.destructive,
    } as ViewStyle,
    placeholderColor: theme.colors.mutedForeground,
  };
}

/**
 * Accessible input component with mobile-friendly touch targets.
 *
 * @component
 * @example
 * ```tsx
 * <Input placeholder="Enter your email" />
 * <Input label="Email" placeholder="Enter your email" />
 * <Input label="Email" error="Invalid email" />
 * ```
 */
const Input = ({
  label,
  placeholder,
  icon,
  iconEnd = false,
  disabled = false,
  required = false,
  error,
  containerStyle,
  inputStyle,
  name,
  type,
  checked,
  max,
  min,
  step,
  style,
  testID,
  ...textInputProps
}: InputProps) => {
  const { theme } = useTheme();
  const styles = getInputStyles(theme);
  const hasError = !!error;

  return (
    <Stack gap={theme.spacing.sm / 2} style={containerStyle} testID={testID}>
      {label && (
        <Text
          level="small"
          style={styles.label}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
          {required && (
            <Text level="small" variant="destructive">
              {' *'}
            </Text>
          )}
        </Text>
      )}
      <View
        style={mergeStyles(
          styles.container,
          hasError && styles.errorContainer,
          disabled && ({ opacity: 0.5 } as ViewStyle),
          icon
            ? ({ flexDirection: 'row', alignItems: 'center' } as ViewStyle)
            : undefined
        )}
        testID={testID ? `${testID}-container` : undefined}
      >
        {icon && !iconEnd && (
          <View
            style={{ marginRight: 8 }}
            testID={testID ? `${testID}-icon` : undefined}
          >
            {icon}
          </View>
        )}
        <TextInput
          style={mergeStyles(
            styles.text,
            icon ? ({ flex: 1 } as any) : undefined,
            inputStyle,
            style
          )}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholderColor}
          editable={!disabled}
          {...textInputProps}
          testID={testID ? `${testID}-input` : undefined}
        />
        {icon && iconEnd && (
          <View
            style={{ marginLeft: 8 }}
            testID={testID ? `${testID}-icon` : undefined}
          >
            {icon}
          </View>
        )}
      </View>
      {error && (
        <Text
          level="caption"
          variant="destructive"
          style={styles.error}
          testID={testID ? `${testID}-error` : undefined}
        >
          {error}
        </Text>
      )}
    </Stack>
  );
};

export default Input;
