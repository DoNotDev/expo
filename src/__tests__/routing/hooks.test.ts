/**
 * @fileoverview Routing hooks tests
 * @description Tests for Expo Router hooks to ensure API compatibility
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { renderHook, act } from '@testing-library/react-native';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';

import {
  useNavigate,
  useBack,
  useLocation,
  useParams,
  useRouteParam,
  useSearchParams,
  useMatch,
  useQueryParams,
} from '../../routing/hooks';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useSegments: jest.fn(() => []),
}));

describe('Expo Router Hooks', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    setParams: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  describe('useNavigate', () => {
    it('navigates to path', () => {
      const { result } = renderHook(() => useNavigate());
      act(() => {
        result.current('/test');
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/test');
    });

    it('handles back navigation', () => {
      const { result } = renderHook(() => useNavigate());
      act(() => {
        result.current('back');
      });
      expect(mockRouter.back).toHaveBeenCalled();
    });

    it('handles replace option', () => {
      const { result } = renderHook(() => useNavigate());
      act(() => {
        result.current('/test', { replace: true });
      });
      expect(mockRouter.replace).toHaveBeenCalledWith('/test');
    });
  });

  describe('useBack', () => {
    it('calls router.back', () => {
      const { result } = renderHook(() => useBack());
      act(() => {
        result.current();
      });
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe('useLocation', () => {
    it('returns location object with pathname', () => {
      (usePathname as jest.Mock).mockReturnValue('/test');
      (useLocalSearchParams as jest.Mock).mockReturnValue({ page: '1' });

      const { result } = renderHook(() => useLocation());
      expect(result.current.pathname).toBe('/test');
      expect(result.current.search).toBeTruthy();
    });

    it('converts search params to URLSearchParams format', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        page: '1',
        sort: 'asc',
      });

      const { result } = renderHook(() => useLocation());
      const searchParams = new URLSearchParams(result.current.search);
      expect(searchParams.get('page')).toBe('1');
      expect(searchParams.get('sort')).toBe('asc');
    });
  });

  describe('useParams', () => {
    it('returns route params', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        id: '123',
        slug: 'test',
      });

      const { result } = renderHook(() => useParams());
      expect(result.current.id).toBe('123');
      expect(result.current.slug).toBe('test');
    });
  });

  describe('useRouteParam', () => {
    it('returns single route param', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '123' });

      const { result } = renderHook(() => useRouteParam('id'));
      expect(result.current).toBe('123');
    });

    it('handles array params (returns first)', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        tags: ['tag1', 'tag2'],
      });

      const { result } = renderHook(() => useRouteParam('tags'));
      expect(result.current).toBe('tag1');
    });

    it('returns undefined for missing param', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});

      const { result } = renderHook(() => useRouteParam('missing'));
      expect(result.current).toBeUndefined();
    });
  });

  describe('useSearchParams', () => {
    it('returns URLSearchParams object', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        page: '1',
        sort: 'asc',
      });

      const { result } = renderHook(() => useSearchParams());
      expect(result.current.get('page')).toBe('1');
      expect(result.current.get('sort')).toBe('asc');
    });
  });

  describe('useMatch', () => {
    it('matches exact path', () => {
      (usePathname as jest.Mock).mockReturnValue('/test');

      const { result } = renderHook(() => useMatch('/test'));
      expect(result.current).toBe(true);
    });

    it('matches pattern with params', () => {
      (usePathname as jest.Mock).mockReturnValue('/product/123');

      const { result } = renderHook(() => useMatch('/product/:id'));
      expect(result.current).toBe(true);
    });

    it('does not match different path', () => {
      (usePathname as jest.Mock).mockReturnValue('/test');

      const { result } = renderHook(() => useMatch('/other'));
      expect(result.current).toBe(false);
    });
  });

  describe('useQueryParams', () => {
    it('returns query params and setters', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ page: '1' });
      (usePathname as jest.Mock).mockReturnValue('/test');

      const { result } = renderHook(() => useQueryParams());
      expect(result.current.query).toBeDefined();
      expect(result.current.setQuery).toBeDefined();
      expect(result.current.removeQuery).toBeDefined();
      expect(result.current.clearQueries).toBeDefined();
    });

    it('setQuery updates params', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});
      (usePathname as jest.Mock).mockReturnValue('/test');

      const { result } = renderHook(() => useQueryParams());
      act(() => {
        result.current.setQuery('page', '2');
      });
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });
});
