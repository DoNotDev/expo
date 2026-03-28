// packages/expo/src/routing/hooks.ts
/**
 * @fileoverview Expo Router routing hooks
 * @description Routing hooks implementation for Expo Router
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useMemo } from 'react';

import {
  useOverlayStore,
  FEATURE_STATUS,
  useNavigationStore,
  USER_ROLES,
} from '@donotdev/core';
import { useAuthConfig } from '@donotdev/core';
import type {
  PageAuth,
  FeatureStatus,
  AuthAPI,
  NavigationRoute,
} from '@donotdev/core';
import type { NavigateOptions } from '@donotdev/ui';
import type { RedirectGuardOptions, RedirectGuardResult } from '@donotdev/ui';

import { useAuthSafe } from '../utils/useAuthSafe';

/**
 * Navigation hook for Expo Router
 */
export function useNavigate() {
  const router = useRouter();
  const closeAll = useOverlayStore((state) => state.closeAll);

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      if (to === 'back') {
        closeAll();
        router.back();
        return;
      }

      closeAll();

      if (options?.replace) {
        router.replace(to as any);
      } else {
        router.push(to as any);
      }
    },
    [router, closeAll]
  );
}

/**
 * Go back hook
 */
export function useBack() {
  const router = useRouter();
  return useCallback(() => router.back(), [router]);
}

/**
 * Refresh hook (no-op on mobile, equivalent to reload)
 */
export function useRefresh() {
  return useCallback(() => {
    // On mobile, refresh is typically handled by pull-to-refresh
    // This is a no-op for API compatibility
  }, []);
}

/**
 * Prefetch hook (no-op on mobile)
 */
export function usePrefetch() {
  return useCallback(() => {
    // Prefetching not applicable on mobile
  }, []);
}

/**
 * Location hook - returns pathname and search params
 */
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();

  // Convert search params to URLSearchParams-like object
  const search = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.set(key, String(value));
    }
  });

  const searchStr = search.toString();

  return {
    pathname: pathname || '/',
    search: searchStr ? `?${searchStr}` : '',
    hash: '',
    state: null,
    key: pathname || 'default',
  };
}

/**
 * Route params hook
 */
export function useParams(): Record<string, string | string[] | undefined> {
  return useLocalSearchParams();
}

/**
 * Single route param hook
 */
export function useRouteParam(key: string): string | undefined {
  const params = useLocalSearchParams();
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Search params hook - returns URLSearchParams-like object
 */
export function useSearchParams(): URLSearchParams {
  const params = useLocalSearchParams();
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.set(key, String(value));
    }
  });
  return search;
}

/**
 * Route match hook (simplified for Expo Router)
 */
export function useMatch(pattern: string): boolean {
  const pathname = usePathname();

  const regex = useMemo(() => {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:\w+/g, '[^/]+')
      .replace(/\*/g, '.*');
    return new RegExp('^' + escaped + '$');
  }, [pattern]);

  return regex.test(pathname || '');
}

/**
 * Query params hook with setter functionality.
 * Uses router directly (not useNavigate) to avoid triggering the form
 * navigation guard on URL-only query param updates.
 */
export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = useLocation();

  const setQuery = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(key, value);

      const newSearch = newParams.toString();
      const pathname = location.pathname || '/';
      const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ''}`;

      router.push(newUrl as any);
    },
    [searchParams, router, location.pathname]
  );

  const removeQuery = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete(key);

      const newSearch = newParams.toString();
      const pathname = location.pathname || '/';
      const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ''}`;

      router.push(newUrl as any);
    },
    [searchParams, router, location.pathname]
  );

  const clearQueries = useCallback(() => {
    const pathname = location.pathname || '/';
    router.push(pathname as any);
  }, [router, location.pathname]);

  return {
    query: searchParams,
    setQuery,
    removeQuery,
    clearQueries,
  };
}

/**
 * Redirect guard hook
 */
export function useRedirectGuard(
  options: RedirectGuardOptions = {}
): RedirectGuardResult {
  const { auth, redirectTo: customRedirectTo, condition } = options;

  // Expo is always client-side — no SSR guard needed (avoids conditional hooks violation)
  const location = useLocation();
  const authConfig = useAuthConfig();
  const user = useAuthSafe('user');
  const can = useAuthSafe('can');
  const status = useAuthSafe('status');

  // Determine redirect state
  const redirectState = useMemo(() => {
    const noAction: RedirectGuardResult = { shouldRedirect: false, redirectTo: null, isChecking: false };

    // Only INITIALIZING = still checking. DEGRADED/ERROR/READY = auth resolved
    if (status === FEATURE_STATUS.INITIALIZING) {
      return { ...noAction, isChecking: true };
    }

    // Custom condition provided
    if (condition) {
      const shouldRedirect = condition(user, status);
      return {
        shouldRedirect,
        redirectTo: shouldRedirect ? customRedirectTo || null : null,
        isChecking: false,
      };
    }

    // Use auth config to determine redirect
    if (auth !== false && auth !== undefined) {
      if (!can) return noAction;

      // Check if user can navigate to this route
      if (!can.navigate(auth)) {
        let targetRoute: string | null = null;

        // Authentication failure (not logged in) → always redirect
        if (typeof auth === 'object' && auth.required && !user) {
          // Check if we have OAuth parameters that need to be preserved
          const hasOAuthParams =
            location.search.includes('code=') ||
            location.search.includes('state=') ||
            location.search.includes('error=');

          const authRoute = authConfig.authRoute!;
          if (hasOAuthParams) {
            targetRoute = `${authRoute}${location.search}`;
          } else {
            targetRoute = authRoute;
          }
        }
        // Authorization failure (wrong role)
        else if (typeof auth === 'object' && auth.role) {
          targetRoute = authConfig.roleRoute;
        }
        // Authorization failure (wrong tier)
        else if (typeof auth === 'object' && auth.tier) {
          targetRoute = authConfig.tierRoute;
        }
        // Fallback
        else {
          targetRoute = authConfig.roleRoute;
        }

        return {
          shouldRedirect: true,
          redirectTo: customRedirectTo || targetRoute,
          isChecking: false,
        };
      }
    }

    // No redirect needed
    return noAction;
  }, [
    auth,
    status,
    user,
    can,
    condition,
    customRedirectTo,
    location.search,
    authConfig.authRoute,
    authConfig.roleRoute,
    authConfig.tierRoute,
  ]);

  return redirectState;
}

/** Enhanced navigation item for UI components */
export interface NavigationItem extends NavigationRoute {
  isActive: boolean;
  hasChildren: boolean;
  children?: NavigationItem[];
}

function isRouteActive(routePath: string, currentPath: string): boolean {
  if (routePath === '/') return currentPath === '/';
  if (currentPath === routePath) return true;
  return currentPath.startsWith(routePath + '/');
}

/**
 * Auth-filtered navigation items for the current app.
 * Used internally by useNavigationRoute.
 */
export function useNavigationItems(): NavigationItem[] {
  const location = useLocation();
  const user = useAuthSafe('user');
  const authenticated = !!user;
  const role = user?.role || USER_ROLES.GUEST;

  const filteredRoutes = useNavigationStore((state) => {
    if (!state || typeof state.getFilteredRoutes !== 'function') return [];
    return state.getFilteredRoutes({ authenticated, role });
  });

  return useMemo(() => {
    if (!Array.isArray(filteredRoutes)) return [];
    return filteredRoutes
      .map((route) => ({
        ...route,
        isActive: isRouteActive(route.path, location.pathname),
        hasChildren: false,
        children: undefined,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredRoutes, location.pathname]);
}

/**
 * Resolves a single navigation item by path.
 * Returns undefined if the path is not registered or the user lacks access.
 */
export function useNavigationRoute(path: string): NavigationItem | undefined {
  const items = useNavigationItems();
  return useMemo(() => items.find((item) => item.path === path), [items, path]);
}

// Re-export types
export type { NavigateOptions } from '@donotdev/ui';
export type { RedirectGuardOptions, RedirectGuardResult } from '@donotdev/ui';
