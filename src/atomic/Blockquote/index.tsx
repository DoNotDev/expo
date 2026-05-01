// packages/expo/src/atomic/Blockquote/index.tsx
/**
 * @fileoverview Blockquote component
 * @description Semantic blockquote component for quotes and testimonials
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Blockquote variant constants
 */
export const BLOCKQUOTE_VARIANT = {
  DEFAULT: 'default',
  EDITORIAL: 'editorial',
  TESTIMONIAL: 'testimonial',
} as const;

/** Blockquote visual variant type. */
export type BlockquoteVariant =
  (typeof BLOCKQUOTE_VARIANT)[keyof typeof BLOCKQUOTE_VARIANT];

/**
 * Blockquote component props interface
 */
export interface BlockquoteProps {
  /**
   * The quote text content
   */
  children: ReactNode;
  /**
   * Author name
   */
  author?: string;
  /**
   * Source or context (e.g., book title, company)
   */
  source?: string;
  /**
   * Citation URL or reference for the quote
   */
  cite?: string;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: BlockquoteVariant;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const blockquoteLayoutStyle: ViewStyle = {
  padding: 16,
  borderLeftWidth: 4,
  borderRadius: 8,
};

/**
 * Semantic blockquote component for quotes and testimonials.
 *
 * @component
 * @example
 * ```tsx
 * <Blockquote variant="default">
 *   This is a quote
 * </Blockquote>
 * <Blockquote variant="testimonial" author="John Doe" source="Company Inc.">
 *   Great product!
 * </Blockquote>
 * ```
 */
const Blockquote = ({
  children,
  author,
  source,
  cite,
  variant = BLOCKQUOTE_VARIANT.DEFAULT,
  style,
  testID,
}: BlockquoteProps) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const variantStyles: Record<BlockquoteVariant, ViewStyle> = {
    default: {
      backgroundColor: c.muted,
      borderLeftColor: c.primary,
    },
    editorial: {
      backgroundColor: c.background,
      borderLeftColor: c.mutedForeground,
      paddingLeft: 20,
    },
    testimonial: {
      backgroundColor: c.primary + '14',
      borderLeftColor: c.primary,
      padding: 20,
      borderRadius: 12,
    },
  };

  const variantStyle = variantStyles[variant];

  return (
    <View
      style={mergeStyles(blockquoteLayoutStyle, variantStyle, style)}
      testID={testID}
    >
      <Stack gap={8}>
        <Text
          level="body"
          style={{ fontStyle: 'italic' }}
          testID={testID ? `${testID}-quote` : undefined}
        >
          {children}
        </Text>
        {(author || source) && (
          <Stack gap={2} testID={testID ? `${testID}-attribution` : undefined}>
            {author && (
              <Text
                level="small"
                variant="muted"
                testID={testID ? `${testID}-author` : undefined}
              >
                — {author}
              </Text>
            )}
            {source && (
              <Text
                level="caption"
                variant="muted"
                testID={testID ? `${testID}-source` : undefined}
              >
                {source}
              </Text>
            )}
          </Stack>
        )}
        {cite && (
          <Text
            level="caption"
            variant="muted"
            style={{ fontStyle: 'italic' }}
            testID={testID ? `${testID}-cite` : undefined}
          >
            {cite}
          </Text>
        )}
      </Stack>
    </View>
  );
};

export default Blockquote;
