// packages/expo/src/atomic/Sheet/index.tsx
/**
 * @fileoverview Sheet component
 * @description Accessible sheet (slide-out) component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { SURFACE_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

import type { Theme } from '../../theme';
import type { ReactNode } from 'react';

/**
 * Sheet variant constants
 */
export const SHEET_VARIANT = SURFACE_VARIANT;

export type SheetVariant =
  (typeof SURFACE_VARIANT)[keyof typeof SURFACE_VARIANT];

/**
 * Sheet component props interface
 */
export interface SheetProps {
  /**
   * The element that opens the sheet
   */
  trigger?: ReactNode;
  /**
   * The title of the sheet
   */
  title?: string | ReactNode;
  /**
   * The description of the sheet
   */
  description?: string | ReactNode;
  /**
   * Main content
   */
  children?: ReactNode;
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether to show the overlay
   * @default true
   */
  showOverlay?: boolean;
  /**
   * The side of the screen the sheet slides from
   * @default 'right'
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Footer content (pinned at bottom)
   */
  footer?: ReactNode;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: SheetVariant;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Label for the close button
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const overlayStyle: ViewStyle = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const getSheetStyle = (
  side: 'top' | 'bottom' | 'left' | 'right',
  colors: Theme['colors'],
  r: number,
  spacing: number
): ViewStyle => {
  const baseStyle: ViewStyle = {
    backgroundColor: colors.card,
    padding: spacing,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  };

  switch (side) {
    case 'top':
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: r,
        borderBottomRightRadius: r,
      };
    case 'bottom':
      return {
        ...baseStyle,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: r,
        borderTopRightRadius: r,
      };
    case 'left':
      return {
        ...baseStyle,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80%',
        borderTopRightRadius: r,
        borderBottomRightRadius: r,
      };
    case 'right':
    default:
      return {
        ...baseStyle,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '80%',
        borderTopLeftRadius: r,
        borderBottomLeftRadius: r,
      };
  }
};

/**
 * Accessible sheet (slide-out) component.
 *
 * @component
 * @example
 * ```tsx
 * <Sheet
 *   trigger={<Button>Open Menu</Button>}
 *   title="Navigation"
 *   side="left"
 * >
 *   <Text>Sheet content</Text>
 * </Sheet>
 * ```
 */
const Sheet = ({
  trigger,
  title,
  description,
  children,
  open: controlledOpen,
  onOpenChange,
  side = 'right',
  showOverlay = true,
  footer,
  variant = SURFACE_VARIANT.DEFAULT,
  closeLabel = 'Close',
  style,
  testID,
}: SheetProps) => {
  const { theme } = useTheme();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpen = () => {
    if (!isControlled) setInternalOpen(true);
    onOpenChange?.(true);
  };

  const handleClose = () => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  };

  const sheetStyle = getSheetStyle(
    side,
    theme.colors,
    theme.radius.surface,
    theme.spacing.lg
  );

  return (
    <>
      {trigger && (
        <TouchableOpacity
          onPress={handleOpen}
          testID={testID ? `${testID}-trigger` : undefined}
        >
          {trigger}
        </TouchableOpacity>
      )}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        testID={testID}
      >
        <View
          style={overlayStyle}
          testID={testID ? `${testID}-overlay` : undefined}
        >
          {showOverlay && (
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleClose}
              testID={testID ? `${testID}-overlay-touch` : undefined}
            />
          )}
          <View
            style={mergeStyles(sheetStyle, style)}
            testID={testID ? `${testID}-content` : undefined}
          >
            <Stack gap={16} style={{ flex: 1 }}>
              {(title || description) && (
                <Stack gap={4} testID={testID ? `${testID}-header` : undefined}>
                  {title && (
                    <Text
                      level="h3"
                      testID={testID ? `${testID}-title` : undefined}
                    >
                      {title}
                    </Text>
                  )}
                  {description && (
                    <Text
                      level="body"
                      variant="muted"
                      testID={testID ? `${testID}-description` : undefined}
                    >
                      {description}
                    </Text>
                  )}
                </Stack>
              )}
              <View
                style={{ flex: 1 }}
                testID={testID ? `${testID}-body` : undefined}
              >
                {children}
              </View>
              {footer && (
                <View testID={testID ? `${testID}-footer` : undefined}>
                  {footer}
                </View>
              )}
              {!footer && (
                <Button
                  variant="outline"
                  onPress={handleClose}
                  testID={testID ? `${testID}-close` : undefined}
                >
                  {closeLabel}
                </Button>
              )}
            </Stack>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Sheet;
