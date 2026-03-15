// packages/expo/src/atomic/CallToAction/index.tsx
/**
 * @fileoverview CallToAction component
 * @description Conversion-focused CTA section with title, subtitle, and actions
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * CallToAction component props interface
 */
export interface CallToActionProps {
  /**
   * Main title
   */
  title?: string;
  /**
   * Subtitle or description
   */
  subtitle?: string;
  /**
   * Primary action button
   */
  primaryAction?: ReactNode;
  /**
   * Secondary action button
   */
  secondaryAction?: ReactNode;
  /**
   * Visual tone for background color
   * @default 'default'
   */
  tone?: 'default' | 'primary' | 'accent' | 'muted';
  /**
   * Alternative content (replaces structured title/subtitle/actions)
   */
  children?: ReactNode;
  /**
   * Content alignment
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const ctaStyle: ViewStyle = {
  padding: 32,
  alignItems: 'center',
};

const getAlignStyle = (align: 'start' | 'center' | 'end'): ViewStyle => {
  switch (align) {
    case 'start':
      return { alignItems: 'flex-start' };
    case 'end':
      return { alignItems: 'flex-end' };
    case 'center':
    default:
      return { alignItems: 'center' };
  }
};

/**
 * Conversion-focused CTA section.
 *
 * @component
 * @example
 * ```tsx
 * <CallToAction
 *   title="Ready to launch?"
 *   subtitle="Get started in minutes."
 *   primaryAction={<Button>Sign Up</Button>}
 *   secondaryAction={<Button variant="outline">Learn More</Button>}
 * />
 * ```
 */
const TONE_COLOR_MAP = {
  default: 'background',
  primary: 'primary',
  accent: 'accent',
  muted: 'muted',
} as const;

const CallToAction = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  tone = 'default',
  children,
  align = 'center',
  style,
  testID,
}: CallToActionProps) => {
  const { theme } = useTheme();

  const toneStyle: ViewStyle =
    tone !== 'default'
      ? { backgroundColor: theme.colors[TONE_COLOR_MAP[tone]] }
      : {};

  return (
    <View
      style={mergeStyles(ctaStyle, getAlignStyle(align), toneStyle, style)}
      testID={testID}
    >
      {children || (
        <Stack
          gap={16}
          align={
            align === 'center'
              ? 'center'
              : align === 'start'
                ? 'flex-start'
                : 'flex-end'
          }
        >
          {title && (
            <Text level="h2" testID={testID ? `${testID}-title` : undefined}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              level="body"
              variant="muted"
              testID={testID ? `${testID}-subtitle` : undefined}
            >
              {subtitle}
            </Text>
          )}
          {(primaryAction || secondaryAction) && (
            <Stack
              direction="row"
              gap={12}
              testID={testID ? `${testID}-actions` : undefined}
            >
              {primaryAction}
              {secondaryAction}
            </Stack>
          )}
        </Stack>
      )}
    </View>
  );
};

export default CallToAction;
