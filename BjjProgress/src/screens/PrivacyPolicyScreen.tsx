import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Database, Trash2, Lock, Eye, Mail } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export default function PrivacyPolicyScreen({ navigation }: Props) {
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
        <Text className="text-white font-bebas text-3xl tracking-wider">PRIVACY POLICY</Text>
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
            <Shield size={24} color="#8b5cf6" />
            <Text className="text-white font-inter-bold text-lg ml-3">Your Privacy Matters</Text>
          </View>
          <Text className="text-gray-300 font-lato text-base leading-6">
            BJJ Progress is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </Text>
        </View>

        {/* Data We Collect */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Database size={20} color="#60a5fa" />
            <Text className="text-white font-inter-bold text-lg ml-3">Data We Collect</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <View className="flex-row items-start">
              <Mail size={16} color="#8b5cf6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-white font-inter-medium">Email Address</Text>
                <Text className="text-gray-400 font-lato text-sm">For account authentication</Text>
              </View>
            </View>
            <View className="flex-row items-start mt-3">
              <Eye size={16} color="#8b5cf6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-white font-inter-medium">Training Logs</Text>
                <Text className="text-gray-400 font-lato text-sm">The training data you choose to log</Text>
              </View>
            </View>
            <View className="flex-row items-start mt-3">
              <Shield size={16} color="#8b5cf6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-white font-inter-medium">Belt & Progress</Text>
                <Text className="text-gray-400 font-lato text-sm">Your BJJ rank and preferences</Text>
              </View>
            </View>
          </View>
        </View>

        {/* How We Use Data */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Lock size={20} color="#10b981" />
            <Text className="text-white font-inter-bold text-lg ml-3">How We Use Your Data</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Provide and maintain the BJJ Progress service
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Generate your training statistics and insights
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Sync your data across devices
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6">
              • Send important account notifications
            </Text>
          </View>
        </View>

        {/* Data Security */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Lock size={20} color="#f59e0b" />
            <Text className="text-white font-inter-bold text-lg ml-3">Data Security</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6">
              Your data is stored securely using Appwrite cloud services with industry-standard encryption. We implement appropriate security measures to protect against unauthorized access, alteration, or destruction.
            </Text>
          </View>
        </View>

        {/* No Selling Data */}
        <View className="mb-6">
          <View className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <Text className="text-green-400 font-inter-bold text-base mb-2">
              ✓ We Never Sell Your Data
            </Text>
            <Text className="text-gray-300 font-lato text-sm leading-5">
              We do not sell, trade, or share your personal information with third parties for marketing purposes.
            </Text>
          </View>
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Trash2 size={20} color="#ef4444" />
            <Text className="text-white font-inter-bold text-lg ml-3">Your Rights</Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Access your personal data at any time
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6 mb-3">
              • Export your training data
            </Text>
            <Text className="text-gray-300 font-lato text-base leading-6">
              • Delete your account and all associated data from Settings
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
