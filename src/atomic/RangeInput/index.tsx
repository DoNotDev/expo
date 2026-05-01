// packages/expo/src/atomic/RangeInput/index.tsx
/**
 * @fileoverview RangeInput component
 * @description Two-input range component for min/max values
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Input from '../Input';
import Stack from '../Stack';

import type { ReactNode } from 'react';

/**
 * RangeInput component props interface
 */
export interface RangeInputProps {
  /**
   * Label for the range
   */
  label?: string;
  /**
   * Placeholder for min input
   */
  minPlaceholder?: string;
  /**
   * Placeholder for max input
   */
  maxPlaceholder?: string;
  /**
   * Current min value
   */
  minValue?: string;
  /**
   * Current max value
   */
  maxValue?: string;
  /**
   * Display minimum (different from track min)
   */
  actualMin?: number;
  /**
   * Display maximum (different from track max)
   */
  actualMax?: number;
  /**
   * Whether the range input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Track minimum value
   */
  min?: number;
  /**
   * Track maximum value
   */
  max?: number;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  /**
   * Step value for numeric inputs
   */
  step?: number;
  /**
   * Change handler: (min, max) => void
   */
  onChange: (min: string, max: string) => void;
  /**
   * Clear handler
   */
  onClear: () => void;
  /**
   * Custom content
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
  /**
   * Form type attribute (for API parity with web)
   */
  type?: string;
  /**
   * Checked state (for API parity with web)
   */
  checked?: boolean;
}

const rangeContainerStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  alignItems: 'flex-end',
};

/**
 * Two-input range component for min/max values.
 *
 * @component
 * @example
 * ```tsx
 * <RangeInput
 *   label="Price"
 *   onChange={(min, max) => setFilter({ min, max })}
 *   onClear={() => setFilter({ min: '', max: '' })}
 * />
 * ```
 */
const RangeInput = ({
  label,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  minValue = '',
  maxValue = '',
  actualMin,
  actualMax,
  disabled = false,
  min,
  max,
  placeholder,
  required = false,
  step,
  onChange,
  onClear,
  children,
  style,
  testID,
}: RangeInputProps) => {
  const hasValue = minValue || maxValue;

  return (
    <Stack
      gap={8}
      style={disabled ? { ...style, opacity: 0.5 } : style}
      testID={testID}
    >
      {label && (
        <Input
          label={label}
          value={`${minValue || ''} - ${maxValue || ''}`}
          editable={false}
          testID={testID ? `${testID}-label` : undefined}
        />
      )}
      <View
        style={rangeContainerStyle}
        testID={testID ? `${testID}-inputs` : undefined}
      >
        <Input
          placeholder={placeholder || minPlaceholder}
          value={minValue}
          onChangeText={(text) => !disabled && onChange(text, maxValue)}
          keyboardType="numeric"
          editable={!disabled}
          containerStyle={{ flex: 1 }}
          testID={testID ? `${testID}-min` : undefined}
        />
        <Input
          placeholder={placeholder || maxPlaceholder}
          value={maxValue}
          onChangeText={(text) => !disabled && onChange(minValue, text)}
          keyboardType="numeric"
          editable={!disabled}
          containerStyle={{ flex: 1 }}
          testID={testID ? `${testID}-max` : undefined}
        />
        <Button
          variant="ghost"
          onPress={onClear}
          disabled={disabled || !hasValue}
          testID={testID ? `${testID}-clear` : undefined}
        >
          ×
        </Button>
      </View>
      {children}
    </Stack>
  );
};

export default RangeInput;
