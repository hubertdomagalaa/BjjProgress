import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Check, TrendingUp, BarChart3, Zap, Calendar } from 'lucide-react-native';
import { haptics } from '../utils/haptics';

interface PRODetailsModalProps {
  visible: boolean;
  onClose: () => void;
  renewalDate?: string; // ISO date string
}

export default function PRODetailsModal({ visible, onClose, renewalDate }: PRODetailsModalProps) {
  const formatRenewalDate = (dateString?: string): string => {
    if (!dateString) return 'No renewal date available';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const features = [
    {
      icon: <TrendingUp size={20} color="#a855f7" />,
      title: 'Unlimited Trainings',
      description: 'Track as many training sessions as you want'
    },
    {
      icon: <BarChart3 size={20} color="#3b82f6" />,
      title: 'Advanced Statistics',
      description: 'Detailed insights, charts, and progress tracking'
    },
    {
      icon: <Zap size={20} color="#f59e0b" />,
      title: 'All Features Unlocked',
      description: 'Access to all current and future premium features'
    },
    {
      icon: <Check size={20} color="#10b981" />,
      title: 'Priority Support',
      description: 'Get help faster with priority support'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        haptics.light();
        onClose();
      }}
    >
      <View className="flex-1 bg-black/80 justify-center items-center p-6">
        <View 
          className="bg-dark-bg rounded-3xl w-full max-w-md overflow-hidden"
          style={{
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={['#a855f7', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 pb-8"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <View className="bg-white/20 p-2 rounded-full">
                  <TrendingUp size={20} color="#fff" />
                </View>
                <Text className="text-white font-inter-bold text-xl">PRO Subscription</Text>
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  haptics.light();
                  onClose();
                }}
                className="bg-white/20 p-2 rounded-full"
                activeOpacity={0.7}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Status Badge */}
            <View className="bg-green-500/20 border border-green-400/50 px-4 py-2 rounded-full self-start">
              <Text className="text-green-400 font-inter-bold text-sm">✓ ACTIVE</Text>
            </View>
          </LinearGradient>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Renewal Date Section */}
            <View className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-2">
                <Calendar size={18} color="#3b82f6" />
                <Text className="text-blue-400 font-inter-bold text-sm">Next Payment</Text>
              </View>
              <Text className="text-white font-inter-bold text-lg">
                {formatRenewalDate(renewalDate)}
              </Text>
              <Text className="text-gray-400 font-inter text-xs mt-1">
                Your subscription will automatically renew
              </Text>
            </View>

            {/* Features List */}
            <Text className="text-white font-inter-bold text-base mb-4">Your PRO Benefits:</Text>
            
            <View className="gap-3">
              {features.map((feature, index) => (
                <View 
                  key={index}
                  className="bg-white/5 rounded-xl p-4 flex-row items-start gap-3"
                >
                  <View className="bg-purple-500/20 p-2 rounded-lg mt-0.5">
                    {feature.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-inter-bold text-sm mb-1">
                      {feature.title}
                    </Text>
                    <Text className="text-gray-400 font-inter text-xs leading-4">
                      {feature.description}
                    </Text>
                  </View>
                  <Check size={18} color="#10b981" />
                </View>
              ))}
            </View>

            {/* Info footer */}
            <View className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <Text className="text-yellow-400 font-inter text-xs leading-5">
                💡 Your subscription is managed through Stripe. You can cancel anytime and continue using PRO features until the end of your billing period.
              </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              onPress={() => {
                haptics.medium();
                onClose();
              }}
              className="bg-purple-500 rounded-xl py-3 mt-6"
              activeOpacity={0.8}
            >
              <Text className="text-white font-inter-bold text-center">Got it!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
