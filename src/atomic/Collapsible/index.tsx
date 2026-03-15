// packages/expo/src/atomic/Collapsible/index.tsx
/**
 * @fileoverview Collapsible component
 * @description Interactive component for expanding/collapsing content
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Collapsible component props interface
 */
export interface CollapsibleProps {
  /** Trigger element (button, text, etc.) */
  trigger?: ReactNode;
  /** Collapsible content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Whether the collapsible is disabled */
  disabled?: boolean;
  /**
   * Show icon indicator
   * @default false
   */
  showIcon?: boolean;
  /**
   * Icon style: 'plus-minus' or 'chevron'
   * @default 'plus-minus'
   */
  iconStyle?: 'plus-minus' | 'chevron';
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

const collapsibleStyle: ViewStyle = {
  overflow: 'hidden',
};

const contentStyle: ViewStyle = {
  paddingTop: 8,
};

/**
 * Accessible collapsible component.
 * Expands and collapses content.
 *
 * @component
 * @example
 * ```tsx
 * <Collapsible trigger={<Button>Toggle details</Button>}>
 *   <Text>Hidden content here</Text>
 * </Collapsible>
 * ```
 */
const Collapsible = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  disabled = false,
  showIcon = false,
  iconStyle = 'plus-minus',
  style,
  testID,
}: CollapsibleProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (disabled) return;
    const newOpen = !open;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const icon = showIcon
    ? iconStyle === 'plus-minus'
      ? open
        ? '−'
        : '+'
      : open
        ? '▼'
        : '▶'
    : null;

  return (
    <View style={mergeStyles(collapsibleStyle, style)} testID={testID}>
      <TouchableOpacity
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <Stack direction="row" align="center" gap={8}>
          {trigger}
          {icon && (
            <Text
              level="body"
              variant="muted"
              testID={testID ? `${testID}-icon` : undefined}
            >
              {icon}
            </Text>
          )}
        </Stack>
      </TouchableOpacity>
      {open && (
        <View
          style={contentStyle}
          testID={testID ? `${testID}-content` : undefined}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default Collapsible;
