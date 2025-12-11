import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, UserX } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

export default function TermsScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0e1a]">
      <LinearGradient
        colors={['#1a1035', '#0a0e1a', '#0a0e1a']}
        className="absolute inset-0"
      />
      
      {/* Header */}
      <View className="px-4 pt-4 pb-6 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 -ml-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white font-bebas text-3xl tracking-wider">TERMS OF SERVICE</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Last Updated */}
        <Text className="text-gray-500 text-sm font-inter mb-6">
          Last updated: December 2024
        </Text>

        {/* Intro */}
        <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center mb-3">
            <FileText size={24} color="#8b5cf6" />
            <Text className="text-white font-inter-bold text-lg ml-3">Welcome to BJJ Progress</Text>
          </View>
          <Text className="text-gray-300 font-lato text-base leading-6">
            By using BJJ Progress, you agree to these terms of service. Please read them carefully before using the app.
          </Text>
        </View>

        {/* Acceptance */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <CheckCircle size={20} color="#10b981" />
            <Text className="text-white font-inter-bold text-lg ml-3">Acceptance of Terms</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6">
              By accessing or using BJJ Progress, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of the terms, you may not access the service.
            </Text>
          </View>
        </View>

        {/* Your Responsibilities */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Scale size={20} color="#60a5fa" />
            <Text className="text-white font-inter-bold text-lg ml-3">Your Responsibilities</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Provide accurate information when creating your account
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Use the app only for personal training tracking
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Keep your account credentials secure
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6">
              • Not attempt to abuse or compromise the service
            </Text>
          </View>
        </View>

        {/* Prohibited Activities */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <UserX size={20} color="#ef4444" />
            <Text className="text-white font-inter-bold text-lg ml-3">Prohibited Activities</Text>
          </View>
          <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Attempting to access other users' data
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Using the service for illegal purposes
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Reverse engineering or tampering with the app
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6">
              • Creating multiple accounts to abuse free trials
            </Text>
          </View>
        </View>

        {/* Subscriptions */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <CheckCircle size={20} color="#f59e0b" />
            <Text className="text-white font-inter-bold text-lg ml-3">Subscriptions & Payments</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • PRO subscriptions are billed monthly or annually
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Subscriptions auto-renew unless cancelled
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6">
              • Refunds are handled through the respective app store
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <AlertTriangle size={20} color="#f59e0b" />
            <Text className="text-white font-inter-bold text-lg ml-3">Disclaimer</Text>
          </View>
          <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6">
              BJJ Progress is provided "as is" without warranties of any kind. We are not responsible for any injuries or issues that may occur during your BJJ training. Always train safely under qualified instruction.
            </Text>
          </View>
        </View>

        {/* Changes to Terms */}
        <View className="mb-6">
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-white font-inter-bold text-base mb-2">
              Changes to Terms
            </Text>
            <Text className="text-gray-300 font-lato text-sm leading-5">
              We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
            </Text>
          </View>
        </View>

        {/* Contact */}
        <View className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <Text className="text-purple-300 font-inter-bold text-base mb-2">
            Questions?
          </Text>
          <Text className="text-gray-300 font-lato text-sm">
            Contact us at support@bjjprogress.app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
