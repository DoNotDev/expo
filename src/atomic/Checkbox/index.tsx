// packages/expo/src/atomic/Checkbox/index.tsx
/**
 * @fileoverview Checkbox component
 * @description Accessible checkbox control with semantic color variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { TouchableOpacity, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { CONTROL_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Checkbox component props interface
 */
export interface CheckboxProps {
  /**
   * Whether checkbox is checked
   */
  checked?: boolean;
  /**
   * Whether checkbox is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Semantic color variant
   * @default 'default'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Change handler
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Optional label text
   */
  label?: ReactNode;
  /**
   * Label content next to the checkbox (alternative to label prop)
   */
  children?: ReactNode;
  /**
   * Whether label shows required indicator
   */
  required?: boolean;
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

const checkboxSize = 20;
const checkboxBorderWidth = 2;

const checkboxBaseStyle: ViewStyle = {
  width: checkboxSize,
  height: checkboxSize,
  borderWidth: checkboxBorderWidth,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
};

const checkboxDisabledStyle: ViewStyle = {
  opacity: 0.5,
};

/**
 * Accessible checkbox control with semantic color variants.
 *
 * @component
 * @example
 * ```tsx
 * <Checkbox checked={agreed} onCheckedChange={setAgreed} />
 * <Checkbox checked={consent} onCheckedChange={setConsent} label="I agree" required />
 * ```
 */
const Checkbox = ({
  checked = false,
  disabled = false,
  variant = CONTROL_VARIANT.DEFAULT,
  onCheckedChange,
  label,
  children,
  required,
  style,
  testID,
}: CheckboxProps) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const checkedStyle: ViewStyle = {
    backgroundColor: c.primary,
    borderColor: c.primary,
  };

  const uncheckedStyle: ViewStyle = {
    backgroundColor: 'transparent',
    borderColor: c.border,
  };

  const checkmarkStyle: ViewStyle = {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: c.background,
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  };

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const checkboxElement = (
    <TouchableOpacity
      style={mergeStyles(
        checkboxBaseStyle,
        checked ? checkedStyle : uncheckedStyle,
        disabled && checkboxDisabledStyle,
        style
      )}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {checked && (
        <View
          style={checkmarkStyle}
          testID={testID ? `${testID}-checkmark` : undefined}
        />
      )}
    </TouchableOpacity>
  );

  const labelContent = label || children;

  if (labelContent) {
    return (
      <Stack
        direction="row"
        align="center"
        gap={8}
        testID={testID ? `${testID}-container` : undefined}
      >
        {checkboxElement}
        {typeof labelContent === 'string' ? (
          <Text level="body" testID={testID ? `${testID}-label` : undefined}>
            {labelContent}
            {required && (
              <Text level="body" variant="destructive">
                {' *'}
              </Text>
            )}
          </Text>
        ) : (
          <View testID={testID ? `${testID}-label` : undefined}>
            {labelContent}
          </View>
        )}
      </Stack>
    );
  }

  return checkboxElement;
};

export default Checkbox;
