// packages/expo/src/utils/helpers.ts
/**
 * @fileoverview Component Helper Utilities
 * @description Provides utility functions for component styling and class name management.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

/** Style input accepted by {@link mergeStyles}: a style object, or a falsy value that is skipped. */
type StyleInput<T> = T | undefined | null | false;

/**
 * Merges style objects for React Native
 *
 * Combines style inputs of one style kind into a single style object, typed as
 * that kind: View inputs give a `ViewStyle`, Text inputs a `TextStyle`, Image
 * inputs an `ImageStyle`. Never feed a `TextStyle` to a View: under Expo's
 * typings (`expo/types`, referenced by every Expo app) `TextStyle` is not
 * assignable to `ViewStyle`.
 *
 * @param {...(ViewStyle | TextStyle | ImageStyle | undefined | null | false)} inputs - Style inputs to merge (falsy entries are skipped)
 * @returns {ViewStyle | TextStyle | ImageStyle} Merged style object, typed as the inputs' style kind
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function mergeStyles(...inputs: StyleInput<ViewStyle>[]): ViewStyle;
export function mergeStyles(...inputs: StyleInput<TextStyle>[]): TextStyle;
export function mergeStyles(...inputs: StyleInput<ImageStyle>[]): ImageStyle;
export function mergeStyles(
  ...inputs: StyleInput<ViewStyle | TextStyle | ImageStyle>[]
): ViewStyle | TextStyle | ImageStyle {
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
