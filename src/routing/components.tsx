// packages/expo/src/routing/components.tsx
/**
 * @fileoverview Expo Router routing components
 * @description Link and Navigate components for Expo Router
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Link as ExpoLink, Redirect as ExpoRedirect } from 'expo-router';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import type { ReactNode } from 'react';

/**
 * Link component for Expo Router
 */
export function Link({
  to,
  children,
  replace,
  ...props
}: {
  to: string;
  children: ReactNode;
  replace?: boolean;
} & TouchableOpacityProps) {
  return (
    <ExpoLink href={to as any} replace={replace} asChild>
      <TouchableOpacity {...props}>{children}</TouchableOpacity>
    </ExpoLink>
  );
}

/**
 * Navigate component — declarative navigation using expo-router's Redirect
 */
export function Navigate({ to }: { to: string }) {
  return <ExpoRedirect href={to as any} />;
}
