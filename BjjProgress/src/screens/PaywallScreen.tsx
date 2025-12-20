import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { usePurchases } from '../context/PurchasesContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Crown, Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation }: Props) {
  const { offerings, isPro, purchasePackage, restorePurchases, isLoading } = usePurchases();
  const [purchasing, setPurchasing] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);

  // Find the monthly package from offerings
  // Fallback to the first available package if specific identifier isn't found
  const monthlyPackage = offerings?.availablePackages?.find(
    p => p.identifier === '$rc_monthly' || p.identifier === 'monthly'
  ) || offerings?.availablePackages?.[0];

  const features = [
    'Advanced Sparring Stats',
    'Win Rate Analytics',
    'Submission Breakdown',
    'Position Tracking',
    'Cloud Backup'
  ];

  const handlePurchase = async () => {
    if (!monthlyPackage) {
      Alert.alert('Error', 'No subscription package available. Please try again later.');
      return;
    }
    
    setPurchasing(true);
    try {
      await purchasePackage(monthlyPackage);
      Alert.alert('🎉 Welcome to PRO!', 'Your subscription is now active. Enjoy all the features!');
      navigation.goBack();
    } catch (e: any) {
      // Don't show error for user cancellation
      if (!e.userCancelled) {
        Alert.alert('Purchase Error', e.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      Alert.alert('Restore Complete', 'Your purchases have been restored successfully.');
    } catch (e: any) {
      Alert.alert('Restore Error', e.message || 'Could not restore purchases. Please contact support.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0f172a] items-center justify-center">
        <ActivityIndicator size="large" color="#a855f7" />
        <Text className="text-gray-400 mt-4">Loading...</Text>
      </View>
    );
  }

  // Already PRO state
  if (isPro) {
    return (
      <View className="flex-1 bg-[#0f172a] items-center justify-center p-8">
        <View className="bg-purple-500/20 p-8 rounded-full mb-6">
          <Crown size={64} color="#a855f7" />
        </View>
        <Text className="text-white text-3xl font-bold text-center mb-2">You're PRO! 🎉</Text>
        <Text className="text-gray-400 text-center mb-8">Enjoy all premium features</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="bg-purple-600 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0f172a]">
      {/* Close Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="absolute top-14 right-4 z-10 bg-black/30 p-2.5 rounded-full"
      >
        <X size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="items-center px-6 mb-10">
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <View className="bg-purple-500/20 p-6 rounded-full mb-6 border border-purple-500/30">
              <Crown size={48} color="#a855f7" />
            </View>
          </MotiView>
          <Text className="text-white text-4xl font-bold text-center mb-2">Unlock PRO</Text>
          <Text className="text-gray-400 text-center text-lg">Take your BJJ journey to the next level</Text>
        </View>

        {/* Features List */}
        <View className="px-6 mb-10">
          <View className="bg-[#1e293b] rounded-3xl p-6 border border-white/5">
            {features.map((feature, index) => (
              <MotiView 
                key={index}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 100 }}
                className={`flex-row items-center ${index < features.length - 1 ? 'mb-5' : ''}`}
              >
                <View className="bg-purple-500/20 p-2.5 rounded-xl mr-4">
                  <Check size={18} color="#a855f7" />
                </View>
                <Text className="text-white font-medium text-base flex-1">{feature}</Text>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Pricing Card */}
        <View className="px-6 mb-8">
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 300 }}
            className="w-full bg-white/10 rounded-3xl p-6 border border-purple-500/30"
          >
            <View className="items-center">
              {/* Trial Badge */}
              <View className="bg-yellow-500/20 px-4 py-1.5 rounded-full mb-3 border border-yellow-500/30">
                <Text className="text-yellow-400 font-bold text-xs">7-DAY FREE TRIAL</Text>
              </View>

              <Text className="text-white text-5xl font-bold mb-1">
                {monthlyPackage?.product?.priceString || '$4.99'}
              </Text>
              <Text className="text-gray-400 mb-4">per month</Text>
              
              <Text className="text-gray-300 text-center text-sm">
                Try FREE for 7 days, then {monthlyPackage?.product?.priceString || '$4.99'}/month.
                Cancel anytime.
              </Text>
            </View>
          </MotiView>
        </View>
      </ScrollView>

      {/* Sticky Footer CTA */}
      <View className="p-6 bg-[#0f172a] border-t border-white/5">
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1.02 }}
          transition={{
            type: 'timing',
            duration: 1500,
            loop: true,
            repeatReverse: true,
          }}
        >
          <TouchableOpacity 
            onPress={handlePurchase} 
            disabled={purchasing}
            className="w-full rounded-2xl overflow-hidden"
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  {monthlyPackage ? 'Start 7-Day Free Trial' : 'Subscription Unavailable'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        <Text className="text-gray-500 text-xs text-center mt-4">
          By subscribing you agree to our Terms & Privacy Policy
        </Text>
        
        {/* Restore Purchases - Required by App Store */}
        <TouchableOpacity onPress={handleRestore} className="mt-4">
          <Text className="text-gray-400 text-center text-sm underline">
            Restore Purchases
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
