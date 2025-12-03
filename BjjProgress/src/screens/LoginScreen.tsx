import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Dumbbell, Mail, Lock, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../components/CustomAlert';
import { Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, recoverPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Determine initial mode from params (default to login if not specified)
  const initialMode = route.params?.initialMode || 'login';
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');

  // Alert State
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' as 'success' | 'error' | 'info' });
  
  // Password Recovery State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ visible: true, title, message, type });
  };


  const handleAuthAction = async () => {
    if (!email || !password) {
      showAlert('Missing Fields', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (error: any) {
      showAlert(isLoginMode ? 'Login Failed' : 'Registration Failed', error.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      showAlert('Missing Email', 'Please enter your email address', 'error');
      return;
    }

    setResetLoading(true);
    try {
      await recoverPassword(resetEmail);
      setShowForgotModal(false);
      showAlert('Email Sent', 'Check your inbox for password reset instructions', 'success');
      setResetEmail('');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to send reset email', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0f172a] justify-center p-6">
      <View className="items-center mb-12">
        <Image 
          source={require('../../assets/appicon.jpg')} 
          className="w-32 h-32 rounded-3xl mb-6 shadow-lg shadow-purple-500/50"
        />
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

        {isLoginMode && (
          <TouchableOpacity 
            onPress={() => setShowForgotModal(true)}
            className="self-end"
          >
            <Text className="text-purple-400 font-lato text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleAuthAction}
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
              <Text className="text-white font-lato-bold text-lg">
                {isLoginMode ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsLoginMode(!isLoginMode)}
          disabled={loading}
          className="mt-4 py-4 rounded-2xl border border-transparent"
        >
          <Text className="text-gray-400 font-lato text-center">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <Text className="text-purple-400 font-bold">
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setShowForgotModal(false)}>
          <View className="flex-1 bg-black/80 justify-center items-center p-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="bg-[#1e293b] w-full max-w-sm p-6 rounded-3xl border border-white/10">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-white font-bebas text-2xl tracking-wide">Reset Password</Text>
                  <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                    <X size={24} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 font-lato mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </Text>

                <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 flex-row items-center">
                  <Mail size={20} color="#94a3b8" style={{ marginRight: 12 }} />
                  <TextInput
                    className="flex-1 text-white font-lato text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#64748b"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={resetLoading}
                >
                  <LinearGradient
                    colors={['#a855f7', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3.5 rounded-xl items-center"
                  >
                    {resetLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-lato-bold text-base">Send Reset Link</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

