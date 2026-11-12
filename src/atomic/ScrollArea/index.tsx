// packages/expo/src/atomic/ScrollArea/index.tsx
/**
 * @fileoverview ScrollArea component
 * @description Scrollable area component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { ScrollView, type ScrollViewProps, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';

/**
 * ScrollArea component props interface
 */
export interface ScrollAreaProps extends ScrollViewProps {
  /**
   * Show horizontal scroll indicator
   */
  showHorizontal?: boolean;
  /**
   * Show vertical scroll indicator
   */
  showVertical?: boolean;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * End prop (for API parity with web)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: exported signature; narrowing it is a breaking change for importers (deferred to a major, any-audit 2026-11-11)
  end?: any;
  /**
   * Type prop (for API parity with web)
   */
  type?: string;
}

/**
 * Scrollable area component.
 * Wrapper around ScrollView for consistency.
 *
 * @component
 * @example
 * ```tsx
 * <ScrollArea>
 *   <Text>Long content...</Text>
 * </ScrollArea>
 * ```
 */
const ScrollArea = ({
  children,
  showHorizontal,
  showVertical,
  style,
  testID,
  ...scrollViewProps
}: ScrollAreaProps) => {
  return (
    <ScrollView
      style={mergeStyles({ flex: 1 }, style)}
      testID={testID}
      showsHorizontalScrollIndicator={showHorizontal}
      showsVerticalScrollIndicator={showVertical}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
};

/**
 * ScrollBar component - No-op on React Native (handled by ScrollView)
 */
export const ScrollBar = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ScrollArea;
