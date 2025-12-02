import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Sweep, SWEEP_POINTS, GuardPosition } from '../constants/bjj-guards';
import { PositionScore, POINT_POSITIONS, PositionType } from '../constants/bjj-positions';
import { GuardPicker } from './GuardPicker';
import { PositionPicker } from './PositionPicker';

const SUBMISSION_TYPES = [
  // Chokes
  'RNC',
  'Guillotine',
  'Triangle',
  'Arm Triangle',
  'D\'Arce',
  'Anaconda',
  'Ezekiel',
  'Bow & Arrow',
  'Buggy Choke',
  // Armbars
  'Armbar',
  // Shoulder Locks
  'Kimura',
  'Americana',
  'Omoplata',
  // Leg Locks
  'Heel Hook',
  'Kneebar',
  'Ankle Lock',
  'Toe Hold',
  // Other
  'Other',
];

interface SubmissionEvent {
  type: 'given' | 'received';
  technique: string;
}

interface Props {
  number: number;
  submissionGiven: number;
  submissionReceived: number;
  submissionsList: string;
  sweeps_list?: string;
  positions_list?: string; // NEW
  notes: string;
  partner_name?: string;
  onUpdate: (updates: {
    submissionGiven?: number;
    submissionReceived?: number;
    submissionsList?: string;
    sweeps_list?: string;
    positions_list?: string; // NEW
    notes?: string;
    partner_name?: string;
  }) => void;
  onDelete: () => void;
}

export default function SparringTile({
  number,
  submissionGiven,
  submissionReceived,
  submissionsList,
  sweeps_list = '[]',
  positions_list = '[]',
  notes,
  partner_name = '',
  onUpdate,
  onDelete,
}: Props) {
  const [showTechniqueSelector, setShowTechniqueSelector] = useState(false);
  const [selectedType, setSelectedType] = useState<'given' | 'received'>('given');
  const [showGuardPicker, setShowGuardPicker] = useState(false);
  const [sweepType, setSweepType] = useState<'given' | 'received'>('given');
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [positionType, setPositionType] = useState<'me' | 'opponent'>('me');

  // Parse submissions list - handle both string and array formats
  let events: SubmissionEvent[] = [];
  try {
    if (typeof submissionsList === 'string' && submissionsList.length > 2) {
      events = JSON.parse(submissionsList);
    } else if (Array.isArray(submissionsList)) {
      events = submissionsList.map(item => 
        typeof item === 'string' ? JSON.parse(item) : item
      ).filter(e => e.type && e.technique);
    }
  } catch (e) {
    events = [];
  }

  // Parse sweeps list
  let sweeps: Sweep[] = [];
  try {
    if (typeof sweeps_list === 'string' && sweeps_list.length > 2) {
      sweeps = JSON.parse(sweeps_list);
    }
  } catch (e) {
    sweeps = [];
  }

  // Calculate counters from events array (always up-to-date)
  const currentGivenCount = events.filter(e => e.type === 'given').length;
  const currentReceivedCount = events.filter(e => e.type === 'received').length;

  // Calculate sweep counters
  const sweepsGiven = sweeps.filter(s => s.type === 'given').length;
  const sweepsReceived = sweeps.filter(s => s.type === 'received').length;

  // Calculate points (2 per sweep)
  const sweepMyPoints = sweepsGiven * SWEEP_POINTS;
  const sweepOpponentPoints = sweepsReceived * SWEEP_POINTS;

  // Parse positions list
  let positions: PositionScore[] = [];
  try {
    if (typeof positions_list === 'string' && positions_list.length > 2) {
      positions = JSON.parse(positions_list);
    }
  } catch (e) {
    positions = [];
  }

  // Calculate position points
  const positionMyPoints = positions
    .filter(p => p.type === 'me')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);
  
  const positionOpponentPoints = positions
    .filter(p => p.type === 'opponent')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);

  // Total points = sweeps + positions
  const totalMyPoints = sweepMyPoints + positionMyPoints;
  const totalOpponentPoints = sweepOpponentPoints + positionOpponentPoints;

  const addSubmissionEvent = (technique: string) => {
    const newEvent: SubmissionEvent = {
      type: selectedType,
      technique,
    };
    const newEvents = [...events, newEvent];
    
    // Update counts
    const givenCount = newEvents.filter(e => e.type === 'given').length;
    const receivedCount = newEvents.filter(e => e.type === 'received').length;

    onUpdate({
      submissionsList: JSON.stringify(newEvents), // Store entire array as JSON string
      submissionGiven: givenCount,
      submissionReceived: receivedCount,
    });

    setShowTechniqueSelector(false);
  };

  const removeSubmissionEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    
    const givenCount = newEvents.filter(e => e.type === 'given').length;
    const receivedCount = newEvents.filter(e => e.type === 'received').length;

    onUpdate({
      submissionsList: JSON.stringify(newEvents),
      submissionGiven: givenCount,
      submissionReceived: receivedCount,
    });
  };

  const addSweep = (guard: GuardPosition) => {
    const newSweep: Sweep = {
      guard,
      type: sweepType,
      timestamp: new Date().toISOString(),
    };
    
    const newSweeps = [...sweeps, newSweep];
    onUpdate({
      sweeps_list: JSON.stringify(newSweeps),
    });
    
    setShowGuardPicker(false);
  };

  const removeSweep = (index: number) => {
    const newSweeps = sweeps.filter((_, i) => i !== index);
    onUpdate({
      sweeps_list: JSON.stringify(newSweeps),
    });
  };

  const addPosition = (position: PositionType) => {
    const newPosition: PositionScore = {
      position,
      type: positionType,
      timestamp: new Date().toISOString(),
    };
    
    const newPositions = [...positions, newPosition];
    onUpdate({
      positions_list: JSON.stringify(newPositions),
    });
    
    setShowPositionPicker(false);
  };

  const removePosition = (index: number) => {
    const newPositions = positions.filter((_, i) => i !== index);
    onUpdate({
      positions_list: JSON.stringify(newPositions),
    });
  };

  return (
    <View className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[#fefcfe] text-lg font-lato-bold">
          Sparring #{number}
        </Text>
        <TouchableOpacity
          onPress={onDelete}
          className="bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/40"
        >
          <Text className="text-red-400 font-lato-bold text-sm">Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Partner Name */}
      <View className="mb-3">
        <Text className="text-gray-400 font-lato text-xs mb-1">Partner (optional)</Text>
        <TextInput
          className="bg-white/5 p-2 rounded-lg text-white font-lato border border-white/10"
          placeholder="Partner name..."
          placeholderTextColor="#6B7280"
          value={partner_name}
          onChangeText={(text) => onUpdate({ partner_name: text })}
        />
      </View>

      {/* Summary Counters */}
      <View className="flex-row justify-around mb-4 bg-white/5 p-3 rounded-lg">
        <View className="items-center">
          <Text className="text-gray-400 text-xs font-lato mb-1">Me</Text>
          <Text className="text-green-400 text-2xl font-lato-bold">{currentGivenCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs font-lato mb-1">Opponent</Text>
          <Text className="text-red-400 text-2xl font-lato-bold">{currentReceivedCount}</Text>
        </View>
      </View>

      {/* Submission Events List */}
      <View className="mb-3">
        <Text className="text-gray-300 font-lato mb-2">Submission Sequence</Text>
        
        {events.length > 0 ? (
          <View className="space-y-2">
            {events.map((event, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between p-3 rounded-lg border ${
                  event.type === 'given'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-white font-lato-bold text-lg mr-2">
                    {index + 1}.
                  </Text>
                  <View>
                    <Text className={`font-lato-bold ${
                      event.type === 'given' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {event.technique}
                    </Text>
                    <Text className="text-gray-400 text-xs font-lato">
                      {event.type === 'given' ? 'Me ✓' : 'Opponent ✗'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeSubmissionEvent(index)}
                  className="bg-red-500/20 px-2 py-1 rounded"
                >
                  <Text className="text-red-400 text-xs font-lato-bold">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-white/5 p-6 rounded-lg border border-dashed border-white/10">
            <Text className="text-gray-500 text-center font-lato text-sm">
              No submissions in this sparring
            </Text>
          </View>
        )}
      </View>

      {/* Add Submission Button */}
      {!showTechniqueSelector ? (
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity
            onPress={() => {
              setSelectedType('given');
              setShowTechniqueSelector(true);
            }}
            className="flex-1 bg-green-500/20 py-3 rounded-lg border border-green-500/40"
          >
            <Text className="text-green-400 text-center font-lato-bold text-sm">
              + I Submitted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedType('received');
              setShowTechniqueSelector(true);
            }}
            className="flex-1 bg-red-500/20 py-3 rounded-lg border border-red-500/40"
          >
            <Text className="text-red-400 text-center font-lato-bold text-sm">
              + I Was Submitted
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 font-lato">
              {selectedType === 'given' ? '✓ I Submitted' : '✗ I Was Submitted'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowTechniqueSelector(false)}
              className="bg-white/10 px-3 py-1 rounded"
            >
              <Text className="text-gray-400 font-lato-bold text-xs">Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            {SUBMISSION_TYPES.map((sub) => (
              <TouchableOpacity
                key={sub}
                onPress={() => addSubmissionEvent(sub)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedType === 'given'
                    ? 'bg-green-500/20 border-green-500/40'
                    : 'bg-red-500/20 border-red-500/40'
                }`}
              >
                <Text
                  className={`font-lato text-sm ${
                    selectedType === 'given' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Sweeps Section */}
      <View className="mb-4">
        <Text className="text-gray-300 font-lato mb-2">Sweeps ({sweepsGiven + sweepsReceived})</Text>
        
        {/* Points Display */}
        <View className="flex-row justify-around mb-3 bg-green-500/10 p-3 rounded-lg border border-green-500/30">
          <View className="items-center">
            <Text className="text-gray-400 text-xs font-lato">My Points</Text>
            <Text className="text-green-400 text-xl font-lato-bold">{sweepMyPoints}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-400 text-xs font-lato">Opponent Points</Text>
            <Text className="text-red-400 text-xl font-lato-bold">{sweepOpponentPoints}</Text>
          </View>
        </View>
        
        {/* Add Sweep Buttons */}
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity
            onPress={() => {
              setSweepType('given');
              setShowGuardPicker(true);
            }}
            className="flex-1 bg-green-500/20 border border-green-500/50 px-3 py-2 rounded-lg"
          >
            <Text className="text-green-400 font-lato-bold text-center text-sm">
              + I Swept
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              setSweepType('received');
              setShowGuardPicker(true);
            }}
            className="flex-1 bg-red-500/20 border border-red-500/50 px-3 py-2 rounded-lg"
          >
            <Text className="text-red-400 font-lato-bold text-center text-sm">
              + Got Swept
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Sweeps List */}
        {sweeps.length > 0 && (
          <View className="bg-white/5 p-3 rounded-lg">
            {sweeps.map((sweep, index) => (
              <View 
                key={index} 
                className="flex-row justify-between items-center py-2 border-b border-white/10"
              >
                <View className="flex-1">
                  <Text className={`font-lato-bold ${
                    sweep.type === 'given' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {sweep.guard}
                  </Text>
                  <Text className="text-gray-500 text-xs font-lato">
                    {sweep.type === 'given' ? '+2 pts (me)' : '+2 pts (opponent)'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeSweep(index)}
                  className="bg-red-500/20 px-2 py-1 rounded"
                >
                  <Text className="text-red-400 font-lato text-xs">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Positions Section - IBJJF Points */}
      <View className="mb-4">
        <Text className="text-gray-300 font-lato mb-2">Positions ({positions.length})</Text>
        
        {/* Total Points Display */}
        <View className="flex-row justify-around mb-3 bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
          <View className="items-center">
            <Text className="text-gray-400 text-xs font-lato">Total My Points</Text>
            <Text className="text-blue-400 text-xl font-lato-bold">{totalMyPoints}</Text>
            <Text className="text-gray-500 text-xs font-lato">
              ({sweepMyPoints} sweeps + {positionMyPoints} positions)
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-400 text-xs font-lato">Total Opponent</Text>
            <Text className="text-orange-400 text-xl font-lato-bold">{totalOpponentPoints}</Text>
            <Text className="text-gray-500 text-xs font-lato">
              ({sweepOpponentPoints} sweeps + {positionOpponentPoints} positions)
            </Text>
          </View>
        </View>
        
        {/* Add Position Buttons */}
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity
            onPress={() => {
              setPositionType('me');
              setShowPositionPicker(true);
            }}
            className="flex-1 bg-blue-500/20 border border-blue-500/50 px-3 py-2 rounded-lg"
          >
            <Text className="text-blue-400 font-lato-bold text-center text-sm">
              + I Scored
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              setPositionType('opponent');
              setShowPositionPicker(true);
            }}
            className="flex-1 bg-orange-500/20 border border-orange-500/50 px-3 py-2 rounded-lg"
          >
            <Text className="text-orange-400 font-lato-bold text-center text-sm">
              + Opponent Scored
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Positions List */}
        {positions.length > 0 && (
          <View className="bg-white/5 p-3 rounded-lg">
            {positions.map((pos, index) => (
              <View 
                key={index} 
                className="flex-row justify-between items-center py-2 border-b border-white/10"
              >
                <View className="flex-1">
                  <Text className={`font-lato-bold ${
                    pos.type === 'me' ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {POINT_POSITIONS[pos.position].name}
                  </Text>
                  <Text className="text-gray-500 text-xs font-lato">
                    +{POINT_POSITIONS[pos.position].points} pts ({pos.type === 'me' ? 'me' : 'opponent'})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removePosition(index)}
                  className="bg-red-500/20 px-2 py-1 rounded"
                >
                  <Text className="text-red-400 font-lato text-xs">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Notes */}
      <View>
        <Text className="text-gray-300 font-lato mb-2">Notes</Text>
        <TextInput
          className="bg-white/10 p-3 rounded-lg text-[#fefcfe] font-lato border border-white/10min-h-[150px]"
          placeholder="Notes about this sparring..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          value={notes}
          onChangeText={(text) => onUpdate({ notes: text })}
          textAlignVertical="top"
          style={{ minHeight: 150 }}
        />
      </View>

      {/* Guard Picker Modal */}
      <GuardPicker
        visible={showGuardPicker}
        title={sweepType === 'given' ? 'I Swept From...' : 'Got Swept From...'}
        subtitle="Select guard position"
        type={sweepType === 'given' ? 'bottom' : 'top'}
        onSelect={addSweep}
        onClose={() => setShowGuardPicker(false)}
      />

      {/* Position Picker Modal */}
      <PositionPicker
        visible={showPositionPicker}
        title={positionType === 'me' ? 'I Scored...' : 'Opponent Scored...'}
        subtitle="Select position"
        onSelect={addPosition}
        onClose={() => setShowPositionPicker(false)}
      />
    </View>
  );
}
