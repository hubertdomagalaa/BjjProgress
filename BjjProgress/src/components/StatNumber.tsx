import React from 'react';
import { View, Text, TextStyle } from 'react-native';

interface StatNumberProps {
  value: number | string;
  label: string;
  unit?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'giant';
}

/**
 * StatNumber - Display numbers as achievements
 * Makes stats feel impactful with giant bold numbers
 */
export const StatNumber = ({ 
  value, 
  label, 
  unit, 
  color = '#fff',
  size = 'large'
}: StatNumberProps) => {
  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-5xl',
    large: 'text-7xl',
    giant: 'text-8xl'
  };

  return (
    <View>
      <Text className="text-[10px] font-inter-bold uppercase tracking-widest text-gray-500 mb-1">
        {label}
      </Text>
      <View className="flex-row items-baseline gap-2">
        <Text 
          className={`font-bebas ${sizeClasses[size]} leading-none`}
          style={{ color }}
        >
          {value}
        </Text>
        {unit && (
          <Text className="font-inter text-xl text-gray-400">
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
};
