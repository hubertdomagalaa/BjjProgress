import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { databases, appwriteConfig } from '../lib/appwrite';
import { useAuth } from '../context/AuthContext';
import { ID } from 'react-native-appwrite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TrainingLog } from '../types';
import SparringTile from '../components/SparringTile';
import { createSparring, getSparringsForTraining, updateSparring, deleteSparring, deleteAllSparringsForTraining, SparringSession } from '../lib/sparring';
import MatchTile from '../components/MatchTile';
import { Trophy, MapPin, Scale, Shield, Zap, Calendar, Clock, FileText, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { haptics } from '../utils/haptics';
import { shadows } from '../styles/shadows';
import { usePurchases } from '../context/PurchasesContext';
// Confetti removed for cleaner UX

type Props = NativeStackScreenProps<RootStackParamList, 'AddLog'>;

type FormData = {
  date: string;
  time: string;
  duration: string;
  type: string;
  notes: string;
  reflection: string;
  tournament_name?: string;
  weight_class?: string;
  location?: string;
  competition_style?: 'GI' | 'NO-GI';
};

export default function AddLogScreen({ navigation, route }: Props) {
  const logToEdit = route.params?.log;
  const isEditing = !!logToEdit;

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5), // Fixed: Use HH:MM format consistently
      duration: '90',
      type: 'GI',
      notes: '',
      reflection: '',
    }
  });

  const { user } = useAuth();
  const { isPro: hasAccess } = usePurchases();
  const [loading, setLoading] = useState(false);
  const [trainingType, setTrainingType] = useState<'GI' | 'NO-GI' | 'COMP'>('GI');
  const [competitionStyle, setCompetitionStyle] = useState<'GI' | 'NO-GI'>('GI');
  const [sparringSessions, setSparringSessions] = useState<Omit<SparringSession, 'training_log_id'>[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (logToEdit) {
      const dateObj = new Date(logToEdit.date);
      reset({
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toTimeString().slice(0, 5), // Fixed: Use HH:MM format consistently
        duration: logToEdit.duration.toString(),
        type: logToEdit.type,
        notes: logToEdit.notes || '',
        reflection: logToEdit.reflection || '',
        tournament_name: logToEdit.tournament_name,
        weight_class: logToEdit.weight_class,
        location: logToEdit.location,
        competition_style: logToEdit.competition_style,
      });
      setTrainingType(logToEdit.type as any);
      if (logToEdit.competition_style) {
        setCompetitionStyle(logToEdit.competition_style as 'GI' | 'NO-GI');
      }
      navigation.setOptions({ title: logToEdit.type === 'COMP' ? 'Edit Competition' : 'Edit Training' });
      
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
        // Competition fields
        is_competition_match: s.is_competition_match,
        result: s.result,
        method: s.method,
        points_my: s.points_my,
        points_opp: s.points_opp,
        stage: s.stage,
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
      is_competition_match: trainingType === 'COMP',
      result: undefined,
      method: undefined,
      points_my: 0,
      points_opp: 0,
      stage: undefined,
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
      // Robust Date Parsing
      const [year, month, day] = data.date.split('-').map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);
      
      // Create date object safely
      const dateTime = new Date(year, month - 1, day, hours, minutes);
      
      // Fallback if invalid
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date or time format');
      }

      const logData = {
        user_id: user.$id,
        date: dateTime.toISOString(),
        duration: parseInt(data.duration) || 0,
        type: trainingType,
        notes: data.notes,
        reflection: data.reflection,
        submission_given: 0,
        submission_received: 0,
        tournament_name: data.tournament_name,
        weight_class: data.weight_class,
        location: data.location,
        competition_style: trainingType === 'COMP' ? competitionStyle : null, // Explicitly null if not COMP
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
      // First, if editing, we already deleted old sessions above.
      // Now create all current sessions as new documents.
      for (const session of sparringSessions) {
        await createSparring({
          training_log_id: trainingId,
          sparring_number: session.sparring_number,
          submission_given: session.submission_given,
          submission_received: session.submission_received,
          submissions_list: typeof session.submissions_list === 'string' 
            ? session.submissions_list 
            : JSON.stringify(session.submissions_list || []),
          sweeps_list: typeof session.sweeps_list === 'string'
            ? session.sweeps_list
            : JSON.stringify(session.sweeps_list || []),
          positions_list: typeof session.positions_list === 'string'
            ? session.positions_list
            : JSON.stringify(session.positions_list || []),
          notes: session.notes || '',
          partner_name: session.partner_name || '', // Ensure partner name is saved
          is_competition_match: trainingType === 'COMP',
          result: session.result,
          method: session.method,
          points_my: session.points_my,
          points_opp: session.points_opp,
          stage: session.stage,
          submission_technique: session.submission_technique,
        });
      }

      haptics.success();
      setShowSuccessToast(true);
      
      // Delay navigation to show success state
      setTimeout(() => {
        setShowSuccessToast(false);
        navigation.goBack();
      }, 2000);
    } catch (error: any) {
      console.error('Training save error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response,
        full: JSON.stringify(error),
      });
      Alert.alert('Error', error.message || 'Failed to save training. Check console for details.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#0a0e1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Custom Header */}
      <View className="px-4 pt-14 pb-3 flex-row items-center gap-4">
        <TouchableOpacity 
          onPress={() => {
            haptics.light();
            navigation.goBack();
          }}
          className="p-2 -ml-2"
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
        contentContainerStyle={{ paddingBottom: 150 }}
      >
      <View className="p-4">
        {/* Training Type Toggle */}
        <View className="mb-8 flex-row gap-3">
          {['GI', 'NO-GI', 'COMP'].map((type) => (
             <TouchableOpacity
             key={type}
             onPress={() => setTrainingType(type as any)}
             className={`flex-1 p-3 rounded-2xl items-center justify-center border ${
               trainingType === type 
                 ? (type === 'GI' ? 'bg-blue-600/20 border-blue-500' : type === 'NO-GI' ? 'bg-orange-600/20 border-orange-500' : 'bg-yellow-500/20 border-yellow-500') 
                 : 'bg-white/5 border-white/10'
             }`}
             style={{ height: 100 }}
           >
             {type === 'GI' && <Shield size={32} color={trainingType === 'GI' ? '#60a5fa' : '#64748b'} />}
             {type === 'NO-GI' && <Zap size={32} color={trainingType === 'NO-GI' ? '#fb923c' : '#64748b'} />}
             {type === 'COMP' && <Trophy size={32} color={trainingType === 'COMP' ? '#eab308' : '#64748b'} />}
             <Text className={`mt-2 font-montserrat font-bold text-sm ${
                trainingType === type 
                  ? (type === 'GI' ? 'text-blue-400' : type === 'NO-GI' ? 'text-orange-400' : 'text-yellow-400') 
                  : 'text-gray-500'
              }`}>
               {type}
             </Text>
           </TouchableOpacity>
          ))}
        </View>

        {/* Date & Time Section */}
        <View className="mb-8">
           <View className="flex-row gap-4">
            <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
              <Text className="text-gray-500 text-xs font-bold mb-1">DATE</Text>
              <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <TextInput 
                      value={value} 
                      onChangeText={onChange} 
                      className="text-white font-lato text-lg" 
                      placeholder="YYYY-MM-DD" 
                      placeholderTextColor="#666" 
                    />
                  )}
              />
            </View>
             <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
              <Text className="text-gray-500 text-xs font-bold mb-1">TIME</Text>
              <Controller
                  control={control}
                  name="time"
                  render={({ field: { onChange, value } }) => (
                    <TextInput 
                      value={value} 
                      onChangeText={onChange} 
                      className="text-white font-lato text-lg" 
                      placeholder="HH:MM" 
                      placeholderTextColor="#666" 
                    />
                  )}
              />
            </View>
           </View>
        </View>

        {/* OPEN NOTE SPACE ("Clean Card") */}
        <View className="mb-10">
          <View className="bg-[#1a1f2e] border border-white/5 rounded-3xl p-6 shadow-lg">
             <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bebas text-white tracking-wide">SESSION NOTES</Text>
             </View>

             <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="text-white font-lato text-lg leading-7"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    placeholder="Write your session notes here..."
                    placeholderTextColor="#64748b"
                    scrollEnabled={false}
                    style={{ minHeight: 150 }}
                  />
                )}
             />
             
             <View className="h-[1px] bg-white/5 my-6" />

             <Text className="text-gray-500 text-xs font-bold mb-3">KEY LEARNINGS</Text>
             <Controller
                control={control}
                name="reflection"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="text-gray-300 font-lato text-base leading-6"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    placeholder="What did you learn today?"
                    placeholderTextColor="#64748b"
                    scrollEnabled={false}
                    style={{ minHeight: 80 }}
                  />
                )}
             />
          </View>
        </View>

        {/* Sparring Section (Monetized) */}
        <View className="mb-8">
           <View className="flex-row justify-between items-center mb-4 px-2">
              <Text className="text-white text-xl font-bebas tracking-wide">SPARRING LOGS</Text>
              <TouchableOpacity
                onPress={() => {
                   if (hasAccess) {
                     addSparringSession();
                   } else {
                     Alert.alert(
                       'Sparring Locked 🔒', 
                       'Tracking detail sparring rounds requires a PRO subscription.',
                       [
                         { text: 'Cancel', style: 'cancel' },
                         { text: 'View Plans', onPress: () => navigation.navigate('Paywall') }
                       ]
                     );
                   }
                }}
                className="bg-white/10 px-4 py-2 rounded-full"
              >
                 <Text className="text-white font-bold text-xs">+ ADD ROUND</Text>
              </TouchableOpacity>
           </View>

           {/* Sparring List Rendering (Existing Logic) */}
           {sparringSessions.map((session, index) => (
              trainingType === 'COMP' ? (
                <MatchTile 
                   key={index} 
                   number={session.sparring_number}
                   result={session.result}
                   method={session.method}
                   points_my={session.points_my}
                   points_opp={session.points_opp}
                   stage={session.stage}
                   notes={session.notes}
                   submissions_list={typeof session.submissions_list === 'string' ? session.submissions_list : JSON.stringify(session.submissions_list || [])}
                   sweeps_list={typeof session.sweeps_list === 'string' ? session.sweeps_list : JSON.stringify(session.sweeps_list || [])}
                   positions_list={typeof session.positions_list === 'string' ? session.positions_list : JSON.stringify(session.positions_list || [])}
                   onUpdate={(updates) => updateSparringSession(index, updates)}
                   onDelete={() => deleteSparringSession(index)}
                />
              ) : (
                <SparringTile
                   key={index}
                   number={session.sparring_number}
                   submissionGiven={session.submission_given}
                   submissionReceived={session.submission_received}
                   submissionsList={typeof session.submissions_list === 'string' ? JSON.parse(session.submissions_list || '[]') : session.submissions_list || []}
                   notes={session.notes}
                   partner_name={session.partner_name}
                   sweeps_list={session.sweeps_list}
                   positions_list={session.positions_list}
                   onUpdate={(updates) => {
                     const formattedUpdates: any = { ...updates };
                     if (updates.submissionsList !== undefined) {
                       formattedUpdates.submissions_list = typeof updates.submissionsList === 'string' ? updates.submissionsList : JSON.stringify(updates.submissionsList || []);
                       delete formattedUpdates.submissionsList;
                     }
                     updateSparringSession(index, formattedUpdates);
                   }}
                   onDelete={() => deleteSparringSession(index)}
                /> 
              )
           ))}
           
           {sparringSessions.length === 0 && (
             <View className="bg-white/5 border border-dashed border-white/10 rounded-xl p-6 items-center">
                <Text className="text-gray-500 text-sm">No sparring rounds recorded</Text>
             </View>
           )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
            className="bg-bjj-purple w-full py-4 rounded-xl items-center shadow-lg shadow-purple-500/30"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text className="text-white font-bold text-lg tracking-wide">
                {isEditing ? 'UPDATE SESSION' : 'COMPLETE SESSION'}
              </Text>
            )}
       </TouchableOpacity>

      </View>
      <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* Success Toast */}
      {showSuccessToast && (
         <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
            <View className="bg-green-500/90 px-6 py-3 rounded-full shadow-xl">
               <Text className="text-white font-bold">Session Saved Successfully! 🥋</Text>
            </View>
         </View>
      )}

    </KeyboardAvoidingView>
  );
}
