// packages/expo/src/atomic/Slider/index.tsx
/**
 * @fileoverview Slider component
 * @description Accessible slider component with semantic color variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useRef, useCallback } from 'react';
import {
  View,
  PanResponder,
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';

import { useTheme } from '../../theme';
import { CONTROL_VARIANT } from '../../utils/constants';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Slider component props interface
 */
export interface SliderProps {
  /**
   * Current value
   */
  value?: number;
  /**
   * Default value
   */
  defaultValue?: number;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Step value
   * @default 1
   */
  step?: number;
  /**
   * Change handler
   */
  onValueChange?: (value: number) => void;
  /**
   * Semantic color variant
   * @default 'default'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Whether the slider is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Layout direction
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Minimum steps between thumbs (for multi-thumb sliders)
   */
  minStepsBetweenThumbs?: number;
  /**
   * Reverse the slider direction
   * @default false
   */
  inverted?: boolean;
  /**
   * Show current value
   * @default false
   */
  showValue?: boolean;
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
}

const variantColors: Record<string, string> = {
  default: '#3b82f6',
  muted: '#9ca3af',
  primary: '#3b82f6',
  secondary: '#6366f1',
  accent: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  destructive: '#ef4444',
};

/**
 * Accessible slider control with semantic color variants.
 *
 * @component
 * @example
 * ```tsx
 * <Slider defaultValue={50} max={100} step={1} variant="success" />
 * <Slider value={value} onValueChange={setValue} min={0} max={5} step={1} showValue />
 * ```
 */
const SliderComponent = ({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  variant = CONTROL_VARIANT.DEFAULT,
  disabled = false,
  orientation = 'horizontal',
  minStepsBetweenThumbs,
  inverted = false,
  showValue = false,
  children,
  style,
  testID,
}: SliderProps) => {
  const { theme } = useTheme();
  const color = variantColors[variant] || variantColors.default;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const currentValue = value ?? internalValue;
  const trackWidth = useRef(0);

  const clampToStep = useCallback(
    (raw: number) => {
      const clamped = Math.min(max, Math.max(min, raw));
      return Math.round((clamped - min) / step) * step + min;
    },
    [min, max, step]
  );

  const updateValue = useCallback(
    (pageX: number, trackX: number) => {
      const ratio = Math.max(
        0,
        Math.min(1, (pageX - trackX) / trackWidth.current)
      );
      const newValue = clampToStep(min + ratio * (max - min));
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [min, max, clampToStep, onValueChange]
  );

  const trackRef = useRef<View>(null);
  const trackXRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        trackRef.current?.measureInWindow((x) => {
          trackXRef.current = x;
          updateValue(evt.nativeEvent.pageX, x);
        });
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.pageX, trackXRef.current);
      },
    })
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const rawPercentage = ((currentValue - min) / (max - min)) * 100;
  const percentage = inverted ? 100 - rawPercentage : rawPercentage;
  const THUMB_SIZE = 20;

  return (
    <Stack
      gap={8}
      style={disabled ? { ...style, opacity: 0.5 } : style}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          ref={trackRef}
          onLayout={handleLayout}
          style={{
            flex: 1,
            height: THUMB_SIZE,
            justifyContent: 'center',
          }}
          {...panResponder.panHandlers}
          testID={testID ? `${testID}-track` : undefined}
        >
          {/* Track background */}
          <View
            style={{
              height: 4,
              backgroundColor: theme.colors.border,
              borderRadius: 2,
            }}
          />
          {/* Fill */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              height: 4,
              width: `${percentage}%`,
              backgroundColor: color,
              borderRadius: 2,
            }}
            testID={testID ? `${testID}-fill` : undefined}
          />
          {/* Thumb */}
          <View
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              marginLeft: -THUMB_SIZE / 2,
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: color,
            }}
            testID={testID ? `${testID}-thumb` : undefined}
          />
        </View>
        {showValue && (
          <Text
            level="body"
            variant="muted"
            testID={testID ? `${testID}-value` : undefined}
          >
            {currentValue}
          </Text>
        )}
      </View>
      {children}
    </Stack>
  );
};

export default SliderComponent;
