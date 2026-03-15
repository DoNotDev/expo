// packages/expo/src/atomic/Rating/index.tsx
/**
 * @fileoverview Rating component
 * @description Interactive star rating component for forms and display
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { CONTROL_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Rating component props interface
 */
export interface RatingProps {
  /**
   * Current rating value (1-5, supports decimals for display)
   */
  value?: number;
  /**
   * Callback when rating changes (only fires whole numbers 1-5)
   */
  onChange?: (value: number) => void;
  /**
   * Maximum rating value
   * @default 5
   */
  max?: number;
  /**
   * Read-only mode (no interaction)
   * @default false
   */
  readonly?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Semantic color variant
   * @default 'warning'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Show numeric value next to stars
   * @default false
   */
  showValue?: boolean;
  /**
   * Custom content after the rating stars
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

const starSize = 24;

const ratingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    width: starSize,
    height: starSize,
  },
});

const variantColors: Record<string, string> = {
  default: '#f59e0b',
  muted: '#9ca3af',
  primary: '#3b82f6',
  secondary: '#6366f1',
  accent: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  destructive: '#ef4444',
};

/**
 * Get star fill state based on position and value
 */
function getStarState(
  position: number,
  value: number
): 'filled' | 'half' | 'empty' {
  if (value >= position) return 'filled';
  if (value >= position - 0.5) return 'half';
  return 'empty';
}

/**
 * Interactive star rating component.
 *
 * @component
 * @example
 * ```tsx
 * <Rating value={3} onChange={setRating} />
 * <Rating value={4.5} readonly showValue />
 * ```
 */
const Rating = ({
  value = 0,
  onChange,
  max = 5,
  readonly = false,
  disabled = false,
  variant = CONTROL_VARIANT.WARNING,
  showValue = false,
  children,
  style,
  testID,
}: RatingProps) => {
  const color = variantColors[variant] || variantColors.warning;
  const isInteractive = !readonly && !disabled && !!onChange;

  const handlePress = (position: number) => {
    if (isInteractive) {
      onChange?.(position);
    }
  };

  return (
    <View style={mergeStyles(ratingStyles.container, style)} testID={testID}>
      {Array.from({ length: max }).map((_, index) => {
        const position = index + 1;
        const state = getStarState(position, value);

        return (
          <TouchableOpacity
            key={position}
            onPress={() => handlePress(position)}
            disabled={!isInteractive}
            activeOpacity={0.7}
            testID={testID ? `${testID}-star-${position}` : undefined}
          >
            <Text
              level="body"
              style={{
                ...ratingStyles.star,
                color: state === 'empty' ? '#d1d5db' : color,
              }}
            >
              {state === 'filled' ? '★' : state === 'half' ? '☆' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
      {showValue && (
        <Text
          level="body"
          variant="muted"
          testID={testID ? `${testID}-value` : undefined}
        >
          {value.toFixed(1)}
        </Text>
      )}
      {children}
    </View>
  );
};

export default Rating;
