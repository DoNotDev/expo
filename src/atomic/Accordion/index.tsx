// packages/expo/src/atomic/Accordion/index.tsx
/**
 * @fileoverview Accordion component
 * @description Accessible accordion component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { TouchableOpacity, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Accordion item interface
 */
export interface AccordionItemType {
  /** The unique value for the accordion item */
  value: string;
  /** The content to be displayed in the trigger/header */
  trigger: string | ReactNode;
  /** The content to be displayed when expanded */
  content: string | ReactNode;
}

/**
 * Accordion component props interface
 */
export interface AccordionProps {
  /**
   * The type of accordion
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * Whether an accordion item can be collapsed after opening (only for type="single")
   * @default false
   */
  collapsible?: boolean;
  /** The default active value(s) */
  defaultValue?: string | string[];
  /** The controlled active value(s) */
  value?: string | string[];
  /** Callback when value changes */
  onValueChange?: (value: string | string[]) => void;
  /** The list of items to render */
  items: AccordionItemType[];
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

// Styles are built dynamically via useTheme() — see component body

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 *
 * @component
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { value: '1', trigger: 'Item 1', content: 'Content 1' },
 *     { value: '2', trigger: 'Item 2', content: 'Content 2' }
 *   ]}
 * />
 * ```
 */
const Accordion = ({
  type = 'single',
  collapsible = false,
  defaultValue,
  value: controlledValue,
  onValueChange,
  items,
  style,
  testID,
}: AccordionProps) => {
  const { theme } = useTheme();

  const accordionItemStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  };

  const triggerStyle: ViewStyle = {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  };

  const [internalValue, setInternalValue] = useState<string | string[]>(
    () => defaultValue || (type === 'multiple' ? [] : '')
  );

  const value = controlledValue ?? internalValue;
  const isControlled = controlledValue !== undefined;

  const isOpen = (itemValue: string) => {
    if (type === 'single') {
      return value === itemValue;
    }
    return Array.isArray(value) && value.includes(itemValue);
  };

  const handleToggle = (itemValue: string) => {
    let newValue: string | string[];

    if (type === 'single') {
      if (value === itemValue && !collapsible) {
        return; // Can't collapse if collapsible is false
      }
      newValue = value === itemValue ? '' : itemValue;
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      newValue = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <View style={style} testID={testID}>
      {items.map((item, index) => {
        const open = isOpen(item.value);

        return (
          <View
            key={item.value}
            style={[
              accordionItemStyle,
              index === items.length - 1 && { borderBottomWidth: 0 },
            ]}
            testID={testID ? `${testID}-item-${item.value}` : undefined}
          >
            <TouchableOpacity
              onPress={() => handleToggle(item.value)}
              style={triggerStyle}
              activeOpacity={0.7}
              testID={testID ? `${testID}-trigger-${item.value}` : undefined}
            >
              <View style={{ flex: 1 }}>
                {typeof item.trigger === 'string' ? (
                  <Text level="h4">{item.trigger}</Text>
                ) : (
                  item.trigger
                )}
              </View>
              <Text level="body" variant="muted">
                {open ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            {open && (
              <View
                style={contentStyle}
                testID={testID ? `${testID}-content-${item.value}` : undefined}
              >
                {typeof item.content === 'string' ? (
                  <Text level="body">{item.content}</Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Accordion;
