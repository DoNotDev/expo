// packages/expo/src/atomic/Toaster/index.tsx
/**
 * @fileoverview Toaster component
 * @description Toast notification toaster component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

// ============================================================================
// MODULE-LEVEL SHARED STATE (singleton pub-sub pattern)
// ============================================================================

let toastIdCounter = 0;

/**
 * Toast type
 */
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Toast interface
 */
export interface ToasterToast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  action?: ReactNode;
  duration?: number;
}

/** Module-level shared toast array */
let sharedToasts: ToasterToast[] = [];

/** Module-level listener set — all useToast() subscribers */
const listeners = new Set<() => void>();

/** Notify all subscribers of state change */
const emitChange = () => {
  listeners.forEach((listener) => listener());
};

/**
 * Standalone toast function — can be called from anywhere.
 * Pushes a toast to the shared array and auto-dismisses after duration.
 */
export const toast = (newToast: Omit<ToasterToast, 'id'>) => {
  const id = `toast-${++toastIdCounter}`;
  const toastWithId: ToasterToast = { ...newToast, id };
  sharedToasts = [...sharedToasts, toastWithId];
  emitChange();

  const duration = newToast.duration || 5000;
  setTimeout(() => {
    sharedToasts = sharedToasts.filter((t) => t.id !== id);
    emitChange();
  }, duration);

  return { id, dismiss: () => dismissToast(id) };
};

/** Dismiss a specific toast by id */
const dismissToast = (id: string) => {
  sharedToasts = sharedToasts.filter((t) => t.id !== id);
  emitChange();
};

/**
 * Hook to use toast — subscribes to shared module-level state.
 * All component instances see the same toasts array.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>(sharedToasts);

  useEffect(() => {
    const listener = () => setToasts(sharedToasts);
    listeners.add(listener);
    // Sync in case toasts changed between render and effect
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return { toasts, toast, dismiss };
};

/**
 * ToastProvider component
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

/**
 * Toast action component
 */
export const ToastAction = ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) => {
  return (
    <Button variant="ghost" onPress={onPress}>
      {children}
    </Button>
  );
};

// Styles are built dynamically via useTheme() — see component body

/**
 * Toaster component that displays toasts.
 *
 * @component
 * @example
 * ```tsx
 * <Toaster />
 * ```
 */
function Toaster() {
  const { theme } = useTheme();
  const { toasts, dismiss } = useToast();

  const toastBaseStyle: ViewStyle = {
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.radius.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
    maxWidth: '90%',
  };

  const toastTypeStyles: Record<ToastType, ViewStyle> = {
    default: { backgroundColor: theme.colors.foreground },
    success: { backgroundColor: theme.colors.success },
    error: { backgroundColor: theme.colors.destructive },
    warning: { backgroundColor: theme.colors.warning },
    info: { backgroundColor: theme.colors.primary },
  };

  // Text color adapts: on dark bg use light text, on warning use dark
  const getTextColor = (type?: ToastType) => {
    if (type === 'warning') return theme.colors.warningForeground;
    return theme.colors.background;
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: theme.zIndex.toast,
      }}
      pointerEvents="box-none"
    >
      {toasts.map((t) => (
        <View
          key={t.id}
          style={mergeStyles(
            toastBaseStyle,
            toastTypeStyles[t.type || 'default']
          )}
        >
          <Stack gap={theme.spacing.sm}>
            {t.title && (
              <Text level="body" style={{ color: getTextColor(t.type) }}>
                {t.title}
              </Text>
            )}
            {t.description && (
              <Text
                level="small"
                style={{ color: getTextColor(t.type), opacity: 0.9 }}
              >
                {t.description}
              </Text>
            )}
            {t.action && <View>{t.action}</View>}
          </Stack>
          <TouchableOpacity
            onPress={() => dismiss(t.id)}
            style={{
              position: 'absolute',
              top: theme.spacing.sm,
              right: theme.spacing.sm,
            }}
          >
            <Text level="body" style={{ color: getTextColor(t.type) }}>
              ×
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export default Toaster;
