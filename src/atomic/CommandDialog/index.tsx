// packages/expo/src/atomic/CommandDialog/index.tsx
/**
 * @fileoverview CommandDialog component
 * @description Command palette in a dialog
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, createContext, useContext } from 'react';
import { View } from 'react-native';

import Command, { type CommandProps } from '../Command';
import Dialog from '../Dialog';

import type { ReactNode } from 'react';

/**
 * Command dialog context
 */
const CommandDialogContext = createContext<{
  close: () => void;
} | null>(null);

/**
 * Hook to close command dialog
 */
export const useCommandDialogClose = () => {
  const context = useContext(CommandDialogContext);
  return context?.close || (() => {});
};

/**
 * CommandDialog component props interface
 */
export interface CommandDialogProps extends Omit<CommandProps, 'onClose'> {
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Trigger element
   */
  trigger?: React.ReactNode;
  /**
   * Dialog description text
   */
  description?: string;
  /**
   * Custom content override (replaces default Command rendering)
   */
  children?: ReactNode;
  /**
   * Footer content rendered below the command list
   */
  footer?: ReactNode;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Command palette in a dialog.
 *
 * @component
 * @example
 * ```tsx
 * <CommandDialog
 *   trigger={<Button>Open Command</Button>}
 *   groups={[{ heading: 'Actions', items: [{ label: 'Copy', onSelect: handleCopy }] }]}
 * />
 * ```
 */
const CommandDialog = ({
  open: controlledOpen,
  onOpenChange,
  trigger,
  description,
  children,
  footer,
  testID,
  ...commandProps
}: CommandDialogProps) => {
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

  return (
    <CommandDialogContext.Provider value={{ close: handleClose }}>
      <Dialog
        trigger={trigger}
        open={open}
        onOpenChange={onOpenChange}
        title="Command Palette"
        description={description}
        testID={testID}
      >
        {children || (
          <Command
            {...commandProps}
            onClose={handleClose}
            testID={testID ? `${testID}-command` : undefined}
          />
        )}
        {footer && (
          <View testID={testID ? `${testID}-footer` : undefined}>{footer}</View>
        )}
      </Dialog>
    </CommandDialogContext.Provider>
  );
};

export default CommandDialog;
