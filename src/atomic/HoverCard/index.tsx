// packages/expo/src/atomic/HoverCard/index.tsx
/**
 * @fileoverview HoverCard component
 * @description Hover card component (press on mobile)
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Popover from '../Popover';

import type { ReactNode } from 'react';

/**
 * HoverCard component props interface
 */
export interface HoverCardProps {
  /**
   * Trigger element
   */
  trigger?: ReactNode;
  /**
   * Trigger content (alternative to trigger prop)
   */
  children?: ReactNode;
  /**
   * Card content
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
   * Content alignment relative to trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Side to display the card
   * @default 'bottom'
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Offset from the trigger in pixels
   */
  sideOffset?: number;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Hover card component (press on mobile, hover on web).
 * Uses Popover on mobile.
 *
 * @component
 * @example
 * ```tsx
 * <HoverCard trigger={<Text>Hover me</Text>} content={<Text>Card content</Text>} />
 * ```
 */
const HoverCard = ({
  trigger,
  children,
  content,
  open,
  onOpenChange,
  align,
  side,
  sideOffset,
  style,
  testID,
}: HoverCardProps) => {
  return (
    <Popover
      trigger={trigger}
      content={content}
      open={open}
      onOpenChange={onOpenChange}
      align={align}
      side={side}
      sideOffset={sideOffset}
      style={style}
      testID={testID}
    >
      {children}
    </Popover>
  );
};

export default HoverCard;
