import React from 'react';
import { PurchasesProvider } from './src/context/PurchasesContext';
import './src/global.css';
import './src/i18n'; // Initialize i18n
import * as Sentry from '@sentry/react-native';
import { PostHogProvider } from 'posthog-react-native';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddLogScreen from './src/screens/AddLogScreen';
import StatsScreen from './src/screens/StatsScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsScreen from './src/screens/TermsScreen';

import { TrainingLog, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { account, client } from './src/lib/appwrite';
import { useEffect } from 'react';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';

// Stripe removed - using RevenueCat for IAP


// Initialize Sentry
/*
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',
  debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
*/

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Montserrat_700Bold,
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    // Verify Appwrite connection
    // User requested client.ping() check
    if ((client as any).ping) {
      (client as any).ping().catch((e: any) => console.log('Ping check:', e));
    }

    account.get()
      .then(() => console.log('Appwrite connection success (User logged in)'))
      .catch((e) => {
        if (e.code === 401) console.log('Appwrite connection success (No session)');
        else console.error('Appwrite connection failed', e);
      });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3a293d' }}>
        <ActivityIndicator size="large" color="#b123c7" />
      </View>
    );
  }

  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
      <PurchasesProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PurchasesProvider>
    </PersistQueryClientProvider>
  );
}

export default App; // Sentry.wrap(App);

// Separate component to access AuthContext
function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3a293d' }}>
        <ActivityIndicator size="large" color="#b123c7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName={user ? "Home" : "Welcome"}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#0a0e1a',
          },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddLog" component={AddLogScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
