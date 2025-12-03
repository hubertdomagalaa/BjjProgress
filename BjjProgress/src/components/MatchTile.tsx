import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Trophy, Medal, XCircle, MinusCircle } from 'lucide-react-native';

interface Props {
  number: number;
  result?: 'win' | 'loss' | 'draw';
  method?: 'submission' | 'points' | 'decision' | 'dq';
  points_my?: number;
  points_opp?: number;
  stage?: 'final' | 'semi_final' | 'quarter_final' | 'elimination' | 'round_robin' | 'bronze_match';
  notes?: string;
  submissions_list?: string; // JSON string of SubmissionEvent[]
  sweeps_list?: string; // JSON string of SweepEvent[]
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

const STAGES = [
  { label: 'Final 🥇', value: 'final' },
  { label: 'Semi-Final', value: 'semi_final' },
  { label: 'Quarter-Final', value: 'quarter_final' },
  { label: 'Elimination', value: 'elimination' },
  { label: 'Round Robin', value: 'round_robin' },
  { label: 'Bronze Match 🥉', value: 'bronze_match' },
];

const METHODS = [
  'Submission', 'Points', 'Decision', 'DQ'
];

import TechniquePicker from './TechniquePicker';

export default function MatchTile({
  number,
  result,
  method,
  points_my = 0,
  points_opp = 0,
  stage,
  notes,
  submissions_list,
  sweeps_list,
  onUpdate,
  onDelete,
}: Props) {
  const [showTechniquePicker, setShowTechniquePicker] = useState(false);
  
  // Parse submissions list
  const submissions = submissions_list ? JSON.parse(submissions_list) : [];
  const winningSubmission = submissions.find((s: any) => s.type === 'given')?.technique;
  const losingSubmission = submissions.find((s: any) => s.type === 'received')?.technique;

  return (
    <>
    <View className={`rounded-xl p-4 mb-4 border ${
      result === 'win' 
        ? 'bg-yellow-500/10 border-yellow-500/30' 
        : result === 'loss'
        ? 'bg-red-500/10 border-red-500/30'
        : 'bg-white/10 border-white/20'
    }`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-[#fefcfe] text-lg font-lato-bold">
            Match #{number}
          </Text>
          {result === 'win' && <Trophy size={16} color="#eab308" />}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/40"
        >
          <Text className="text-red-400 font-lato-bold text-sm">Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Result Toggle */}
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={() => onUpdate({ result: 'win' })}
          className={`flex-1 py-3 rounded-lg border items-center justify-center ${
            result === 'win'
              ? 'bg-yellow-500/20 border-yellow-500'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <Text className={`font-bebas text-xl ${result === 'win' ? 'text-yellow-400' : 'text-gray-400'}`}>
            WIN
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onUpdate({ result: 'loss' })}
          className={`flex-1 py-3 rounded-lg border items-center justify-center ${
            result === 'loss'
              ? 'bg-red-500/20 border-red-500'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <Text className={`font-bebas text-xl ${result === 'loss' ? 'text-red-400' : 'text-gray-400'}`}>
            LOSS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onUpdate({ result: 'draw' })}
          className={`flex-1 py-3 rounded-lg border items-center justify-center ${
            result === 'draw'
              ? 'bg-gray-500/20 border-gray-500'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <Text className={`font-bebas text-xl ${result === 'draw' ? 'text-gray-300' : 'text-gray-400'}`}>
            DRAW
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stage Selector */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs font-lato mb-2">STAGE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          {STAGES.map((s) => (
            <TouchableOpacity
              key={s.value}
              onPress={() => onUpdate({ stage: s.value })}
              className={`px-3 py-2 rounded-lg border ${
                stage === s.value
                  ? 'bg-purple-500/20 border-purple-500'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={`text-xs font-lato-bold ${
                stage === s.value ? 'text-purple-300' : 'text-gray-400'
              }`}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Method & Points */}
      <View className="mb-4">
        {/* Method */}
        <View className="mb-3">
          <Text className="text-gray-400 text-xs font-lato mb-2">METHOD</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {METHODS.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => onUpdate({ method: m.toLowerCase() })}
                className={`px-3 py-2 rounded-lg border ${
                  method === m.toLowerCase()
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-lato-bold ${
                  method === m.toLowerCase() ? 'text-blue-300' : 'text-gray-400'
                }`}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Submission Picker (Only if method is submission) */}
        {method === 'submission' && (
          <View>
             <TouchableOpacity
              onPress={() => setShowTechniquePicker(true)}
              className={`border p-3 rounded-lg flex-row items-center justify-between ${
                result === 'win' 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : result === 'loss' 
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <View>
                <Text className={`text-xs font-lato-bold mb-1 ${
                  result === 'win' ? 'text-yellow-500' : result === 'loss' ? 'text-red-500' : 'text-blue-400'
                }`}>
                  {result === 'win' ? 'WINNING SUBMISSION' : result === 'loss' ? 'LOSING SUBMISSION' : 'SUBMISSION'}
                </Text>
                <Text className="text-white font-lato text-sm">
                  {(result === 'win' ? winningSubmission : losingSubmission) || 'Select Submission...'}
                </Text>
              </View>
              <Trophy size={14} color={result === 'win' ? '#eab308' : result === 'loss' ? '#ef4444' : '#93c5fd'} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sweeps */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs font-lato mb-2">SWEEPS</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => {
              const currentSweeps = sweeps_list ? JSON.parse(sweeps_list) : [];
              const newSweeps = [...currentSweeps, { name: 'Sweep', type: 'my' }];
              onUpdate({ sweeps_list: JSON.stringify(newSweeps) });
            }}
            className="flex-1 bg-blue-500/20 border border-blue-500/30 p-3 rounded-lg flex-row items-center justify-between"
          >
            <Text className="text-blue-300 font-lato-bold text-xs">MY SWEEPS</Text>
            <Text className="text-white font-bebas text-xl">
              {(sweeps_list ? JSON.parse(sweeps_list) : []).filter((s: any) => s.type === 'my').length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const currentSweeps = sweeps_list ? JSON.parse(sweeps_list) : [];
              const newSweeps = [...currentSweeps, { name: 'Sweep', type: 'opp' }];
              onUpdate({ sweeps_list: JSON.stringify(newSweeps) });
            }}
            className="flex-1 bg-red-500/20 border border-red-500/30 p-3 rounded-lg flex-row items-center justify-between"
          >
            <Text className="text-red-300 font-lato-bold text-xs">OPP SWEEPS</Text>
            <Text className="text-white font-bebas text-xl">
              {(sweeps_list ? JSON.parse(sweeps_list) : []).filter((s: any) => s.type === 'opp').length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Score Board */}
      <View className="bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
        <Text className="text-gray-400 text-xs font-lato text-center mb-2">SCORE BOARD</Text>
        <View className="flex-row items-center justify-center gap-6">
          <View className="items-center">
            <Text className="text-gray-500 text-[10px] mb-1">ME</Text>
            <TextInput
              className="bg-white/10 w-12 h-10 rounded text-center text-white font-bebas text-xl"
              keyboardType="numeric"
              value={points_my.toString()}
              onChangeText={(t) => onUpdate({ points_my: parseInt(t) || 0 })}
            />
          </View>
          <Text className="text-gray-600 font-bebas text-xl">-</Text>
          <View className="items-center">
            <Text className="text-gray-500 text-[10px] mb-1">OPP</Text>
            <TextInput
              className="bg-white/10 w-12 h-10 rounded text-center text-white font-bebas text-xl"
              keyboardType="numeric"
              value={points_opp.toString()}
              onChangeText={(t) => onUpdate({ points_opp: parseInt(t) || 0 })}
            />
          </View>
        </View>
      </View>

      {/* Notes */}
      <View>
        <TextInput
          className="bg-white/5 p-3 rounded-lg text-white font-lato text-sm min-h-[60px]"
          placeholder="Match notes..."
          placeholderTextColor="#6B7280"
          multiline
          value={notes}
          onChangeText={(text) => onUpdate({ notes: text })}
        />
      </View>
    </View>

    <TechniquePicker
      visible={showTechniquePicker}
      onClose={() => setShowTechniquePicker(false)}
      onSelect={(tech) => {
        // Determine type based on result
        const type = result === 'win' ? 'given' : 'received';
        
        // Create new submissions list with just this one entry (since matches usually end with 1 sub)
        const newSubmissions = [{ technique: tech.name, type }];
        
        onUpdate({ 
          submissions_list: JSON.stringify(newSubmissions),
          // Also update counts for compatibility
          submission_given: type === 'given' ? 1 : 0,
          submission_received: type === 'received' ? 1 : 0
        });
        setShowTechniquePicker(false);
      }}
    />
    </>
  );
}
