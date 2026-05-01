// packages/expo/src/atomic/Toggle/index.tsx
/**
 * @fileoverview Toggle component
 * @description Accessible toggle button component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';

import type { ReactNode } from 'react';

/**
 * Toggle component props interface
 */
export interface ToggleProps {
  /**
   * Whether toggle is pressed/active
   */
  pressed?: boolean;
  /**
   * Press handler
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT];
  /**
   * Initial pressed state for uncontrolled mode
   */
  defaultPressed?: boolean;
  /**
   * Whether toggle is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Toggle content
   */
  children: ReactNode;
  /**
   * Additional style
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
   * Form type attribute (for API parity with web)
   */
  type?: string;
  /**
   * Form value attribute (for API parity with web)
   */
  value?: string;
}

const toggleBaseStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
};

const toggleStyles = StyleSheet.create({
  default: {
    backgroundColor: '#f3f4f6',
  },
  pressed: {
    backgroundColor: '#e5e7eb',
  },
  primary: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#6366f1',
  },
  accent: {
    backgroundColor: '#8b5cf6',
  },
  success: {
    backgroundColor: '#10b981',
  },
  warning: {
    backgroundColor: '#f59e0b',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  muted: {
    backgroundColor: '#9ca3af',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  disabled: {
    opacity: 0.5,
  },
});

/**
 * Accessible toggle button component.
 *
 * @component
 * @example
 * ```tsx
 * <Toggle pressed={isPressed} onPressedChange={setIsPressed}>
 *   Toggle me
 * </Toggle>
 * ```
 */
const Toggle = ({
  pressed: controlledPressed,
  defaultPressed,
  onPressedChange,
  variant = THEME_VARIANT.DEFAULT,
  disabled = false,
  children,
  style,
  testID,
}: ToggleProps) => {
  const [internalPressed, setInternalPressed] = useState(
    defaultPressed ?? false
  );
  const pressed = controlledPressed ?? internalPressed;

  const handlePress = () => {
    if (!disabled) {
      const newPressed = !pressed;
      setInternalPressed(newPressed);
      onPressedChange?.(newPressed);
    }
  };

  const variantStyle = pressed
    ? toggleStyles[variant] || toggleStyles.default
    : toggleStyles.default;

  return (
    <TouchableOpacity
      style={mergeStyles(
        toggleBaseStyle,
        variantStyle,
        disabled && toggleStyles.disabled,
        style
      )}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Toggle;
