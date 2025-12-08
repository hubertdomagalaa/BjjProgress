import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MotiView, MotiImage } from 'moti';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-[#0f172a]">
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2e1065', '#0f172a', '#000000']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />

      {/* Decorative Elements */}
      <View className="absolute top-[-100] right-[-100] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <View className="absolute bottom-[-100] left-[-100] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <View className="flex-1 items-center justify-center p-8">
        {/* Logo Section */}
        <View className="items-center mb-12">
          <MotiView 
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mb-8 p-1 rounded-[36px]"
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              className="rounded-[32px] p-0.5"
            >
              <Image 
                source={require('../../assets/appicon.jpg')} 
                className="w-44 h-44 rounded-[30px]"
              />
            </LinearGradient>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700, delay: 300 }}
          >
            <Text className="text-white text-6xl font-bebas mb-2 text-center tracking-wider" style={{ textShadowColor: 'rgba(168, 85, 247, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }}>
              BJJ PROGRESS
            </Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 700, delay: 600 }}
            className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 mb-4"
          >
            <Text className="text-gray-300 text-sm font-inter tracking-[4px] uppercase">
              Track. Analyze. Evolve.
            </Text>
          </MotiView>
        </View>

        {/* Buttons Section */}
        <MotiView 
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 20, delay: 800 }}
          className="w-full gap-4 mb-8"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Login', { initialMode: 'register' })}
            activeOpacity={0.8}
            className="w-full"
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={['#9333ea', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full py-4 rounded-2xl items-center justify-center border border-white/10"
            >
              <Text className="text-white font-lato-bold text-lg tracking-wide text-center">
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login', { initialMode: 'login' })}
            activeOpacity={0.7}
            className="w-full py-4 rounded-2xl items-center bg-white/5 border border-white/10"
          >
            <Text className="text-gray-300 font-lato-bold text-lg">
              I already have an account
            </Text>
          </TouchableOpacity>
        </MotiView>
        
        <Text className="text-gray-500 text-xs font-inter text-center">
          v1.3.0 • Built for Jiu-Jitsu Athletes
        </Text>
      </View>
    </View>
  );
}
