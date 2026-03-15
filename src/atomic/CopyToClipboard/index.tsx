// packages/expo/src/atomic/CopyToClipboard/index.tsx
/**
 * @fileoverview CopyToClipboard component
 * @description Component for copying text to clipboard with visual feedback
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Button, { type ButtonProps } from '../Button';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * CopyToClipboard component props interface
 */
export interface CopyToClipboardProps extends Omit<
  ButtonProps,
  'children' | 'onPress'
> {
  /**
   * Text to copy to clipboard
   */
  text: string;
  /**
   * Custom copy button content
   */
  children?: React.ReactNode;
  /**
   * Callback when copy is successful
   */
  onCopy?: (text: string) => void;
  /**
   * Tooltip text when not copied
   * @default 'Copy to clipboard'
   */
  tooltipText?: string;
  /**
   * Tooltip text when copied
   * @default 'Copied!'
   */
  copiedTooltipText?: string;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * ARIA label (for API parity with web)
   */
  ariaLabel?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Form type attribute (for API parity with web)
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Form value attribute (for API parity with web)
   */
  value?: string;
  /**
   * Icon prop (expo-only, for API parity)
   */
  icon?: ReactNode;
}

/**
 * Component for copying text to clipboard with visual feedback.
 *
 * @component
 * @example
 * ```tsx
 * <CopyToClipboard text="Hello World" />
 * ```
 */
const CopyToClipboard = ({
  text,
  children,
  variant = 'ghost',
  onCopy,
  tooltipText = 'Copy to clipboard',
  copiedTooltipText = 'Copied!',
  style,
  testID,
  ...buttonProps
}: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      onCopy?.(text);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (__DEV__) console.error('Failed to copy text:', error);
    }
  };

  return (
    <Button
      variant={variant}
      onPress={handleCopy}
      style={style}
      testID={testID}
      {...buttonProps}
    >
      {children || (
        <Text level="body">{copied ? copiedTooltipText : tooltipText}</Text>
      )}
    </Button>
  );
};

export default CopyToClipboard;
