import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { databases, appwriteConfig } from '../lib/appwrite';
import { useAuth } from '../context/AuthContext';
import { ID } from 'react-native-appwrite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TrainingLog } from '../types';
import SparringTile from '../components/SparringTile';
import { createSparring, getSparringsForTraining, updateSparring, deleteSparring, deleteAllSparringsForTraining, SparringSession } from '../lib/sparring';
import { Calendar, Clock, FileText, Shield, Zap, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { haptics } from '../utils/haptics';
import { shadows } from '../styles/shadows';
import { checkSubscription } from '../utils/subscription';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLog'>;

type FormData = {
  date: string;
  time: string;
  duration: string;
  type: string;
  notes: string;
  reflection: string;
};

export default function AddLogScreen({ navigation, route }: Props) {
  const logToEdit = route.params?.log;
  const isEditing = !!logToEdit;

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '90',
      type: 'GI',
      notes: '',
      reflection: '',
    }
  });

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isGi, setIsGi] = useState(true);
  const [sparringSessions, setSparringSessions] = useState<Omit<SparringSession, 'training_log_id'>[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (logToEdit) {
      const dateObj = new Date(logToEdit.date);
      reset({
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: logToEdit.duration.toString(),
        type: logToEdit.type,
        notes: logToEdit.notes,
        reflection: logToEdit.reflection,
      });
      setIsGi(logToEdit.type === 'GI');
      navigation.setOptions({ title: 'Edit Training' });
      
      // Load sparring sessions for this training
      loadSparringSessions(logToEdit.$id!);
    }
  }, [logToEdit, reset, navigation]);

  const loadSparringSessions = async (trainingId: string) => {
    try {
      const sessions = await getSparringsForTraining(trainingId);
      setSparringSessions(sessions.map(s => ({
        $id: s.$id,
        sparring_number: s.sparring_number,
        submission_given: s.submission_given,
        submission_received: s.submission_received,
        submissions_list: s.submissions_list,
        sweeps_list: s.sweeps_list,
        positions_list: s.positions_list,
        notes: s.notes,
        partner_name: s.partner_name,
      })));
    } catch (error) {
      console.error('Error loading sparring sessions:', error);
    }
  };

  const addSparringSession = () => {
    setSparringSessions([...sparringSessions, {
      sparring_number: sparringSessions.length + 1,
      submission_given: 0,
      submission_received: 0,
      submissions_list: '[]',
      sweeps_list: '[]',
      positions_list: '[]',
      notes: '',
      partner_name: '',
    }]);
  };

  const updateSparringSession = (index: number, updates: any) => {
    const newSessions = [...sparringSessions];
    newSessions[index] = { ...newSessions[index], ...updates };
    setSparringSessions(newSessions);
  };

  const deleteSparringSession = (index: number) => {
    const newSessions = sparringSessions.filter((_, i) => i !== index);
    // Renumber remaining sessions
    const renumbered = newSessions.map((s, i) => ({ ...s, sparring_number: i + 1 }));
    setSparringSessions(renumbered);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const dateString = data.date;
      const timeString = data.time;
      const dateTime = new Date(`${dateString}T${timeString}:00`);

      const logData = {
        user_id: user.$id,
        date: dateTime.toISOString(),
        duration: parseInt(data.duration),
        type: isGi ? 'GI' : 'NO-GI',
        notes: data.notes,
        reflection: data.reflection,
        submission_given: 0,
        submission_received: 0,
      };

      let trainingId: string;

      if (isEditing && logToEdit) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionId,
          logToEdit.$id,
          logData
        );
        trainingId = logToEdit.$id;
        
        // Delete old sparring sessions and create new ones
        await deleteAllSparringsForTraining(trainingId);
      } else {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collectionId,
          ID.unique(),
          logData
        );
        trainingId = doc.$id;
      }

      // Save sparring sessions
      for (const session of sparringSessions) {
        await createSparring({
          training_log_id: trainingId,
          sparring_number: session.sparring_number,
          submission_given: session.submission_given,
          submission_received: session.submission_received,
          submissions_list: typeof session.submissions_list === 'string' 
            ? session.submissions_list 
            : JSON.stringify(session.submissions_list || []),
          notes: session.notes || '',
        });
      }

      haptics.success();
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to save training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#0a0e1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Custom Header */}
      <View className="px-4 pt-14 pb-3 flex-row items-center gap-4">
        <TouchableOpacity 
          onPress={() => {
            haptics.light();
            navigation.goBack();
          }}
          className="p-2 -ml-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="font-bebas text-3xl text-white tracking-wider">
          {isEditing ? 'EDIT TRAINING' : 'ADD TRAINING'}
        </Text>
      </View>

      <ScrollView 
        className="flex-1 bg-dark-bg"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View className="p-4">
        {/* Training Type Toggle - Premium Redesign */}
        <View className="mb-8 flex-row gap-4">
          <TouchableOpacity
            onPress={() => setIsGi(true)}
            className={`flex-1 p-4 rounded-2xl items-center justify-center border ${
              isGi 
                ? 'bg-blue-600/20 border-blue-500' 
                : 'bg-white/5 border-white/10'
            }`}
            style={{ height: 120 }}
          >
            <Shield size={40} color={isGi ? '#60a5fa' : '#64748b'} />
            <Text className={`mt-3 font-montserrat font-bold text-lg ${isGi ? 'text-blue-400' : 'text-gray-500'}`}>
              GI
            </Text>
            {isGi && <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400" />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsGi(false)}
            className={`flex-1 p-4 rounded-2xl items-center justify-center border ${
              !isGi 
                ? 'bg-orange-600/20 border-orange-500' 
                : 'bg-white/5 border-white/10'
            }`}
            style={{ height: 120 }}
          >
            <Zap size={40} color={!isGi ? '#fb923c' : '#64748b'} />
            <Text className={`mt-3 font-montserrat font-bold text-lg ${!isGi ? 'text-orange-400' : 'text-gray-500'}`}>
              NO-GI
            </Text>
            {!isGi && <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-400" />}
          </TouchableOpacity>
        </View>
          {/* Date & Time Section - Glassmorphic Inputs */}
        <View className="mb-6">
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-400 font-lato text-xs mb-2 ml-1">DATE</Text>
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
                <Calendar size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="flex-1 text-white font-lato text-base"
                      value={value}
                      onChangeText={onChange}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#64748b"
                    />
                  )}
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-gray-400 font-lato text-xs mb-2 ml-1">TIME</Text>
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
                <Clock size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                <Controller
                  control={control}
                  name="time"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="flex-1 text-white font-lato text-base"
                      value={value}
                      onChangeText={onChange}
                      placeholder="HH:MM"
                      placeholderTextColor="#64748b"
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-gray-400 font-lato text-xs mb-2 ml-1">DURATION (MIN)</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
              <Clock size={18} color="#94a3b8" style={{ marginRight: 10 }} />
              <Controller
                control={control}
                name="duration"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 text-white font-lato text-base"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    placeholder="90"
                    placeholderTextColor="#64748b"
                  />
                )}
              />
            </View>
          </View>
        </View>


      {/* Training Notes */}
      <View className="mb-4">
        <Text className="text-white font-inter-medium mb-2">Notes</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="bg-white/10 p-4 rounded-xl text-white font-inter border border-white/10"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="What did you work on today?"
              placeholderTextColor="#9ca3af"
              style={{ minHeight: 150 }}
            />
          )}
        />
      </View>

      {/* Reflection Notes */}
      <View className="mb-4">
        <Text className="text-white font-inter-medium mb-2">Reflection / Learnings</Text>
        <Controller
          control={control}
          name="reflection"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="bg-white/10 p-4 rounded-xl text-white font-inter border border-white/10"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="What went well? What to improve?"
              placeholderTextColor="#9ca3af"
              style={{ minHeight: 150 }}
          />
          )}
        />
      </View>

      {/* Sparrings Section */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[#fefcfe] text-xl font-lato-bold">💪 Sparrings</Text>
          <TouchableOpacity
            onPress={() => {
              // Check if user has access (PRO or active trial)
              const { hasAccess } = checkSubscription(user?.prefs);
              
              if (!hasAccess) {
                // Show upgrade alert
                Alert.alert(
                  'Sparring Tracking Locked',
                  'Your trial has ended. Upgrade to PRO to continue tracking your sparring sessions and BJJ progress!',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Upgrade to PRO', 
                      onPress: () => navigation.navigate('Paywall')
                    }
                  ]
                );
                return;
              }
              addSparringSession();
            }}
            className={`px-4 py-2 rounded-full ${checkSubscription(user?.prefs).hasAccess ? 'bg-[#b123c7]' : 'bg-gray-600'}`}
            disabled={!checkSubscription(user?.prefs).hasAccess}
          >
            <Text className="text-white font-lato-bold">
              {checkSubscription(user?.prefs).hasAccess ? '+ Add Sparring' : '+ Add Sparring (PRO)'}
            </Text>
          </TouchableOpacity>
        </View>

        {sparringSessions.map((session, index) => (
          <SparringTile
            key={index}
            number={session.sparring_number}
            submissionGiven={session.submission_given}
            submissionReceived={session.submission_received}
            submissionsList={typeof session.submissions_list === 'string' 
              ? JSON.parse(session.submissions_list || '[]') 
              : session.submissions_list || []}
            notes={session.notes}
            partner_name={session.partner_name}
            sweeps_list={session.sweeps_list}
            positions_list={session.positions_list}
            onUpdate={(updates) => {
              // Handle submissionsList format correctly
              const formattedUpdates: any = { ...updates };
              
              if (updates.submissionsList !== undefined) {
                formattedUpdates.submissions_list = 
                  typeof updates.submissionsList === 'string'
                    ? updates.submissionsList
                    : JSON.stringify(updates.submissionsList || []);
                delete formattedUpdates.submissionsList;
              }
              
              updateSparringSession(index, formattedUpdates);
            }}
            onDelete={() => deleteSparringSession(index)}
          />
        ))}

        {sparringSessions.length === 0 && (
          <View className="bg-white/5 p-8 rounded-xl border border-dashed border-white/20">
            <Text className="text-gray-400 text-center font-lato">No sparrings yet</Text>
            <Text className="text-gray-500 text-center text-sm mt-2 font-lato">Add your first sparring</Text>
          </View>
        )}
      </View>

      {/* Save/Update Button - Prominent */}
      <View className="px-4 pb-6">
        {loading ? (
          <View className="bg-bjj-purple/50 px-6 py-4 rounded-xl items-center">
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity 
            className="bg-bjj-purple px-6 py-4 rounded-xl items-center"
            style={{
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={() => {
              haptics.heavy();
              handleSubmit(onSubmit)();
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-white font-montserrat text-base font-bold">
              {isEditing ? 'Update Training' : 'Save Training'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      </View>

      {/* Success Toast - Professional Design */}
      {showSuccessToast && (
        <View 
          style={{
            position: 'absolute',
            bottom: 100,
            left: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <View className="bg-green-500/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-green-400/20">
            <View className="flex-row items-center gap-3">
              <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                <CheckCircle size={24} color="#fff" strokeWidth={3} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-montserrat font-bold text-lg">
                  Training Added! 🥋
                </Text>
                <Text className="text-white/90 font-lato text-sm mt-1">
                  Your progress has been saved
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
     </ScrollView>
    </KeyboardAvoidingView>
  );
}
