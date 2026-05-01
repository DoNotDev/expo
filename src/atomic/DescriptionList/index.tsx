// packages/expo/src/atomic/DescriptionList/index.tsx
/**
 * @fileoverview DescriptionList component
 * @description Semantic description list for key-value pairs
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Description item interface
 */
export interface DescriptionItem {
  /** Term/label */
  label: string;
  /** Definition/value */
  value: ReactNode;
}

/**
 * DescriptionList component props interface
 */
export interface DescriptionListProps {
  /**
   * Array of term/definition pairs
   */
  items?: DescriptionItem[];
  /**
   * Alternative content (replaces items array rendering)
   */
  children?: ReactNode;
  /**
   * Layout orientation
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const itemBaseStyle: ViewStyle = {
  paddingVertical: 8,
  borderBottomWidth: 1,
};

const horizontalItemStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

/**
 * DescriptionList component for key-value pairs.
 *
 * @component
 * @example
 * ```tsx
 * <DescriptionList items={[
 *   { label: 'Email', value: user.email },
 *   { label: 'Plan', value: 'Pro' }
 * ]} />
 * ```
 */
const DescriptionList = ({
  items,
  children,
  orientation = 'vertical',
  style,
  testID,
}: DescriptionListProps) => {
  const { theme } = useTheme();
  const itemBorderStyle: ViewStyle = { borderBottomColor: theme.colors.border };
  if (children) {
    return (
      <View style={style} testID={testID}>
        {children}
      </View>
    );
  }

  if (!items) return null;

  return (
    <View style={style} testID={testID}>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            itemBaseStyle,
            itemBorderStyle,
            orientation === 'horizontal' && horizontalItemStyle,
            index === items.length - 1 && { borderBottomWidth: 0 },
          ]}
          testID={testID ? `${testID}-item-${index}` : undefined}
        >
          <Text
            level="body"
            variant="muted"
            testID={testID ? `${testID}-label-${index}` : undefined}
          >
            {item.label}
          </Text>
          <View
            style={
              orientation === 'horizontal' && {
                flex: 1,
                alignItems: 'flex-end',
              }
            }
          >
            {typeof item.value === 'string' ? (
              <Text
                level="body"
                testID={testID ? `${testID}-value-${index}` : undefined}
              >
                {item.value}
              </Text>
            ) : (
              item.value
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default DescriptionList;
