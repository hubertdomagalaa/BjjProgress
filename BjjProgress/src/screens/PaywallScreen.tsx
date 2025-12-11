import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BarChart3, TrendingUp, Award, Gift, Crown, Check, X } from 'lucide-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Constants from 'expo-constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const STRIPE_PRO_MONTHLY_PRICE_ID = (Constants.expoConfig?.extra?.stripeProMonthlyPriceId as string) || 'price_1QJzwxB123c7agjhQ4TN4e3o';
const BACKEND_URL = (Constants.expoConfig?.extra?.backendUrl as string) || 'https://bjjprogress-backend.vercel.app';

export default function PaywallScreen({ navigation }: Props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const features = [
    'Unlimited Training Logs',
    'Advanced Sparring Stats',
    'Win Rate Analytics',
    'Submission Breakdown',
    'Cloud Backup'
  ];

  const handleSubscribe = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Starting payment flow...');
      console.log('Backend URL:', BACKEND_URL);
      
      // 1. Create payment intent on your backend
      const response = await fetch(`${BACKEND_URL}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.$id,
          email: user.email,
          priceId: STRIPE_PRO_MONTHLY_PRICE_ID,
        }),
      });

      console.log('📡 Backend response status:', response.status);

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        
        // Show helpful error message based on status
        let errorMessage = 'Payment failed. ';
        if (response.status === 401) {
          errorMessage += 'Backend authentication issue. Please contact support.';
        } else if (response.status === 404) {
          errorMessage += 'Backend endpoint not found. Please check configuration.';
        } else if (response.status >= 500) {
          errorMessage += 'Server error. Please try again later.';
        } else {
          errorMessage += `Error ${response.status}: ${errorText.substring(0, 100)}`;
        }
        
        Alert.alert('Backend Error', errorMessage);
        setLoading(false);
        return;
      }

      // Try to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('❌ JSON parse error. Response was:', text.substring(0, 200));
        Alert.alert(
          'Configuration Error',
          'Backend returned invalid data. Please check:\n1. Backend URL is correct\n2. Backend is deployed\n3. Environment variables are set'
        );
        setLoading(false);
        return;
      }

      const { paymentIntent, ephemeralKey, customer } = data;

      if (!paymentIntent || !ephemeralKey || !customer) {
        console.error('❌ Missing required data:', data);
        Alert.alert('Error', 'Invalid payment data received from backend');
        setLoading(false);
        return;
      }

      console.log('✅ Payment data received, initializing sheet...');

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'BjjProgress',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          email: user.email,
        },
        returnURL: 'bjjprogress://stripe-redirect',
      });

      if (initError) {
        console.error('❌ Payment sheet init error:', initError);
        Alert.alert('Error', initError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Payment sheet initialized');

      // 3. Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.log('⚠️ Payment canceled:', paymentError.message);
        Alert.alert('Payment Canceled', paymentError.message);
      } else {
        console.log('✅ Payment successful!');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('Home');
        }, 5000); // 5 seconds for better visibility
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      
      // Network error
      if (error.message?.includes('Network request failed')) {
        Alert.alert(
          'Network Error',
          'Could not connect to backend. Please check:\n1. Your internet connection\n2. Backend is running\n3. Backend URL is correct'
        );
      } else {
        Alert.alert('Error', error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Email: support@bjjprogress.com\n\nWe\'ll help you with any questions!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-[#0f172a]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Close Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute top-12 right-4 z-10 bg-black/20 p-2 rounded-full"
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>

        {/* Hero Section */}
        <View className="items-center pt-20 pb-10 px-4 w-full max-w-3xl self-center">
          <View className="bg-purple-500/20 p-6 rounded-full mb-6 border border-purple-500/30 shadow-lg shadow-purple-500/50">
            <Crown size={48} color="#a855f7" />
          </View>
          <Text className="text-white text-4xl font-montserrat text-center mb-2" adjustsFontSizeToFit numberOfLines={1}>
            Unlock Pro
          </Text>
          <Text className="text-gray-400 text-center font-lato text-lg px-4" adjustsFontSizeToFit numberOfLines={2}>
            Take your BJJ journey to the next level
          </Text>
        </View>

        {/* Features List - Premium Cards */}
        <View className="px-6 mb-10 w-full max-w-3xl self-center">
          <View className="bg-[#1e293b] rounded-3xl p-6 border border-white/5 shadow-xl shadow-black/30">
            {features.map((feature, index) => (
              <MotiView 
                key={index} 
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: index * 100 }}
                className="flex-row items-center mb-6 last:mb-0"
              >
                <View className="bg-purple-500/10 p-3 rounded-xl mr-4">
                  <Check size={20} color="#a855f7" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-lato-bold text-base" adjustsFontSizeToFit numberOfLines={2}>{feature}</Text>
                </View>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Pricing Card */}
        <View className="px-6 mb-8 w-full max-w-3xl self-center">
          <View className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-1 rounded-3xl border border-purple-500/30">
            <View className="bg-[#1e293b]/90 p-6 rounded-[20px] items-center">
              <View className="bg-green-500/20 px-3 py-1 rounded-full mb-4 border border-green-500/30">
                <Text className="text-green-400 font-bold text-xs">7 DAYS FREE TRIAL</Text>
              </View>
              
              <Text className="text-white font-montserrat text-5xl mb-1" adjustsFontSizeToFit numberOfLines={1}>$4.99</Text>
              <Text className="text-gray-400 font-lato mb-6">per month</Text>
              
              <Text className="text-gray-300 text-center text-sm mb-2" adjustsFontSizeToFit numberOfLines={2}>
                Recurring billing. Cancel anytime.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Subscribe Button */}
      <View className="p-6 bg-[#0f172a] border-t border-white/5">
        {Platform.OS === 'ios' ? (
          <MotiView 
            from={{ scale: 1 }}
            animate={{ scale: 1.02 }}
            transition={{
              type: 'timing',
              duration: 1500,
              loop: true,
              repeatReverse: true,
            }}
            className="w-full py-4 rounded-2xl bg-green-500/20 border border-green-500/30 items-center"
          >
            <Text className="text-green-400 font-lato-bold text-lg text-center">
              🎉 Launch Special: Free Access Active!
            </Text>
            <Text className="text-green-500/70 text-xs text-center mt-1">
              Enjoy PRO features for free during our launch.
            </Text>
          </MotiView>
        ) : (
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1.03 }}
            transition={{
              type: 'timing',
              duration: 1500,
              loop: true,
              repeatReverse: true,
            }}
          >
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={loading}
            className="w-full rounded-2xl overflow-hidden"
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center justify-center"
              style={{
                 shadowColor: '#a855f7',
                 shadowOffset: { width: 0, height: 4 },
                 shadowOpacity: 0.3,
                 shadowRadius: 8,
                 elevation: 8,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-lato-bold text-lg text-center">
                  Start Free Trial
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          </MotiView>
        )}
        <Text className="text-gray-500 text-xs text-center mt-4">
          By subscribing you agree to our Terms & Privacy Policy
        </Text>
        
        {/* Restore Purchases - Required for App Store */}
        <TouchableOpacity 
          onPress={() => {
            Alert.alert('Restore Purchases', 'To restore your purchase, please contact support with your receipt.');
          }}
          className="mt-4"
        >
          <Text className="text-gray-400 text-center font-lato text-sm underline">
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Support Link */}
        <TouchableOpacity onPress={handleContactSupport} className="mb-12 mt-4">
          <Text className="text-purple-400 text-center font-lato">
            Questions? Contact Support →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <View className="mx-6">
            <LinearGradient
              colors={['#8b5cf6', '#6366f1', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl p-8 items-center"
              style={{
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.6,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              {/* Crown Icon with Glow */}
              <View className="bg-white/20 p-6 rounded-full mb-6">
                <Crown size={64} color="#fff" strokeWidth={2.5} />
              </View>

              {/* Title */}
              <Text className="text-white font-bebas text-5xl text-center mb-3 tracking-wider">
                WELCOME TO PRO!
              </Text>

              {/* Subtitle */}
              <Text className="text-white/90 font-inter text-center text-lg px-4 mb-8">
                Your subscription is now active.{'\n'}
                Unlimited BJJ tracking unlocked! 🥋
              </Text>

              {/* Checkmarks */}
              <View className="space-y-3 mb-6">
                {['Unlimited trainings', 'Advanced statistics', 'Sparring analytics'].map((item, i) => (
                  <View key={i} className="flex-row items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
                    <Check size={20} color="#4ade80" strokeWidth={3} />
                    <Text className="text-white font-inter-bold">{item}</Text>
                  </View>
                ))}
              </View>

              {/* Auto-redirect message */}
              <Text className="text-white/60 font-inter text-sm">
                Redirecting to home...
              </Text>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
}
