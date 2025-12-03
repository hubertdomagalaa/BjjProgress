import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { X, Search, Check } from 'lucide-react-native';
import { SUBMISSIONS } from '../constants/bjj-techniques';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (technique: { id: string; name: string; category: string }) => void;
}

export default function TechniquePicker({ visible, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');

  // Flatten techniques for searching
  const allTechniques = Object.entries(SUBMISSIONS).flatMap(([category, techs]) => 
    techs.map(tech => ({ ...tech, category }))
  );

  const filtered = allTechniques.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-[#1e293b] rounded-t-3xl h-[80%] p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bebas text-2xl">Select Submission</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-white/10 rounded-full">
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white/5 p-3 rounded-xl mb-4 border border-white/10">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-white font-lato text-base"
              placeholder="Search technique..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="flex-row items-center justify-between p-4 border-b border-white/5 active:bg-white/5"
              >
                <View>
                  <Text className="text-white font-lato-bold text-base">{item.name}</Text>
                  <Text className="text-gray-500 text-xs uppercase">{item.category}</Text>
                </View>
                <Check size={16} color="#4ade80" style={{ opacity: 0 }} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
