// packages/expo/src/atomic/InfiniteScroll/index.tsx
/**
 * @fileoverview InfiniteScroll component
 * @description Infinite scroll component for loading more data
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect, useRef } from 'react';
import { ScrollView, type ScrollViewProps, type ViewStyle } from 'react-native';

import { mergeStyles } from '../../utils/helpers';
import Spinner from '../Spinner';
import Stack from '../Stack';

import type { ReactNode } from 'react';

/**
 * InfiniteScroll component props interface
 */
export interface InfiniteScrollProps extends ScrollViewProps {
  /**
   * Whether more data is loading
   */
  loading?: boolean;
  /**
   * Whether there is more data to load
   */
  hasMore?: boolean;
  /**
   * Callback when more data should be loaded
   */
  onLoadMore?: () => void;
  /**
   * Threshold (in pixels) before triggering load more
   * @default 200
   */
  threshold?: number;
  /**
   * ScrollView children
   */
  children: ReactNode;
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
 * Infinite scroll component for loading more data.
 *
 * @component
 * @example
 * ```tsx
 * <InfiniteScroll
 *   loading={loading}
 *   hasMore={hasMore}
 *   onLoadMore={loadMore}
 * >
 *   {items.map(item => <Item key={item.id} />)}
 * </InfiniteScroll>
 * ```
 */
const InfiniteScroll = ({
  loading = false,
  hasMore = false,
  onLoadMore,
  threshold = 200,
  children,
  style,
  testID,
  ...scrollViewProps
}: InfiniteScrollProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    if (!hasMore || loading || !onLoadMore) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromEnd =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (distanceFromEnd < threshold) {
      onLoadMore();
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={mergeStyles({ flex: 1 }, style)}
      testID={testID}
      {...scrollViewProps}
    >
      <Stack gap={8}>
        {children}
        {loading && (
          <Stack
            align="center"
            testID={testID ? `${testID}-loading` : undefined}
          >
            <Spinner />
          </Stack>
        )}
      </Stack>
    </ScrollView>
  );
};

export default InfiniteScroll;
