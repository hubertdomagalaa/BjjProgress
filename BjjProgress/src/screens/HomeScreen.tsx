import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';
import { useAuth } from '../context/AuthContext';
import { getSparringsForTraining } from '../lib/sparring';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TrainingLog } from '../types';
import { TrendingUp, LogOut, Plus, Calendar, Trash2, BarChart3, Settings, Users, Crown } from 'lucide-react-native';
import { usePurchases } from '../context/PurchasesContext';
import { haptics } from '../utils/haptics';
import { shadows } from '../styles/shadows';
import { LinearGradient } from 'expo-linear-gradient';
import { StatNumber } from '../components/StatNumber';
import { BeltDisplay } from '../components/BeltDisplay';
import { BeltLevel, Stripes } from '../constants/bjj-belts';
import PRODetailsModal from '../components/PRODetailsModal';
import CustomAlert from '../components/CustomAlert';

import { MotiView } from 'moti';
import LottieView from 'lottie-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isPro } = usePurchases();
  const queryClient = useQueryClient();
  
  const { data: logs = [], isLoading: loading, refetch, isRefetching: refreshing } = useQuery({
    queryKey: ['trainingLogs', user?.$id],
    queryFn: async () => {
      if (!user) return [];
      const { databaseId, collectionId } = appwriteConfig;
      if (!databaseId || !collectionId) throw new Error('Appwrite config missing');
      
      const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('date')
        ]
      );
      return response.documents as unknown as TrainingLog[];
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute - reduces unnecessary refetches for better performance
  });
  const [belt, setBelt] = useState<BeltLevel>('white');
  const [stripes, setStripes] = useState<Stripes>(0);
  // PRO Modal removed for free launch - subscription features disabled
  
  // Custom Alert State
  const [alert, setAlert] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    type: 'info' as 'success' | 'error' | 'info',
    onConfirm: undefined as (() => void) | undefined,
    confirmText: 'OK'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ visible: true, title, message, type, onConfirm: undefined, confirmText: 'OK' });
  };

  // Update user belt info when user changes
  useEffect(() => {
    if (user) {
      // Load belt from user preferences
      if (user.prefs) {
        const prefs = user.prefs as any; // Type assertion to avoid TS errors
        setBelt((prefs.belt as BeltLevel) || 'white');
        setStripes((prefs.stripes as Stripes) || 0);
      }
    }
  }, [user]);

  // useFocusEffect to refetch when screen comes into focus (optional, but good for ensuring fresh data)
  useFocusEffect(
    useCallback(() => {
      // We can rely on React Query's staleTime/gcTime, but if we want to force check:
      // refetch();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    // Haptic feedback on start
    haptics.medium();
    await refetch();
    // Haptic feedback on completion
    haptics.success();
  }, [refetch]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteTraining = (logId: string, logType: string, logDate: string) => {
    setAlert({
      visible: true,
      title: t('home.delete_title'),
      message: t('home.delete_confirm', { type: logType, date: new Date(logDate).toLocaleDateString() }),
      type: 'error',
      confirmText: t('common.delete'),
      onConfirm: () => {
        // Close confirmation alert first
        setAlert(prev => ({ ...prev, visible: false }));
        
        // Use requestAnimationFrame to ensure UI updates before async work
        requestAnimationFrame(() => {
          performDelete(logId);
        });
      }
    });
  };

  const performDelete = async (logId: string) => {
    try {
      const { sparringCollectionId, databaseId, collectionId } = appwriteConfig;

      if (!databaseId || !collectionId) {
        throw new Error('Appwrite configuration missing');
      }

      // Delete sparring sessions first
      const sparrings = await getSparringsForTraining(logId);
      
      if (sparringCollectionId) {
        await Promise.all(
          sparrings
            .filter(sparring => sparring.$id)
            .map(sparring => 
              databases.deleteDocument(databaseId, sparringCollectionId, sparring.$id!)
            )
        );
      }
      
      // Delete training log
      await databases.deleteDocument(
        databaseId,
        collectionId,
        logId
      );
      
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['trainingLogs', user?.$id] });
      
      // Show success alert
      showAlert(t('common.success'), t('home.delete_success'), 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showAlert(t('common.error'), t('home.delete_error'), 'error');
    }
  };

  const renderTrainingCard = ({ item, index }: { item: TrainingLog, index: number }) => (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: index * 100 }}
      className="mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#151b2e',
        ...shadows.card,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
      }}
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'transparent']}
        className="absolute inset-0"
        pointerEvents="none"
      />

      <TouchableOpacity 
        onPress={() => {
          haptics.light();
          navigation.navigate('AddLog', { log: item });
        }}
        className="p-5"
        activeOpacity={0.85}
        accessibilityLabel={`Training on ${new Date(item.date).toLocaleDateString()}`}
        accessibilityRole="button"
      >
        <View className="flex-row justify-between items-start mb-4">
          {/* Date - Giant Number Design */}
          <View className="flex-row items-baseline gap-3">
            <Text className="font-bebas text-6xl text-white leading-none">
              {new Date(item.date).getDate()}
            </Text>
            <View>
              <Text className="font-inter-bold text-sm uppercase text-gray-400">
                {new Date(item.date).toLocaleDateString(undefined, { month: 'short' })}
              </Text>
              <Text className="font-inter text-xs text-gray-600">
                {new Date(item.date).getFullYear()}
              </Text>
            </View>
          </View>
          
          {/* Type Badge */}
          <View className={`px-3 py-1.5 rounded-full ${item.type === 'GI' ? 'bg-bjj-blue/20' : 'bg-bjj-orange/20'}`}>
            <Text className={`font-inter-bold text-xs ${item.type === 'GI' ? 'text-bjj-blue' : 'text-bjj-orange'}`}>
              {item.type}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between mb-3">
          {/* Duration - Giant Number */}
          <View>
            <Text className="text-[9px] font-inter-bold uppercase tracking-widest text-gray-500 mb-1">
              {t('home.duration')}
            </Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="font-bebas text-5xl text-bjj-green leading-none">
                {item.duration}
              </Text>
              <Text className="font-inter text-lg text-gray-400">{t('home.min')}</Text>
            </View>
          </View>
          
          {/* Delete Action */}
          <TouchableOpacity
            onPress={() => handleDeleteTraining(item.$id, item.type, item.date)}
            className="p-2.5 bg-bjj-red/10 rounded-lg"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel={t('home.delete_title')}
            accessibilityRole="button"
          >
            <Trash2 size={20} color="#ef4444" style={{ opacity: 0.8 }} />
          </TouchableOpacity>
        </View>

        {item.notes ? (
          <Text className="text-gray-400 text-sm font-lato leading-5" numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-dark-bg" style={{ maxWidth: 700, width: '100%', alignSelf: 'center' }}>
      <View className="px-4 pt-14 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Text className="font-bebas text-3xl text-white tracking-wider">{t('home.title')}</Text>
          </View>
          
          {/* Friends Button Removed as per request */}

          {/* Logout Button */}
          <TouchableOpacity 
          onPress={async () => {
            haptics.medium();
            await logout();
            navigation.navigate('Welcome');
          }}
          className="bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-xl flex-row items-center gap-2"
          activeOpacity={0.7}
          accessibilityLabel={t('common.logout')}
          accessibilityRole="button"
        >
            <LogOut size={16} color="#ef4444" />
            <Text className="text-red-400 font-inter-bold text-xs">{t('common.logout')}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Belt Display */}
        <TouchableOpacity 
          onPress={() => {
            haptics.light();
            navigation.navigate('Settings');
          }}
          className="mt-2 flex-row items-center justify-between bg-dark-card/50 rounded-xl p-3 border border-gray-700/50"
          activeOpacity={0.7}
          accessibilityLabel={t('common.settings')}
          accessibilityRole="button"
        >
          <BeltDisplay belt={belt} stripes={stripes} size="normal" />
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4">
      {/* Action Buttons Row - PRO Badge removed for free launch */}
      <View className="flex-row gap-2 mb-6 justify-end items-center">
        
        <TouchableOpacity
          className="bg-white/10 p-2.5 rounded-full border border-white/10"
          onPress={() => {
            haptics.light();
            navigation.navigate('Stats');
          }}
          accessibilityLabel="Statistics"
          accessibilityRole="button"
        >
          <BarChart3 size={20} color="#60a5fa" />
        </TouchableOpacity>
        <TouchableOpacity
            className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 rounded-full"
            onPress={() => {
              haptics.medium();
              navigation.navigate('AddLog');
            }}
            accessibilityLabel={t('home.add')}
            accessibilityRole="button"
          >
            <Text className="text-white font-lato text-sm font-bold">{t('home.add')}</Text>
          </TouchableOpacity>
      </View>

      {/* Upgrade Banner (for non-PRO users only) */}
      {!isPro && (
        <TouchableOpacity 
          className="mb-8 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#1e293b',
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.2)'
          }}
          onPress={() => navigation.navigate('Paywall')}
          activeOpacity={0.9}
          accessibilityLabel={t('home.upgrade_to_pro')}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['rgba(88, 28, 135, 0.4)', 'rgba(30, 58, 138, 0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute inset-0"
          />
          
          <View className="p-5 flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center mb-1">
                <View className="bg-purple-500/30 p-2 rounded-full mr-3">
                  <Crown size={18} color="#a855f7" />
                </View>
                <View>
                  <Text className="text-white font-lato text-base font-bold" adjustsFontSizeToFit numberOfLines={2}>
                    Unlock PRO Features
                  </Text>
                  <View className="bg-yellow-500/20 px-2 py-0.5 rounded text-xs border border-yellow-500/30 self-start mt-1">
                    <Text className="text-yellow-400 text-[10px] font-bold">{t('home.recommended')}</Text>
                  </View>
                </View>
              </View>
              <Text className="text-gray-300 font-lato text-xs leading-4 mt-2" adjustsFontSizeToFit numberOfLines={2}>
                Advanced stats, sparring analytics, and more!
              </Text>
            </View>
            
            <View className="bg-white px-4 py-2.5 rounded-xl shadow-lg">
              <Text className="text-purple-900 font-lato-bold text-xs">
                Upgrade
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}


      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#b123c7" />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderTrainingCard}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20, maxWidth: 800, alignSelf: 'center', width: '100%' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="transparent" // Hide default spinner
              colors={['transparent']} // Hide default spinner on Android
              style={{ backgroundColor: 'transparent' }}
            />
          }
          ListHeaderComponent={
            <View className="mb-6 px-4">
              {refreshing && (
                <View className="items-center justify-center py-4 h-20">
                  <LottieView
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }}
                    // Using a default loading animation if no custom one exists
                    // You can replace this with require('../assets/animations/belt-tying.json')
                    source={require('../../assets/loading.json')} 
                  />
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            <View className="items-center mt-20 px-6">
              <View className="bg-white/5 p-6 rounded-full mb-4 border border-white/10">
                <Calendar size={48} color="#6b7280" />
              </View>
              <Text className="text-white font-bebas text-2xl tracking-wide mb-2">
                NO TRAININGS LOGGED
              </Text>
              <Text className="text-gray-400 text-center font-lato text-sm mb-8 leading-5">
                Start tracking your BJJ journey! Log your classes, sparring sessions, and competition results.
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  haptics.medium();
                  navigation.navigate('AddLog');
                }}
                className="bg-purple-600 px-8 py-3 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-2">
                  <Plus size={20} color="#fff" />
                  <Text className="text-white font-inter-bold text-base">Log First Training</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      </View>
      
      {/* PRO Details Modal removed for free launch */}

      {/* Custom Alert */}
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
        onConfirm={alert.onConfirm}
        confirmText={alert.confirmText}
      />
    </View>
  );
}
