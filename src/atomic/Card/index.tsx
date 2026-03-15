// packages/expo/src/atomic/Card/index.tsx
/**
 * @fileoverview Card component
 * @description Card component with behavioral variants and elevation
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
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Card variant type
 */
export type CardVariant =
  (typeof SURFACE_VARIANT)[keyof typeof SURFACE_VARIANT];

/**
 * Card content type - string, string[], or ReactNode
 */
export type CardContent = string | string[] | ReactNode;

/**
 * Renders card content
 */
export function renderCardContent(content: CardContent | undefined): ReactNode {
  if (!content) return null;
  if (typeof content === 'string') {
    return (
      <Text level="small" testID="card-content-text">
        {content}
      </Text>
    );
  }
  if (Array.isArray(content)) {
    return (
      <Stack gap={4} testID="card-content-list">
        {content.map((item, index) => (
          <Text key={index} level="small" testID={`card-content-item-${index}`}>
            {item}
          </Text>
        ))}
      </Stack>
    );
  }
  return content;
}

/**
 * Renders card header with title and subtitle
 */
export function renderCardHeader({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}): ReactNode {
  if (!title && !subtitle) return null;
  return (
    <Stack gap={2} testID="card-header">
      {title && (
        <Text level="h4" testID="card-title">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text level="small" variant="muted" testID="card-subtitle">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}

/**
 * Card component props interface
 */
export interface CardProps {
  /**
   * Icon element rendered in the card header
   */
  icon?: ReactNode;
  /**
   * Card title
   */
  title?: string;
  /**
   * Card subtitle
   */
  subtitle?: string;
  /**
   * Card content (string, string[], or ReactNode)
   */
  content?: CardContent;
  /**
   * Footer content
   */
  footer?: ReactNode;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: CardVariant;
  /**
   * Whether the card is clickable (wraps in pressable)
   * @default false
   */
  clickable?: boolean;
  /**
   * Whether to apply elevated shadow
   * @default false
   */
  elevated?: boolean;
  /**
   * Press handler (implies clickable)
   */
  onPress?: () => void;
  /**
   * Card children (alternative to content)
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

/**
 * Card component with behavioral variants.
 *
 * @component
 * @example
 * ```tsx
 * <Card title="Title" content="Content text" />
 * <Card title="Title" subtitle="Subtitle" content={["Item 1", "Item 2"]} />
 * <Card variant="primary">
 *   <Text>Custom content</Text>
 * </Card>
 * ```
 */
const Card = ({
  icon,
  title,
  subtitle,
  content,
  footer,
  variant = SURFACE_VARIANT.DEFAULT,
  clickable,
  elevated,
  onPress,
  children,
  style,
  testID,
}: CardProps) => {
  const { theme } = useTheme();
  const surfaceVariants = getSurfaceVariants(theme);
  const variantStyle = surfaceVariants[variant];
  const renderedContent = content ? renderCardContent(content) : children;

  const baseCardStyle: ViewStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.radius.surface,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: elevated ? 4 : 2 },
    shadowOpacity: elevated ? theme.opacity.subtle * 2 : theme.opacity.subtle,
    shadowRadius: elevated ? 8 : 4,
    elevation: elevated ? 6 : 2,
  };

  const headerContent =
    title || subtitle || icon ? (
      <Stack
        direction="row"
        gap={theme.spacing.sm}
        align="center"
        testID="card-header"
      >
        {icon}
        <Stack gap={2} flex={1}>
          {title && (
            <Text level="h4" testID="card-title">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text level="small" variant="muted" testID="card-subtitle">
              {subtitle}
            </Text>
          )}
        </Stack>
      </Stack>
    ) : null;

  const cardContent = (
    <Stack gap={theme.spacing.sm}>
      {headerContent}
      {renderedContent}
      {footer}
    </Stack>
  );

  if (clickable || onPress) {
    return (
      <TouchableOpacity
        style={mergeStyles(baseCardStyle, variantStyle, style)}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={mergeStyles(baseCardStyle, variantStyle, style)}
      testID={testID}
    >
      {cardContent}
    </View>
  );
};

export default Card;
