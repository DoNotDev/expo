// packages/expo/src/atomic/Combobox/index.tsx
/**
 * @fileoverview Combobox component
 * @description Searchable select with autocomplete, Modal-based outside-press dismiss,
 * debounced filtering, loading/empty states, and custom option rendering.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { CONTROL_VARIANT } from '../../utils/constants';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Combobox option interface
 */
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  content?: ReactNode;
}

/**
 * Combobox component props interface
 */
export interface ComboboxProps {
  /** Selected value(s) */
  value?: string | string[];
  /** Change handler */
  onValueChange?: (value: string | string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Array of options */
  options?: ComboboxOption[];
  /**
   * Whether the combobox is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the combobox is loading options asynchronously
   * @default false
   */
  isLoading?: boolean;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Empty message shown when filter yields no results
   * @default 'No results found'
   */
  emptyMessage?: string;
  /**
   * Multiple selection
   * @default false
   */
  multiple?: boolean;
  /**
   * Whether users can create new options when no match is found
   * @default false
   */
  creatable?: boolean;
  /**
   * Label for the create option
   * @default 'Create'
   */
  createLabel?: string;
  /**
   * Whether the selection can be cleared
   * @default false
   */
  clearable?: boolean;
  /** Label text */
  label?: string;
  /** Whether field is required */
  required?: boolean;
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;

  // --- New props ---

  /**
   * Whether users can create new options from search text.
   * Alias for `creatable` — when true, shows a "Create …" row.
   * @default false
   */
  allowCreate?: boolean;
  /**
   * Callback fired when the user selects the "Create" row.
   * Receives the trimmed search text. If omitted the value is
   * passed through `onValueChange` as-is.
   */
  onCreateOption?: (text: string) => void;
  /**
   * Custom option renderer. Receives the option and whether it is selected.
   * When provided, replaces the default label + description layout.
   */
  renderOption?: (option: ComboboxOption, selected: boolean) => ReactNode;
  /**
   * Maximum height of the scrollable options list (px).
   * @default 300
   */
  maxHeight?: number;
  /**
   * Debounce delay in ms applied to the search input.
   * @default 150
   */
  debounce?: number;
}

// ---------------------------------------------------------------------------
// Hook: useDebounce
// ---------------------------------------------------------------------------

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Searchable select component with autocomplete.
 *
 * Features:
 * - Modal overlay for reliable outside-press dismiss
 * - Always-visible TextInput for search/filter
 * - Debounced filtering for performance
 * - Loading, empty, and create-new states
 * - Custom option rendering via `renderOption`
 * - Fully theme-aware — no hardcoded colors
 *
 * @component
 * @example
 * ```tsx
 * <Combobox
 *   value={value}
 *   onValueChange={setValue}
 *   options={[{ value: '1', label: 'Option 1' }]}
 *   placeholder="Search items..."
 * />
 * ```
 */
const Combobox = ({
  value,
  onValueChange,
  placeholder = 'Search...',
  options = [],
  disabled = false,
  isLoading = false,
  variant = CONTROL_VARIANT.DEFAULT,
  emptyMessage = 'No results found',
  multiple = false,
  creatable = false,
  createLabel = 'Create',
  clearable = false,
  label,
  required,
  style,
  testID,
  onOpenChange,
  allowCreate,
  onCreateOption,
  renderOption,
  maxHeight = 300,
  debounce = 150,
}: ComboboxProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, debounce);

  // Position tracking: we measure the input container to place the dropdown
  const anchorRef = useRef<View>(null);
  const [anchorLayout, setAnchorLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const canCreate = creatable || allowCreate;

  // ------------------------------------------------------------------
  // Open / close helpers
  // ------------------------------------------------------------------

  const open = useCallback(() => {
    if (disabled) return;

    // Measure anchor position on screen before opening
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ x, y, width, height });
      setIsOpen(true);
      onOpenChange?.(true);
    });
  }, [disabled, onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    onOpenChange?.(false);
  }, [onOpenChange]);

  // ------------------------------------------------------------------
  // Selection helpers
  // ------------------------------------------------------------------

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return options;
    const q = debouncedSearch.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q)
    );
  }, [options, debouncedSearch]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const next = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onValueChange?.(next);
      } else {
        onValueChange?.(optionValue);
        close();
      }
    },
    [multiple, selectedValues, onValueChange, close]
  );

  const handleCreate = useCallback(() => {
    const text = search.trim();
    if (!text) return;
    if (onCreateOption) {
      onCreateOption(text);
    } else {
      handleSelect(text);
    }
    setSearch('');
    if (!multiple) close();
  }, [search, onCreateOption, handleSelect, multiple, close]);

  const handleClear = useCallback(() => {
    onValueChange?.(multiple ? [] : '');
    setSearch('');
    close();
  }, [multiple, onValueChange, close]);

  // Display label in the input when closed
  const selectedOption = options.find(
    (o) => o.value === (Array.isArray(value) ? value[0] : value)
  );

  const showCreatable =
    canCreate && search.trim() && filteredOptions.length === 0;

  // ------------------------------------------------------------------
  // Styles (all from theme)
  // ------------------------------------------------------------------

  const inputContainerStyle: ViewStyle = {
    minHeight: theme.interactive.touchTarget,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: isOpen ? theme.colors.ring : theme.colors.border,
    borderRadius: theme.radius.interactive || theme.radius.md,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
  };

  const inputTextStyle: TextStyle = {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.base,
    color: theme.colors.foreground,
    paddingVertical: 0,
  };

  const dropdownStyle: ViewStyle = {
    position: 'absolute',
    top: anchorLayout.y + anchorLayout.height + 4,
    left: anchorLayout.x,
    width: anchorLayout.width,
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radius.floating || theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  };

  const optionBaseStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  };

  const selectedBgStyle: ViewStyle = {
    backgroundColor: theme.colors.muted,
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

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

      {/* Anchor: always-visible TextInput */}
      <View
        ref={anchorRef}
        collapsable={false}
        style={[inputContainerStyle, disabled && { opacity: 0.5 }]}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <TextInput
          style={inputTextStyle}
          placeholder={
            selectedOption && !isOpen ? selectedOption.label : placeholder
          }
          placeholderTextColor={
            selectedOption && !isOpen
              ? theme.colors.foreground
              : theme.colors.mutedForeground
          }
          value={search}
          onChangeText={setSearch}
          onFocus={open}
          editable={!disabled}
          accessibilityRole="combobox"
          accessibilityState={{ expanded: isOpen, disabled }}
          testID={testID ? `${testID}-input` : undefined}
        />

        <Stack direction="row" align="center" gap={4}>
          {clearable && selectedOption && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={8}
              testID={testID ? `${testID}-clear` : undefined}
            >
              <Text level="body" variant="muted">
                {'✕'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => (isOpen ? close() : open())}
            hitSlop={8}
            disabled={disabled}
          >
            <Text level="body" variant="muted">
              {isOpen ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </Stack>
      </View>

      {/* Dropdown inside transparent Modal for outside-press dismiss */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        {/* Backdrop: pressing anywhere outside closes */}
        <Pressable
          style={{ flex: 1 }}
          onPress={close}
          testID={testID ? `${testID}-backdrop` : undefined}
        >
          {/* Dropdown positioned absolutely under the anchor */}
          <Pressable
            style={dropdownStyle}
            onPress={() => {
              /* prevent backdrop close */
            }}
            testID={testID ? `${testID}-dropdown` : undefined}
          >
            {/* Loading state */}
            {isLoading && (
              <View
                style={{
                  paddingVertical: theme.spacing.md,
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            )}

            {/* Options list */}
            {!isLoading && (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {filteredOptions.length === 0 && !showCreatable ? (
                  <View style={optionBaseStyle}>
                    <Text level="body" variant="muted">
                      {emptyMessage}
                    </Text>
                  </View>
                ) : (
                  <>
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            optionBaseStyle,
                            isSelected && selectedBgStyle,
                            option.disabled && {
                              opacity: theme.opacity.subtle,
                            },
                          ]}
                          onPress={() =>
                            !option.disabled && handleSelect(option.value)
                          }
                          disabled={option.disabled}
                          activeOpacity={0.7}
                          testID={
                            testID
                              ? `${testID}-option-${option.value}`
                              : undefined
                          }
                        >
                          {renderOption ? (
                            renderOption(option, isSelected)
                          ) : (
                            <Stack gap={2}>
                              {option.content ?? (
                                <Text level="body">{option.label}</Text>
                              )}
                              {option.description && (
                                <Text level="caption" variant="muted">
                                  {option.description}
                                </Text>
                              )}
                            </Stack>
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    {showCreatable && (
                      <TouchableOpacity
                        style={optionBaseStyle}
                        onPress={handleCreate}
                        activeOpacity={0.7}
                        testID={testID ? `${testID}-create` : undefined}
                      >
                        <Text level="body" variant="muted">
                          {createLabel} &quot;{search.trim()}&quot;
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Combobox;
