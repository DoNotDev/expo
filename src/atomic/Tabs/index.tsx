// packages/expo/src/atomic/Tabs/index.tsx
/**
 * @fileoverview Tabs component
 * @description Tabbed interface component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Tab item interface
 */
export interface TabItem {
  /** Unique identifier for the tab */
  value: string;
  /** Tab label content */
  label: string | ReactNode;
  /** Tab panel content */
  content: ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

/**
 * Tabs component props interface
 */
export interface TabsProps {
  /**
   * Default active tab value
   */
  defaultValue?: string;
  /**
   * Controlled active tab value
   */
  value?: string;
  /**
   * Change handler
   */
  onValueChange?: (value: string) => void;
  /**
   * Array of tab items
   */
  items: TabItem[];
  /**
   * Variant style
   * @default 'default'
   */
  variant?: (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT];
  /**
   * Gap between tab triggers
   */
  gap?: number;
  /**
   * Align tab list
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Justify tab list
   */
  justify?: 'start' | 'center' | 'end' | 'space-between';
  /**
   * Shorthand for align=center justify=center
   * @default false
   */
  center?: boolean;
  /**
   * Tab list direction
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Tab list style (for API parity with web)
   */
  listStyle?: ViewStyle;
  /**
   * Tab content style (for API parity with web)
   */
  contentStyle?: ViewStyle;
}

// Styles are built dynamically via useTheme() — see component body

/**
 * Tabbed interface component.
 *
 * @component
 * @example
 * ```tsx
 * <Tabs
 *   defaultValue="tab1"
 *   items={[
 *     { value: 'tab1', label: 'Tab 1', content: <Text>Content 1</Text> },
 *     { value: 'tab2', label: 'Tab 2', content: <Text>Content 2</Text> }
 *   ]}
 * />
 * ```
 */
const alignMap = {
  start: 'flex-start' as const,
  center: 'center' as const,
  end: 'flex-end' as const,
};

const justifyMap = {
  start: 'flex-start' as const,
  center: 'center' as const,
  end: 'flex-end' as const,
  'space-between': 'space-between' as const,
};

const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  items,
  variant = THEME_VARIANT.DEFAULT,
  gap: tabGap,
  align,
  justify,
  center = false,
  orientation = 'horizontal',
  style,
  listStyle,
  contentStyle,
  testID,
}: TabsProps) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState(
    () => defaultValue || items[0]?.value || ''
  );

  const resolvedAlign = center ? 'center' : align;
  const resolvedJustify = center ? 'center' : justify;
  const isVertical = orientation === 'vertical';

  const tabsListStyle: ViewStyle = {
    flexDirection: isVertical ? 'column' : 'row',
    borderBottomWidth: isVertical ? 0 : 1,
    borderBottomColor: isVertical ? undefined : theme.colors.border,
    ...(isVertical && {
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    }),
    ...(tabGap !== undefined && { gap: tabGap }),
    ...(resolvedAlign && { alignItems: alignMap[resolvedAlign] }),
    ...(resolvedJustify && { justifyContent: justifyMap[resolvedJustify] }),
    ...listStyle,
  };

  const tabTriggerStyle: ViewStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  };

  const activeTabStyle: ViewStyle = {
    borderBottomColor: theme.colors.primary,
  };

  const tabContentStyle: ViewStyle = {
    padding: theme.spacing.md,
    ...contentStyle,
  };
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const activeTab = items.find((item) => item.value === activeValue);

  return (
    <View style={style} testID={testID}>
      <View
        style={tabsListStyle}
        testID={testID ? `${testID}-list` : undefined}
      >
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <TouchableOpacity
              key={item.value}
              style={[tabTriggerStyle, isActive && activeTabStyle]}
              onPress={() => !item.disabled && handleChange(item.value)}
              disabled={item.disabled}
              activeOpacity={0.7}
              testID={testID ? `${testID}-trigger-${item.value}` : undefined}
            >
              {typeof item.label === 'string' ? (
                <Text
                  level="body"
                  variant={isActive ? 'primary' : 'muted'}
                  style={item.disabled ? { opacity: 0.5 } : undefined}
                >
                  {item.label}
                </Text>
              ) : (
                item.label
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {activeTab && (
        <View
          style={tabContentStyle}
          testID={testID ? `${testID}-content` : undefined}
        >
          {activeTab.content}
        </View>
      )}
    </View>
  );
};

export default Tabs;
