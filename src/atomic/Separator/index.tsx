// packages/expo/src/atomic/Separator/index.tsx
/**
 * @fileoverview Separator component
 * @description Visual separator line component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Separator orientation constants
 */
export const SEPARATOR_ORIENTATION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

export type SeparatorOrientation =
  (typeof SEPARATOR_ORIENTATION)[keyof typeof SEPARATOR_ORIENTATION];

/**
 * Separator component props interface
 */
export interface SeparatorProps {
  /**
   * Orientation (horizontal or vertical)
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;
  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'default' | 'muted' | 'primary' | 'accent';
  /**
   * Inline content (e.g. "OR" divider text)
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

const separatorStyles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: '#e5e7eb',
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  inlineLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

const variantColors: Record<string, string> = {
  default: '#e5e7eb',
  muted: '#9ca3af',
  primary: '#3b82f6',
  accent: '#8b5cf6',
};

/**
 * Visual separator line component.
 *
 * @component
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * ```
 */
const Separator = ({
  orientation = SEPARATOR_ORIENTATION.HORIZONTAL,
  variant = 'default',
  children,
  style,
  testID,
}: SeparatorProps) => {
  const lineColor = variantColors[variant] || variantColors.default;

  if (children && orientation === SEPARATOR_ORIENTATION.HORIZONTAL) {
    return (
      <View
        style={mergeStyles(separatorStyles.inlineContainer, style)}
        testID={testID}
      >
        <View
          style={[separatorStyles.inlineLine, { backgroundColor: lineColor }]}
        />
        <Text level="small" variant="muted">
          {children}
        </Text>
        <View
          style={[separatorStyles.inlineLine, { backgroundColor: lineColor }]}
        />
      </View>
    );
  }

  return (
    <View
      style={mergeStyles(
        separatorStyles[orientation],
        { backgroundColor: lineColor },
        style
      )}
      testID={testID}
    />
  );
};

export default Separator;
