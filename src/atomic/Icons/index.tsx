// packages/expo/src/atomic/Icons/index.tsx
/**
 * @fileoverview Icon component for Expo
 * @description Uses @expo/vector-icons (bundled with Expo) for icon rendering.
 * Falls back to text when icon name is not recognized.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { MaterialIcons } from '@expo/vector-icons';
import { type TextStyle } from 'react-native';

import type { ReactNode } from 'react';

/**
 * Icon component props interface
 */
export interface IconProps {
  /**
   * MaterialIcons icon name (e.g. 'home', 'search', 'settings')
   */
  name?: string;
  /**
   * Icon size
   * @default 24
   */
  size?: number;
  /**
   * Icon color
   */
  color?: string;
  /**
   * Custom icon component (overrides name)
   */
  component?: ReactNode;
  /**
   * Additional style
   */
  style?: TextStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Icon component using @expo/vector-icons MaterialIcons.
 *
 * @component
 * @example
 * ```tsx
 * <Icon name="home" size={24} color="#000" />
 * <Icon name="search" size={20} color={theme.colors.primary} />
 * <Icon component={<CustomSvg />} />
 * ```
 */
const Icon = ({
  name,
  size = 24,
  color = '#111827',
  component,
  style,
  testID,
}: IconProps) => {
  if (component) {
    return <>{component}</>;
  }

  return (
    <MaterialIcons
      name={(name as keyof typeof MaterialIcons.glyphMap) || 'help-outline'}
      size={size}
      color={color}
      style={style}
      testID={testID}
    />
  );
};

export default Icon;
