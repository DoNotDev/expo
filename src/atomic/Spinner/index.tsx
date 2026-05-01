// packages/expo/src/atomic/Spinner/index.tsx
/**
 * @fileoverview Spinner component
 * @description Spinner component for loading states with inline and overlay modes
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  ActivityIndicator,
  View,
  type ViewStyle,
  type ColorValue,
} from 'react-native';

import { useTheme } from '../../theme';
import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';

/**
 * Spinner component props interface
 */
export interface SpinnerProps {
  /**
   * If true, renders as full-page overlay with backdrop. If false/undefined, renders inline (default).
   * @default false
   */
  overlay?: boolean;
  /**
   * Color variant - theme color for spinner
   * @default 'primary'
   */
  variant?: (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT];
  /**
   * Size of the spinner
   * @default 'small'
   */
  size?: 'small' | 'large';
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
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

/**
 * Spinner component for loading states.
 *
 * @component
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner variant="primary" size="large" />
 * <Spinner overlay />
 * ```
 */
const Spinner = ({
  overlay = false,
  variant = THEME_VARIANT.PRIMARY,
  size = 'small',
  style,
  testID,
}: SpinnerProps) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const variantColors: Record<string, ColorValue> = {
    default: c.mutedForeground,
    muted: c.mutedForeground,
    primary: c.primary,
    secondary: c.secondary,
    accent: c.accent,
    success: c.success,
    warning: c.warning,
    destructive: c.destructive,
  };
  const color = variantColors[variant] || variantColors.primary;

  if (overlay) {
    return (
      <View style={mergeStyles(overlayStyle, style)} testID={testID}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={style}
      testID={testID}
    />
  );
};

export default Spinner;
