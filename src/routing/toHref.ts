// packages/expo/src/routing/toHref.ts
/**
 * @fileoverview Framework path → expo-router Href
 * @description Single typed boundary between framework string paths and expo-router's Href
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { Href } from 'expo-router';

/**
 * Converts a framework path string to an expo-router `Href`.
 * why: consumer apps with `typedRoutes` narrow `Href` to their literal route union,
 * which framework-level runtime paths cannot satisfy statically.
 */
export function toHref(path: string): Href {
  return path as Href;
}
