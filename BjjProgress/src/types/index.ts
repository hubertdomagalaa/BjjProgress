export interface TrainingLog {
  $id: string;
  user_id: string;
  date: string;
  duration: number;
  type: 'GI' | 'NO-GI';
  notes: string;
  reflection: string;
  submission_given: number;
  submission_received: number;
  sparring_rounds: number;
}

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type Stripes = 0 | 1 | 2 | 3 | 4;

// Extend Appwrite's Models.Preferences to include our custom fields
declare module 'react-native-appwrite' {
  namespace Models {
    interface Preferences {
      belt?: BeltLevel;
      stripes?: Stripes;
      subscription_tier?: string;
      subscription_status?: string;
      subscription_end_date?: string;
      subscription_renewal_date?: string; // NEW: Next payment date
      trial_start_date?: string; // When trial started
      trial_end_date?: string;   // When trial ends
      stripe_customer_id?: string;
    }
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
  AddLog: { log?: TrainingLog } | undefined;
  Stats: undefined;
  Paywall: undefined;
  Settings: undefined;
};
