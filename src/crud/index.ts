// packages/expo/src/crud/index.ts
/**
 * @fileoverview CRUD exports
 * @description Exports for CRUD functionality
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Components
export * from './components';

// Contexts
export { UploadProvider, useUploadContext } from './contexts/UploadContext';
export type { UploadProviderProps } from './contexts/UploadContext';

// Hooks
export { useUnsavedChangesWarning } from './hooks/useUnsavedChangesWarning';

// Stores
export * from './stores';

// Forms
export * from './forms/hooks/useEntityForm';

// Re-export CRUD hooks and utilities from @donotdev/crud
export {
  useCrud,
  useCrudList,
  useCrudCardList,
  getCrudService,
  useCrudStore,
  useCrudFilters,
  useEntityForm as useEntityFormBase,
  useEntityField,
  useController,
  isFieldEditable,
  getFieldsForOperation,
  validateEntity,
  translateFieldLabel,
  translateLabel,
  registerFieldType,
  getFieldRegistry,
  registerBuiltinFieldTypes,
  useFileUpload,
  useEntityFavorites,
  useRelatedItems,
} from '@donotdev/crud';

export type {
  CrudServiceInterface,
  CrudState,
  CrudActions,
  OptimisticStatus,
  OptimisticMeta,
  CrudStoreApi,
  CacheOptions,
  MutationOptions,
  FilterState,
  CollectionUIState,
  ViewerRole,
  RenderableField,
  GetFieldsForOperationOptions,
  EntityFieldsInput,
  SchemaOperation,
  ValidationIssue,
  ValidationResult,
  InferEntityData,
  InferEntityInput,
  InferEntityOutput,
  UseEntityFormOptions,
  EntityFormReturn,
  EntityFieldReturn,
  UseControllerProps,
  UseControllerReturn,
  ControllerRenderProps,
  ControllerFieldState,
  FieldTypeRegistration,
  ControlledFieldProps,
  UncontrolledFieldProps,
} from '@donotdev/crud';
