// packages/expo/src/atomic/HeroSection/index.tsx
/**
 * @fileoverview HeroSection component
 * @description Hero section with title, subtitle, and optional badge
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Badge from '../Badge';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * HeroSection component props interface
 */
export interface HeroSectionProps {
  /**
   * Badge text
   */
  badge?: string;
  /**
   * Hero title (renders as h1)
   */
  title?: string | ReactNode;
  /**
   * Hero subtitle
   */
  subtitle?: string | ReactNode;
  /**
   * Full viewport height
   * @default false
   */
  fullHeight?: boolean;
  /**
   * Content alignment
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'subtle' | 'accent';
  /**
   * Content
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

const heroStyle: ViewStyle = {
  padding: 48,
  alignItems: 'center',
  justifyContent: 'center',
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
 * Hero section with title, subtitle, and optional badge.
 *
 * @component
 * @example
 * ```tsx
 * <HeroSection
 *   title="Build Faster"
 *   subtitle="The ultimate framework"
 *   badge="New v2.0"
 * >
 *   <Button>Get Started</Button>
 * </HeroSection>
 * ```
 */
const HeroSection = ({
  badge,
  title,
  subtitle,
  fullHeight = false,
  align = 'center',
  variant = 'primary',
  children,
  style,
  testID,
}: HeroSectionProps) => {
  return (
    <View
      style={mergeStyles(
        heroStyle,
        getAlignStyle(align),
        fullHeight && { minHeight: '100%' },
        style
      )}
      testID={testID}
    >
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
        {badge && (
          <Badge
            variant="primary"
            testID={testID ? `${testID}-badge` : undefined}
          >
            {badge}
          </Badge>
        )}
        {title && (
          <Text level="h1" testID={testID ? `${testID}-title` : undefined}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            level="h3"
            variant="muted"
            testID={testID ? `${testID}-subtitle` : undefined}
          >
            {subtitle}
          </Text>
        )}
        {children && (
          <View testID={testID ? `${testID}-children` : undefined}>
            {children}
          </View>
        )}
      </Stack>
    </View>
  );
};

export default HeroSection;
