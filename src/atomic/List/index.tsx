// packages/expo/src/atomic/List/index.tsx
/**
 * @fileoverview List component
 * @description Simple list component for bullet points, numbered lists, and feature lists
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
 * List item interface
 */
export interface ListItem {
  /** Item content (text or ReactNode) */
  content: ReactNode;
  /** Optional icon before item */
  icon?: ReactNode;
}

/**
 * List component props interface
 */
export interface ListProps {
  /**
   * Array of items (strings or objects)
   */
  items?: (string | ReactNode | ListItem)[];
  /**
   * Whether to render as ordered list (numbers)
   * @default false
   */
  ordered?: boolean;
  /**
   * Default icon for all string items
   */
  icon?: ReactNode;
  /**
   * Item density affecting gap and padding
   * @default 'default'
   */
  density?: 'compact' | 'default' | 'comfortable';
  /**
   * Alternative content (replaces items array rendering)
   */
  children?: ReactNode;
  /**
   * Spacing between items (in pixels)
   * @default 4
   */
  gap?: number;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const listItemStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
};

const bulletBaseStyle: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  marginTop: 8,
  marginRight: 8,
};

/**
 * List component for bullet points, numbered lists, and feature lists.
 *
 * @component
 * @example
 * ```tsx
 * <List items={['Feature 1', 'Feature 2']} />
 * <List items={['Step 1', 'Step 2']} ordered />
 * <List items={[{ icon: <Check />, content: 'Completed' }]} />
 * ```
 */
const DENSITY_GAP = {
  compact: 2,
  default: 4,
  comfortable: 8,
} as const;

const DENSITY_PADDING = {
  compact: 0,
  default: 0,
  comfortable: 4,
} as const;

const List = ({
  items = [],
  ordered = false,
  icon,
  density = 'default',
  children,
  gap,
  style,
  testID,
}: ListProps) => {
  const { theme } = useTheme();
  const bulletColorStyle: ViewStyle = {
    backgroundColor: theme.colors.mutedForeground,
  };
  const resolvedGap = gap ?? DENSITY_GAP[density];
  const paddingVertical = DENSITY_PADDING[density];

  if (children) {
    return (
      <Stack
        gap={resolvedGap}
        style={mergeStyles(
          paddingVertical ? { paddingVertical } : undefined,
          style
        )}
        testID={testID}
      >
        {children}
      </Stack>
    );
  }

  return (
    <Stack
      gap={resolvedGap}
      style={mergeStyles(
        paddingVertical ? { paddingVertical } : undefined,
        style
      )}
      testID={testID}
    >
      {items.map((item, index) => {
        let content: ReactNode;
        let itemIcon: ReactNode | undefined;

        if (typeof item === 'string') {
          content = item;
          itemIcon = icon;
        } else if (
          typeof item === 'object' &&
          item !== null &&
          'content' in item
        ) {
          content = (item as ListItem).content;
          itemIcon = (item as ListItem).icon || icon;
        } else {
          content = item;
        }

        return (
          <View
            key={index}
            style={listItemStyle}
            testID={testID ? `${testID}-item-${index}` : undefined}
          >
            {ordered ? (
              <Text level="body" variant="muted" style={{ marginRight: 8 }}>
                {index + 1}.
              </Text>
            ) : itemIcon ? (
              <View style={{ marginRight: 8 }}>{itemIcon}</View>
            ) : (
              <View style={[bulletBaseStyle, bulletColorStyle]} />
            )}
            {typeof content === 'string' ? (
              <Text level="body" style={{ flex: 1 }}>
                {content}
              </Text>
            ) : (
              <View style={{ flex: 1 }}>{content}</View>
            )}
          </View>
        );
      })}
    </Stack>
  );
};

export default List;
