import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic Feedback Utility
 * Provides a consistent interface for triggering haptics across the app.
 * Safe to call on any platform (web will just ignore).
 */

export const haptics = {
  /**
   * Light impact (e.g., toggle switch, minor selection)
   */
  light: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignore errors on unsupported devices
    }
  },

  /**
   * Medium impact (e.g., button press, card tap)
   */
  medium: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Heavy impact (e.g., delete action, major error)
   */
  heavy: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Success notification (e.g., saved log, completed task)
   */
  success: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Error notification (e.g., validation failed)
   */
  error: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {
      // Ignore
    }
  },
};
