import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { databases, appwriteConfig, Query } from '../lib/appwrite';
import { useAuth } from '../context/AuthContext';
import { TrainingLog } from '../types';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { BarChart3, TrendingUp, Filter, ArrowLeft, LogOut } from 'lucide-react-native';
import { StatNumber } from '../components/StatNumber';
import { bjjColors } from '../constants/bjj-colors';
import { getSparringsForTraining } from '../lib/sparring';
import { Sweep } from '../constants/bjj-guards';
import { PositionScore, POINT_POSITIONS } from '../constants/bjj-positions';
import { haptics } from '../utils/haptics';
import { shadows } from '../styles/shadows';
import { checkSubscription, isTrialExpired } from '../utils/subscription';


type TimeRange = 'WEEK' | 'MONTH' | 'YEAR';
type TrainingType = 'ALL' | 'GI' | 'NO-GI';

interface SubmissionEvent {
  type: 'given' | 'received';
  technique: string;
}

export default function StatsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('WEEK');
  const [trainingType, setTrainingType] = useState<TrainingType>('ALL');
  const [sparringData, setSparringData] = useState<any[]>([]);

  // Check if user has access (PRO or active trial)
  const { hasAccess } = checkSubscription(user?.prefs);
  const trialExpired = isTrialExpired(user?.prefs);
  const isBlocked = !hasAccess && trialExpired;

  // Block stats for non-PRO users with expired trial
  if (isBlocked) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center p-6">
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          className="w-full max-w-md rounded-3xl p-8 items-center"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="bg-orange-500/20 p-4 rounded-full mb-4">
            <BarChart3 size={40} color="#f97316" />
          </View>
          
          <Text className="text-white font-inter-bold text-2xl text-center mb-2">
            Statistics Locked 🔒
          </Text>
          
          <Text className="text-gray-400 font-inter text-center mb-6">
            Your trial has ended. Upgrade to PRO to access detailed statistics and insights about your BJJ progress!
          </Text>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Paywall' as never)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-4 px-8 w-full mb-3"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899']}
              className="absolute inset-0 rounded-xl"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Text className="text-white font-inter-bold text-center text-lg relative z-10">
              Unlock Statistics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-2"
          >
            <Text className="text-gray-500 font-inter">Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const fetchLogs = async () => {
    if (!user) return;
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('date'),
          Query.limit(100)
        ]
      );
      const fetchedLogs = response.documents as unknown as TrainingLog[];
      setLogs(fetchedLogs);

      // Fetch sparring data for all logs
      const allSparrings = [];
      for (const log of fetchedLogs) {
        try {
          const sparrings = await getSparringsForTraining(log.$id);
          allSparrings.push(...sparrings);
        } catch (e) {
          // Skip if error
        }
      }
      setSparringData(allSparrings);
    } catch (error) {
      console.error('Error fetching logs for stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [user])
  );

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeRange) {
      case 'WEEK':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'YEAR':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    let filtered = logs.filter(log => new Date(log.date) >= cutoff);
    
    // Filter by training type
    if (trainingType !== 'ALL') {
      filtered = filtered.filter(log => log.type === trainingType);
    }

    return filtered;
  }, [logs, timeRange, trainingType]);

  // Calculate submission type stats from sparring data
  const submissionTypeStats = useMemo(() => {
    const typeCount: { [key: string]: { given: number; received: number } } = {};
    
    // FIXED: Only count sparring sessions from filtered logs
    const filteredLogIds = filteredLogs.map(log => log.$id);
    const relevantSparring = sparringData.filter(s => 
      filteredLogIds.includes(s.training_log_id)
    );
    
    relevantSparring.forEach(sparring => {
      try {
        const events: SubmissionEvent[] = JSON.parse(sparring.submissions_list || '[]');
        events.forEach(event => {
          if (!typeCount[event.technique]) {
            typeCount[event.technique] = { given: 0, received: 0 };
          }
          if (event.type === 'given') {
            typeCount[event.technique].given++;
          } else {
            typeCount[event.technique].received++;
          }
        });
      } catch (e) {
        // Skip invalid data
      }
    });

    // Convert to array and sort by total count
    return Object.entries(typeCount)
      .map(([technique, counts]) => ({
        technique,
        given: counts.given,
        received: counts.received,
        total: counts.given + counts.received,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 submissions
  }, [sparringData, filteredLogs]);

  // Calculate sweep guard stats from sparring data
  const sweepGuardStats = useMemo(() => {
    const guardCount: { [key: string]: { given: number; received: number } } = {};
    
    const filteredLogIds = filteredLogs.map(log => log.$id);
    const relevantSparring = sparringData.filter(s => 
      filteredLogIds.includes(s.training_log_id)
    );
    
    relevantSparring.forEach(sparring => {
      try {
        const sweeps: Sweep[] = JSON.parse(sparring.sweeps_list || '[]');
        sweeps.forEach(sweep => {
          if (!guardCount[sweep.guard]) {
            guardCount[sweep.guard] = { given: 0, received: 0 };
          }
          if (sweep.type === 'given') {
            guardCount[sweep.guard].given++;
          } else {
            guardCount[sweep.guard].received++;
          }
        });
      } catch (e) {
        // Skip invalid data
      }
    });

    // Convert to array and sort by total count
    return Object.entries(guardCount)
      .map(([guard, counts]) => ({
        guard,
        given: counts.given,
        received: counts.received,
        total: counts.given + counts.received,
      }))
      .sort((a, b) => b.total - a.total);
  }, [sparringData, filteredLogs]);

  // Calculate position stats from sparring data
  const positionStats = useMemo(() => {
    const posCount: { [key: string]: { me: number; opponent: number } } = {};
    
    const filteredLogIds = filteredLogs.map(log => log.$id);
    const relevantSparring = sparringData.filter(s => 
      filteredLogIds.includes(s.training_log_id)
    );
    
    relevantSparring.forEach(sparring => {
      try {
        const positions: PositionScore[] = JSON.parse(sparring.positions_list || '[]');
        positions.forEach(pos => {
          const posName = POINT_POSITIONS[pos.position].name;
          if (!posCount[posName]) {
            posCount[posName] = { me: 0, opponent: 0 };
          }
          if (pos.type === 'me') {
            posCount[posName].me++;
          } else {
            posCount[posName].opponent++;
          }
        });
      } catch (e) {
        // Skip invalid data
      }
    });

    return Object.entries(posCount)
      .map(([position, counts]) => ({
        position,
        me: counts.me,
        opponent: counts.opponent,
        total: counts.me + counts.opponent,
      }))
      .sort((a, b) => b.total - a.total);
  }, [sparringData, filteredLogs]);

  const stats = useMemo(() => {
    let totalDuration = 0;
    let giCount = 0;
    let noGiCount = 0;

    // Count from training logs
    filteredLogs.forEach(log => {
      totalDuration += log.duration || 0;
      if (log.type === 'GI') giCount++;
      else noGiCount++;
    });

    // Get sparring sessions for filtered logs only
    const filteredLogIds = filteredLogs.map(log => log.$id);
    const relevantSparring = sparringData.filter(s => 
      filteredLogIds.includes(s.training_log_id)
    );

    // Calculate submissions from sparring sessions (the correct source)
    let totalSubsGiven = 0;
    let totalSubsReceived = 0;

    relevantSparring.forEach(sparring => {
      totalSubsGiven += sparring.submission_given || 0;
      totalSubsReceived += sparring.submission_received || 0;
    });

    const totalSubsInvolved = totalSubsGiven + totalSubsReceived;
    const winRate = totalSubsInvolved > 0 
      ? Math.round((totalSubsGiven / totalSubsInvolved) * 100) 
      : 0;

    // Calculate free trial days remaining
    let trialDaysRemaining = 0;
    if (user?.$createdAt) {
      const createdDate = new Date(user.$createdAt);
      const now = new Date();
      const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      trialDaysRemaining = Math.max(0, 7 - daysSinceCreation); // 7-day trial
    }

    // Process submission techniques for analytical charts
    const submissionsGivenByTechnique: { [key: string]: number } = {};
    const submissionsReceivedByTechnique: { [key: string]: number } = {};

    relevantSparring.forEach(sparring => {
      try {
        const events: SubmissionEvent[] = JSON.parse(sparring.submissions_list || '[]');
        events.forEach(event => {
          if (event.type === 'given') {
            submissionsGivenByTechnique[event.technique] = 
              (submissionsGivenByTechnique[event.technique] || 0) + 1;
          } else {
            submissionsReceivedByTechnique[event.technique] = 
              (submissionsReceivedByTechnique[event.technique] || 0) + 1;
          }
        });
      } catch (e) {
        // Skip invalid data
      }
    });

    return {
      totalDuration,
      winRate,
      totalSubsGiven,
      totalSubsReceived,
      totalTrainings: filteredLogs.length,
      totalSparringSessions: relevantSparring.length,
      giCount,
      noGiCount,
      trialDaysRemaining,
      submissionsGivenByTechnique,
      submissionsReceivedByTechnique,
    };
  }, [filteredLogs, sparringData, user]);

  const chartData = useMemo(() => {
    const result = [];
    
    if (timeRange === 'WEEK') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayIndex = d.getDay();
        const dayName = days[dayIndex];
        
        const count = filteredLogs.filter(l => 
          new Date(l.date).toDateString() === d.toDateString()
        ).length;
        
        result.push({
          value: count,
          label: dayName.slice(0, 1),
          frontColor: count > 0 ? '#a855f7' : '#4b5563',
        });
      }
    } else if (timeRange === 'MONTH') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const count = filteredLogs.filter(l => {
          const logDate = new Date(l.date);
          return logDate >= weekStart && logDate <= weekEnd;
        }).length;
        
        result.push({
          value: count,
          label: `W${4-i}`,
          frontColor: count > 0 ? '#a855f7' : '#4b5563',
        });
      }
    } else {
      const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthIndex = monthDate.getMonth();
        
        const count = filteredLogs.filter(l => {
          const logDate = new Date(l.date);
          return logDate.getMonth() === monthIndex && 
                 logDate.getFullYear() === monthDate.getFullYear();
        }).length;
        
        result.push({
          value: count,
          label: months[monthIndex],
          frontColor: count > 0 ? '#a855f7' : '#4b5563',
        });
      }
    }

    return result;
  }, [filteredLogs, timeRange]);

  return (
    <View className="flex-1 bg-dark-bg">
      {/* Custom Header */}
      <View className="px-4 pt-14 pb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="font-bebas text-3xl text-white tracking-wider">STATISTICS</Text>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          onPress={async () => {
            haptics.medium();
            await logout();
            (navigation as any).navigate('Welcome');
          }}
          className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl flex-row items-center gap-2"
          activeOpacity={0.7}
        >
          <LogOut size={16} color="#ef4444" />
          <Text className="text-red-400 font-inter-bold text-sm">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
      <View className="px-4 pt-4">
        {/* Time Range Filter */}
        <View className="flex-row bg-white/5 p-1 rounded-2xl mb-3 border border-white/10">
          {(['WEEK', 'MONTH', 'YEAR'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              className={`flex-1 py-3 rounded-xl items-center ${
                timeRange === range ? 'bg-purple-600' : ''
              }`}
            >
              <Text className={`font-lato-bold text-xs ${
                timeRange === range ? 'text-white' : 'text-gray-400'
              }`}>
                {range === 'WEEK' ? 'Week' : range === 'MONTH' ? 'Month' : 'Year'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* GI / NO-GI Filter */}
        <View className="flex-row bg-white/5 p-1 rounded-2xl mb-6 border border-white/10">
          {(['ALL', 'GI', 'NO-GI'] as TrainingType[]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setTrainingType(type)}
              className={`flex-1 py-2 rounded-xl items-center ${
                trainingType === type ? 'bg-purple-600' : ''
              }`}
            >
              <Text className={`font-lato-bold text-xs ${
                trainingType === type ? 'text-white' : 'text-gray-400'
              }`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View className="py-20">
            <ActivityIndicator size="large" color="#a855f7" />
          </View>
        ) : (
          <View className="pb-8">
            {/* Overview Cards - Clean 5-Tile Layout */}
            <View className="mb-6">
              {/* Training Summary - Giant Number */}
              <View 
                className="bg-dark-card rounded-3xl p-6 mb-6" 
                style={shadows.card}
              >
                <Text className="text-[10px] font-inter-bold uppercase tracking-widest text-gray-500 mb-3">
                  TRAINING SUMMARY
                </Text>
                
                {/* Giant Total */}
                <Text className="font-bebas text-9xl text-white leading-none mb-1">
                  {stats.totalTrainings}
                </Text>
                <Text className="font-inter text-sm text-gray-400 mb-6">
                  total sessions logged
                </Text>
                
                {/* GI / NO-GI Breakdown */}
                <View className="flex-row gap-4">
                  <View className="flex-1 bg-bjj-blue/10 rounded-2xl p-4 border border-bjj-blue/20">
                    <Text className="text-bjj-blue font-bebas text-4xl leading-none">
                      {stats.giCount}
                    </Text>
                    <Text className="text-[9px] font-inter-bold uppercase text-gray-500 mt-1">
                      GI
                    </Text>
                  </View>
                  <View className="flex-1 bg-bjj-orange/10 rounded-2xl p-4 border border-bjj-orange/20">
                    <Text className="text-bjj-orange font-bebas text-4xl leading-none">
                      {stats.noGiCount}
                    </Text>
                    <Text className="text-[9px] font-inter-bold uppercase text-gray-500 mt-1">
                      NO-GI
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bottom Row: 2 Cards - GI Time, NO-GI Time */}
              <View className="flex-row gap-3">
                <View className="flex-1 bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
                  <Text className="text-blue-400 font-lato-bold text-xs mb-2">GI TIME</Text>
                  <Text className="text-white text-3xl font-lato-bold mb-1">
                    {filteredLogs.filter(l => l.type === 'GI').reduce((sum, l) => sum + l.duration, 0)} min
                  </Text>
                  <Text className="text-gray-400 text-xs font-lato">on the mat</Text>
                </View>

                <View className="flex-1 bg-orange-500/20 border border-orange-500/30 rounded-2xl p-4">
                  <Text className="text-orange-400 font-lato-bold text-xs mb-2">NO-GI TIME</Text>
                  <Text className="text-white text-3xl font-lato-bold mb-1">
                    {filteredLogs.filter(l => l.type === 'NO-GI').reduce((sum, l) => sum + l.duration, 0)} min
                  </Text>
                  <Text className="text-gray-400 text-xs font-lato">on the mat</Text>
                </View>
              </View>
            </View>

            {/* Submission Analysis - Technique Breakdown */}
            {(Object.keys(stats.submissionsGivenByTechnique).length > 0 || Object.keys(stats.submissionsReceivedByTechnique).length > 0) && (
              <View className="flex-row gap-3 mb-6">
                {/* Submissions Given Analysis */}
                <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                  <Text className="text-green-400 font-lato-bold text-xs mb-4">MY SUBMISSIONS</Text>
                  {Object.keys(stats.submissionsGivenByTechnique).length > 0 ? (
                    <>
                      <View className="items-center mb-4">
                        <PieChart
                          data={Object.entries(stats.submissionsGivenByTechnique)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 8)
                            .map(([technique, count], index) => {
                              const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
                              return {
                                value: count,
                                color: colors[index],
                                text: count.toString(),
                              };
                            })}
                          radius={60}
                          textColor="#fff"
                          textSize={14}
                          fontWeight="bold"
                          showText
                          showValuesAsLabels
                        />
                      </View>
                      <View className="space-y-2">
                        {Object.entries(stats.submissionsGivenByTechnique)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 8)
                          .map(([technique, count], index) => {
                            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
                            return (
                              <View key={technique} className="flex-row items-center justify-between py-1">
                                <View className="flex-row items-center flex-1">
                                  <View 
                                    style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                  />
                                  <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{technique}</Text>
                                </View>
                                <Text className="text-gray-400 font-lato-bold text-sm ml-2">{count}</Text>
                              </View>
                            );
                          })}
                      </View>
                    </>
                  ) : (
                    <Text className="text-gray-500 text-center font-lato text-sm py-4">No submissions given yet</Text>
                  )}
                </View>

                {/* Submissions Received Analysis */}
                <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                  <Text className="text-red-400 font-lato-bold text-xs mb-4">GOT SUBMITTED BY</Text>
                  {Object.keys(stats.submissionsReceivedByTechnique).length > 0 ? (
                    <>
                      <View className="items-center mb-4">
                        <PieChart
                          data={Object.entries(stats.submissionsReceivedByTechnique)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 8)
                            .map(([technique, count], index) => {
                              const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#10b981', '#f97316'];
                              return {
                                value: count,
                                color: colors[index],
                                text: count.toString(),
                              };
                            })}
                          radius={60}
                          textColor="#fff"
                          textSize={14}
                          fontWeight="bold"
                          showText
                          showValuesAsLabels
                        />
                      </View>
                      <View className="space-y-2">
                        {Object.entries(stats.submissionsReceivedByTechnique)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 8)
                          .map(([technique, count], index) => {
                            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#10b981', '#f97316'];
                            return (
                              <View key={technique} className="flex-row items-center justify-between py-1">
                                <View className="flex-row items-center flex-1">
                                  <View 
                                    style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                  />
                                  <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{technique}</Text>
                                </View>
                                <Text className="text-gray-400 font-lato-bold text-sm ml-2">{count}</Text>
                              </View>
                            );
                          })}
                      </View>
                    </>
                  ) : (
                    <Text className="text-gray-500 text-center font-lato text-sm py-4">No submissions received yet</Text>
                  )}
                </View>
              </View>
            )}

            {/* Submission Stats - Side by Side Pie Charts */}
            {(stats.totalSubsGiven > 0 || stats.totalSubsReceived > 0) && (
              <View className="flex-row gap-3 mb-6">
                {/* Submissions Given */}
                <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                  <Text className="text-green-400 font-lato-bold text-xs mb-4">SUBMISSIONS GIVEN</Text>
                  <View className="items-center mb-3">
                    <PieChart
                      data={[
                        { value: stats.totalSubsGiven, color: '#10b981' },
                        { value: Math.max(1, stats.totalSubsReceived), color: '#1e293b' }
                      ]}
                      radius={50}
                      donut
                      innerRadius={35}
                      centerLabelComponent={() => (
                        <View>
                          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                            {stats.totalSubsGiven}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                  <Text className="text-gray-400 text-center font-lato text-xs">Successful submissions</Text>
                </View>

                {/* Submissions Received */}
                <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                  <Text className="text-red-400 font-lato-bold text-xs mb-4">SUBMISSIONS RECEIVED</Text>
                  <View className="items-center mb-3">
                    <PieChart
                      data={[
                        { value: stats.totalSubsReceived, color: '#ef4444' },
                        { value: Math.max(1, stats.totalSubsGiven), color: '#1e293b' }
                      ]}
                      radius={50}
                      donut
                      innerRadius={35}
                      centerLabelComponent={() => (
                        <View>
                          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                            {stats.totalSubsReceived}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                  <Text className="text-gray-400 text-center font-lato text-xs">Times submitted</Text>
                </View>
              </View>
             )}

            {/* Sweep Statistics - Guard Usage Pie Charts */}
            {sweepGuardStats.length > 0 && (
              <View className="mb-6">
                <Text className="text-white font-bebas text-2xl mb-4 tracking-wider">🥋 SWEEP STATISTICS</Text>
                
                <View className="flex-row gap-3">
                  {/* Sweeps I Gave (Guards I Use) */}
                  <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                    <Text className="text-green-400 font-lato-bold text-xs mb-4">MY SWEEPS</Text>
                    {sweepGuardStats.some(s => s.given > 0) ? (
                      <>
                        <View className="items-center mb-3">
                          <PieChart
                            data={sweepGuardStats
                              .filter(s => s.given > 0)
                              .slice(0, 6)
                              .map((stat, index) => {
                                const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
                                return {
                                  value: stat.given,
                                  color: colors[index],
                                };
                              })}
                            radius={50}
                            textColor="#fff"
                            textSize={12}
                            fontWeight="bold"
                          />
                        </View>
                        <View className="space-y-2">
                          {sweepGuardStats
                            .filter(s => s.given > 0)
                            .slice(0, 6)
                            .map((stat, index) => {
                              const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
                              return (
                                <View key={stat.guard} className="flex-row items-center justify-between py-1">
                                  <View className="flex-row items-center flex-1">
                                    <View 
                                      style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                    />
                                    <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{stat.guard}</Text>
                                  </View>
                                  <Text className="text-gray-400 font-lato-bold text-sm ml-2">{stat.given}</Text>
                                </View>
                              );
                            })}
                        </View>
                      </>
                    ) : (
                      <Text className="text-gray-500 text-center font-lato text-sm py-4">No sweeps tracked yet</Text>
                    )}
                  </View>

                  {/* Sweeps Opponent Gave (Where I Got Swept) */}
                  <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                    <Text className="text-red-400 font-lato-bold text-xs mb-4">GOT SWEPT FROM</Text>
                    {sweepGuardStats.some(s => s.received > 0) ? (
                      <>
                        <View className="items-center mb-3">
                          <PieChart
                            data={sweepGuardStats
                              .filter(s => s.received > 0)
                              .slice(0, 6)
                              .map((stat, index) => {
                                const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
                                return {
                                  value: stat.received,
                                  color: colors[index],
                                };
                              })}
                            radius={50}
                            textColor="#fff"
                            textSize={12}
                            fontWeight="bold"
                          />
                        </View>
                        <View className="space-y-2">
                          {sweepGuardStats
                            .filter(s => s.received > 0)
                            .slice(0, 6)
                            .map((stat, index) => {
                              const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
                              return (
                                <View key={stat.guard} className="flex-row items-center justify-between py-1">
                                  <View className="flex-row items-center flex-1">
                                    <View 
                                      style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                    />
                                    <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{stat.guard}</Text>
                                  </View>
                                  <Text className="text-gray-400 font-lato-bold text-sm ml-2">{stat.received}</Text>
                                </View>
                              );
                            })}
                        </View>
                      </>
                    ) : (
                      <Text className="text-gray-500 text-center font-lato text-sm py-4">No sweeps received yet</Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Position Statistics - IBJJF Points */}
            {positionStats.length > 0 && (
              <View className="mb-6">
                <Text className="text-white font-bebas text-2xl mb-4 tracking-wider">🏆 POSITION STATISTICS</Text>
                
                <View className="flex-row gap-3">
                  {/* My Positions */}
                  <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                    <Text className="text-blue-400 font-lato-bold text-xs mb-4">MY POSITIONS</Text>
                    {positionStats.some(s => s.me > 0) ? (
                      <>
                        <View className="items-center mb-3">
                          <PieChart
                            data={positionStats
                              .filter(s => s.me > 0)
                              .slice(0, 6)
                              .map((stat, index) => {
                                const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];
                                return {
                                  value: stat.me,
                                  color: colors[index],
                                };
                              })}
                            radius={50}
                            textColor="#fff"
                            textSize={12}
                            fontWeight="bold"
                          />
                        </View>
                        <View className="space-y-2">
                          {positionStats
                            .filter(s => s.me > 0)
                            .slice(0, 6)
                            .map((stat, index) => {
                              const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];
                              return (
                                <View key={stat.position} className="flex-row items-center justify-between py-1">
                                  <View className="flex-row items-center flex-1">
                                    <View 
                                      style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                    />
                                    <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{stat.position}</Text>
                                  </View>
                                  <Text className="text-gray-400 font-lato-bold text-sm ml-2">{stat.me}</Text>
                                </View>
                              );
                            })}
                        </View>
                      </>
                    ) : (
                      <Text className="text-gray-500 text-center font-lato text-sm py-4">No positions tracked yet</Text>
                    )}
                  </View>

                  {/* Opponent Positions */}
                  <View className="flex-1 bg-[#1e293b] rounded-2xl p-5 border border-white/5">
                    <Text className="text-orange-400 font-lato-bold text-xs mb-4">OPPONENT POSITIONS</Text>
                    {positionStats.some(s => s.opponent > 0) ? (
                      <>
                        <View className="items-center mb-3">
                          <PieChart
                            data={positionStats
                              .filter(s => s.opponent > 0)
                              .slice(0, 6)
                              .map((stat, index) => {
                                const colors = ['#f97316', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
                                return {
                                  value: stat.opponent,
                                  color: colors[index],
                                };
                              })}
                            radius={50}
                            textColor="#fff"
                            textSize={12}
                            fontWeight="bold"
                          />
                        </View>
                        <View className="space-y-2">
                          {positionStats
                            .filter(s => s.opponent > 0)
                            .slice(0, 6)
                            .map((stat, index) => {
                              const colors = ['#f97316', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
                              return (
                                <View key={stat.position} className="flex-row items-center justify-between py-1">
                                  <View className="flex-row items-center flex-1">
                                    <View 
                                      style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors[index], marginRight: 8 }}
                                    />
                                    <Text className="text-white font-lato text-sm flex-1" numberOfLines={1}>{stat.position}</Text>
                                  </View>
                                  <Text className="text-gray-400 font-lato-bold text-sm ml-2">{stat.opponent}</Text>
                                </View>
                              );
                            })}
                        </View>
                      </>
                    ) : (
                      <Text className="text-gray-500 text-center font-lato text-sm py-4">No opponent positions yet</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
    </View>
  );
};
