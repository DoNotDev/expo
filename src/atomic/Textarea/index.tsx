// packages/expo/src/atomic/Textarea/index.tsx
/**
 * @fileoverview Textarea component
 * @description Accessible textarea component with mobile-friendly touch targets
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

/**
 * Textarea component props interface
 */
export interface TextareaProps extends Omit<TextInputProps, 'style'> {
  /**
   * Label text (shown above textarea)
   */
  label?: string;
  /**
   * Error message (shown below textarea)
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
   * Whether the textarea is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the field is required (shows asterisk on label)
   * @default false
   */
  required?: boolean;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Style prop (for API parity with web, maps to inputStyle)
   */
  style?: TextStyle;
}

function getTextareaStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    container: {
      minHeight: 100,
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
      textAlignVertical: 'top' as const,
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
 * Accessible textarea component with mobile-friendly touch targets.
 *
 * @component
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message" />
 * <Textarea label="Message" placeholder="Enter your message" />
 * <Textarea label="Message" error="Required field" />
 * ```
 */
const Textarea = ({
  label,
  error,
  containerStyle,
  inputStyle,
  disabled = false,
  required = false,
  name,
  style,
  testID,
  ...textInputProps
}: TextareaProps) => {
  const { theme } = useTheme();
  const styles = getTextareaStyles(theme);
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
          disabled && { opacity: 0.5 }
        )}
        testID={testID ? `${testID}-container` : undefined}
      >
        <TextInput
          style={mergeStyles(styles.text, inputStyle, style)}
          placeholder={textInputProps.placeholder}
          placeholderTextColor={styles.placeholderColor}
          multiline
          editable={!disabled}
          {...textInputProps}
          testID={testID ? `${testID}-input` : undefined}
        />
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

export default Textarea;
