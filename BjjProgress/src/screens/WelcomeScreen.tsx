import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-[#3a293d] items-center justify-center p-6">
      <View style={{ alignItems: 'center' }}>
        <Image 
          source={require('../../assets/appicon.jpg')} 
          className="w-40 h-40 rounded-3xl mb-8"
        />
        <Text className="text-[#fefcfe] text-4xl font-lato-bold mb-2 text-center">
          BjjProgress
        </Text>
        <Text className="text-gray-300 text-lg font-lato mb-12 text-center">
          Śledź swoje postępy w Jiu-Jitsu
        </Text>
      </View>

      <View style={{ width: '100%' }}>
        <TouchableOpacity
          className="bg-[#b123c7] w-full py-4 rounded-xl items-center mb-4 shadow-lg shadow-purple-900/50"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-white font-lato-bold text-lg">Zaloguj się</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white/10 w-full py-4 rounded-xl items-center border border-white/20"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-[#fefcfe] font-lato-bold text-lg">Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
