// packages/expo/src/atomic/Pagination/index.tsx
/**
 * @fileoverview Pagination component
 * @description Pagination component for navigating through pages
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useMemo } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

/**
 * Pagination component props interface
 */
export interface PaginationProps {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;
  /**
   * Maximum number of visible page buttons
   * @default 5
   */
  maxVisible?: number;
  /**
   * Show navigation buttons (Previous/Next)
   * @default true
   */
  showNavigation?: boolean;
  /**
   * Previous button label
   * @default 'Previous'
   */
  previousLabel?: string;
  /**
   * Next button label
   * @default 'Next'
   */
  nextLabel?: string;
  /**
   * Items per page
   */
  pageSize?: number;
  /**
   * Total number of items
   */
  total?: number;
  /**
   * Placeholder text for items per page selector
   */
  itemsPerPagePlaceholder?: string;
  /**
   * Label template for showing range (e.g. "Showing {from}-{to} of {total}")
   */
  showingLabel?: string;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Pagination component for navigating through pages.
 *
 * @component
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showNavigation = true,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  pageSize,
  total,
  itemsPerPagePlaceholder,
  showingLabel,
  style,
  testID,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const showingText = useMemo(() => {
    if (!showingLabel || !pageSize || !total) return null;
    const from = (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);
    return showingLabel
      .replace('{from}', String(from))
      .replace('{to}', String(to))
      .replace('{total}', String(total));
  }, [showingLabel, pageSize, total, currentPage]);

  return (
    <Stack gap={8} style={style} testID={testID}>
      <Stack direction="row" align="center" gap={8}>
        {showNavigation && (
          <Button
            variant="outline"
            onPress={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            testID={testID ? `${testID}-previous` : undefined}
          >
            {previousLabel}
          </Button>
        )}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <Text
                key={`ellipsis-${index}`}
                level="body"
                variant="muted"
                testID={testID ? `${testID}-ellipsis-${index}` : undefined}
              >
                ...
              </Text>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? 'primary' : 'outline'}
              onPress={() => onPageChange(pageNum)}
              testID={testID ? `${testID}-page-${pageNum}` : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
        {showNavigation && (
          <Button
            variant="outline"
            onPress={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            testID={testID ? `${testID}-next` : undefined}
          >
            {nextLabel}
          </Button>
        )}
      </Stack>
      {showingText && (
        <Text
          level="caption"
          variant="muted"
          testID={testID ? `${testID}-showing` : undefined}
        >
          {showingText}
        </Text>
      )}
    </Stack>
  );
};

export default Pagination;
