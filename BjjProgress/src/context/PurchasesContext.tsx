import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';

// Replace with your RevenueCat Public API Key from the dashboard
const API_KEYS = {
  apple: 'appl_XVpYCMeENhyKsgofjmTOmCArpKI',
  google: 'goog_custom_key_placeholder', // Placeholder for Android
};

const REVENUECAT_API_KEY = Platform.select({
  ios: API_KEYS.apple,
  android: API_KEYS.google,
}) || '';

interface PurchasesContextType {
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  isPro: boolean;
  isLoading: boolean;
  purchasePackage: (pkg: any) => Promise<void>;
  restorePurchases: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider = ({ children }: { children: ReactNode }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Configure RevenueCat
        console.log('🔧 RevenueCat: Starting initialization...');
        console.log('🔑 API Key:', REVENUECAT_API_KEY ? 'Present' : 'Missing');
        
        if (REVENUECAT_API_KEY && !REVENUECAT_API_KEY.includes('YOUR_')) {
          Purchases.configure({ apiKey: REVENUECAT_API_KEY });
          console.log('✅ RevenueCat: Configured successfully');
          
          // Fetch initial customer info
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
          console.log('👤 Customer ID:', info.originalAppUserId);
          console.log('🎫 Active Entitlements:', Object.keys(info.entitlements.active));
          
          // Fetch available offerings (products)
          const offers = await Purchases.getOfferings();
          console.log('📦 All Offerings:', JSON.stringify(Object.keys(offers.all || {})));
          console.log('📦 Current Offering:', offers.current ? offers.current.identifier : 'NULL');
          console.log('📦 Available Packages:', offers.current?.availablePackages?.length || 0);
          
          if (offers.current?.availablePackages?.length) {
            offers.current.availablePackages.forEach((pkg, i) => {
              console.log(`  📦 Package ${i}: ${pkg.identifier} - ${pkg.product?.priceString}`);
            });
          } else {
            console.warn('⚠️ No packages available! Check App Store Connect subscription status.');
          }
          
          setOfferings(offers.current);
        } else {
          console.warn('⚠️ RevenueCat API key not configured. Set it in PurchasesContext.tsx');
        }
      } catch (e) {
        console.error('❌ RevenueCat init error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();

    // Listen for customer info updates (e.g., subscription changes)
    Purchases.addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
    });

    // Note: RevenueCat SDK listener doesn't return a remover in all versions
    // The listener will be cleaned up when the app closes
  }, []);

  // Check if user has active 'pro' entitlement
  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;

  const purchasePackage = async (pkg: any) => {
    try {
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newInfo);
    } catch (e: any) {
      // Re-throw so the UI can handle user cancellation vs errors
      throw e;
    }
  };

  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
    } catch (e: any) {
      throw e;
    }
  };

  const refreshCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (e) {
      console.error('Error refreshing customer info:', e);
    }
  };

  return (
    <PurchasesContext.Provider 
      value={{ 
        customerInfo, 
        offerings, 
        isPro, 
        isLoading, 
        purchasePackage, 
        restorePurchases,
        refreshCustomerInfo 
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchasesProvider');
  }
  return context;
};
