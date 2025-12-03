import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search, UserPlus, Users, Check, X, Share2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { databases, appwriteConfig, Query, ID } from '../lib/appwrite';
import { Friend } from '../types';
import { shadows } from '../styles/shadows';
import { haptics } from '../utils/haptics';
import { useTranslation } from 'react-i18next';

type Tab = 'friends' | 'add';

export default function FriendsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any[]>([]); // Using any for now as we join with user data
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Mock data for UI development until backend is ready
  const MOCK_FRIENDS = [
    { $id: '1', name: 'Marcus Almeida', belt: 'black', stripes: 2 },
    { $id: '2', name: 'Gordon Ryan', belt: 'black', stripes: 4 },
  ];

  const fetchFriends = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { databaseId } = appwriteConfig;
      // Fetch where I am user_1
      const response1 = await databases.listDocuments(
        databaseId,
        'friends',
        [Query.equal('user_id_1', user.$id), Query.equal('status', 'accepted')]
      );
      
      // Fetch where I am user_2
      const response2 = await databases.listDocuments(
        databaseId,
        'friends',
        [Query.equal('user_id_2', user.$id), Query.equal('status', 'accepted')]
      );

      // Combine and extract friend IDs
      const friendIds = [
        ...response1.documents.map((doc: any) => doc.user_id_2),
        ...response2.documents.map((doc: any) => doc.user_id_1)
      ];

      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      // Fetch user details for these friends
      // Note: In a real app, you'd want a Cloud Function for this to avoid exposing all users
      // For now, we'll assume we can fetch public profiles if we had a collection for them.
      // Since we don't have a public profiles collection yet, we will show IDs or placeholder names
      // until Phase 2 of Social (Profiles).
      
      // TEMPORARY: Just show IDs as names for now to prove connection
      setFriends(friendIds.map(id => ({ $id: id, name: `User ${id.substring(0, 5)}`, belt: 'white', stripes: 0 })));
      
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      // Query the 'users' collection (ID from AuthContext)
      // Note: This requires the users collection to have read permissions for authenticated users
      const USERS_COLLECTION_ID = '6745960d001d960d2358'; 
      
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        USERS_COLLECTION_ID,
        [
          Query.search('email', searchQuery), // Assuming we search by email for now, or name if available
          Query.limit(5)
        ]
      );
      
      // Map to UI format
      const results = response.documents.map((doc: any) => ({
        $id: doc.$id,
        name: doc.email.split('@')[0], // Use email prefix as name if name field is missing
        belt: doc.belt || 'white',
        stripes: doc.stripes || 0
      })).filter((doc: any) => doc.$id !== user?.$id); // Exclude self

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback for demo if search fails (e.g. permissions issue)
      Alert.alert('Info', 'Search requires backend permissions. Showing mock result.');
      setSearchResults([
        { $id: '3', name: 'John Danaher', belt: 'black', stripes: 4 },
      ]);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!user) return;
    try {
      haptics.medium();
      
      // Check if already friends or requested
      // This logic should ideally be server-side or more robust
      
      await databases.createDocument(
        appwriteConfig.databaseId,
        'friends',
        ID.unique(),
        {
          user_id_1: user.$id,
          user_id_2: targetUserId,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      );
      
      Alert.alert('Success', 'Friend request sent!');
      setActiveTab('friends');
    } catch (error: any) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const renderFriendItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between bg-dark-card p-4 rounded-xl mb-3 border border-white/5">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center border border-purple-500/30">
          <Text className="text-purple-400 font-bebas text-lg">{item.name.charAt(0)}</Text>
        </View>
        <View>
          <Text className="text-white font-lato-bold text-base">{item.name}</Text>
          <Text className="text-gray-400 text-xs font-lato capitalize">{item.belt} Belt • {item.stripes} Stripes</Text>
        </View>
      </View>
    </View>
  );

  const renderSearchItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between bg-dark-card p-4 rounded-xl mb-3 border border-white/5">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
          <Text className="text-white font-bebas text-lg">{item.name.charAt(0)}</Text>
        </View>
        <View>
          <Text className="text-white font-lato-bold text-base">{item.name}</Text>
          <Text className="text-gray-400 text-xs font-lato capitalize">{item.belt} Belt</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => sendFriendRequest(item.$id)}
        className="bg-purple-600 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
      >
        <UserPlus size={14} color="#fff" />
        <Text className="text-white font-inter-bold text-xs">Add</Text>
      </TouchableOpacity>
    </View>
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join me on BJJ Progress to track your training and competitions! 🥋\n\nDownload here: https://bjjprogress.com',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="px-4 pt-14 pb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="font-bebas text-3xl text-white tracking-wider">COMMUNITY</Text>
        </View>

        <TouchableOpacity 
          onPress={handleShare}
          className="bg-purple-500/20 p-2 rounded-full border border-purple-500/30"
        >
          <Share2 size={20} color="#d8b4fe" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-6">
        <TouchableOpacity 
          onPress={() => setActiveTab('friends')}
          className={`flex-1 pb-3 border-b-2 ${activeTab === 'friends' ? 'border-purple-500' : 'border-transparent'}`}
        >
          <Text className={`text-center font-bebas text-xl ${activeTab === 'friends' ? 'text-purple-400' : 'text-gray-500'}`}>
            MY FRIENDS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('add')}
          className={`flex-1 pb-3 border-b-2 ${activeTab === 'add' ? 'border-purple-500' : 'border-transparent'}`}
        >
          <Text className={`text-center font-bebas text-xl ${activeTab === 'add' ? 'text-purple-400' : 'text-gray-500'}`}>
            FIND PEOPLE
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {activeTab === 'friends' ? (
          loading ? (
            <ActivityIndicator size="large" color="#a855f7" className="mt-10" />
          ) : (
            <FlatList
              data={friends}
              renderItem={renderFriendItem}
              keyExtractor={item => item.$id}
              ListEmptyComponent={
                <View className="items-center mt-10">
                  <Users size={48} color="#4b5563" />
                  <Text className="text-gray-500 font-lato mt-4">No friends yet. Add some!</Text>
                </View>
              }
            />
          )
        ) : (
          <View>
            <View className="flex-row items-center bg-dark-card border border-white/10 rounded-xl px-4 py-3 mb-6">
              <Search size={20} color="#9ca3af" />
              <TextInput
                placeholder="Search by name..."
                placeholderTextColor="#9ca3af"
                className="flex-1 ml-3 text-white font-lato text-base"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            
            {searching ? (
              <ActivityIndicator color="#a855f7" />
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchItem}
                keyExtractor={item => item.$id}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}
