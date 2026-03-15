// packages/expo/src/crud/contexts/UploadContext.tsx
/**
 * @fileoverview Upload Context
 * @description Provides formId to upload components via context
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

const UploadContext = createContext<string | undefined>(undefined);

export interface UploadProviderProps {
  formId?: string;
  children: ReactNode;
}

/**
 * UploadProvider - Provides formId to upload components via context
 */
export function UploadProvider({ formId, children }: UploadProviderProps) {
  return (
    <UploadContext.Provider value={formId}>{children}</UploadContext.Provider>
  );
}

/**
 * useUploadContext - Get formId for upload components
 */
export function useUploadContext(): string | undefined {
  return useContext(UploadContext);
}
