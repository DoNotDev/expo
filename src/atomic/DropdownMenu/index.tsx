// packages/expo/src/atomic/DropdownMenu/index.tsx
/**
 * @fileoverview DropdownMenu component
 * @description Dropdown menu component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Separator from '../Separator';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Dropdown menu item data interface
 */
export interface DropdownMenuItemData {
  label: string;
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

/**
 * DropdownMenu component props interface
 */
export interface DropdownMenuProps {
  /**
   * Trigger element
   */
  trigger?: ReactNode;
  /**
   * Trigger content (alternative to trigger prop)
   */
  children?: ReactNode;
  /**
   * Menu items
   */
  items?: DropdownMenuItemData[];
  /**
   * Menu content (alternative to items)
   */
  content?: ReactNode;
  /**
   * Width of the dropdown content
   */
  contentWidth?: number | string;
  /**
   * Alignment of the dropdown content relative to trigger
   * @default 'start'
   */
  contentAlign?: 'start' | 'center' | 'end';
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const menuBaseStyle: ViewStyle = {
  borderRadius: 8,
  borderWidth: 1,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  minWidth: 200,
};

const itemStyle: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
};

/**
 * Dropdown menu component.
 *
 * @component
 * @example
 * ```tsx
 * <DropdownMenu
 *   trigger={<Button>Menu</Button>}
 *   items={[
 *     { label: 'Item 1', onSelect: () => console.log('1') },
 *     { label: 'Item 2', onSelect: () => console.log('2') }
 *   ]}
 * />
 * ```
 */
const DropdownMenu = ({
  trigger,
  children,
  items = [],
  content,
  contentWidth,
  contentAlign = 'start',
  open: controlledOpen,
  onOpenChange,
  style,
  testID,
}: DropdownMenuProps) => {
  const { theme } = useTheme();
  const menuStyle: ViewStyle = {
    ...menuBaseStyle,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.foreground,
  };
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleClose = () => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  };

  const triggerContent = trigger || children;

  const alignStyle: ViewStyle =
    contentAlign === 'end'
      ? { alignSelf: 'flex-end' }
      : contentAlign === 'center'
        ? { alignSelf: 'center' }
        : { alignSelf: 'flex-start' };

  const widthStyle: ViewStyle = contentWidth
    ? { width: contentWidth as number, minWidth: undefined }
    : {};

  return (
    <View style={style} testID={testID}>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {triggerContent}
      </TouchableOpacity>
      {isOpen && (
        <View
          style={mergeStyles(menuStyle, alignStyle, widthStyle)}
          testID={testID ? `${testID}-menu` : undefined}
        >
          <ScrollView>
            {content || (
              <Stack gap={0}>
                {items.map((item, index) => {
                  if (item.separator) {
                    return (
                      <Separator
                        key={`separator-${index}`}
                        testID={
                          testID ? `${testID}-separator-${index}` : undefined
                        }
                      />
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={item.value || item.label}
                      style={itemStyle}
                      onPress={() => {
                        item.onSelect?.();
                        handleClose();
                      }}
                      disabled={item.disabled}
                      activeOpacity={0.7}
                      testID={testID ? `${testID}-item-${index}` : undefined}
                    >
                      {item.icon}
                      <Text
                        level="body"
                        style={item.disabled ? { opacity: 0.5 } : undefined}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Stack>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
