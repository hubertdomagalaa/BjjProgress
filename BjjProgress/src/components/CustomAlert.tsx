import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

export default function CustomAlert({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  onClose,
  onConfirm,
  confirmText = 'OK'
}: CustomAlertProps) {
  const { width } = Dimensions.get('window');

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={40} color="#4ade80" />;
      case 'error': return <AlertCircle size={40} color="#f87171" />;
      default: return <Info size={40} color="#60a5fa" />;
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'success': return ['rgba(74, 222, 128, 0.1)', 'rgba(74, 222, 128, 0.05)'];
      case 'error': return ['rgba(248, 113, 113, 0.1)', 'rgba(248, 113, 113, 0.05)'];
      default: return ['rgba(96, 165, 250, 0.1)', 'rgba(96, 165, 250, 0.05)'];
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'rgba(74, 222, 128, 0.3)';
      case 'error': return 'rgba(248, 113, 113, 0.3)';
      default: return 'rgba(96, 165, 250, 0.3)';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/80 px-6">
        <View 
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{ 
            borderWidth: 1, 
            borderColor: getBorderColor(),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10
          }}
        >
          <BlurView intensity={40} tint="dark" className="p-6 items-center">
            <LinearGradient
              colors={getGradientColors() as any}
              className="absolute inset-0"
            />
            
            <View className="mb-4 bg-white/10 p-3 rounded-full">
              {getIcon()}
            </View>

            <Text className="text-white font-bebas text-3xl mb-2 text-center tracking-wide">
              {title}
            </Text>
            
            <Text className="text-gray-300 font-lato text-center text-base mb-8 leading-6">
              {message}
            </Text>

            <View className="flex-row gap-3 w-full">
              {onConfirm && (
                <TouchableOpacity 
                  onPress={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 items-center"
                >
                  <Text className="text-gray-300 font-lato-bold">Cancel</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={onConfirm || onClose}
                className="flex-1 py-3 rounded-xl items-center"
              >
                <LinearGradient
                  colors={type === 'error' ? ['#ef4444', '#dc2626'] : ['#9333ea', '#7c3aed']}
                  className="absolute inset-0 rounded-xl"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Text className="text-white font-lato-bold text-base">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}
