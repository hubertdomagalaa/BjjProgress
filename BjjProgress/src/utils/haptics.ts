import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utilities for tactile user interactions
 */
export const haptics = {
  /** Light tap - for navigation and card taps */
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  
  /** Medium impact - for selections and toggles */
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  
  /** Heavy impact - for important actions */
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  
  /** Success notification - for successful saves/completions */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  
  /** Warning notification - for warnings */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  
  /** Error notification - for errors */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
