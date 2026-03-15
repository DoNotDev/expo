// packages/expo/src/atomic/Tooltip/index.tsx
/**
 * @fileoverview Tooltip component
 * @description Accessible tooltip component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { FLOATING_VARIANT } from '../../utils/constants';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Tooltip component props interface
 */
export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: string | ReactNode;
  /**
   * Trigger element
   */
  children: ReactNode;
  /**
   * Tooltip position
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Variant style
   * @default 'default'
   */
  variant?: (typeof FLOATING_VARIANT)[keyof typeof FLOATING_VARIANT];
  /**
   * Tooltip alignment relative to trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

// tooltipStyle is built dynamically via useTheme() — see component body

const getTooltipPosition = (
  side: 'top' | 'right' | 'bottom' | 'left'
): ViewStyle => {
  switch (side) {
    case 'top':
      return { bottom: '100%', marginBottom: 4 };
    case 'right':
      return { left: '100%', marginLeft: 4 };
    case 'bottom':
      return { top: '100%', marginTop: 4 };
    case 'left':
      return { right: '100%', marginRight: 4 };
  }
};

/**
 * Accessible tooltip component.
 * Note: On React Native, tooltips are simpler and may use long-press or show on press.
 *
 * @component
 * @example
 * ```tsx
 * <Tooltip content="Help text">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
const Tooltip = ({
  content,
  children,
  side = 'bottom',
  align = 'center',
  variant = FLOATING_VARIANT.DEFAULT,
  style,
  testID,
}: TooltipProps) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const tooltipStyle: ViewStyle = {
    backgroundColor: theme.colors.foreground,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.floating || 6,
    position: 'absolute',
    zIndex: theme.zIndex.tooltip,
  };

  // On mobile, show tooltip on long press
  return (
    <View style={style} testID={testID}>
      <TouchableOpacity
        onLongPress={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        activeOpacity={0.7}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {children}
      </TouchableOpacity>
      {visible && (
        <View
          style={[
            tooltipStyle,
            getTooltipPosition(side),
            align === 'start' && { alignSelf: 'flex-start' },
            align === 'end' && { alignSelf: 'flex-end' },
            align === 'center' && { alignSelf: 'center' },
          ]}
          testID={testID ? `${testID}-content` : undefined}
        >
          {typeof content === 'string' ? (
            <Text level="caption" style={{ color: theme.colors.background }}>
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
      )}
    </View>
  );
};

/**
 * TooltipProvider - No-op on React Native
 */
export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Tooltip;
