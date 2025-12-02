import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { account, databases, appwriteConfig } from '../lib/appwrite';
import { Models, ID } from 'react-native-appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize trial for new users
  const initializeTrialIfNeeded = async (currentUser: Models.User<Models.Preferences>) => {
    try {
      const prefs = currentUser.prefs || {};
      
      // If no trial start date and not PRO, start trial automatically
      if (!prefs.trial_start_date && prefs.subscription_tier !== 'pro') {
        const now = new Date().toISOString();
        const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        await account.updatePrefs({
          ...prefs,
          trial_start_date: now,
          trial_end_date: trialEnd,
          subscription_status: 'trialing',
        });
        
        // Refresh user to get updated preferences
        const updatedUser = await account.get();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error initializing trial:', error);
    }
  };

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Auto-activate trial for new users
      await initializeTrialIfNeeded(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Delete any existing session first
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if no session exists
      }
      
      await account.createEmailPasswordSession(email, password);
      await checkUser();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Delete any existing session first
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if no session exists
      }
      
      // Create account with unique ID
      const userId = ID.unique();
      const newUser = await account.create(userId, email, password);
      
      // Login immediately
      await account.createEmailPasswordSession(email, password);
      
      // Grant automatic 7-day FREE PRO access for all new users
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now
      
      try {
        // Create user document with free 7-day access
        await databases.createDocument(
          appwriteConfig.databaseId,
          '69285365001eb0f8b99e', // users collection
          newUser.$id,
          {
            user_id: newUser.$id,
            email: newUser.email,
            subscription_tier: 'pro',
            subscription_status: 'trial',
            trial_end_date: trialEndDate.toISOString(),
            created_at: new Date().toISOString(),
          }
        );
        console.log('✅ New user granted 7 days free PRO access!');
      } catch (e) {
        console.log('ℹ️ User document creation skipped:', e);
        // Continue even if this fails - user can still use app
      }
      
      await checkUser();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
