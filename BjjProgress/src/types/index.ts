export interface TrainingLog {
  $id: string;
  user_id: string;
  date: string;
  duration: number;
  type: 'GI' | 'NO-GI' | 'COMP';
  notes: string;
  reflection: string;
  submission_given: number;
  submission_received: number;
  sparring_rounds: number;
  tournament_name?: string;
  weight_class?: string;
  location?: string;
  competition_style?: 'GI' | 'NO-GI';
}

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type Stripes = 0 | 1 | 2 | 3 | 4;

import { Models } from 'react-native-appwrite';

export interface UserPreferences extends Models.Preferences {
  belt?: BeltLevel;
  stripes?: Stripes;
  subscription_tier?: string;
  subscription_status?: string;
  subscription_end_date?: string;
  subscription_renewal_date?: string;
  trial_start_date?: string;
  trial_end_date?: string;
  stripe_customer_id?: string;
}



export interface Friend {
  $id: string;
  user_id_1: string;
  user_id_2: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: { initialMode?: 'login' | 'register' };
  Home: undefined;
  AddLog: { log?: TrainingLog } | undefined;
  Stats: undefined;
  Paywall: undefined;
  Settings: undefined;
  Friends: undefined;
};
