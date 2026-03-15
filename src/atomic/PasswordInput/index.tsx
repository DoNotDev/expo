// packages/expo/src/atomic/PasswordInput/index.tsx
/**
 * @fileoverview PasswordInput component
 * @description Password input with show/hide toggle functionality
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

/**
 * PasswordInput component props interface
 */
export interface PasswordInputProps extends Omit<
  TextInputProps,
  'type' | 'style'
> {
  /**
   * Whether the password is currently visible
   */
  visible?: boolean;
  /**
   * Callback when visibility changes
   */
  onVisibilityChange?: (visible: boolean) => void;
  /**
   * Label text (shown above input)
   */
  label?: string;
  /**
   * Error message (shown below input)
   */
  error?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
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
   * Form type attribute (for API parity with web)
   */
  type?: string;
  /**
   * Checked state (for API parity with web)
   */
  checked?: boolean;
  /**
   * Maximum value (for API parity with web)
   */
  max?: number | string;
  /**
   * Minimum value (for API parity with web)
   */
  min?: number | string;
  /**
   * Step value (for API parity with web)
   */
  step?: number | string;
  /**
   * Style prop (for API parity with web, maps to inputStyle)
   */
  style?: TextStyle;
}

function getPasswordInputStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    container: {
      minHeight: theme.interactive.touchTarget,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.input,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    } as ViewStyle,
    text: {
      fontSize: theme.typography.fontSize.base,
      lineHeight:
        theme.typography.fontSize.base * theme.typography.lineHeight.base,
      color: theme.colors.foreground,
      flex: 1,
    } as TextStyle,
    toggleButton: {
      padding: theme.spacing.sm / 2,
      marginLeft: theme.spacing.sm,
    } as ViewStyle,
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
 * Password input field with show/hide toggle functionality.
 *
 * @component
 * @example
 * ```tsx
 * <PasswordInput
 *   value={password}
 *   onChangeText={setPassword}
 *   placeholder="Enter password"
 * />
 * ```
 */
const PasswordInput = ({
  visible: controlledVisible,
  onVisibilityChange,
  label,
  error,
  required,
  disabled = false,
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
}: PasswordInputProps) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const visible = controlledVisible ?? internalVisible;
  const hasError = !!error;

  const handleToggle = () => {
    const newVisible = !visible;
    if (onVisibilityChange) {
      onVisibilityChange(newVisible);
    } else {
      setInternalVisible(newVisible);
    }
  };

  const { theme } = useTheme();
  const styles = getPasswordInputStyles(theme);

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
          disabled && { opacity: 0.5 }
        )}
        testID={testID ? `${testID}-container` : undefined}
      >
        <TextInput
          style={mergeStyles(styles.text, inputStyle, style)}
          placeholder={textInputProps.placeholder}
          placeholderTextColor={styles.placeholderColor}
          secureTextEntry={!visible}
          editable={!disabled}
          {...textInputProps}
          testID={testID ? `${testID}-input` : undefined}
        />
        <TouchableOpacity
          onPress={handleToggle}
          style={styles.toggleButton}
          testID={testID ? `${testID}-toggle` : undefined}
        >
          <Text level="body" variant="muted">
            {visible ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
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

export default PasswordInput;
