// Subscription utility functions

export interface SubscriptionInfo {
  isPremium: boolean;
  isTrial: boolean;
  daysLeft: number;
  message: string;
  tier: 'free' | 'pro' | 'coach';
}

export const calculateDaysRemaining = (endDate: string | null): number => {
  if (!endDate) return 0;
  
  try {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch (e) {
    return 0;
  }
};

export const getSubscriptionStatus = (user: any): SubscriptionInfo => {
  // Default for users without subscription data
  if (!user) {
    return {
      isPremium: false,
      isTrial: false,
      daysLeft: 0,
      message: 'Free Plan',
      tier: 'free',
    };
  }

  const tier = user.subscription_tier || 'free';
  const status = user.subscription_status || 'inactive';
  const trialEndDate = user.trial_end_date || null;
  const subscriptionEndDate = user.subscription_end_date || null;

  const daysLeft = calculateDaysRemaining(
    status === 'trial' ? trialEndDate : subscriptionEndDate
  );

  const isTrial = status === 'trial' && daysLeft > 0;
  // PRO if status is 'active' OR tier is 'pro' (even without end_date)
  const isActive = status === 'active' || tier === 'pro';
  const isPremium = isTrial || isActive;

  let message = 'Free Plan';
  if (isTrial) {
    message = `${daysLeft} days left in trial`;
  } else if (isActive) {
    message = `${daysLeft} days until renewal`;
  } else if (status === 'canceled') {
    message = 'Subscription canceled';
  } else if (status === 'expired') {
    message = 'Trial expired';
  }

  return {
    isPremium,
    isTrial,
    daysLeft,
    message,
    tier: tier as 'free' | 'pro' | 'coach',
  };
};

// NEW: Trial-specific utility functions
export const getTrialDaysRemaining = (trialEndDate?: string): number | null => {
  if (!trialEndDate) return null;
  
  try {
    const end = new Date(trialEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days : 0;
  } catch (e) {
    return null;
  }
};

export const isTrialActive = (prefs: any): boolean => {
  const daysLeft = getTrialDaysRemaining(prefs?.trial_end_date);
  return daysLeft !== null && daysLeft > 0;
};

export const isTrialExpired = (prefs: any): boolean => {
  // If no trial dates, not expired (could be new user or PRO)
  if (!prefs?.trial_end_date) return false;
  
  const daysLeft = getTrialDaysRemaining(prefs.trial_end_date);
  return daysLeft !== null && daysLeft === 0;
};

// Check PRO status (simple and clear)
export const checkSubscription = (prefs: any) => {
  const isPro = prefs?.subscription_tier === 'pro' || prefs?.subscription_status === 'active';
  const isTrialing = isTrialActive(prefs);
  const trialExpired = isTrialExpired(prefs);
  const trialDays = getTrialDaysRemaining(prefs?.trial_end_date);
  
  return {
    isPro,
    isTrialing,
    trialExpired,
    trialDays,
    hasAccess: isPro || isTrialing, // Can use features
  };
};
