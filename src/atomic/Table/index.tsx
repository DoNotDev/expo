// packages/expo/src/atomic/Table/index.tsx
/**
 * @fileoverview Table component
 * @description Table component with sorting and selection
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';

import { useTranslation } from '@donotdev/core';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  sortableTableColumns,
  sortTableRows,
} from '../../utils/tableSort';
import Checkbox from '../Checkbox';
import Input from '../Input';
import Pagination from '../Pagination';
import Stack from '../Stack';
import Text from '../Text';

/**
 * Table column configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: exported signature; narrowing it is a breaking change for importers (deferred to a major, any-audit 2026-11-11)
export interface TableColumn<T = any> {
  key: string;
  /** Column header */
  title: string | ReactNode;
  /** Row field shown in the cell. Sorting reads a dotted key (`'offer.price'`) as is when the row has it, else as a path. */
  dataIndex?: keyof T;
  /**
   * Sorting is on by default: a column with `dataIndex` or `render` sorts on
   * what its cells show, in the UI language (the i18n language): numbers, dates and booleans
   * by value, other cells by the text `render` shows (a formatted number such
   * as `1 234,50 €` by value), case and accents ignored; empty cells last. A
   * column whose cells are all empty or all the same over the data (an action
   * column) has nothing to sort: no arrow, header press inert. `false` opts
   * this column out.
   * Same sort as the web DataTable (`sortTableRows`, a copy in `src/utils/tableSort.ts`).
   * @default true
   */
  sortable?: boolean;
  /**
   * Sort value of a row in this column, used instead of the value derived from
   * `dataIndex` / `render`; it goes through the same comparison (numbers, dates,
   * texts with the collator, empty last). Framework-internal for field-typed lists
   * (EntityList sets it for price fields: the discounted price the cell shows).
   * Apps normally don't need it: put the shown value in the row instead.
   */
  sortValue?: (row: T) => unknown;
  filterable?: boolean;
  /** Render prop for custom cell content */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: exported signature; narrowing it is a breaking change for importers (deferred to a major, any-audit 2026-11-11)
  render?: (value: any, record: T, index: number) => ReactNode;
  /** Column width */
  width?: string | number;
  /** Text alignment */
  align?: 'start' | 'center' | 'end';
}

/**
 * Data table component props
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: exported signature; narrowing it is a breaking change for importers (deferred to a major, any-audit 2026-11-11)
export interface DataTableProps<T = any> {
  /** Data array */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /**
   * Header press sorts the rows on that column (see `TableColumn.sortable`);
   * `false` turns sorting off for every column.
   * @default true
   */
  sortable?: boolean;
  /** Enable row selection */
  selectable?: boolean;
  /** Enable search */
  searchable?: boolean;
  /** Enable pagination */
  pagination?: boolean;
  /** Current page (1-indexed) */
  currentPage?: number;
  /**
   * Page size
   * @default 25
   */
  pageSize?: number;
  /** Total number of items */
  total?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Loading state */
  loading?: boolean;
  /** Called with the column key and direction after a header press (the table sorts the rows itself). */
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  /** Callback when selection changes */
  onSelect?: (selectedRows: T[]) => void;
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Callback when a row is clicked/pressed */
  onRowClick?: (row: T) => void;
  /** Alias for onRowClick (React Native convention) */
  onRowPress?: (row: T) => void;
  /** Label template for showing range (e.g. "Showing {from}-{to} of {total}") */
  showingLabel?: string;
  /** Previous button label for pagination */
  paginationPreviousLabel?: string;
  /** Next button label for pagination */
  paginationNextLabel?: string;
  /** Placeholder text for items per page selector */
  paginationItemsPerPagePlaceholder?: string;
  /** Show cell border lines */
  gridLines?: boolean;
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

// Styles are built dynamically via useTheme() — see component bodies

/**
 * Basic Table wrapper component.
 */
function Table({
  children,
  style,
  testID,
}: {
  children: ReactNode;
  style?: ViewStyle;
  testID?: string;
}) {
  const { theme } = useTheme();
  const tableStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.surface,
    overflow: 'hidden',
  };
  return (
    <View style={mergeStyles(tableStyle, style)} testID={testID}>
      {children}
    </View>
  );
}

/**
 * Data table component with sorting, selection, and pagination.
 *
 * @component
 * @example
 * ```tsx
 * <DataTable
 *   data={data}
 *   columns={[
 *     { key: 'name', title: 'Name', dataIndex: 'name' },
 *     { key: 'age', title: 'Age', dataIndex: 'age' }
 *   ]}
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- why: not yet narrowed (any-audit 2026-11-11 follow-up)
function DataTable<T = any>({
  data,
  columns,
  sortable = true,
  selectable = false,
  searchable = false,
  pagination = false,
  currentPage: controlledPage,
  pageSize: controlledPageSize,
  total,
  onPageChange,
  onPageSizeChange,
  loading = false,
  onSort,
  onSelect,
  onSearch,
  onRowClick,
  onRowPress,
  showingLabel,
  paginationPreviousLabel,
  paginationNextLabel,
  paginationItemsPerPagePlaceholder,
  gridLines = false,
  style,
  testID,
}: DataTableProps<T>) {
  const { theme } = useTheme();
  const handleRowPress = onRowPress || onRowClick;

  const tableStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.surface,
    overflow: 'hidden',
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: theme.colors.muted,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  };

  const cellStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    ...(gridLines && {
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    }),
  };
  const [internalPage, setInternalPage] = useState(1);
  // Same default as the web DataTable (one constant)
  const [internalPageSize, setInternalPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const currentPage = controlledPage ?? internalPage;
  const pageSize = controlledPageSize ?? internalPageSize;

  // UI language (i18n): text comparison and formatted numbers of the sort
  const { language } = useTranslation();
  // Columns with something to sort over the data (2+ different values), once per data / columns change
  const sortableKeys = useMemo(
    () => sortableTableColumns(data, columns, sortable, language),
    [data, columns, sortable, language]
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (search && onSearch) {
      onSearch(search);
      // Filtering would be handled by parent if onSearch is provided
    }
    // Sorting: on what the column shows, in the UI language (one sort with the web DataTable)
    const sortBy = columns.find((column) => column.key === sortColumn);
    if (sortBy && sortableKeys.has(sortBy.key)) {
      result = sortTableRows(result, sortBy, sortDirection, language);
    }
    return result;
  }, [data, search, sortColumn, sortDirection, onSearch, columns, sortableKeys, language]);

  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData;

  const totalPages =
    pagination && total
      ? Math.ceil(total / pageSize)
      : Math.ceil(filteredData.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    const newDirection =
      sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const handleSelect = (index: number) => {
    if (!selectable) return;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    const selectedData = Array.from(newSelected)
      .map((i) => filteredData[i])
      .filter((item): item is T => item !== undefined);
    onSelect?.(selectedData);
  };

  return (
    <Stack gap={16} style={style} testID={testID}>
      {searchable && (
        <Input
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          testID={testID ? `${testID}-search` : undefined}
        />
      )}
      <View style={tableStyle} testID={testID ? `${testID}-table` : undefined}>
        {/* Header */}
        <View
          style={headerStyle}
          testID={testID ? `${testID}-header` : undefined}
        >
          {selectable && (
            <View
              style={cellStyle}
              testID={testID ? `${testID}-header-checkbox` : undefined}
            >
              <Checkbox
                checked={
                  selectedRows.size === paginatedData.length &&
                  paginatedData.length > 0
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    const all = new Set(paginatedData.map((_, i) => i));
                    setSelectedRows(all);
                    onSelect?.(paginatedData);
                  } else {
                    setSelectedRows(new Set());
                    onSelect?.([]);
                  }
                }}
                testID={testID ? `${testID}-select-all` : undefined}
              />
            </View>
          )}
          {columns.map((column) => {
            const columnSortable = sortableKeys.has(column.key);
            return (
              <TouchableOpacity
                key={column.key}
                style={[cellStyle, { flex: column.width ? 0 : 1 }]}
                onPress={() => columnSortable && handleSort(column.key)}
                disabled={!columnSortable}
                activeOpacity={columnSortable ? 0.7 : 1}
                testID={testID ? `${testID}-header-${column.key}` : undefined}
              >
                <Stack direction="row" align="center" gap={4}>
                  <Text
                    level="body"
                    variant="muted"
                    style={{ fontWeight: '600' }}
                  >
                    {column.title}
                  </Text>
                  {columnSortable && sortColumn === column.key && (
                    <Text level="caption" variant="muted">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </Stack>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Rows */}
        <ScrollView testID={testID ? `${testID}-body` : undefined}>
          {paginatedData.map((row, rowIndex) => (
            <TouchableOpacity
              key={rowIndex}
              style={rowStyle}
              onPress={() => handleRowPress?.(row)}
              activeOpacity={handleRowPress ? 0.7 : 1}
              testID={testID ? `${testID}-row-${rowIndex}` : undefined}
            >
              {selectable && (
                <View
                  style={cellStyle}
                  testID={testID ? `${testID}-checkbox-${rowIndex}` : undefined}
                >
                  <Checkbox
                    checked={selectedRows.has(rowIndex)}
                    onCheckedChange={() => handleSelect(rowIndex)}
                    testID={testID ? `${testID}-select-${rowIndex}` : undefined}
                  />
                </View>
              )}
              {columns.map((column) => {
                const value: unknown = column.dataIndex
                  ? row[column.dataIndex]
                  : undefined;
                const rendered: ReactNode = column.render
                  ? column.render(value, row, rowIndex)
                  : // why: without `render`, the raw cell value is rendered as-is (existing contract)
                    (value as ReactNode);
                return (
                  <View
                    key={column.key}
                    style={[cellStyle, { flex: column.width ? 0 : 1 }]}
                    testID={
                      testID
                        ? `${testID}-cell-${rowIndex}-${column.key}`
                        : undefined
                    }
                  >
                    {typeof rendered === 'string' ||
                    typeof rendered === 'number' ? (
                      <Text level="body">{rendered}</Text>
                    ) : (
                      rendered
                    )}
                  </View>
                );
              })}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setInternalPage(page);
            onPageChange?.(page);
          }}
          pageSize={pageSize}
          total={total}
          showingLabel={showingLabel}
          previousLabel={paginationPreviousLabel}
          nextLabel={paginationNextLabel}
          testID={testID ? `${testID}-pagination` : undefined}
        />
      )}
    </Stack>
  );
}

export default Table;
export { DataTable };
