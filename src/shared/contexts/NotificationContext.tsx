import React, { createContext, useContext } from 'react';

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
  console.log('🔧 NotificationContext: Using simplified notification context (notifications disabled)');

  const requestPermissions = async (): Promise<boolean> => {
    console.log('🔧 Notifications disabled - cannot request permissions');
    return false;
  };

  const scheduleNotification = async (
    title: string, 
    body: string, 
    data?: any, 
    trigger?: any
  ): Promise<string | null> => {
    console.log('🔧 Notifications disabled - cannot schedule notification');
    return null;
  };

  const sendImmediateNotification = async (
    title: string, 
    body: string, 
    data?: any
  ): Promise<string | null> => {
    console.log('🔧 Notifications disabled - cannot send immediate notification');
    return null;
  };

  const cancelNotification = async (identifier: string): Promise<void> => {
    console.log('🔧 Notifications disabled - cannot cancel notification');
  };

  const cancelAllNotifications = async (): Promise<void> => {
    console.log('🔧 Notifications disabled - cannot cancel all notifications');
  };

  const getBadgeCount = async (): Promise<number> => {
    console.log('🔧 Notifications disabled - cannot get badge count');
    return 0;
  };

  const setBadgeCount = async (count: number): Promise<void> => {
    console.log('🔧 Notifications disabled - cannot set badge count');
  };

  const contextValue: NotificationContextType = {
    expoNotificationsAvailable: false,
    requestPermissions,
    scheduleNotification,
    sendImmediateNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    isSupported: false,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
