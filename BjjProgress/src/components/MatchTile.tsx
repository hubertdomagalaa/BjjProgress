import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Trophy, Medal, XCircle, MinusCircle } from 'lucide-react-native';
import { Sweep, SWEEP_POINTS, GuardPosition } from '../constants/bjj-guards';
import { PositionScore, POINT_POSITIONS, PositionType } from '../constants/bjj-positions';
import { GuardPicker } from './GuardPicker';
import { PositionPicker } from './PositionPicker';
import TechniquePicker from './TechniquePicker';
import { haptics } from '../utils/haptics';
import { MotiView } from 'moti';

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
  positions_list?: string; // JSON string of PositionScore[]
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
  positions_list,
  onUpdate,
  onDelete,
}: Props) {
  const [showTechniquePicker, setShowTechniquePicker] = useState(false);
  const [showGuardPicker, setShowGuardPicker] = useState(false);
  const [sweepType, setSweepType] = useState<'given' | 'received'>('given');
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [positionType, setPositionType] = useState<'me' | 'opponent'>('me');
  
  // Parse submissions list
  const submissions = submissions_list ? JSON.parse(submissions_list) : [];
  const winningSubmission = submissions.find((s: any) => s.type === 'given')?.technique;
  const losingSubmission = submissions.find((s: any) => s.type === 'received')?.technique;

  // Parse sweeps list
  let sweeps: Sweep[] = [];
  try {
    if (typeof sweeps_list === 'string' && sweeps_list.length > 2) {
      sweeps = JSON.parse(sweeps_list);
    }
  } catch (e) {
    sweeps = [];
  }

  // Parse positions list
  let positions: PositionScore[] = [];
  try {
    if (typeof positions_list === 'string' && positions_list.length > 2) {
      positions = JSON.parse(positions_list);
    }
  } catch (e) {
    positions = [];
  }

  // Calculate points dynamically
  const sweepMyPoints = sweeps.filter(s => s.type === 'given').length * SWEEP_POINTS;
  const sweepOppPoints = sweeps.filter(s => s.type === 'received').length * SWEEP_POINTS;

  const posMyPoints = positions
    .filter(p => p.type === 'me')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);
  
  const posOppPoints = positions
    .filter(p => p.type === 'opponent')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);

  const calculatedMyPoints = sweepMyPoints + posMyPoints;
  const calculatedOppPoints = sweepOppPoints + posOppPoints;

  // Sync calculated points with parent state if they differ
  useEffect(() => {
    if (calculatedMyPoints !== points_my || calculatedOppPoints !== points_opp) {
      onUpdate({
        points_my: calculatedMyPoints,
        points_opp: calculatedOppPoints
      });
    }
  }, [calculatedMyPoints, calculatedOppPoints]);

  const addSweep = (guard: GuardPosition) => {
    const newSweep: Sweep = {
      guard,
      type: sweepType,
      timestamp: new Date().toISOString(),
    };
    const newSweeps = [...sweeps, newSweep];
    onUpdate({ sweeps_list: JSON.stringify(newSweeps) });
    setShowGuardPicker(false);
    haptics.heavy();
  };

  const removeSweep = (index: number) => {
    const newSweeps = sweeps.filter((_, i) => i !== index);
    onUpdate({ sweeps_list: JSON.stringify(newSweeps) });
    haptics.light();
  };

  const addPosition = (position: PositionType) => {
    const newPosition: PositionScore = {
      position,
      type: positionType,
      timestamp: new Date().toISOString(),
    };
    const newPositions = [...positions, newPosition];
    onUpdate({ positions_list: JSON.stringify(newPositions) });
    setShowPositionPicker(false);
    haptics.heavy();
  };

  const removePosition = (index: number) => {
    const newPositions = positions.filter((_, i) => i !== index);
    onUpdate({ positions_list: JSON.stringify(newPositions) });
    haptics.light();
  };

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
          onPress={() => {
            onUpdate({ result: 'win' });
            haptics.medium();
          }}
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
          onPress={() => {
            onUpdate({ result: 'loss' });
            haptics.medium();
          }}
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
          onPress={() => {
            onUpdate({ result: 'draw' });
            haptics.medium();
          }}
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

      {/* ADVANCED SCORING SECTION */}
      <View className="mb-4">
        <Text className="text-white font-bebas text-lg mb-3 tracking-wider">SCORING & STATS</Text>
        
        {/* Score Board (Read Only - Calculated) */}
        <View className="bg-black/40 p-4 rounded-xl border border-white/10 mb-4">
          <Text className="text-gray-400 text-xs font-lato text-center mb-2">LIVE SCORE</Text>
          <View className="flex-row items-center justify-center gap-8">
            <View className="items-center">
              <Text className="text-gray-500 text-[10px] mb-1 font-inter-bold">ME</Text>
              <Text className="text-white font-bebas text-5xl">{calculatedMyPoints}</Text>
            </View>
            <Text className="text-gray-600 font-bebas text-3xl">-</Text>
            <View className="items-center">
              <Text className="text-gray-500 text-[10px] mb-1 font-inter-bold">OPP</Text>
              <Text className="text-white font-bebas text-5xl">{calculatedOppPoints}</Text>
            </View>
          </View>
        </View>

        {/* Sweeps Tracking */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-lato mb-2">SWEEPS</Text>
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={() => {
                setSweepType('given');
                setShowGuardPicker(true);
              }}
              className="flex-1 bg-green-500/20 border border-green-500/30 p-3 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-green-300 font-lato-bold text-xs">+ I Swept</Text>
              <Text className="text-white font-bebas text-xl">{sweeps.filter(s => s.type === 'given').length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSweepType('received');
                setShowGuardPicker(true);
              }}
              className="flex-1 bg-red-500/20 border border-red-500/30 p-3 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-red-300 font-lato-bold text-xs">+ Got Swept</Text>
              <Text className="text-white font-bebas text-xl">{sweeps.filter(s => s.type === 'received').length}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sweeps List */}
          {sweeps.length > 0 && (
            <View className="bg-white/5 p-3 rounded-lg">
              {sweeps.map((sweep, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <View>
                    <Text className={`font-lato-bold ${sweep.type === 'given' ? 'text-green-400' : 'text-red-400'}`}>
                      {sweep.guard}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {sweep.type === 'given' ? '+2 pts (me)' : '+2 pts (opp)'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeSweep(index)} className="bg-white/10 p-1 rounded">
                    <XCircle size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Positions Tracking */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-lato mb-2">POSITIONS</Text>
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={() => {
                setPositionType('me');
                setShowPositionPicker(true);
              }}
              className="flex-1 bg-blue-500/20 border border-blue-500/30 p-3 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-blue-300 font-lato-bold text-xs">+ I Scored</Text>
              <Text className="text-white font-bebas text-xl">{posMyPoints}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPositionType('opponent');
                setShowPositionPicker(true);
              }}
              className="flex-1 bg-orange-500/20 border border-orange-500/30 p-3 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-orange-300 font-lato-bold text-xs">+ Opp Scored</Text>
              <Text className="text-white font-bebas text-xl">{posOppPoints}</Text>
            </TouchableOpacity>
          </View>

          {/* Positions List */}
          {positions.length > 0 && (
            <View className="bg-white/5 p-3 rounded-lg">
              {positions.map((pos, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <View>
                    <Text className={`font-lato-bold ${pos.type === 'me' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {POINT_POSITIONS[pos.position].name}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      +{POINT_POSITIONS[pos.position].points} pts ({pos.type === 'me' ? 'me' : 'opp'})
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removePosition(index)} className="bg-white/10 p-1 rounded">
                    <XCircle size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
        const type = result === 'win' ? 'given' : 'received';
        const newSubmissions = [{ technique: tech.name, type }];
        onUpdate({ 
          submissions_list: JSON.stringify(newSubmissions),
          submission_given: type === 'given' ? 1 : 0,
          submission_received: type === 'received' ? 1 : 0
        });
        setShowTechniquePicker(false);
      }}
    />

    <GuardPicker
      visible={showGuardPicker}
      title={sweepType === 'given' ? 'I Swept From...' : 'Got Swept From...'}
      subtitle="Select guard position"
      type={sweepType === 'given' ? 'bottom' : 'top'}
      onSelect={addSweep}
      onClose={() => setShowGuardPicker(false)}
    />

    <PositionPicker
      visible={showPositionPicker}
      title={positionType === 'me' ? 'I Scored...' : 'Opponent Scored...'}
      subtitle="Select position"
      onSelect={addPosition}
      onClose={() => setShowPositionPicker(false)}
    />
    </>
  );
}
