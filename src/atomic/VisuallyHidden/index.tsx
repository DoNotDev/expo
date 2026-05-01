// packages/expo/src/atomic/VisuallyHidden/index.tsx
/**
 * @fileoverview VisuallyHidden component
 * @description Component that hides content visually but keeps it accessible to screen readers
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, StyleSheet, type ViewProps } from 'react-native';

import type { ReactNode } from 'react';

/**
 * VisuallyHidden component props interface
 */
export interface VisuallyHiddenProps extends ViewProps {
  /**
   * Hidden content
   */
  children: ReactNode;
}

const hiddenStyle = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    borderWidth: 0,
  },
});

/**
 * Component that hides content visually but keeps it accessible to screen readers.
 *
 * @component
 * @example
 * ```tsx
 * <VisuallyHidden>
 *   <Text>Screen reader only text</Text>
 * </VisuallyHidden>
 * ```
 */
const VisuallyHidden = ({ children, style, ...props }: VisuallyHiddenProps) => {
  return (
    <View style={[hiddenStyle.hidden, style]} {...props}>
      {children}
    </View>
  );
};

export default VisuallyHidden;
