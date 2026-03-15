// packages/expo/src/atomic/Tag/index.tsx
/**
 * @fileoverview Tag component
 * @description Interactive tag component for categorization and filters
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  TouchableOpacity,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Tag variant constants
 */
export const TAG_VARIANT = {
  DEFAULT: 'default',
  OUTLINE: 'outline',
  ACCENT: 'accent',
} as const;

export type TagVariant = (typeof TAG_VARIANT)[keyof typeof TAG_VARIANT];

/**
 * Tag component props interface
 */
export interface TagProps {
  /**
   * Tag content
   */
  children: ReactNode;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: TagVariant;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the tag is interactive (clickable)
   * @default false
   */
  interactive?: boolean;
  /**
   * Callback when tag is clicked
   */
  onClick?: () => void;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Whether the tag is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const tagBaseStyle: ViewStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

const tagStyles = StyleSheet.create({
  default: {
    backgroundColor: '#f3f4f6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  accent: {
    backgroundColor: '#8b5cf6',
  },
});

const tagSizes = StyleSheet.create({
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

const tagTextStyles = StyleSheet.create({
  default: {
    color: '#111827',
  },
  outline: {
    color: '#111827',
  },
  accent: {
    color: '#ffffff',
  },
});

const disabledStyle: ViewStyle = {
  opacity: 0.5,
};

/**
 * Interactive tag component for categorization and filters.
 *
 * @component
 * @example
 * ```tsx
 * <Tag>React</Tag>
 * <Tag variant="outline" onRemove={() => console.log('removed')}>Filter</Tag>
 * <Tag variant="accent" interactive onClick={() => console.log('clicked')}>Click me</Tag>
 * ```
 */
const Tag = ({
  children,
  variant = TAG_VARIANT.DEFAULT,
  size = 'md',
  interactive = false,
  onClick,
  onRemove,
  disabled = false,
  style,
  testID,
}: TagProps) => {
  const variantStyle = tagStyles[variant];
  const sizeStyle = tagSizes[size];
  const textStyle = tagTextStyles[variant];

  const content = (
    <View
      style={mergeStyles(
        tagBaseStyle,
        variantStyle,
        sizeStyle,
        disabled && disabledStyle,
        style
      )}
      testID={testID}
    >
      <Text
        level="caption"
        style={textStyle}
        testID={testID ? `${testID}-text` : undefined}
      >
        {children}
      </Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          disabled={disabled}
          testID={testID ? `${testID}-remove` : undefined}
        >
          <Text level="caption" style={textStyle}>
            ×
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (interactive && onClick) {
    return (
      <TouchableOpacity
        onPress={onClick}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID ? `${testID}-button` : undefined}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Tag;
