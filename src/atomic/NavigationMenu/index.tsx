// packages/expo/src/atomic/NavigationMenu/index.tsx
/**
 * @fileoverview NavigationMenu component
 * @description Navigation menu component
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
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Navigation menu item interface
 */
export interface NavigationMenuItem {
  label: string;
  value: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * NavigationMenu component props interface
 */
export interface NavigationMenuProps {
  /**
   * Menu items
   */
  items?: NavigationMenuItem[];
  /**
   * Current active value
   */
  value?: string;
  /**
   * Change handler
   */
  onValueChange?: (value: string) => void;
  /**
   * Whether menu is vertical
   * @default false
   */
  vertical?: boolean;
  /**
   * Menu orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Custom link component for navigation
   */
  LinkComponent?: any;
  /**
   * Custom children (overrides items rendering)
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

const itemStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
};

// activeItemStyle is built dynamically inside the component to use theme tokens

/**
 * Navigation menu component.
 *
 * @component
 * @example
 * ```tsx
 * <NavigationMenu
 *   items={[
 *     { label: 'Home', value: 'home', onPress: () => navigate('/') },
 *     { label: 'About', value: 'about', onPress: () => navigate('/about') }
 *   ]}
 * />
 * ```
 */
const NavigationMenu = ({
  items = [],
  value,
  onValueChange,
  vertical = false,
  orientation,
  LinkComponent,
  children,
  style,
  testID,
}: NavigationMenuProps) => {
  const { theme } = useTheme();
  const isVertical = vertical || orientation === 'vertical';

  const activeItemStyle: ViewStyle = {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  };

  return (
    <View style={style} testID={testID}>
      {children || (
        <Stack direction={isVertical ? 'column' : 'row'} gap={0}>
          {items.map((item) => {
            const isActive = value === item.value;
            const itemContent = (
              <>
                {item.icon}
                <Text
                  level="body"
                  variant={isActive ? 'primary' : 'default'}
                  style={item.disabled ? { opacity: 0.5 } : undefined}
                >
                  {item.label}
                </Text>
              </>
            );

            if (LinkComponent && item.href) {
              return (
                <LinkComponent
                  key={item.value}
                  href={item.href}
                  style={[itemStyle, isActive && activeItemStyle]}
                  testID={testID ? `${testID}-item-${item.value}` : undefined}
                >
                  {itemContent}
                </LinkComponent>
              );
            }

            return (
              <TouchableOpacity
                key={item.value}
                style={[itemStyle, isActive && activeItemStyle]}
                onPress={() => {
                  item.onPress?.();
                  onValueChange?.(item.value);
                }}
                disabled={item.disabled}
                activeOpacity={0.7}
                testID={testID ? `${testID}-item-${item.value}` : undefined}
              >
                {itemContent}
              </TouchableOpacity>
            );
          })}
        </Stack>
      )}
    </View>
  );
};

export default NavigationMenu;
