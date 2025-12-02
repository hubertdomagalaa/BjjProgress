import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { haptics } from '../utils/haptics';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
  enableHaptics?: boolean;
}

/**
 * AnimatedCard - Card with spring scale animation
 * Makes every tap feel satisfying with smooth spring physics
 */
export const AnimatedCard = ({ 
  children, 
  onPress, 
  style,
  className,
  enableHaptics = true 
}: AnimatedCardProps) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} className={className}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97, {
            damping: 15,
            stiffness: 400,
          });
          if (enableHaptics && onPress) {
            haptics.light();
          }
        }}
        onPressOut={() => {
          scale.value = withSpring(1, {
            damping: 15,
            stiffness: 400,
          });
        }}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
