import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import './src/global.css';
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

import { TrainingLog, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

import { AuthProvider } from './src/context/AuthContext';
import { account } from './src/lib/appwrite';
import { useEffect } from 'react';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

export default function App() {
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
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </StripeProvider>
  );
}

// Separate component to access AuthContext
function AppNavigator() {
  const { user, isLoading } = require('./src/context/AuthContext').useAuth();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
