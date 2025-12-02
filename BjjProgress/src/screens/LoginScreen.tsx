import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Dumbbell, Mail, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0f172a] justify-center p-6">
      <View className="items-center mb-12">
        <View className="bg-purple-500/20 p-6 rounded-full mb-6 border border-purple-500/30 shadow-lg shadow-purple-500/50">
          <Dumbbell size={48} color="#a855f7" />
        </View>
        <Text className="text-white text-4xl font-montserrat font-bold mb-2">BJJ Progress</Text>
        <Text className="text-gray-400 font-lato text-lg">Track your journey to black belt</Text>
      </View>

      <View className="space-y-4">
        <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 flex-row items-center">
          <Mail size={20} color="#94a3b8" style={{ marginRight: 12 }} />
          <TextInput
            className="flex-1 text-white font-lato text-base"
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 flex-row items-center">
          <Lock size={20} color="#94a3b8" style={{ marginRight: 12 }} />
          <TextInput
            className="flex-1 text-white font-lato text-base"
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mt-4"
        >
          <LinearGradient
            colors={['#a855f7', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 rounded-2xl items-center shadow-lg shadow-purple-500/40"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-lato-bold text-lg">Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="mt-4 bg-white/5 py-4 rounded-2xl border border-white/10"
        >
          <Text className="text-white font-lato-bold text-lg text-center">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

