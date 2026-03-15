// packages/expo/src/crud/components/EntityList.tsx
/**
 * @fileoverview Entity List Component for Expo
 * @description Table view for admin/internal CRUD operations using React Native components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useMemo, useCallback, useState } from 'react';
import { View } from 'react-native';

import { useTranslation } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import type { EntityListProps } from '@donotdev/core';
import {
  translateFieldLabel,
  useCrud,
  useCrudList,
  useCrudFilters,
} from '@donotdev/crud';
import type { InferEntityData, UseCrudListOptions } from '@donotdev/crud';

import { formatValue } from './DisplayFieldRenderer';
import { EntityFilters, matchesFilter } from './EntityFilters';
import { DataTable, Button, Stack, Section, Input } from '../../atomic';
import { useNavigate } from '../../routing';

import type { TableColumn } from '../../atomic';

export type { EntityListProps };

/**
 * Entity List Component - Table view for admin/internal operations
 *
 * Features:
 * - Filters section (collapsible) with actions and filter inputs
 * - Results section with DataTable
 * - Excel-like table display with formatted values
 * - Edit and Delete actions (admin only)
 * - Auto-routing when handlers not provided
 */
export function EntityList({
  entity,
  userRole = 'guest',
  basePath,
  onClick,
  hideFilters = false,
  pagination = 'client',
  pageSize: pageSizeProp,
  queryOptions,
  exportable = true,
}: EntityListProps) {
  const navigate = useNavigate();
  const base = basePath ?? `/${entity.collection}`;

  // Infer entity data type (includes id from store)
  type EntityData = InferEntityData<typeof entity> & { id: string };

  // Server-side pagination state (only used when pagination='server')
  const [currentPage, setCurrentPage] = useState(1);
  const [serverPageSize, setServerPageSize] = useState(pageSizeProp);

  const {
    data: listData,
    loading,
    mutate: refreshList,
  } = useCrudList<EntityData>(entity, {
    pagination,
    ...(queryOptions && { queryOptions }),
    ...(pagination === 'server' && {
      page: currentPage,
      pageSize: serverPageSize,
    }),
  } as UseCrudListOptions<EntityData>);

  // useCrud -> handles actions (delete)
  const { delete: deleteItem } = useCrud<EntityData>(entity);

  const { t: tCrud } = useTranslation('crud');
  const data: EntityData[] = listData?.items || [];

  // Entity + crud namespaces so formatValue can resolve crud:price.* etc.
  const { t } = useTranslation([entity.namespace, 'crud']);

  // Get filters for applying to data (EntityFilters manages its own state)
  const { filters } = useCrudFilters({
    collection: entity.collection,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    await refreshList();
  }, [refreshList]);

  // Edit button: always navigate to basePath/:id
  const handleEdit = useCallback(
    (id: string) => {
      navigate(`${base}/${id}`);
    },
    [base, navigate]
  );

  // Row click: onClick(id) if provided, else navigate to basePath/:id
  const handleView = useCallback(
    (id: string) => {
      if (onClick) {
        onClick(id);
      } else {
        navigate(`${base}/${id}`);
      }
    },
    [base, navigate, onClick]
  );

  // Add New: navigate to basePath/new
  const handleCreate = useCallback(() => {
    navigate(`${base}/new`);
  }, [base, navigate]);

  // Delete handler
  const handleDelete = useCallback(
    async (itemId: string) => {
      await deleteItem(itemId);
    },
    [deleteItem]
  );

  // Apply search and filters to data
  const filteredData = useMemo((): EntityData[] => {
    let result: EntityData[] = data;

    // Apply search query (searches all fields)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply column filters
    if (Object.keys(filters).length > 0) {
      result = result.filter((item) => {
        return Object.entries(filters).every(([fieldName, filterValue]) => {
          const itemValue = item[fieldName as keyof EntityData];
          const fieldConfig = entity.fields[fieldName];
          const fieldType = fieldConfig?.type || 'text';
          return matchesFilter(itemValue, filterValue, fieldType);
        });
      });
    }

    return result;
  }, [data, searchQuery, filters, entity.fields]);

  // Generate columns from entity.listFields or entity.fields
  const columns: TableColumn<EntityData>[] = useMemo(() => {
    const fieldsToShow = entity.listFields || Object.keys(entity.fields);

    const baseColumns: TableColumn<EntityData>[] = fieldsToShow
      .map((fieldName) => {
        const fieldConfig = entity.fields[fieldName];
        if (!fieldConfig) return null;

        const label = translateFieldLabel(fieldName, fieldConfig, t);
        const fieldType = fieldConfig.type || 'text';
        const isNumeric = fieldType === 'number' || fieldType === 'range';
        const align: 'start' | 'center' | 'end' = isNumeric ? 'end' : 'start';

        return {
          key: fieldName,
          title: label,
          dataIndex: fieldName as keyof EntityData,
          sortable: true,
          filterable: true,
          align,
          render: (value: unknown, record: EntityData) =>
            formatValue(value, fieldConfig, t, { compact: true }),
        };
      })
      .filter(Boolean) as TableColumn<EntityData>[];

    // Add actions column
    if (userRole === 'admin') {
      baseColumns.push({
        key: '_actions',
        title: tCrud('actions.label', { defaultValue: 'Actions' }),
        dataIndex: undefined as unknown as keyof EntityData,
        sortable: false,
        width: 120,
        align: 'center',
        render: (_: unknown, record: EntityData) => (
          <Stack gap={8} direction="row" align="center" justify="center">
            <Button
              variant="outline"
              onPress={() => handleEdit(record.id)}
              testID={`edit-${record.id}`}
            >
              {tCrud('edit', { defaultValue: 'Edit' })}
            </Button>
            <Button
              variant="destructive"
              onPress={() => handleDelete(record.id)}
              testID={`delete-${record.id}`}
            >
              {tCrud('delete', { defaultValue: 'Delete' })}
            </Button>
          </Stack>
        ),
      });
    }

    return baseColumns;
  }, [
    entity.fields,
    entity.listFields,
    t,
    tCrud,
    userRole,
    handleEdit,
    handleDelete,
  ]);

  return (
    <Stack gap={16}>
      {/* Filters Section */}
      {!hideFilters && (
        <Section
          title={tCrud('filters.title', { defaultValue: 'Filters' })}
          collapsible
          defaultCollapsed={false}
        >
          <Stack gap={16}>
            <Input
              placeholder={tCrud('search.placeholder', {
                defaultValue: 'Search...',
              })}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <EntityFilters entity={entity} data={data} />
          </Stack>
        </Section>
      )}

      {/* Results Section */}
      <Section
        title={tCrud('results.title', { defaultValue: 'Results' })}
        actions={
          <Stack direction="row" gap={8}>
            <Button variant="outline" onPress={handleRefresh} loading={loading}>
              {tCrud('refresh', { defaultValue: 'Refresh' })}
            </Button>
            {userRole === 'admin' && (
              <Button variant="primary" onPress={handleCreate}>
                {tCrud('create', { defaultValue: 'Create New' })}
              </Button>
            )}
          </Stack>
        }
      >
        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          pagination={pagination !== undefined}
          pageSize={pageSizeProp}
          onRowPress={(row: EntityData) => handleView(row.id)}
          testID="entity-list-table"
        />
      </Section>
    </Stack>
  );
}

export default EntityList;
