// packages/expo/src/atomic/Slot/index.tsx
/**
 * @fileoverview Slot component
 * @description Polymorphic component for composition
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewProps } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

import type { ReactNode } from 'react';

/**
 * Slot component props interface
 */
export interface SlotProps extends ViewProps {
  /**
   * Slot children
   */
  children: ReactNode;
}

/**
 * Polymorphic component for composition.
 * Merges styles and props with children.
 *
 * @component
 */
const Slot = ({ children, style, ...props }: SlotProps) => {
  if (
    typeof children === 'object' &&
    children !== null &&
    'props' in children
  ) {
    const childProps = (children as any).props || {};
    const mergedStyle = mergeStyles(
      childProps.style,
      StyleSheet.flatten(style)
    );
    return {
      ...children,
      props: {
        ...childProps,
        ...props,
        style: mergedStyle,
      },
    };
  }

  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export default Slot;
