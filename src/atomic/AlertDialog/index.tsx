// packages/expo/src/atomic/AlertDialog/index.tsx
/**
 * @fileoverview AlertDialog component
 * @description Accessible alert dialog component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * AlertDialog component props interface
 */
export interface AlertDialogProps {
  /**
   * The element that triggers the dialog to open
   */
  trigger?: ReactNode;
  /**
   * The title of the alert dialog
   */
  title: ReactNode;
  /**
   * The description content of the alert dialog
   */
  description?: ReactNode;
  /**
   * Text for the cancel button
   * @default 'Cancel'
   */
  cancelLabel?: string;
  /**
   * Text for the action/confirm button (alias for actionLabel)
   * @default 'Confirm'
   */
  confirmLabel?: string;
  /**
   * Text for the action button
   * @default 'Confirm'
   */
  actionLabel?: string;
  /**
   * Cancel button handler
   */
  onCancel?: () => void;
  /**
   * Action button handler
   */
  onAction?: () => void;
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

const overlayStyle: ViewStyle = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

const dialogBaseStyle: ViewStyle = {
  borderRadius: 12,
  padding: 24,
  maxWidth: '90%',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
};

/**
 * Accessible alert dialog component.
 *
 * @component
 * @example
 * ```tsx
 * <AlertDialog
 *   trigger={<Button>Delete</Button>}
 *   title="Are you sure?"
 *   description="This action cannot be undone."
 *   onAction={handleDelete}
 * />
 * ```
 */
const AlertDialog = ({
  trigger,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel,
  actionLabel = 'Confirm',
  onCancel,
  onAction,
  open: controlledOpen,
  onOpenChange,
  style,
  testID,
}: AlertDialogProps) => {
  const { theme } = useTheme();
  const dialogStyle: ViewStyle = {
    ...dialogBaseStyle,
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.foreground,
  };

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

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

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
            style={mergeStyles(dialogStyle, style)}
            testID={testID ? `${testID}-content` : undefined}
          >
            <Stack gap={16}>
              <Stack gap={4} testID={testID ? `${testID}-header` : undefined}>
                <Text
                  level="h3"
                  testID={testID ? `${testID}-title` : undefined}
                >
                  {title}
                </Text>
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
              <Stack
                direction="row"
                gap={8}
                justify="flex-end"
                testID={testID ? `${testID}-footer` : undefined}
              >
                <Button
                  variant="outline"
                  onPress={handleCancel}
                  testID={testID ? `${testID}-cancel` : undefined}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant="destructive"
                  onPress={handleAction}
                  testID={testID ? `${testID}-action` : undefined}
                >
                  {confirmLabel || actionLabel}
                </Button>
              </Stack>
            </Stack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AlertDialog;
