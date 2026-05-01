// packages/expo/src/atomic/PortalButton/index.tsx
/**
 * @fileoverview PortalButton component
 * @description Button that opens content in a portal/modal
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Button, { type ButtonProps } from '../Button';

import type { ReactNode } from 'react';

/**
 * PortalButton component props interface
 */
export interface PortalButtonProps extends Omit<ButtonProps, 'onPress'> {
  /**
   * Content to show in portal/modal
   */
  portalContent: ReactNode;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Button type (for API parity with web)
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Form value attribute (for API parity with web)
   */
  value?: string;
}

const overlayStyle: ViewStyle = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

const contentStyle: ViewStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  maxWidth: '90%',
  maxHeight: '90%',
};

/**
 * Button that opens content in a portal/modal.
 *
 * @component
 * @example
 * ```tsx
 * <PortalButton portalContent={<Text>Portal content</Text>}>
 *   Open Portal
 * </PortalButton>
 * ```
 */
const PortalButton = ({
  portalContent,
  children,
  style,
  testID,
  ...buttonProps
}: PortalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        style={style}
        testID={testID}
        {...buttonProps}
      >
        {children}
      </Button>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        testID={testID ? `${testID}-modal` : undefined}
      >
        <TouchableOpacity
          style={overlayStyle}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          testID={testID ? `${testID}-overlay` : undefined}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={contentStyle}
            testID={testID ? `${testID}-content` : undefined}
          >
            {portalContent}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default PortalButton;
