// packages/expo/src/atomic/ToggleGroup/index.tsx
/**
 * @fileoverview ToggleGroup component
 * @description Toggle group component with variant support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Toggle from '../Toggle';

import type { ReactNode } from 'react';

/**
 * Toggle option interface
 */
export interface ToggleOption {
  value: string;
  label: string | ReactNode;
  disabled?: boolean;
}

/**
 * ToggleGroup component props interface
 */
export interface ToggleGroupProps {
  /**
   * Type: 'single' or 'multiple'
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * Selected value(s)
   */
  value?: string | string[];
  /**
   * Change handler
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * List of toggle options
   */
  items?: ToggleOption[];
  /**
   * Variant style
   * @default 'default'
   */
  variant?: 'default' | 'outline';
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
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
}

const toggleGroupStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
});

/**
 * Toggle group component with variant support.
 *
 * @component
 * @example
 * ```tsx
 * <ToggleGroup
 *   type="single"
 *   value={value}
 *   onValueChange={setValue}
 *   items={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]}
 * />
 * ```
 */
const ToggleGroup = ({
  type = 'single',
  value,
  onValueChange,
  items = [],
  variant = 'default',
  size = 'md',
  children,
  style,
  testID,
}: ToggleGroupProps) => {
  const isSelected = (optionValue: string) => {
    if (type === 'single') {
      return value === optionValue;
    }
    return Array.isArray(value) && value.includes(optionValue);
  };

  const handleToggle = (optionValue: string) => {
    if (!onValueChange) return;

    if (type === 'single') {
      onValueChange(value === optionValue ? '' : optionValue);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onValueChange(newValues);
    }
  };

  return (
    <View
      style={mergeStyles(toggleGroupStyles.container, style)}
      testID={testID}
    >
      {items.map((option) => (
        <Toggle
          key={option.value}
          pressed={isSelected(option.value)}
          onPressedChange={() => handleToggle(option.value)}
          disabled={option.disabled}
          variant={variant === 'outline' ? 'secondary' : 'default'}
          testID={testID ? `${testID}-item-${option.value}` : undefined}
        >
          {option.label}
        </Toggle>
      ))}
      {children}
    </View>
  );
};

export default ToggleGroup;
