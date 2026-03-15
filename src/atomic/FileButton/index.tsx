// packages/expo/src/atomic/FileButton/index.tsx
/**
 * @fileoverview FileButton component
 * @description Button for file input
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import * as DocumentPicker from 'expo-document-picker';
import { useRef } from 'react';
import { TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Button, { type ButtonProps } from '../Button';

import type { ReactNode } from 'react';

/**
 * FileButton component props interface
 */
export interface FileButtonProps extends Omit<ButtonProps, 'onPress'> {
  /**
   * Callback when file is selected
   */
  onFileSelect?: (file: {
    uri: string;
    name: string;
    type: string;
    size: number;
  }) => void;
  /**
   * Accepted file types (MIME types)
   */
  accept?: string[];
  /**
   * Multiple file selection
   * @default false
   */
  multiple?: boolean;
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
 * Button for file input.
 *
 * @component
 * @example
 * ```tsx
 * <FileButton onFileSelect={(file) => console.log(file)}>
 *   Choose File
 * </FileButton>
 * ```
 */
const FileButton = ({
  onFileSelect,
  accept,
  multiple = false,
  children,
  style,
  testID,
  ...buttonProps
}: FileButtonProps) => {
  const handlePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept?.join(','),
        multiple,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => {
          onFileSelect?.({
            uri: asset.uri,
            name: asset.name || 'file',
            type: asset.mimeType || 'application/octet-stream',
            size: asset.size || 0,
          });
        });
      }
    } catch (error) {
      if (__DEV__) console.error('File picker error:', error);
    }
  };

  return (
    <Button
      onPress={handlePress}
      style={style}
      testID={testID}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default FileButton;
