// packages/expo/src/atomic/Stack/index.tsx
/**
 * @fileoverview Stack component
 * @description Polymorphic flexbox layout primitive for linear organization (vertical or horizontal).
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

import type { ReactNode } from 'react';

/**
 * Stack direction constants
 */
export const STACK_DIRECTION = {
  ROW: 'row',
  COLUMN: 'column',
} as const;

export type StackDirection =
  (typeof STACK_DIRECTION)[keyof typeof STACK_DIRECTION];

/**
 * Stack alignment constants
 */
export const STACK_ALIGN = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
} as const;

export type StackAlign = (typeof STACK_ALIGN)[keyof typeof STACK_ALIGN];

/**
 * Stack justify constants
 */
export const STACK_JUSTIFY = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
} as const;

export type StackJustify = (typeof STACK_JUSTIFY)[keyof typeof STACK_JUSTIFY];

/**
 * Stack component props interface
 */
export interface StackProps {
  /**
   * Stack children
   */
  children: ReactNode;
  /**
   * Direction (row or column)
   * @default 'column'
   */
  direction?: StackDirection;
  /**
   * Alignment along cross axis
   * @default 'stretch'
   */
  align?: StackAlign;
  /**
   * Justification along main axis
   * @default 'flex-start'
   */
  justify?: StackJustify;
  /**
   * Gap between items (in pixels)
   * @default 0
   */
  gap?: number;
  /**
   * Whether children should wrap to next line
   * @default false
   */
  wrap?: boolean;
  /**
   * Flex value (0 = auto, 1 = fill available)
   */
  flex?: number;
  /**
   * Center children on both axes (shorthand for align="center" justify="center")
   * @default false
   */
  centered?: boolean;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Overflow behavior (for API parity with web)
   */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

/**
 * Polymorphic flexbox layout primitive for linear organization.
 *
 * @component
 * @example
 * ```tsx
 * // Vertical stack (default)
 * <Stack>
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 * </Stack>
 *
 * // Horizontal stack
 * <Stack direction="row" gap={16}>
 *   <Button>Previous</Button>
 *   <Button>Next</Button>
 * </Stack>
 *
 * // Centered stack
 * <Stack align="center" justify="center">
 *   <Text>Centered content</Text>
 * </Stack>
 * ```
 */
const Stack = ({
  children,
  direction = STACK_DIRECTION.COLUMN,
  align = STACK_ALIGN.STRETCH,
  justify = STACK_JUSTIFY.START,
  gap = 0,
  wrap,
  flex,
  centered,
  style,
  overflow,
  testID,
}: StackProps) => {
  const stackStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: centered ? 'center' : align,
    justifyContent: centered ? 'center' : justify,
    gap,
  };
  if (wrap) stackStyle.flexWrap = 'wrap';
  if (flex !== undefined) stackStyle.flex = flex;
  if (overflow && overflow !== 'auto') stackStyle.overflow = overflow;

  return (
    <View style={mergeStyles(stackStyle, style)} testID={testID}>
      {children}
    </View>
  );
};

export default Stack;
