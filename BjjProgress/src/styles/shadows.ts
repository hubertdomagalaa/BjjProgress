import { ViewStyle } from 'react-native';

/**
 * Consistent shadow styles for depth and hierarchy
 */
export const shadows = {
  /** Standard card shadow - for training cards, stats cards */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  } as ViewStyle,
  
  /** Button shadow with purple glow - for primary actions */
  button: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  
  /** Floating element shadow - for modals, toasts */
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  } as ViewStyle,
  
  /** Subtle shadow - for subtle elevation */
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  } as ViewStyle,
};
