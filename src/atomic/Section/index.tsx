// packages/expo/src/atomic/Section/index.tsx
/**
 * @fileoverview Section component
 * @description Layout section with title and optional separator
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Separator from '../Separator';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Section component props interface
 */
export interface SectionProps {
  /**
   * Section title
   */
  title?: string;
  /**
   * Section subtitle
   */
  subtitle?: string;
  /**
   * Section content
   */
  children: ReactNode;
  /**
   * Whether to show separator after title
   * @default false
   */
  showSeparator?: boolean;
  /**
   * Separator prop (alias for showSeparator, for API parity with web)
   */
  separator?: boolean;
  /**
   * Whether the section is collapsible
   * @default false
   */
  collapsible?: boolean;
  /**
   * Default collapsed state (only used when collapsible=true)
   * @default true
   */
  defaultCollapsed?: boolean;
  /**
   * Tone variant
   * @default 'default'
   */
  tone?: 'default' | 'primary' | 'accent' | 'muted';
  /**
   * Text alignment for title
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Controlled open state (inverse of collapsed)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Default open state (inverse of defaultCollapsed)
   */
  defaultOpen?: boolean;
  /**
   * Actions rendered in the header (right side)
   */
  actions?: ReactNode;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const sectionStyle: ViewStyle = {
  paddingVertical: 16,
};

/**
 * Layout section with title and optional separator.
 *
 * @component
 * @example
 * ```tsx
 * <Section title="Features">
 *   <Card />
 *   <Card />
 * </Section>
 * <Section title="Details" subtitle="More info" showSeparator>
 *   <Text>Content</Text>
 * </Section>
 * ```
 */
const alignMap = {
  start: 'flex-start' as const,
  center: 'center' as const,
  end: 'flex-end' as const,
};

const Section = ({
  title,
  subtitle,
  children,
  showSeparator = false,
  separator,
  collapsible = false,
  defaultCollapsed = true,
  tone = 'default',
  align,
  open,
  onOpenChange,
  defaultOpen,
  actions,
  style,
  testID,
}: SectionProps) => {
  // defaultOpen is inverse of defaultCollapsed
  const resolvedDefaultCollapsed =
    defaultOpen !== undefined ? !defaultOpen : defaultCollapsed;

  const [internalCollapsed, setInternalCollapsed] = useState(
    collapsible ? resolvedDefaultCollapsed : false
  );

  // Controlled mode: open prop takes precedence
  const isControlled = open !== undefined;
  const collapsed = isControlled ? !open : internalCollapsed;

  // separator prop is alias for showSeparator
  const shouldShowSeparator =
    separator !== undefined ? separator : showSeparator;

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    if (!isControlled) {
      setInternalCollapsed(newCollapsed);
    }
    onOpenChange?.(!newCollapsed);
  };

  const headerContent = (
    <Stack gap={4} testID={testID ? `${testID}-header` : undefined}>
      <Stack direction="row" align="center" justify="space-between">
        <Stack gap={4} style={{ flex: 1 }}>
          {title && (
            <Stack
              direction="row"
              align="center"
              gap={8}
              style={align ? { alignSelf: alignMap[align] } : undefined}
            >
              <Text level="h2" testID={testID ? `${testID}-title` : undefined}>
                {title}
              </Text>
              {collapsible && (
                <Text level="body" variant="muted">
                  {collapsed ? '▶' : '▼'}
                </Text>
              )}
            </Stack>
          )}
          {subtitle && (
            <Text
              level="small"
              variant="muted"
              testID={testID ? `${testID}-subtitle` : undefined}
            >
              {subtitle}
            </Text>
          )}
        </Stack>
        {actions && !collapsed && (
          <View testID={testID ? `${testID}-actions` : undefined}>
            {actions}
          </View>
        )}
      </Stack>
      {shouldShowSeparator && (
        <Separator testID={testID ? `${testID}-separator` : undefined} />
      )}
    </Stack>
  );

  return (
    <View style={mergeStyles(sectionStyle, style)} testID={testID}>
      <Stack gap={12}>
        {(title || subtitle || actions) &&
          (collapsible ? (
            <TouchableOpacity
              onPress={toggleCollapsed}
              activeOpacity={0.7}
              testID={testID ? `${testID}-toggle` : undefined}
            >
              {headerContent}
            </TouchableOpacity>
          ) : (
            headerContent
          ))}
        {!collapsed && (
          <View testID={testID ? `${testID}-content` : undefined}>
            {children}
          </View>
        )}
      </Stack>
    </View>
  );
};

export default Section;
