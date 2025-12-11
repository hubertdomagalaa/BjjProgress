import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { BeltDisplay } from '../components/BeltDisplay';
import { BELT_LEVELS, BELT_NAMES, BELT_COLORS, BeltLevel, Stripes } from '../constants/bjj-belts';
import { account } from '../lib/appwrite';
import { haptics } from '../utils/haptics';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { user, deleteAccount, checkUser } = useAuth();
  const [belt, setBelt] = useState<BeltLevel>('white');
  const [stripes, setStripes] = useState<Stripes>(0);

  const [saving, setSaving] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

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
      
      // Refresh user state so belt updates everywhere in the app
      await checkUser();
      
      haptics.success();
      setShowPromotionModal(true);
      // Confetti will start automatically when modal mounts
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
            className={`p-4 rounded-xl items-center mb-8 ${
              saving ? 'bg-purple-500/50' : 'bg-purple-500'
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-white font-inter-bold text-base">
              {saving ? 'Saving...' : 'Save Belt'}
            </Text>
          </TouchableOpacity>

          {/* Legal Section */}
          <View className="mb-8">
            <Text className="text-gray-400 font-inter-medium text-sm mb-3 ml-1">
              Legal
            </Text>
          <View className="bg-dark-card rounded-xl overflow-hidden">
              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}
                className="p-4 border-b border-gray-700/50 flex-row justify-between items-center"
              >
                <Text className="text-white font-inter">Privacy Policy</Text>
                <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Terms')}
                className="p-4 flex-row justify-between items-center"
              >
                <Text className="text-white font-inter">Terms of Service</Text>
                <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="border-t border-gray-800 pt-6 mb-10">
            <Text className="text-red-500 font-inter-bold text-sm mb-4 uppercase tracking-wider">
              Danger Zone
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteAccount();
                          // Navigation to Welcome is handled by AuthContext state change or we can force it
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'Welcome' }],
                          });
                        } catch (error) {
                          Alert.alert('Error', 'Failed to delete account');
                        }
                      }
                    }
                  ]
                );
              }}
              className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl items-center"
              activeOpacity={0.7}
            >
              <Text className="text-red-500 font-inter-bold text-base">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>


      {/* Promotion Celebration Modal */}
      <Modal
        visible={showPromotionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowPromotionModal(false);
          navigation.goBack();
        }}
      >
        <View className="flex-1 bg-black/90 items-center justify-center p-6">
          <ConfettiCannon
            count={200}
            origin={{x: -10, y: 0}}
            autoStart={true}
            ref={confettiRef}
            fadeOut={true}
          />
          
          <View className="items-center">
            <Text className="text-white font-bebas text-6xl mb-2 text-center tracking-wider">
              PROMOTED!
            </Text>
            <Text className="text-gray-300 font-lato text-xl mb-8 text-center">
              Congratulations on your new rank.
            </Text>
            
            <View className="mb-10 scale-150">
              <BeltDisplay belt={belt} stripes={stripes} size="large" />
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowPromotionModal(false);
                navigation.goBack();
              }}
              className="bg-white px-8 py-4 rounded-full"
            >
              <Text className="text-black font-inter-bold text-lg">
                Continue Journey
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
