import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  isInitialized: boolean;
  serviceStatus: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({
    firebaseAvailable: false,
    serviceType: 'Unknown'
  });

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Check if device supports notifications
        const isSupported = Device.isDevice;
        
        if (!isSupported) {
          console.log('🔔 Notifications not supported on simulator');
          setServiceStatus(prev => ({ ...prev, serviceType: 'Not Supported' }));
          setIsInitialized(true);
          return;
        }

        // Configure notification behavior
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        // Check permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('🔔 Notification permission not granted');
          setServiceStatus(prev => ({ ...prev, serviceType: 'Permission Denied' }));
        } else {
          console.log('🔔 Notification permission granted');
          setServiceStatus(prev => ({ ...prev, serviceType: 'Expo Notifications' }));
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('🔔 Notification initialization error:', error);
        setServiceStatus(prev => ({ ...prev, serviceType: 'Error' }));
        setIsInitialized(true);
      }
    };

    initializeNotifications();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('🔔 Permission request error:', error);
      return false;
    }
  };

  const scheduleNotification = async (
    title: string, 
    body: string, 
    data?: any, 
    trigger?: any
  ): Promise<string | null> => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      });
      return identifier;
    } catch (error) {
      console.error('🔔 Schedule notification error:', error);
      return null;
    }
  };

  const sendImmediateNotification = async (
    title: string, 
    body: string, 
    data?: any
  ): Promise<string | null> => {
    return scheduleNotification(title, body, data, null);
  };

  const cancelNotification = async (identifier: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('🔔 Cancel notification error:', error);
    }
  };

  const cancelAllNotifications = async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('🔔 Cancel all notifications error:', error);
    }
  };

  const getBadgeCount = async (): Promise<number> => {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('🔔 Get badge count error:', error);
      return 0;
    }
  };

  const setBadgeCount = async (count: number): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('🔔 Set badge count error:', error);
    }
  };

  const contextValue: NotificationContextType = {
    expoNotificationsAvailable: true,
    requestPermissions,
    scheduleNotification,
    sendImmediateNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    isSupported: Device.isDevice,
    isInitialized,
    serviceStatus,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};