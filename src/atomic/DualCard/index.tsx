// packages/expo/src/atomic/DualCard/index.tsx
/**
 * @fileoverview DualCard component
 * @description Two-column card layout with vertical separator
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { SURFACE_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import { getSurfaceVariants } from '../../utils/variants';
import { renderCardContent, renderCardHeader } from '../Card';
import Card from '../Card';
import Separator from '../Separator';
import Stack from '../Stack';

import type { CardContent } from '../Card';
import type { ReactNode } from 'react';

/**
 * DualCard component props interface
 */
export interface DualCardProps {
  /**
   * Left side title
   */
  leftTitle?: string;
  /**
   * Left side subtitle
   */
  leftSubtitle?: string;
  /**
   * Left side content
   */
  leftContent?: CardContent;
  /**
   * Left side CTA
   */
  leftCTA?: ReactNode;
  /**
   * Left side icon (for API parity with web)
   */
  leftIcon?: ReactNode;
  /**
   * Right side title
   */
  rightTitle?: string;
  /**
   * Right side subtitle
   */
  rightSubtitle?: string;
  /**
   * Right side content
   */
  rightContent?: CardContent;
  /**
   * Right side CTA
   */
  rightCTA?: ReactNode;
  /**
   * Right side icon (for API parity with web)
   */
  rightIcon?: ReactNode;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: (typeof SURFACE_VARIANT)[keyof typeof SURFACE_VARIANT];
  /**
   * Increases card shadow for elevated appearance
   * @default false
   */
  elevated?: boolean;
  /**
   * Custom content override (replaces default dual layout)
   */
  children?: ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const mobileDualCardStyle: ViewStyle = {
  flexDirection: 'column',
};

/**
 * Two-column card with vertical separator.
 * Responsive: 2 columns on tablet+, stacks to 1 column on mobile.
 *
 * @component
 * @example
 * ```tsx
 * <DualCard
 *   leftTitle="What we do"
 *   leftContent="Content left"
 *   rightTitle="How we do it"
 *   rightContent="Content right"
 * />
 * ```
 */
const DualCard = ({
  leftTitle,
  leftSubtitle,
  leftContent,
  leftCTA,
  rightTitle,
  rightSubtitle,
  rightContent,
  rightCTA,
  variant = SURFACE_VARIANT.DEFAULT,
  elevated = false,
  children,
  onClick,
  style,
  testID,
}: DualCardProps) => {
  const { theme } = useTheme();

  const elevatedStyle: ViewStyle = elevated
    ? {
        shadowColor: theme.colors.foreground,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }
    : {};

  const dualCardStyle: ViewStyle = {
    flexDirection: 'row',
    gap: theme.spacing.md,
  };

  // If children provided, render as custom content override
  if (children) {
    const wrapper = (
      <View style={[elevatedStyle]} testID={testID}>
        {children}
      </View>
    );

    if (onClick) {
      return (
        <TouchableOpacity
          onPress={onClick}
          activeOpacity={0.7}
          style={style}
          testID={testID ? `${testID}-button` : undefined}
        >
          {wrapper}
        </TouchableOpacity>
      );
    }

    return <View style={style}>{wrapper}</View>;
  }

  const content = (
    <View
      style={[dualCardStyle, mobileDualCardStyle, elevatedStyle]}
      testID={testID}
    >
      <View style={{ flex: 1 }} testID={testID ? `${testID}-left` : undefined}>
        <Card
          title={leftTitle}
          subtitle={leftSubtitle}
          content={leftContent}
          variant={variant}
          testID={testID ? `${testID}-left-card` : undefined}
        >
          {leftCTA}
        </Card>
      </View>
      <Separator
        orientation="vertical"
        testID={testID ? `${testID}-separator` : undefined}
      />
      <View style={{ flex: 1 }} testID={testID ? `${testID}-right` : undefined}>
        <Card
          title={rightTitle}
          subtitle={rightSubtitle}
          content={rightContent}
          variant={variant}
          testID={testID ? `${testID}-right-card` : undefined}
        >
          {rightCTA}
        </Card>
      </View>
    </View>
  );

  if (onClick) {
    return (
      <TouchableOpacity
        onPress={onClick}
        activeOpacity={0.7}
        style={style}
        testID={testID ? `${testID}-button` : undefined}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{content}</View>;
};

export default DualCard;
