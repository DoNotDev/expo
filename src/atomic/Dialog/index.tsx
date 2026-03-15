// packages/expo/src/atomic/Dialog/index.tsx
/**
 * @fileoverview Dialog component
 * @description Accessible modal dialog component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React, { useState, cloneElement, isValidElement } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { SURFACE_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

import type { ButtonVariant } from '../Button';
import type { ReactNode } from 'react';

/**
 * Content size type
 */
export type ContentSize = 'auto' | 'form' | 'text' | 'image' | 'code' | 'full';

/**
 * Dialog component props interface
 */
export interface DialogProps {
  /**
   * The element that opens the dialog
   */
  trigger?: ReactNode;
  /**
   * Dialog title
   */
  title?: string | ReactNode;
  /**
   * Dialog description
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
   * Content size
   * @default 'auto'
   */
  contentSize?: ContentSize;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: (typeof SURFACE_VARIANT)[keyof typeof SURFACE_VARIANT];
  /**
   * Structured action buttons for the dialog footer
   */
  actions?: {
    cancel?: { label: string; onClick?: () => void };
    confirm?: { label: string; onClick?: () => void; variant?: ButtonVariant };
  };
  /**
   * Footer actions (custom ReactNode)
   */
  footer?: ReactNode;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Label for the auto-rendered close button (shown when no footer/actions provided).
   * Localize this at the call site.
   * @default 'Close'
   */
  closeText?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const overlayStyle: ViewStyle = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

/** Size styles use % of screen width for mobile safety */
const getSizeStyle = (size: ContentSize, screenWidth: number): ViewStyle => {
  switch (size) {
    case 'form':
      return { width: Math.min(400, screenWidth * 0.9) };
    case 'text':
      return { width: Math.min(600, screenWidth * 0.9) };
    case 'image':
      return { width: Math.min(800, screenWidth * 0.95) };
    case 'code':
      return { width: Math.min(900, screenWidth * 0.95) };
    case 'full':
      return { width: '95%', height: '95%' };
    default:
      return { width: 'auto', maxWidth: '90%' };
  }
};

/**
 * Accessible modal dialog component.
 *
 * @component
 * @example
 * ```tsx
 * <Dialog
 *   trigger={<Button>Open Dialog</Button>}
 *   title="Confirm"
 *   description="Are you sure?"
 * >
 *   <Text>Dialog content</Text>
 * </Dialog>
 * ```
 */
const Dialog = ({
  trigger,
  title,
  description,
  children,
  open: controlledOpen,
  onOpenChange,
  contentSize = 'auto',
  variant = SURFACE_VARIANT.DEFAULT,
  actions,
  footer,
  style,
  closeText = 'Close',
  testID,
}: DialogProps) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
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

  const sizeStyle = getSizeStyle(contentSize, screenWidth);

  const dialogStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.surface,
    padding: theme.spacing.lg,
    maxHeight: '90%',
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  };

  return (
    <>
      {trigger &&
        (isValidElement(trigger) ? (
          cloneElement(trigger as React.ReactElement<any>, {
            onPress: handleOpen,
            testID: testID ? `${testID}-trigger` : undefined,
          })
        ) : (
          <TouchableOpacity
            onPress={handleOpen}
            testID={testID ? `${testID}-trigger` : undefined}
          >
            {trigger}
          </TouchableOpacity>
        ))}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        testID={testID}
      >
        <TouchableOpacity
          style={overlayStyle}
          activeOpacity={1}
          onPress={handleClose}
          testID={testID ? `${testID}-overlay` : undefined}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={mergeStyles(dialogStyle, sizeStyle, style)}
            testID={testID ? `${testID}-content` : undefined}
          >
            <Stack gap={16}>
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
              <View testID={testID ? `${testID}-body` : undefined}>
                {children}
              </View>
              {footer && (
                <View testID={testID ? `${testID}-footer` : undefined}>
                  {footer}
                </View>
              )}
              {!footer && actions && (
                <Stack
                  direction="row"
                  gap={12}
                  justify="flex-end"
                  testID={testID ? `${testID}-actions` : undefined}
                >
                  {actions.cancel && (
                    <Button
                      variant="outline"
                      onPress={() => {
                        actions.cancel?.onClick?.();
                        handleClose();
                      }}
                      testID={testID ? `${testID}-cancel` : undefined}
                    >
                      {actions.cancel.label}
                    </Button>
                  )}
                  {actions.confirm && (
                    <Button
                      variant={actions.confirm.variant || 'default'}
                      onPress={() => {
                        actions.confirm?.onClick?.();
                        handleClose();
                      }}
                      testID={testID ? `${testID}-confirm` : undefined}
                    >
                      {actions.confirm.label}
                    </Button>
                  )}
                </Stack>
              )}
              {!footer && !actions && (
                <Button
                  variant="outline"
                  onPress={handleClose}
                  testID={testID ? `${testID}-close` : undefined}
                >
                  {closeText}
                </Button>
              )}
            </Stack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Dialog;
