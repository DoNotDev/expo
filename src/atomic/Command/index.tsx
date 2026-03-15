// packages/expo/src/atomic/Command/index.tsx
/**
 * @fileoverview Command component
 * @description Command palette component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Input from '../Input';
import Separator from '../Separator';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Command item interface
 */
export interface CommandItem {
  /** The main label text */
  label: string;
  /** Optional value (defaults to label) */
  value?: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Optional badge */
  badge?: ReactNode;
  /** Callback when selected */
  onSelect?: () => void;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
}

/**
 * Command group interface
 */
export interface CommandGroup {
  /** Group heading */
  heading?: string;
  /** List of items in the group */
  items: CommandItem[];
  /** Whether to show a separator before this group */
  separator?: boolean;
}

/**
 * Command component props interface
 */
export interface CommandProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Message to show when no results found
   */
  emptyMessage?: string;
  /**
   * Groups of command items
   */
  groups?: CommandGroup[];
  /**
   * Standalone command items (ungrouped)
   */
  items?: CommandItem[];
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const itemStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
};

const groupHeadingStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
};

/**
 * Command palette component.
 *
 * @component
 * @example
 * ```tsx
 * <Command
 *   groups={[
 *     {
 *       heading: 'Actions',
 *       items: [{ label: 'Copy', onSelect: handleCopy }]
 *     }
 *   ]}
 * />
 * ```
 */
const Command = ({
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  groups = [],
  items = [],
  onClose,
  style,
  testID,
}: CommandProps) => {
  const [search, setSearch] = useState('');

  const filteredGroups = useMemo(() => {
    if (!search) return groups;
    const searchLower = search.toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, search]);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const searchLower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
    );
  }, [items, search]);

  const allItems = [
    ...filteredGroups.flatMap((group) => group.items),
    ...filteredItems,
  ];

  return (
    <View style={style} testID={testID}>
      <Stack gap={8}>
        <Input
          placeholder={placeholder}
          value={search}
          onChangeText={setSearch}
          testID={testID ? `${testID}-search` : undefined}
        />
        <ScrollView style={{ maxHeight: 400 }}>
          <Stack gap={4}>
            {filteredGroups.map((group, groupIndex) => (
              <View
                key={groupIndex}
                testID={testID ? `${testID}-group-${groupIndex}` : undefined}
              >
                {group.separator && groupIndex > 0 && (
                  <Separator
                    testID={
                      testID ? `${testID}-separator-${groupIndex}` : undefined
                    }
                  />
                )}
                {group.heading && (
                  <View
                    style={groupHeadingStyle}
                    testID={
                      testID ? `${testID}-heading-${groupIndex}` : undefined
                    }
                  >
                    <Text level="small" variant="muted">
                      {group.heading}
                    </Text>
                  </View>
                )}
                {group.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.value || item.label}
                    style={itemStyle}
                    onPress={() => !item.disabled && item.onSelect?.()}
                    disabled={item.disabled}
                    activeOpacity={0.7}
                    testID={
                      testID
                        ? `${testID}-item-${groupIndex}-${itemIndex}`
                        : undefined
                    }
                  >
                    {item.icon}
                    <View style={{ flex: 1 }}>
                      <Text level="body">{item.label}</Text>
                      {item.description && (
                        <Text level="caption" variant="muted">
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {item.badge}
                    {item.shortcut && (
                      <Text level="caption" variant="muted">
                        {item.shortcut}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={item.value || item.label}
                style={itemStyle}
                onPress={() => !item.disabled && item.onSelect?.()}
                disabled={item.disabled}
                activeOpacity={0.7}
                testID={
                  testID ? `${testID}-standalone-item-${index}` : undefined
                }
              >
                {item.icon}
                <View style={{ flex: 1 }}>
                  <Text level="body">{item.label}</Text>
                  {item.description && (
                    <Text level="caption" variant="muted">
                      {item.description}
                    </Text>
                  )}
                </View>
                {item.badge}
              </TouchableOpacity>
            ))}
            {allItems.length === 0 && (
              <View
                style={itemStyle}
                testID={testID ? `${testID}-empty` : undefined}
              >
                <Text level="body" variant="muted">
                  {emptyMessage}
                </Text>
              </View>
            )}
          </Stack>
        </ScrollView>
      </Stack>
    </View>
  );
};

export default Command;
