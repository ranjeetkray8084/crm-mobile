// Mobile-specific configuration for React Native/Expo
import Constants from 'expo-constants';

export const mobileConfig = {
  // API Configuration for mobile
  api: {
    baseURL: Constants.expoConfig?.extra?.apiBaseUrl || 'http://192.168.1.26:8082',
    timeout: 30000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Platform': 'mobile'
    }
  },

  // Storage Configuration for React Native
  storage: {
    tokenKey: 'crm_token',
    userKey: 'crm_user',
    prefix: 'crm_',
    // Use AsyncStorage for React Native
    type: 'async'
  },

  // Mobile-specific features
  features: {
    enableNotifications: true,
    enableOfflineMode: true,
    enableBiometric: false, // Can be enabled with expo-local-authentication
    enablePushNotifications: false, // Can be enabled with expo-notifications
    enableHapticFeedback: true, // Uses expo-haptics
    enableDeepLinking: true // Uses expo-linking
  },

  // Platform detection for mobile
  platform: {
    isWeb: false,
    isMobile: true,
    isTablet: false, // Can be detected with expo-device
    isExpo: true
  },

  // Mobile UI configuration
  ui: {
    // Safe area handling
    safeArea: {
      top: true,
      bottom: true,
      left: true,
      right: true
    },
    
    // Touch feedback
    touchFeedback: {
      enabled: true,
      duration: 200
    },

    // Colors adapted for mobile
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280'
    }
  },

  // Environment detection
  environment: Constants.expoConfig?.extra?.environment || 'development',
  
  // Debug mode
  debug: Constants.expoConfig?.extra?.debug || __DEV__
};

// Export default config
export default mobileConfig;
