// packages/expo/src/atomic/ContextMenu/index.tsx
/**
 * @fileoverview ContextMenu component
 * @description Context menu component (long press on mobile)
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Separator from '../Separator';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Context menu item type
 */
export interface ContextMenuItemType {
  label: string;
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

/**
 * ContextMenu component props interface
 */
export interface ContextMenuProps {
  /**
   * Trigger element
   */
  trigger: ReactNode;
  /**
   * Menu items
   */
  items?: ContextMenuItemType[];
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

/**
 * Context menu component (long press on mobile).
 *
 * @component
 * @example
 * ```tsx
 * <ContextMenu
 *   trigger={<View>Long press me</View>}
 *   items={[
 *     { label: 'Copy', onSelect: () => console.log('copy') },
 *     { label: 'Delete', onSelect: () => console.log('delete') }
 *   ]}
 * />
 * ```
 */
const ContextMenu = ({
  trigger,
  items = [],
  style,
  testID,
}: ContextMenuProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const menuStyle: ViewStyle = {
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radius.floating,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 200,
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleLongPress = (event: any) => {
    setPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setIsOpen(true);
  };

  return (
    <View style={style} testID={testID}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {trigger}
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        testID={testID ? `${testID}-modal` : undefined}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          testID={testID ? `${testID}-overlay` : undefined}
        >
          <View
            style={[
              menuStyle,
              {
                position: 'absolute',
                left: position.x - 100,
                top: position.y - 50,
              },
            ]}
            testID={testID ? `${testID}-menu` : undefined}
          >
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
                      setIsOpen(false);
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
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ContextMenu;
