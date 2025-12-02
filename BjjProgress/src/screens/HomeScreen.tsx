import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';
import { useAuth } from '../context/AuthContext';
import { getSparringsForTraining } from '../lib/sparring';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TrainingLog } from '../types';
import { TrendingUp, LogOut, Plus, Calendar, Trash2, BarChart3, Settings } from 'lucide-react-native';
import { getSubscriptionStatus, SubscriptionInfo, checkSubscription, getTrialDaysRemaining, isTrialActive } from '../utils/subscription';
import { haptics } from '../utils/haptics';
import { shadows } from '../styles/shadows';
import { LinearGradient } from 'expo-linear-gradient';
import { StatNumber } from '../components/StatNumber';
import { BeltDisplay } from '../components/BeltDisplay';
import { BeltLevel, Stripes } from '../constants/bjj-belts';
import PRODetailsModal from '../components/PRODetailsModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isPremium: false,
    isTrial: false,
    daysLeft: 0,
    message: 'Free Plan',
    tier: 'free',
  });
  const [belt, setBelt] = useState<BeltLevel>('white');
  const [stripes, setStripes] = useState<Stripes>(0);
  const [showPROModal, setShowPROModal] = useState(false);

  // Update subscription info when user changes
  useEffect(() => {
    if (user) {
      const info = getSubscriptionStatus(user);
      setSubscriptionInfo(info);
      
      // Load belt from user preferences
      if (user.prefs) {
        const prefs = user.prefs as any; // Type assertion to avoid TS errors
        setBelt((prefs.belt as BeltLevel) || 'white');
        setStripes((prefs.stripes as Stripes) || 0);
      }
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    try {
      const { databaseId, collectionId } = appwriteConfig;
      if (!databaseId || !collectionId) {
        throw new Error('Appwrite configuration missing');
      }

      const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('date')
        ]
      );
      // Cast documents to TrainingLog[] (Appwrite returns Document objects which include $id, etc.)
      const documents = response.documents as unknown as TrainingLog[];
      setLogs(documents);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [user])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLogs();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteTraining = async (logId: string, logType: string, logDate: string) => {
    Alert.alert(
      'Delete Training',
      `Delete this ${logType} training from ${new Date(logDate).toLocaleDateString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { sparringCollectionId, databaseId, collectionId } = appwriteConfig;

              if (!databaseId || !collectionId) {
                throw new Error('Appwrite configuration missing');
              }

              // Delete sparring sessions first
              const sparrings = await getSparringsForTraining(logId);
              
              if (sparringCollectionId) {
                for (const sparring of sparrings) {
                  if (sparring.$id) {
                    await databases.deleteDocument(
                      databaseId,
                      sparringCollectionId,
                      sparring.$id
                    );
                  }
                }
              }
              
              // Delete training log
              await databases.deleteDocument(
                databaseId,
                collectionId,
                logId
              );
              
              // Refresh list
              fetchLogs();
              
              Alert.alert('Success', 'Training deleted');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete training');
            }
          },
        },
      ]
    );
  };

  const renderLogItem = ({ item }: { item: TrainingLog }) => (
    <View 
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
              DURATION
            </Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="font-bebas text-5xl text-bjj-green leading-none">
                {item.duration}
              </Text>
              <Text className="font-inter text-lg text-gray-400">min</Text>
            </View>
          </View>
          
          {/* Delete Action */}
          <TouchableOpacity
            onPress={() => handleDeleteTraining(item.$id, item.type, item.date)}
            className="p-2.5 bg-bjj-red/10 rounded-lg"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
    </View>
  );

  return (
    <View className="flex-1 bg-dark-bg">
      <View className="px-4 pt-14 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Text className="font-bebas text-3xl text-white tracking-wider">MY TRAININGS</Text>
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity 
          onPress={async () => {
            haptics.medium();
            await logout();
            navigation.navigate('Welcome');
          }}
          className="bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-xl flex-row items-center gap-2"
          activeOpacity={0.7}
        >
            <LogOut size={16} color="#ef4444" />
            <Text className="text-red-400 font-inter-bold text-xs">Logout</Text>
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
        >
          <BeltDisplay belt={belt} stripes={stripes} size="normal" />
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4">
      {/* Action Buttons Row with PRO Badge */}
      <View className="flex-row gap-2 mb-6 justify-end items-center">
        {/* PRO Compact Badge (only show for PRO users) - CLICKABLE */}
        {checkSubscription(user?.prefs).isPro && (
          <TouchableOpacity
            onPress={() => {
              haptics.medium();
              setShowPROModal(true);
            }}
            className="bg-purple-500/20 border-2 border-purple-500/50 px-3 py-2 rounded-xl flex-row items-center gap-2"
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
            activeOpacity={0.7}
          >
            <View className="bg-purple-500/30 p-1 rounded-full">
              <TrendingUp size={14} color="#a855f7" />
            </View>
            <Text className="text-purple-400 font-inter-bold text-xs">PRO</Text>
            <Text className="text-green-400 font-inter-bold text-[10px]">✓</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          className="bg-white/10 p-2.5 rounded-full border border-white/10"
          onPress={() => {
            haptics.light();
            navigation.navigate('Stats');
          }}
        >
          <BarChart3 size={20} color="#60a5fa" />
        </TouchableOpacity>
        <TouchableOpacity
            className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 rounded-full"
            onPress={() => {
              haptics.medium();
              navigation.navigate('AddLog');
            }}
          >
            <Text className="text-white font-lato text-sm font-bold">+ Add</Text>
          </TouchableOpacity>
      </View>

      {/* Trial Countdown or Upgrade Banner (for non-PRO users only) */}
      {!checkSubscription(user?.prefs).isPro && (
        <>
          {/* Show trial countdown if user has an active trial */}
          {isTrialActive(user?.prefs) && (
            <View className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-blue-400 font-inter-bold text-base mb-1">
                    🎁 Trial: {getTrialDaysRemaining((user?.prefs as any)?.trial_end_date)} day{getTrialDaysRemaining((user?.prefs as any)?.trial_end_date) !== 1 ? 's' : ''} left
                  </Text>
                  <Text className="text-gray-300 font-inter text-sm">
                    Enjoying BJJ Progress? Upgrade to keep tracking!
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Paywall')}
                className="bg-blue-500 rounded-lg py-3 mt-3"
                activeOpacity={0.8}
              >
                <Text className="text-white font-inter-bold text-center">
                  Upgrade to PRO
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Show upgrade banner only if trial expired or no trial */}
          {!isTrialActive(user?.prefs) && (
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
                      <TrendingUp size={18} color="#a855f7" />
                    </View>
                    <View>
                      <Text className="text-white font-lato text-base font-bold">Unlimited Tracking</Text>
                      <View className="bg-yellow-500/20 px-2 py-0.5 rounded text-xs border border-yellow-500/30 self-start mt-1">
                        <Text className="text-yellow-400 text-[10px] font-bold">RECOMMENDED</Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-300 font-lato text-xs leading-4 mt-2">
                    Unlimited tracking, advanced stats & more.
                  </Text>
                </View>
                
                <View className="bg-white px-4 py-2.5 rounded-xl shadow-lg">
                  <Text className="text-purple-900 font-lato-bold text-xs">Upgrade</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </>
      )}


      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#b123c7" />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.$id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#8b5cf6"
              colors={['#8b5cf6', '#ec4899']}  // Android gradient
              progressBackgroundColor="#151b2e"
              title="Pull to refresh"  // iOS
              titleColor="#8b5cf6"
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-gray-400 text-lg">No trainings yet</Text>
              <Text className="text-gray-500 text-sm mt-2">Add your first training!</Text>
            </View>
          }
        />
      )}
      </View>
      
      {/* PRO Details Modal */}
      <PRODetailsModal 
        visible={showPROModal}
        onClose={() => setShowPROModal(false)}
        renewalDate={(user?.prefs as any)?.subscription_renewal_date}
      />
    </View>
  );
}
