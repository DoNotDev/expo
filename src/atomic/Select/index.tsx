// packages/expo/src/atomic/Select/index.tsx
/**
 * @fileoverview Select component
 * @description Production-quality select component with modal overlay dismiss,
 * search/filter, multi-select, grouped options, and smooth animations.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import Text from '../Text';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Select option interface
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Grouped options — a labelled group containing options.
 */
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

/**
 * Union helper — items can be flat options, grouped options, or a mix.
 */
type SelectItems = SelectOption[] | SelectGroup[];

/** Internal flattened row used by the list renderer. */
type FlatRow =
  | { type: 'group'; label: string }
  | { type: 'option'; option: SelectOption };

/**
 * Select component props interface.
 *
 * Backwards-compatible with the original API — all new props are optional.
 */
export interface SelectProps {
  /** Selected value (single mode) or values (multi mode). */
  value?: string | string[];
  /** Change handler — receives a string in single mode, string[] in multi mode. */
  onValueChange?: (value: string | string[]) => void;
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string;
  /**
   * Array of options or grouped options.
   * Flat: `[{ value, label }]`
   * Grouped: `[{ label: 'Group', options: [...] }]`
   */
  options?: SelectItems;
  /** Whether the select is disabled. @default false */
  disabled?: boolean;
  /** Label text rendered above the trigger. */
  label?: string;
  /** Whether the field is required (shows asterisk after label). */
  required?: boolean;
  /** Additional style applied to the root wrapper. */
  style?: ViewStyle;
  /** Test ID for testing. */
  testID?: string;

  // --- New optional props ---

  /** Enable a search/filter input at the top of the dropdown. @default false */
  searchable?: boolean;
  /** Placeholder for the search input. @default 'Search...' */
  searchPlaceholder?: string;
  /** Enable multi-select with checkbox indicators. @default false */
  multiple?: boolean;
  /** Maximum height of the dropdown list. @default 300 */
  maxHeight?: number;
  /** Text shown when search yields no results. @default 'No results found' */
  emptyMessage?: string;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Type guard — is this a grouped options array? */
function isGrouped(items: SelectItems): items is SelectGroup[] {
  return items.length > 0 && items[0] != null && 'options' in items[0];
}

/** Flatten groups into a renderable list. */
function flattenItems(items: SelectItems): FlatRow[] {
  if (items.length === 0) return [];
  if (isGrouped(items)) {
    const rows: FlatRow[] = [];
    for (const group of items) {
      rows.push({ type: 'group', label: group.label });
      for (const option of group.options) {
        rows.push({ type: 'option', option });
      }
    }
    return rows;
  }
  return (items as SelectOption[]).map((option) => ({
    type: 'option',
    option,
  }));
}

/** Extract all flat options from items (for display value lookup). */
function allOptions(items: SelectItems): SelectOption[] {
  if (items.length === 0) return [];
  if (isGrouped(items)) {
    return items.flatMap((g) => g.options);
  }
  return items as SelectOption[];
}

/** Filter flat rows by search string. Groups are kept only if they still have children. */
function filterRows(rows: FlatRow[], search: string): FlatRow[] {
  if (!search) return rows;
  const lower = search.toLowerCase();
  const result: FlatRow[] = [];
  let currentGroup: FlatRow | null = null;
  let groupHasMatch = false;

  for (const row of rows) {
    if (row.type === 'group') {
      // flush previous group if it had matches
      if (currentGroup && groupHasMatch) {
        // already pushed
      }
      currentGroup = row;
      groupHasMatch = false;
    } else {
      const matches =
        row.option.label.toLowerCase().includes(lower) ||
        (row.option.description?.toLowerCase().includes(lower) ?? false);
      if (matches) {
        if (currentGroup && !groupHasMatch) {
          result.push(currentGroup);
          groupHasMatch = true;
        }
        result.push(row);
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Production-quality accessible select component.
 *
 * Features:
 * - Modal overlay for outside-press dismiss
 * - Proper positioning below (or above) the trigger
 * - Theme-aware — all colors from `useTheme()`
 * - Accessible roles and states
 * - Animated dropdown (fade + slide)
 * - Optional search/filter (`searchable`)
 * - Optional multi-select (`multiple`)
 * - Grouped options support
 * - Hardware back button dismiss (Android)
 * - Scrollable with configurable `maxHeight`
 *
 * @component
 * @example
 * ```tsx
 * // Simple usage (backwards-compatible)
 * <Select
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select an option..."
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' },
 *   ]}
 * />
 *
 * // Searchable with groups
 * <Select
 *   searchable
 *   options={[
 *     { label: 'Fruits', options: [{ value: 'apple', label: 'Apple' }] },
 *     { label: 'Veggies', options: [{ value: 'carrot', label: 'Carrot' }] },
 *   ]}
 * />
 *
 * // Multi-select
 * <Select multiple value={selectedIds} onValueChange={setSelectedIds} options={items} />
 * ```
 */
const Select = ({
  value,
  onValueChange,
  placeholder = 'Select an option...',
  options = [],
  disabled = false,
  label,
  required,
  style,
  testID,
  searchable = false,
  searchPlaceholder = 'Search...',
  multiple = false,
  maxHeight = 300,
  emptyMessage = 'No results found',
  onOpenChange,
}: SelectProps) => {
  const { theme } = useTheme();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-8)).current;

  // Refs
  const triggerRef = useRef<View>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Derived
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const flatOptions = useMemo(() => allOptions(options), [options]);
  const allRows = useMemo(() => flattenItems(options), [options]);
  const visibleRows = useMemo(
    () => filterRows(allRows, search),
    [allRows, search]
  );

  // Display text
  const displayText = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    if (!multiple) {
      const found = flatOptions.find((o) => o.value === selectedValues[0]);
      return found?.label ?? placeholder;
    }
    const labels = selectedValues
      .map((v) => flatOptions.find((o) => o.value === v)?.label)
      .filter(Boolean);
    if (labels.length === 0) return placeholder;
    if (labels.length <= 2) return labels.join(', ');
    return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
  }, [selectedValues, flatOptions, placeholder, multiple]);

  const hasSelection = selectedValues.length > 0 && displayText !== placeholder;

  // Determine whether dropdown should open above or below
  const screenHeight = Dimensions.get('window').height;
  const spaceBelow = screenHeight - (triggerLayout.y + triggerLayout.height);
  const openAbove = spaceBelow < maxHeight + 20 && triggerLayout.y > spaceBelow;

  // ------ Open / Close ------

  const open = useCallback(() => {
    // Measure trigger position before opening
    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setTriggerLayout({ x, y, width, height });
        setIsOpen(true);
        onOpenChange?.(true);
        setSearch('');

        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: theme.duration.fast,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: theme.duration.fast,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Focus search input after animation
          if (searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        });
      });
    }
  }, [fadeAnim, slideAnim, theme.duration.fast, searchable, onOpenChange]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: theme.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: theme.duration.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
      onOpenChange?.(false);
      setSearch('');
    });
  }, [fadeAnim, slideAnim, theme.duration.fast, onOpenChange]);

  // ------ Selection handler ------

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const next = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onValueChange?.(next);
        // Keep dropdown open in multi mode
      } else {
        onValueChange?.(optionValue);
        close();
      }
    },
    [multiple, selectedValues, onValueChange, close]
  );

  // ------ Styles (all from theme) ------

  const triggerStyle: ViewStyle = {
    minHeight: theme.interactive.touchTarget,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.interactive || theme.radius.md,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const dropdownContainerStyle: ViewStyle = {
    position: 'absolute',
    width: triggerLayout.width,
    start: triggerLayout.x,
    ...(openAbove
      ? { bottom: screenHeight - triggerLayout.y + 4 }
      : { top: triggerLayout.y + triggerLayout.height + 4 }),
    maxHeight,
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radius.floating || theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  };

  const searchInputStyle: TextStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.foreground,
  };

  const optionBaseStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
  };

  const groupHeaderStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm + 2,
    paddingBottom: 4,
  };

  const checkboxSize = 18;
  const checkboxStyle: ViewStyle = {
    width: checkboxSize,
    height: checkboxSize,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: theme.spacing.sm,
  };

  const checkboxCheckedStyle: ViewStyle = {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  };

  // ------ Key extractor for FlatList ------

  const keyExtractor = useCallback(
    (_item: FlatRow, index: number) =>
      _item.type === 'group'
        ? `group-${index}`
        : `option-${_item.option.value}`,
    []
  );

  // ------ Render rows ------

  const renderRow = useCallback(
    ({ item }: { item: FlatRow }) => {
      if (item.type === 'group') {
        return (
          <View style={groupHeaderStyle}>
            <Text
              level="caption"
              style={{
                color: theme.colors.mutedForeground,
                fontWeight: theme.typography.fontWeight.semibold,
                textTransform: 'uppercase' as const,
                letterSpacing: 0.5,
              }}
            >
              {item.label}
            </Text>
          </View>
        );
      }

      const { option } = item;
      const isSelected = selectedValues.includes(option.value);

      return (
        <TouchableOpacity
          style={[
            optionBaseStyle,
            isSelected && !multiple && { backgroundColor: theme.colors.muted },
            option.disabled && { opacity: theme.opacity.subtle },
          ]}
          onPress={() => !option.disabled && handleSelect(option.value)}
          disabled={option.disabled}
          activeOpacity={0.6}
          accessibilityRole="menuitem"
          accessibilityState={{
            selected: isSelected,
            disabled: option.disabled,
          }}
          testID={testID ? `${testID}-option-${option.value}` : undefined}
        >
          {multiple && (
            <View style={[checkboxStyle, isSelected && checkboxCheckedStyle]}>
              {isSelected && (
                <Text
                  level="caption"
                  style={{
                    color: theme.colors.primaryForeground,
                    fontSize: 12,
                    lineHeight: 14,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text
              level="body"
              style={{ color: theme.colors.popoverForeground }}
            >
              {option.label}
            </Text>
            {option.description && (
              <Text
                level="caption"
                style={{ color: theme.colors.mutedForeground, marginTop: 2 }}
              >
                {option.description}
              </Text>
            )}
          </View>
          {!multiple && isSelected && (
            <Text
              level="body"
              style={{
                color: theme.colors.primary,
                marginStart: theme.spacing.sm,
              }}
            >
              ✓
            </Text>
          )}
        </TouchableOpacity>
      );
    },
    [
      selectedValues,
      multiple,
      handleSelect,
      theme,
      testID,
      groupHeaderStyle,
      optionBaseStyle,
      checkboxStyle,
      checkboxCheckedStyle,
    ]
  );

  // ------ Render ------

  return (
    <View style={style} testID={testID}>
      {/* Label */}
      {label && (
        <Text
          level="small"
          style={{ marginBottom: 4 }}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
          {required && (
            <Text level="small" variant="destructive">
              {' *'}
            </Text>
          )}
        </Text>
      )}

      {/* Trigger */}
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          style={[triggerStyle, disabled && { opacity: theme.opacity.muted }]}
          onPress={() => !disabled && open()}
          disabled={disabled}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen, disabled }}
          accessibilityLabel={label ? `${label}: ${displayText}` : displayText}
          testID={testID ? `${testID}-trigger` : undefined}
        >
          <Text
            level="body"
            style={{
              color: hasSelection
                ? theme.colors.foreground
                : theme.colors.mutedForeground,
              flex: 1,
            }}
          >
            {displayText}
          </Text>
          <Text level="body" style={{ color: theme.colors.mutedForeground }}>
            {isOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        {/* Backdrop — press to dismiss */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          onPress={close}
          accessibilityRole="none"
        >
          {/* Dropdown — stop propagation so taps inside don't close */}
          <Animated.View
            style={[
              dropdownContainerStyle,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: openAbove
                      ? Animated.multiply(slideAnim, -1)
                      : slideAnim,
                  },
                ],
              },
            ]}
            accessibilityRole="menu"
            testID={testID ? `${testID}-dropdown` : undefined}
          >
            <Pressable>
              {/* Search input */}
              {searchable && (
                <TextInput
                  ref={searchInputRef}
                  style={searchInputStyle}
                  value={search}
                  onChangeText={setSearch}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={theme.colors.mutedForeground}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                  testID={testID ? `${testID}-search` : undefined}
                />
              )}

              {/* Options list */}
              {visibleRows.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.md,
                  }}
                >
                  <Text
                    level="body"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {emptyMessage}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={visibleRows}
                  keyExtractor={keyExtractor}
                  renderItem={renderRow}
                  style={{ maxHeight: maxHeight - (searchable ? 44 : 0) }}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                />
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Select;
