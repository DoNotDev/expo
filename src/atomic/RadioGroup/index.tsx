// packages/expo/src/atomic/RadioGroup/index.tsx
/**
 * @fileoverview RadioGroup component
 * @description Accessible radio group component with semantic color variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { CONTROL_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Radio option interface
 */
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * RadioGroup component props interface
 */
export interface RadioGroupProps {
  /**
   * Selected value
   */
  value?: string;
  /**
   * Change handler
   */
  onValueChange?: (value: string) => void;
  /**
   * List of radio options
   */
  items?: RadioOption[];
  /**
   * Semantic color variant
   * @default 'default'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Disables all radio items
   * @default false
   */
  disabled?: boolean;
  /**
   * Layout direction
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Indicates required field
   * @default false
   */
  required?: boolean;
  /**
   * Custom content to render
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
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
}

const radioSize = 20;
const radioBorderWidth = 2;

const radioContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
};

const radioBaseStyle: ViewStyle = {
  width: radioSize,
  height: radioSize,
  borderRadius: radioSize / 2,
  borderWidth: radioBorderWidth,
  alignItems: 'center',
  justifyContent: 'center',
};

const radioDisabledStyle: ViewStyle = {
  opacity: 0.5,
};

/**
 * Accessible radio group component with semantic color variants.
 *
 * @component
 * @example
 * ```tsx
 * <RadioGroup
 *   value={value}
 *   onValueChange={setValue}
 *   items={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]}
 * />
 * ```
 */
const RadioGroup = ({
  value,
  onValueChange,
  items = [],
  variant = CONTROL_VARIANT.DEFAULT,
  disabled = false,
  orientation = 'vertical',
  required = false,
  children,
  style,
  testID,
}: RadioGroupProps) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const selectedStyle: ViewStyle = { borderColor: c.primary };
  const unselectedStyle: ViewStyle = { borderColor: c.border };
  const indicatorStyle: ViewStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.primary,
  };

  return (
    <View accessibilityRole="radiogroup" style={style} testID={testID}>
      <Stack
        gap={8}
        direction={orientation === 'horizontal' ? 'row' : 'column'}
      >
        {items.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => !isDisabled && onValueChange?.(option.value)}
              disabled={isDisabled}
              activeOpacity={0.7}
              style={radioContainerStyle}
              testID={testID ? `${testID}-item-${option.value}` : undefined}
            >
              <View
                style={[
                  radioBaseStyle,
                  isSelected ? selectedStyle : unselectedStyle,
                  isDisabled && radioDisabledStyle,
                ]}
              >
                {isSelected && (
                  <View
                    style={indicatorStyle}
                    testID={
                      testID ? `${testID}-indicator-${option.value}` : undefined
                    }
                  />
                )}
              </View>
              <Text
                level="body"
                style={isDisabled ? { opacity: 0.5 } : undefined}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {children}
      </Stack>
    </View>
  );
};

export default RadioGroup;
