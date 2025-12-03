import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { BOTTOM_GUARDS, TOP_POSITIONS, GuardPosition, BottomGuard, TopPosition } from '../constants/bjj-guards';
import { haptics } from '../utils/haptics';

interface GuardPickerProps {
  visible: boolean;
  title: string;
  subtitle: string;
  type: 'bottom' | 'top';  // bottom = you sweeping, top = opponent sweeping you
  onSelect: (guard: GuardPosition) => void;
  onClose: () => void;
}

export const GuardPicker: React.FC<GuardPickerProps> = ({
  visible,
  title,
  subtitle,
  type,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine all guards for search, but prioritize relevant ones based on type if needed.
  // User requested "all sweeps options inside got sweept", so we simply combine them.
  // We can remove duplicates if any (though currently they seem distinct).
  const allGuards = Array.from(new Set([...BOTTOM_GUARDS, ...TOP_POSITIONS]));
  
  const filteredGuards = allGuards.filter(guard =>
    guard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (guard: GuardPosition) => {
    haptics.medium();
    onSelect(guard);
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark-bg rounded-t-3xl max-h-[80%]">
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

          {/* Search */}
          <View className="p-4 border-b border-gray-700">
            <View className="flex-row items-center bg-dark-card rounded-xl px-3 py-2">
              <Search size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-white font-inter"
                placeholder="Search guards..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Guard List */}
          <ScrollView className="p-4">
            {filteredGuards.map((guard) => (
              <TouchableOpacity
                key={guard}
                onPress={() => handleSelect(guard)}
                className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-2"
                activeOpacity={0.7}
              >
                <Text className="text-white font-inter-medium text-base">
                  {guard}
                </Text>
              </TouchableOpacity>
            ))}
            
            {filteredGuards.length === 0 && (
              <View className="items-center py-8">
                <Text className="text-gray-400 font-inter">No guards found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
