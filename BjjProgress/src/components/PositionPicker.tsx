import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { POINT_POSITIONS, PositionType } from '../constants/bjj-positions';
import { haptics } from '../utils/haptics';

interface PositionPickerProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onSelect: (position: PositionType) => void;
  onClose: () => void;
}

export const PositionPicker: React.FC<PositionPickerProps> = ({
  visible,
  title,
  subtitle,
  onSelect,
  onClose
}) => {
  const handleSelect = (position: PositionType) => {
    haptics.medium();
    onSelect(position);
  };

  // Group by category
  const dominant = Object.entries(POINT_POSITIONS).filter(([_, v]) => v.category === 'dominant');
  const pass = Object.entries(POINT_POSITIONS).filter(([_, v]) => v.category === 'pass');
  const control = Object.entries(POINT_POSITIONS).filter(([_, v]) => v.category === 'control');
  const takedowns = Object.entries(POINT_POSITIONS).filter(([_, v]) => v.category === 'takedown');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark-bg rounded-t-3xl max-h-[70%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
            <View className="flex-1">
              <Text className="text-white font-inter-bold text-lg">{title}</Text>
              <Text className="text-gray-400 font-inter text-sm mt-1">{subtitle}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-700/50 p-2 rounded-full"
            >
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            {/* Dominant Positions (4 pts) */}
            <Text className="text-purple-400 font-inter-bold text-sm mb-2">DOMINANT (4 Points)</Text>
            {dominant.map(([key, pos]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(key as PositionType)}
                className="bg-dark-card border border-purple-500/30 rounded-xl p-4 mb-2 flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-inter-medium">{pos.name}</Text>
                <Text className="text-purple-400 font-inter-bold">+{pos.points}</Text>
              </TouchableOpacity>
            ))}

            {/* Guard Pass (3 pts) */}
            <Text className="text-green-400 font-inter-bold text-sm mt-4 mb-2">GUARD PASS (3 Points)</Text>
            {pass.map(([key, pos]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(key as PositionType)}
                className="bg-dark-card border border-green-500/30 rounded-xl p-4 mb-2 flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-inter-medium">{pos.name}</Text>
                <Text className="text-green-400 font-inter-bold">+{pos.points}</Text>
              </TouchableOpacity>
            ))}

            {/* Control Positions (2 pts) */}
            <Text className="text-blue-400 font-inter-bold text-sm mt-4 mb-2">CONTROL (2 Points)</Text>
            {control.map(([key, pos]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(key as PositionType)}
                className="bg-dark-card border border-blue-500/30 rounded-xl p-4 mb-2 flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-inter-medium">{pos.name}</Text>
                <Text className="text-blue-400 font-inter-bold">+{pos.points}</Text>
              </TouchableOpacity>
            ))}

            {/* Takedowns (2 pts) */}
            <Text className="text-orange-400 font-inter-bold text-sm mt-4 mb-2">TAKEDOWNS (2 Points)</Text>
            {takedowns.map(([key, pos]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(key as PositionType)}
                className="bg-dark-card border border-orange-500/30 rounded-xl p-4 mb-2 flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-inter-medium">{pos.name}</Text>
                <Text className="text-orange-400 font-inter-bold">+{pos.points}</Text>
              </TouchableOpacity>
            ))}
            
            <View className="h-4" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
