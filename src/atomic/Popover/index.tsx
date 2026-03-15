// packages/expo/src/atomic/Popover/index.tsx
/**
 * @fileoverview Popover component
 * @description Accessible popover component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { FLOATING_VARIANT } from '../../utils/constants';

import type { ReactNode } from 'react';

/**
 * Popover variant constants
 */
export const POPOVER_VARIANT = FLOATING_VARIANT;

export type PopoverVariant =
  (typeof FLOATING_VARIANT)[keyof typeof FLOATING_VARIANT];

/**
 * Popover component props interface
 */
export interface PopoverProps {
  /**
   * The element that opens the popover
   */
  trigger?: ReactNode;
  /**
   * Trigger content (alternative to trigger prop)
   */
  children?: ReactNode;
  /**
   * Popover content
   */
  content: ReactNode;
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Popover side
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Content alignment relative to trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Offset from the trigger edge (in pixels)
   * @default 4
   */
  sideOffset?: number;
  /**
   * Whether the popover is modal (blocks interaction with rest of page)
   * @default false
   */
  modal?: boolean;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: PopoverVariant;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

// popoverStyle is built dynamically via useTheme() — see component body

/**
 * Accessible popover component.
 * On React Native, popovers are simpler and show on press.
 *
 * @component
 * @example
 * ```tsx
 * <Popover trigger={<Button>Open</Button>} content={<Text>Popover content</Text>} />
 * ```
 */
const Popover = ({
  trigger,
  children,
  content,
  open: controlledOpen,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  modal = false,
  variant = FLOATING_VARIANT.DEFAULT,
  style,
  testID,
}: PopoverProps) => {
  const { theme } = useTheme();
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const visible = isControlled ? controlledOpen : internalVisible;

  const handleToggle = () => {
    const next = !visible;
    if (!isControlled) setInternalVisible(next);
    onOpenChange?.(next);
  };

  const popoverStyle: ViewStyle = {
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radius.floating || theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    zIndex: theme.zIndex.dropdown,
    marginTop: side === 'bottom' ? sideOffset : 0,
    marginBottom: side === 'top' ? sideOffset : 0,
    marginLeft: side === 'right' ? sideOffset : 0,
    marginRight: side === 'left' ? sideOffset : 0,
    ...(align === 'start' && { alignSelf: 'flex-start' }),
    ...(align === 'end' && { alignSelf: 'flex-end' }),
    ...(align === 'center' && { alignSelf: 'center' }),
  };

  const triggerContent = trigger || children;

  return (
    <View style={style} testID={testID}>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {triggerContent}
      </TouchableOpacity>
      {visible && (
        <>
          {modal && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -9999,
                left: -9999,
                right: -9999,
                bottom: -9999,
              }}
              onPress={handleToggle}
              activeOpacity={1}
              testID={testID ? `${testID}-overlay` : undefined}
            />
          )}
          <View
            style={popoverStyle}
            testID={testID ? `${testID}-content` : undefined}
          >
            {content}
          </View>
        </>
      )}
    </View>
  );
};

export default Popover;
