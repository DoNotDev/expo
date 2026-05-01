// packages/expo/src/atomic/Grid/index.tsx
/**
 * @fileoverview Grid component
 * @description Grid layout component with responsive columns
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React from 'react';
import { View, useWindowDimensions, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

import type { ReactNode } from 'react';

/**
 * Breakpoints matching framework: mobile < 768, tablet < 1024, laptop < 1440, desktop >= 1440
 */
const BREAKPOINTS = [768, 1024, 1440] as const;

/**
 * Responsive columns array: [mobile, tablet, laptop, desktop]
 */
export type ResponsiveCols = [number, number, number, number];

/**
 * Grid component props interface
 */
export interface GridProps {
  /**
   * Number of columns - fixed or responsive
   * @default 1
   */
  cols?: number | ResponsiveCols;
  /**
   * Spacing between items (in pixels)
   * @default 16
   */
  gap?: number;
  /**
   * Cross-axis alignment of grid items
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * Main-axis content justification
   */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /**
   * Grid children
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
}

/**
 * GridArea component props interface
 */
export interface GridAreaProps {
  /**
   * Area name
   */
  name: string;
  /**
   * Area content
   */
  children: ReactNode;
  /**
   * Self-alignment within the grid cell
   * @default 'auto'
   */
  alignSelf?: 'auto' | 'start' | 'center' | 'end' | 'stretch';
  /**
   * Justify self alignment (horizontal alignment within grid cell)
   * @default 'stretch'
   */
  justifySelf?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * Overflow behavior
   * @default 'hidden'
   */
  overflow?: 'hidden' | 'visible' | 'auto' | 'scroll';
  /**
   * Minimum width for GridArea
   */
  min?: string | number;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Grid layout component with responsive columns.
 *
 * @component
 * @example
 * ```tsx
 * <Grid cols={3} gap={16}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 */
const ALIGN_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const JUSTIFY_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
} as const;

const Grid = ({
  cols = 1,
  gap = 16,
  align,
  justify,
  children,
  style,
  testID,
}: GridProps) => {
  const { width } = useWindowDimensions();

  // Resolve responsive columns: [mobile, tablet, laptop, desktop]
  const numCols =
    typeof cols === 'number'
      ? cols
      : width < BREAKPOINTS[0]
        ? cols[0]
        : width < BREAKPOINTS[1]
          ? cols[1]
          : width < BREAKPOINTS[2]
            ? cols[2]
            : cols[3];

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(gap / 2),
    ...(align && { alignItems: ALIGN_MAP[align] }),
    ...(justify && { justifyContent: JUSTIFY_MAP[justify] }),
  };

  // Calculate item width accounting for gap
  const itemWidth = `${100 / numCols}%` as const;

  return (
    <View style={mergeStyles(gridStyle, style)} testID={testID}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <View
            style={{
              width: itemWidth,
              paddingHorizontal: gap / 2,
              marginBottom: gap,
            }}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
};

/**
 * GridArea component for named grid areas.
 *
 * @component
 */
const ALIGN_SELF_MAP = {
  auto: 'auto',
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const JUSTIFY_SELF_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

export const GridArea = ({
  name,
  children,
  alignSelf,
  justifySelf,
  overflow,
  min,
  style,
  testID,
}: GridAreaProps) => {
  const selfStyle: ViewStyle = {
    ...(alignSelf && { alignSelf: ALIGN_SELF_MAP[alignSelf] }),
    ...(justifySelf && { alignSelf: JUSTIFY_SELF_MAP[justifySelf] }),
    ...(overflow && overflow !== 'auto' && { overflow }),
    ...(min !== undefined && typeof min === 'number' && { minWidth: min }),
  };

  return (
    <View style={mergeStyles(selfStyle, style)} testID={testID}>
      {children}
    </View>
  );
};

export default Grid;
