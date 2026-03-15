// packages/expo/src/utils/helpers.ts
/**
 * @fileoverview Component Helper Utilities
 * @description Provides utility functions for component styling and class name management.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ViewStyle, TextStyle } from 'react-native';

/**
 * Merges style objects for React Native
 *
 * Combines multiple style inputs into a single style object.
 *
 * @param {...(ViewStyle | TextStyle | undefined | null | false)} inputs - Style inputs to merge
 * @returns {ViewStyle | TextStyle} Merged style object
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function mergeStyles(
  ...inputs: Array<ViewStyle | TextStyle | undefined | null | false>
): ViewStyle | TextStyle {
  return Object.assign({}, ...inputs.filter(Boolean));
}

/**
 * Generates data attributes from variant props (for testing/debugging)
 *
 * In React Native, we don't use data attributes, but this helps maintain
 * API compatibility with web components for testing purposes.
 *
 * @param variants - Variant props object
 * @returns Object with testID attributes
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function getVariantDataAttrs(variants: {
  variant?: string | null | undefined;
  size?: string | null | undefined;
  [key: string]: string | null | undefined;
}): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (variants.variant != null) attrs['data-variant'] = variants.variant;
  if (variants.size != null) attrs['data-size'] = variants.size;
  return attrs;
}
