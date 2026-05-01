// packages/expo/src/atomic/Avatar/index.tsx
/**
 * @fileoverview Avatar component
 * @description Accessible avatar component with image and fallback support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useEffect } from 'react';
import { Image, View, type ViewStyle, type ImageStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Avatar component props interface
 */
export interface AvatarProps {
  /**
   * The URL of the avatar image
   */
  src?: string;
  /**
   * The initials or text to display when image fails to load
   */
  fallback: string;
  /**
   * Size of the avatar (in pixels)
   * @default 40
   */
  size?: number;
  /**
   * Custom content overlay (e.g. status badge)
   */
  children?: ReactNode;
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
 * Accessible avatar component with image and fallback support.
 *
 * @component
 * @example
 * ```tsx
 * <Avatar src="https://github.com/user.png" fallback="JD" />
 * <Avatar fallback="AB" size={60} />
 * ```
 */
const Avatar = ({
  src,
  fallback,
  size = 40,
  children,
  style,
  testID,
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const c = theme.colors;

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const showFallback = !src || imageError;

  const avatarStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: c.muted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const imageStyle: ImageStyle = {
    width: size,
    height: size,
  };

  const textStyle = {
    fontSize: size * 0.4,
    fontWeight: '600' as const,
    color: c.mutedForeground,
  };

  return (
    <View style={mergeStyles(avatarStyle, style)} testID={testID}>
      {src && !imageError ? (
        <Image
          source={{ uri: src }}
          style={imageStyle}
          onError={() => {
            setImageError(true);
          }}
          testID={testID ? `${testID}-image` : undefined}
        />
      ) : null}
      {showFallback && (
        <Text
          level="body"
          style={textStyle}
          testID={testID ? `${testID}-fallback` : undefined}
        >
          {fallback}
        </Text>
      )}
      {children}
    </View>
  );
};

export default Avatar;
