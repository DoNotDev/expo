// packages/expo/src/atomic/Skeleton/index.tsx
/**
 * @fileoverview Skeleton component
 * @description Skeleton component for loading states
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

/**
 * Skeleton component props interface
 */
export interface SkeletonProps {
  /**
   * Animation variant
   * @default 'pulse'
   */
  variant?: 'pulse' | 'wave' | 'shimmer' | 'none';
  /**
   * Size preset for common content types
   * @default 'custom'
   */
  size?: 'text' | 'heading' | 'avatar' | 'button' | 'card' | 'image' | 'custom';
  /**
   * Custom width (in pixels or percentage string)
   */
  width?: number | string;
  /**
   * Custom height (in pixels or percentage string)
   */
  height?: number | string;
  /**
   * Number of lines for text skeleton
   * @default 1
   */
  lines?: number;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const sizePresets: Record<string, ViewStyle> = {
  text: { height: 16, width: '100%' },
  heading: { height: 24, width: '100%' },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  button: { height: 44, width: '100%' },
  card: { height: 128, width: '100%' },
  image: { height: 192, width: '100%' },
  custom: { width: '100%' },
};

const baseSkeletonStyle: ViewStyle = {
  backgroundColor: '#e5e7eb',
  borderRadius: 4,
};

/**
 * Skeleton component for loading states.
 *
 * @component
 * @example
 * ```tsx
 * <Skeleton size="text" lines={3} />
 * <Skeleton size="avatar" variant="wave" />
 * <Skeleton width={200} height={40} />
 * ```
 */
const Skeleton = ({
  variant = 'pulse',
  size = 'custom',
  width,
  height,
  lines = 1,
  style,
  testID,
}: SkeletonProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'pulse' || variant === 'shimmer') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant, animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: variant === 'pulse' ? [0.5, 1] : [0.3, 0.7],
  });

  const presetStyle = sizePresets[size] ?? sizePresets.custom!;
  const dynamicStyle: ViewStyle = {
    width: (width ?? presetStyle.width) as ViewStyle['width'],
    height: (height ?? presetStyle.height) as ViewStyle['height'],
  };

  const skeletonStyle = mergeStyles(
    baseSkeletonStyle,
    presetStyle,
    dynamicStyle,
    style
  );

  if (lines > 1 && size === 'text') {
    return (
      <View testID={testID}>
        {Array.from({ length: lines }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              skeletonStyle,
              { opacity: variant === 'none' ? 1 : opacity },
              index < lines - 1 && { marginBottom: 8 },
            ]}
            testID={testID ? `${testID}-line-${index}` : undefined}
          />
        ))}
      </View>
    );
  }

  return (
    <Animated.View
      style={[skeletonStyle, { opacity: variant === 'none' ? 1 : opacity }]}
      testID={testID}
    />
  );
};

export default Skeleton;
