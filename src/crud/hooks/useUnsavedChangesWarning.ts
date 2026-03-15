// packages/expo/src/crud/hooks/useUnsavedChangesWarning.ts
/**
 * @fileoverview Unsaved changes warning hook (Expo/React Native)
 * @description Intercepts the hardware back button to warn about unsaved changes.
 * Auto-save ensures drafts are persisted — SPA navigation is never blocked.
 * This hook only handles the Android hardware back press (equivalent of beforeunload).
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

const DEFAULT_MESSAGE =
  'You have unsaved changes. Are you sure you want to go back?';

/**
 * Hook to warn about unsaved changes on hardware back press only.
 * Auto-save handles SPA navigation — this is for the Android back button.
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  message?: string,
  onDiscard?: () => void
) {
  useEffect(() => {
    if (!isDirty) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Unsaved Changes',
          message || DEFAULT_MESSAGE,
          [
            { text: 'Stay', style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => {
                if (onDiscard) {
                  onDiscard();
                }
              },
            },
          ],
          { cancelable: true }
        );
        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isDirty, message, onDiscard]);
}
