// packages/expo/src/atomic/Label/index.tsx
/**
 * @fileoverview Label component
 * @description Accessible label component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type TextStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Label component props interface
 */
export interface LabelProps {
  /**
   * Label text
   */
  children: ReactNode;
  /**
   * Icon rendered alongside the label text
   */
  icon?: ReactNode;
  /**
   * Places icon after the label text instead of before
   * @default false
   */
  iconEnd?: boolean;
  /**
   * Removes bold/medium font weight when true
   * @default false
   */
  plain?: boolean;
  /**
   * Whether the field is required - shows asterisk indicator
   * @default false
   */
  required?: boolean;
  /**
   * Additional style
   */
  style?: TextStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const labelBaseStyle: TextStyle = {
  fontSize: 14,
  fontWeight: '500',
};

/**
 * Accessible label component.
 *
 * @component
 * @example
 * ```tsx
 * <Label>Email Address</Label>
 * <Label required>Password</Label>
 * ```
 */
const plainStyle: TextStyle = {
  fontWeight: '400',
};

const Label = ({
  children,
  icon,
  iconEnd = false,
  plain = false,
  required = false,
  style,
  testID,
}: LabelProps) => {
  const { theme } = useTheme();

  const labelColorStyle: TextStyle = { color: theme.colors.foreground };

  return (
    <Stack direction="row" align="center" gap={4} testID={testID}>
      {icon && !iconEnd && (
        <View testID={testID ? `${testID}-icon` : undefined}>{icon}</View>
      )}
      <Text
        level="small"
        style={mergeStyles(
          labelBaseStyle,
          labelColorStyle,
          plain && plainStyle,
          style
        )}
      >
        {children}
      </Text>
      {icon && iconEnd && (
        <View testID={testID ? `${testID}-icon` : undefined}>{icon}</View>
      )}
      {required && (
        <Text
          level="small"
          variant="destructive"
          testID={testID ? `${testID}-required` : undefined}
        >
          *
        </Text>
      )}
    </Stack>
  );
};

export default Label;
