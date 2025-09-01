import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Import expo-notifications with error handling
let Notifications: any = null;
let Network: any = null;

try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('⚠️ expo-notifications not available in NotificationContext:', error);
}

try {
  Network = require('expo-network');
} catch (error) {
  console.log('⚠️ expo-network not available in NotificationContext:', error);
}

// Disable problematic imports for development
const isDevelopment = __DEV__;
const isExpoGo = Constants.appOwnership === 'expo';
const isDevelopmentBuild = Constants.appOwnership === 'standalone' || Constants.appOwnership === 'unknown';

if (isDevelopment) {
  console.log('🔧 Development mode: Using simplified notification context');
  console.log('🔧 App ownership:', Constants.appOwnership);
  console.log('🔧 Is Expo Go:', isExpoGo);
  console.log('🔧 Is Development Build:', isDevelopmentBuild);
}

interface NotificationContextType {
  expoNotificationsAvailable: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleNotification: (title: string, body: string, data?: any, trigger?: any) => Promise<string | null>;
  sendImmediateNotification: (title: string, body: string, data?: any) => Promise<string | null>;
  cancelNotification: (identifier: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  getBadgeCount: () => Promise<number>;
  setBadgeCount: (count: number) => Promise<void>;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    console.warn('useNotifications must be used within a NotificationProvider');
    // Return a fallback context instead of throwing an error
    return {
      expoNotificationsAvailable: false,
      requestPermissions: async () => false,
      scheduleNotification: async () => null,
      sendImmediateNotification: async () => null,
      cancelNotification: async () => {},
      cancelAllNotifications: async () => {},
      getBadgeCount: async () => 0,
      setBadgeCount: async () => {},
      isSupported: false,
    };
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoNotificationsAvailable, setExpoNotificationsAvailable] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkNotificationSupport = async () => {
      try {
        // In development mode with Expo Go, disable notifications to avoid errors
        if (isDevelopment && isExpoGo) {
          setExpoNotificationsAvailable(false);
          setIsSupported(false);
          console.log('🔧 Development mode (Expo Go): Notifications disabled to avoid native module errors');
          return;
        }

        // Check if we're running in Expo Go
        const appOwnership = Constants.appOwnership;
        const isExpoGo = appOwnership === 'expo';
        const isDevelopmentBuild = appOwnership === 'standalone' || appOwnership === 'unknown';
        
        console.log('🔔 DEBUG: App ownership:', appOwnership);
        console.log('🔔 DEBUG: Is Expo Go:', isExpoGo);
        console.log('🔔 DEBUG: Is Development Build:', isDevelopmentBuild);
        console.log('🔔 DEBUG: Notifications object available:', !!Notifications);
        console.log('🔔 DEBUG: Network object available:', !!Network);

        if (Notifications && !isExpoGo) {
          setExpoNotificationsAvailable(true);
          setIsSupported(true);
          console.log('✅ Notifications fully supported in development build');
        } else if (Notifications && isExpoGo) {
          setExpoNotificationsAvailable(true);
          setIsSupported(false);
          console.log('⚠️ Notifications available but limited in Expo Go');
        } else {
          setExpoNotificationsAvailable(false);
          setIsSupported(false);
          console.log('❌ Notifications not available - using fallback mode');
        }
      } catch (error) {
        console.error('NotificationContext: Error checking notification support:', error);
        setExpoNotificationsAvailable(false);
        setIsSupported(false);
      }
    };

    checkNotificationSupport();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot request permissions - notifications not available');
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('NotificationContext: Permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('NotificationContext: Error requesting permissions:', error);
      return false;
    }
  };

  const scheduleNotification = async (
    title: string, 
    body: string, 
    data?: any, 
    trigger?: any
  ): Promise<string | null> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot schedule notification - notifications not available');
      return null;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      });
      console.log('NotificationContext: Scheduled notification with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('NotificationContext: Error scheduling notification:', error);
      return null;
    }
  };

  const sendImmediateNotification = async (
    title: string, 
    body: string, 
    data?: any
  ): Promise<string | null> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot send immediate notification - notifications not available');
      return null;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // No trigger for immediate notifications
      });
      console.log('NotificationContext: Sent immediate notification with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('NotificationContext: Error sending immediate notification:', error);
      return null;
    }
  };

  const cancelNotification = async (identifier: string): Promise<void> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot cancel notification - notifications not available');
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('NotificationContext: Cancelled notification:', identifier);
    } catch (error) {
      console.error('NotificationContext: Error cancelling notification:', error);
    }
  };

  const cancelAllNotifications = async (): Promise<void> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot cancel all notifications - notifications not available');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('NotificationContext: Cancelled all notifications');
    } catch (error) {
      console.error('NotificationContext: Error cancelling all notifications:', error);
    }
  };

  const getBadgeCount = async (): Promise<number> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot get badge count - notifications not available');
      return 0;
    }

    try {
      const count = await Notifications.getBadgeCountAsync();
      console.log('NotificationContext: Badge count:', count);
      return count;
    } catch (error) {
      console.error('NotificationContext: Error getting badge count:', error);
      return 0;
    }
  };

  const setBadgeCount = async (count: number): Promise<void> => {
    if (!Notifications || !expoNotificationsAvailable) {
      console.log('⚠️ Cannot set badge count - notifications not available');
      return;
    }

    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('NotificationContext: Set badge count to:', count);
    } catch (error) {
      console.error('NotificationContext: Error setting badge count:', error);
    }
  };

  const contextValue: NotificationContextType = {
    expoNotificationsAvailable,
    requestPermissions,
    scheduleNotification,
    sendImmediateNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    isSupported,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
