// packages/expo/src/atomic/Progress/index.tsx
/**
 * @fileoverview Progress component
 * @description Accessible progress component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';

import type { ReactNode } from 'react';

/**
 * Progress component props interface
 */
export interface ProgressProps {
  /**
   * Progress value (0-100)
   * @default 0
   */
  value?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  /**
   * Custom accessibility value label
   */
  getValueLabel?: (value: number, max: number) => string;
  /**
   * Content below the progress bar
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

const progressContainerBaseStyle: ViewStyle = {
  height: 8,
  borderRadius: 4,
  overflow: 'hidden',
};

const progressBarBaseStyle: ViewStyle = {
  height: '100%',
  borderRadius: 4,
};

/**
 * Accessible progress component.
 *
 * @component
 * @example
 * ```tsx
 * <Progress value={50} />
 * <Progress value={75} max={100} />
 * ```
 */
const Progress = ({
  value = 0,
  max = 100,
  variant = 'default',
  getValueLabel,
  children,
  style,
  testID,
}: ProgressProps) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const variantColors: Record<string, string> = {
    default: c.primary,
    primary: c.primary,
    success: c.success,
    warning: c.warning,
    destructive: c.destructive,
  };

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = variantColors[variant] || variantColors.default;
  const accessibilityLabel = getValueLabel
    ? getValueLabel(value, max)
    : undefined;

  return (
    <View testID={testID}>
      <View
        style={mergeStyles(
          progressContainerBaseStyle,
          { backgroundColor: c.muted },
          style
        )}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max,
          now: value,
          text: accessibilityLabel,
        }}
        testID={testID ? `${testID}-track` : undefined}
      >
        <View
          style={[
            progressBarBaseStyle,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
          testID={testID ? `${testID}-bar` : undefined}
        />
      </View>
      {children}
    </View>
  );
};

export default Progress;
