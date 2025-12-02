import React from 'react';
import { View, Text } from 'react-native';
import { BELT_COLORS, BELT_NAMES, BeltLevel, Stripes } from '../constants/bjj-belts';

interface BeltDisplayProps {
  belt: BeltLevel;
  stripes: Stripes;
  size?: 'small' | 'normal' | 'large';
}

export const BeltDisplay: React.FC<BeltDisplayProps> = ({ 
  belt, 
  stripes, 
  size = 'normal' 
}) => {
  const sizes = {
    small: { badge: 'px-2 py-1', text: 'text-xs', stripe: 'w-1.5 h-4' },
    normal: { badge: 'px-3 py-1.5', text: 'text-sm', stripe: 'w-2 h-5' },
    large: { badge: 'px-4 py-2', text: 'text-base', stripe: 'w-2.5 h-6' }
  };

  const currentSize = sizes[size];
  const textColor = belt === 'white' ? '#1F2937' : '#FFFFFF';
  const borderColor = belt === 'white' ? '#E5E7EB' : BELT_COLORS[belt];

  return (
    <View className="flex-row items-center gap-2">
      {/* Belt Badge */}
      <View 
        className={`${currentSize.badge} rounded-full border-2`}
        style={{ 
          backgroundColor: BELT_COLORS[belt],
          borderColor: borderColor
        }}
      >
        <Text 
          className={`${currentSize.text} font-inter-bold`}
          style={{ color: textColor }}
        >
          {BELT_NAMES[belt].toUpperCase()}
        </Text>
      </View>
      
      {/* Stripes */}
      {stripes > 0 && (
        <View className="flex-row gap-0.5">
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              className={`${currentSize.stripe} rounded-sm`}
              style={{
                backgroundColor: i < stripes ? '#FFFFFF' : '#374151',
                opacity: i < stripes ? 1 : 0.3
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
