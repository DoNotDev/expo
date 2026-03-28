// packages/expo/src/features/auth/components/FeatureGuard.tsx
/**
 * @fileoverview FeatureGuard component for Expo
 * @description Component-level feature access control
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { View, type ViewStyle } from 'react-native';

import type { UserRole, SubscriptionTier } from '@donotdev/core';
import { hasTierAccess } from '@donotdev/core';

import { Stack, Text } from '../../../atomic';
import { useAuthSafe } from '../../../utils/useAuthSafe';

import type { ReactNode, ComponentType } from 'react';

/** Props for the FeatureGuard component. */
export interface FeatureGuardProps {
  children: ReactNode;
  role?: UserRole | UserRole[];
  tier?: SubscriptionTier;
  subscription?: boolean;
  validate?: (role: UserRole, tier: SubscriptionTier) => boolean;
  fallback?: ComponentType<{
    requiredRole?: UserRole | UserRole[];
    requiredTier?: SubscriptionTier;
    requiresSubscription?: boolean;
    userRole?: UserRole;
    userTier?: SubscriptionTier;
  }>;
  style?: ViewStyle;
  testID?: string;
}

/**
 * FeatureGuard - Protects components based on user permissions
 */
function FeatureGuard({
  children,
  role,
  tier,
  subscription,
  validate,
  fallback: Fallback,
  style,
  testID,
}: FeatureGuardProps) {
  const user = useAuthSafe('user');
  const userRole = useAuthSafe('userRole') as UserRole | undefined;
  const userTier = useAuthSafe('userTier') as SubscriptionTier | undefined;
  const isAvailable = useAuthSafe('isAvailable');

  // If auth not available, show children (graceful degradation)
  if (!isAvailable) {
    if (__DEV__) {
      console.warn(
        '[FeatureGuard] Auth not available — rendering protected content without access control.'
      );
    }
    return <View style={style}>{children}</View>;
  }

  // If not authenticated, deny access
  if (!user) {
    if (Fallback) {
      return (
        <Fallback
          requiredRole={role}
          requiredTier={tier}
          requiresSubscription={subscription}
        />
      );
    }
    return (
      <View style={style} testID={testID}>
        <Text level="body" variant="muted">
          Please sign in to access this feature
        </Text>
      </View>
    );
  }

  // Check role
  if (role) {
    const requiredRoles = Array.isArray(role) ? role : [role];
    if (!userRole || !requiredRoles.includes(userRole)) {
      if (Fallback) {
        return (
          <Fallback
            requiredRole={role}
            userRole={userRole}
            userTier={userTier}
          />
        );
      }
      return (
        <View style={style} testID={testID}>
          <Text level="body" variant="muted">
            This feature requires a different role
          </Text>
        </View>
      );
    }
  }

  // Check tier — deny when userTier is missing and a tier is required
  if (tier) {
    if (!userTier || !hasTierAccess(userTier, tier)) {
      if (Fallback) {
        return (
          <Fallback
            requiredTier={tier}
            userRole={userRole}
            userTier={userTier}
          />
        );
      }
      return (
        <View style={style} testID={testID}>
          <Text level="body" variant="muted">
            This feature requires {tier} tier
          </Text>
        </View>
      );
    }
  }

  // Check subscription (derive from userTier - if user has any tier, they have a subscription)
  const hasSubscription = !!userTier;
  if (subscription && !hasSubscription) {
    if (Fallback) {
      return (
        <Fallback
          requiresSubscription={true}
          userRole={userRole}
          userTier={userTier}
        />
      );
    }
    return (
      <View style={style} testID={testID}>
        <Text level="body" variant="muted">
          This feature requires an active subscription
        </Text>
      </View>
    );
  }

  // Custom validation — deny when validate is provided but role/tier is missing,
  // since we cannot satisfy the predicate with incomplete auth state.
  if (validate) {
    if (!userRole || !userTier || !validate(userRole, userTier)) {
      if (Fallback) {
        return <Fallback userRole={userRole} userTier={userTier} />;
      }
      return (
        <View style={style} testID={testID}>
          <Text level="body" variant="muted">
            Access denied
          </Text>
        </View>
      );
    }
  }

  return <View style={style}>{children}</View>;
}

/**
 * Hook to check if current user can access a feature
 *
 * Provides programmatic access to feature permission checking without
 * rendering components. Useful for conditional logic, analytics, and
 * programmatic feature access validation.
 *
 * @param config - Feature access configuration
 * @returns True if user can access the feature, false otherwise
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function useCanAccessFeature(config: {
  role?: UserRole | UserRole[];
  tier?: SubscriptionTier;
  subscription?: boolean;
  validate?: (role: UserRole, tier: SubscriptionTier) => boolean;
}): boolean {
  const user = useAuthSafe('user');
  const userRole = useAuthSafe('userRole') as UserRole | undefined;
  const userTier = useAuthSafe('userTier') as SubscriptionTier | undefined;

  // Not authenticated and auth required
  if (!user && (config.role || config.tier || config.subscription)) {
    return false;
  }

  // Check role requirements (using cached values)
  if (config.role) {
    const requiredRoles = Array.isArray(config.role)
      ? config.role
      : [config.role];
    const hasRequiredRole = requiredRoles.some(
      (requiredRole) => userRole === requiredRole
    );
    if (!hasRequiredRole) return false;
  }

  if (config.tier && (!userTier || !hasTierAccess(userTier, config.tier))) {
    return false;
  }

  // Derive subscription status from tier presence
  if (config.subscription && !userTier) {
    return false;
  }

  // Deny when validate is provided but role/tier is missing — cannot run predicate safely.
  if (config.validate) {
    if (!userRole || !userTier || !config.validate(userRole, userTier)) {
      return false;
    }
  }

  return true;
}

export default FeatureGuard;
