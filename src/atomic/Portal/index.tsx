// packages/expo/src/atomic/Portal/index.tsx
/**
 * @fileoverview Portal component
 * @description Portal component for rendering outside the normal tree
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Modal, type ModalProps } from 'react-native';

import type { ReactNode } from 'react';

/**
 * Portal component props interface
 */
export interface PortalProps {
  /**
   * Portal content
   */
  children: ReactNode;
  /**
   * Container name (unused on React Native)
   */
  container?: string;
  /**
   * Style prop (for API parity with web)
   */
  style?: any;
}

/**
 * Portal component for rendering outside the normal tree.
 * On React Native, uses Modal for overlay rendering.
 *
 * @component
 * @example
 * ```tsx
 * <Portal>
 *   <Dialog>Content</Dialog>
 * </Portal>
 * ```
 */
const Portal = ({ children, container }: PortalProps) => {
  // On React Native, portals are typically handled by Modal components
  // This is a passthrough component for API compatibility
  return <>{children}</>;
};

export default Portal;
