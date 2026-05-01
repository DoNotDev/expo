// packages/expo/src/atomic/FeatureFallback/index.tsx
/**
 * @fileoverview FeatureFallback component
 * @description Component for graceful feature degradation
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Component } from 'react';
import { View, type ViewStyle } from 'react-native';

import Button from '../Button';
import Card from '../Card';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode, ComponentType, ErrorInfo } from 'react';

/**
 * FeatureFallback component props interface
 */
export interface FeatureFallbackProps {
  /**
   * Fallback content to show when feature is unavailable
   */
  children?: ReactNode;
  /**
   * Name of the unavailable feature
   */
  featureName?: string;
  /**
   * Custom message to display
   */
  message?: string;
  /**
   * Icon to display above the message
   */
  icon?: ReactNode;
  /**
   * Whether to show an action button
   * @default false
   */
  showActionButton?: boolean;
  /**
   * Action button text
   * @default 'Go Back'
   */
  actionButtonText?: string;
  /**
   * Additional help text below the message
   */
  helpText?: string;
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
 * Component for graceful feature degradation.
 *
 * @component
 * @example
 * ```tsx
 * <FeatureFallback>
 *   <Text>Feature not available</Text>
 * </FeatureFallback>
 * ```
 */
const FeatureFallback = ({
  children,
  featureName,
  message,
  icon,
  showActionButton = false,
  actionButtonText = 'Go Back',
  helpText,
  style,
  testID,
}: FeatureFallbackProps) => {
  // If children provided, render them directly (original behavior)
  if (children) {
    return (
      <View style={style} testID={testID}>
        {children}
      </View>
    );
  }

  // Render structured fallback card
  return (
    <View
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
      testID={testID}
    >
      <Card testID={testID ? `${testID}-card` : undefined}>
        <Stack gap={12} align="center">
          {icon && (
            <View testID={testID ? `${testID}-icon` : undefined}>{icon}</View>
          )}
          {featureName && (
            <Text
              level="h3"
              testID={testID ? `${testID}-feature-name` : undefined}
            >
              {featureName}
            </Text>
          )}
          {message && (
            <Text
              level="body"
              variant="muted"
              testID={testID ? `${testID}-message` : undefined}
            >
              {message}
            </Text>
          )}
          {helpText && (
            <Text
              level="caption"
              variant="muted"
              testID={testID ? `${testID}-help` : undefined}
            >
              {helpText}
            </Text>
          )}
          {showActionButton && (
            <Button
              variant="outline"
              testID={testID ? `${testID}-action` : undefined}
            >
              {actionButtonText}
            </Button>
          )}
        </Stack>
      </Card>
    </View>
  );
};

/**
 * ErrorBoundary that catches render errors and shows a fallback.
 */
class FeatureErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[FeatureErrorBoundary]', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return <FeatureFallback>{this.props.fallback}</FeatureFallback>;
    }
    return this.props.children;
  }
}

/**
 * HOC to wrap components with feature fallback via ErrorBoundary.
 * Catches React render errors that try/catch cannot.
 */
export const withFeatureFallback = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback: ReactNode
) => {
  const WithFeatureFallback = (props: P) => (
    <FeatureErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </FeatureErrorBoundary>
  );

  WithFeatureFallback.displayName = `withFeatureFallback(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithFeatureFallback;
};

export default FeatureFallback;
