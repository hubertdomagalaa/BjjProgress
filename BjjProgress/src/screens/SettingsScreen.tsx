import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { BeltDisplay } from '../components/BeltDisplay';
import { BELT_LEVELS, BELT_NAMES, BELT_COLORS, BeltLevel, Stripes } from '../constants/bjj-belts';
import { account } from '../lib/appwrite';
import { haptics } from '../utils/haptics';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [belt, setBelt] = useState<BeltLevel>('white');
  const [stripes, setStripes] = useState<Stripes>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.prefs) {
      setBelt((user.prefs.belt as BeltLevel) || 'white');
      setStripes((user.prefs.stripes as Stripes) || 0);
    }
  }, [user]);

  const saveBelt = async () => {
    try {
      setSaving(true);
      haptics.medium();
      
      await account.updatePrefs({
        ...user?.prefs,
        belt,
        stripes
      });
      
      haptics.success();
      Alert.alert('Success', 'Belt updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving belt:', error);
      haptics.error();
      Alert.alert('Error', 'Failed to save belt. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white font-inter-bold text-2xl">Settings</Text>
          </View>

          {/* Current Belt Display */}
          <View className="bg-dark-card rounded-xl p-4 mb-6">
            <Text className="text-gray-400 font-inter text-sm mb-3">
              Current Belt
            </Text>
            <BeltDisplay belt={belt} stripes={stripes} size="large" />
          </View>

          {/* Belt Selection */}
          <View className="mb-6">
            <Text className="text-gray-400 font-inter-medium text-sm mb-3">
              Select Your Belt
            </Text>
            {BELT_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  haptics.light();
                  setBelt(level);
                }}
                className={`p-4 rounded-xl mb-2 border ${
                  belt === level 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'bg-dark-card border-gray-700'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-white font-inter-medium">
                    {BELT_NAMES[level]}
                  </Text>
                  <View 
                    className="w-8 h-8 rounded-full border-2"
                    style={{ 
                      backgroundColor: BELT_COLORS[level],
                      borderColor: level === 'white' ? '#E5E7EB' : BELT_COLORS[level]
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stripes Selection */}
          <View className="mb-6">
            <Text className="text-gray-400 font-inter-medium text-sm mb-3">
              Stripes
            </Text>
            <View className="flex-row gap-3">
              {[0, 1, 2, 3, 4].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => {
                    haptics.light();
                    setStripes(num as Stripes);
                  }}
                  className={`flex-1 h-16 rounded-xl items-center justify-center border ${
                    stripes === num
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-dark-card border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-inter-bold text-lg">{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={saveBelt}
            disabled={saving}
            className={`p-4 rounded-xl items-center ${
              saving ? 'bg-purple-500/50' : 'bg-purple-500'
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-white font-inter-bold text-base">
              {saving ? 'Saving...' : 'Save Belt'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
