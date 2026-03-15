// packages/expo/src/atomic/Switch/index.tsx
/**
 * @fileoverview Switch component
 * @description Accessible switch/toggle control with semantic color variants
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Switch as RNSwitch, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { CONTROL_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Switch component props interface
 */
export interface SwitchProps {
  /**
   * Whether switch is checked
   */
  checked?: boolean;
  /**
   * Whether switch is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Semantic color variant (affects track color when checked)
   * @default 'default'
   */
  variant?: (typeof CONTROL_VARIANT)[keyof typeof CONTROL_VARIANT];
  /**
   * Change handler
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Optional label text
   */
  label?: ReactNode;
  /**
   * Label shown when switch is unchecked
   */
  uncheckedLabel?: string;
  /**
   * Label shown when switch is checked
   */
  checkedLabel?: string;
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  /**
   * Label content (rendered after the switch)
   */
  children?: ReactNode;
  /**
   * Additional container style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Form name attribute (for API parity with web)
   */
  name?: string;
  /**
   * Form type attribute (for API parity with web)
   */
  type?: string;
  /**
   * Form value attribute (for API parity with web)
   */
  value?: string;
}

/**
 * Returns theme-driven variant colors for Switch track.
 */
function useSwitchVariantColors() {
  const { theme } = useTheme();
  const c = theme.colors;

  return {
    default: { true: c.primary, false: c.border },
    primary: { true: c.primary, false: c.border },
    secondary: { true: c.secondary, false: c.border },
    accent: { true: c.accent, false: c.border },
    success: { true: c.success, false: c.border },
    warning: { true: c.warning, false: c.border },
    destructive: { true: c.destructive, false: c.border },
    muted: { true: c.mutedForeground, false: c.border },
  } as Record<string, { true: string; false: string }>;
}

/**
 * Accessible switch/toggle control with semantic color variants.
 *
 * @component
 * @example
 * ```tsx
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch checked={notifications} onCheckedChange={setNotifications} label="Enable notifications" />
 * ```
 */
const Switch = ({
  checked = false,
  disabled = false,
  variant = CONTROL_VARIANT.DEFAULT,
  onCheckedChange,
  label,
  uncheckedLabel,
  checkedLabel,
  required = false,
  children,
  style,
  testID,
}: SwitchProps) => {
  const { theme } = useTheme();
  const variantColors = useSwitchVariantColors();
  const colors = (variantColors[variant] ?? variantColors.default)!;

  const switchElement = (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{ false: colors.false, true: colors.true }}
      thumbColor={theme.colors.background}
      ios_backgroundColor={colors.false}
      style={style}
      testID={testID}
    />
  );

  const hasWrapper = label || uncheckedLabel || checkedLabel || children;

  if (hasWrapper) {
    return (
      <Stack
        direction="row"
        align="center"
        gap={8}
        style={style}
        testID={testID ? `${testID}-container` : undefined}
      >
        {uncheckedLabel && !checked && (
          <Text
            level="small"
            variant="muted"
            testID={testID ? `${testID}-unchecked-label` : undefined}
          >
            {uncheckedLabel}
          </Text>
        )}
        {label && (
          <Text level="body" testID={testID ? `${testID}-label` : undefined}>
            {label}
          </Text>
        )}
        {switchElement}
        {checkedLabel && checked && (
          <Text
            level="small"
            variant="muted"
            testID={testID ? `${testID}-checked-label` : undefined}
          >
            {checkedLabel}
          </Text>
        )}
        {children}
      </Stack>
    );
  }

  return switchElement;
};

export default Switch;
