import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TokenRegistrationService from './TokenRegistrationService';
import { getApiBaseUrl, API_ENDPOINTS } from '../config/api.config';

// Import expo-notifications with error handling
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('Could not import expo-notifications or expo-device:', error);
}

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: 'default' | 'normal' | 'high';
}

class NotificationService {
  private static instance: NotificationService;
  private isExpoGo: boolean;
  private isDevelopmentBuild: boolean;
  private notificationsAvailable: boolean;
  private tokenRegistrationService: TokenRegistrationService | null;
  private notificationListener: any;
  private responseListener: any;

  constructor() {
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.isDevelopmentBuild = Constants.appOwnership === 'standalone' || Constants.appOwnership === null;
    this.notificationsAvailable = !!(Notifications && !this.isExpoGo);
    this.tokenRegistrationService = TokenRegistrationService.getInstance();
    
    console.log('🔔 DEBUG: NotificationService constructor called');
    console.log('🔔 DEBUG: App ownership:', Constants.appOwnership);
    console.log('🔔 DEBUG: Is Expo Go:', this.isExpoGo);
    console.log('🔔 DEBUG: Is Development Build:', this.isDevelopmentBuild);
    console.log('🔔 DEBUG: Notifications available:', this.notificationsAvailable);
    console.log('🔔 DEBUG: Notifications object:', !!Notifications);
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      console.log('🔔 DEBUG: Creating new NotificationService instance');
      NotificationService.instance = new NotificationService();
    } else {
      console.log('🔔 DEBUG: Returning existing NotificationService instance');
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    console.log('🔔 DEBUG: NotificationService.initialize() called');
    try {
      if (this.notificationsAvailable) {
        console.log('✅ DEBUG: Initializing with full functionality');
        
        // Configure notification behavior for both foreground and background
        console.log('🔔 DEBUG: Setting notification handler...');
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
        console.log('✅ DEBUG: Notification handler set successfully');

        // Set up background notification handling
        await this.setupBackgroundNotifications();
        
      } else {
        console.log('⚠️ DEBUG: Running with limited functionality (Expo Go)');
      }
    } catch (error) {
      console.error('❌ DEBUG: Error during initialization:', error);
    }
  }

  private async setupBackgroundNotifications(): Promise<void> {
    try {
      console.log('🔔 DEBUG: Setting up background notifications...');
      
      // Configure for background notifications
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
      
      console.log('✅ DEBUG: Background notification channel configured');
      
      // Set up notification listeners
      await this.setupNotificationListeners();
      
    } catch (error) {
      console.error('❌ DEBUG: Error setting up background notifications:', error);
    }
  }

  private async setupNotificationListeners(): Promise<void> {
    try {
      console.log('🔔 DEBUG: Setting up notification listeners...');
      
      // Set up Firebase messaging listeners (fallback)
      try {
        const messaging = await import('@react-native-firebase/messaging');
        
        // Listen for foreground messages
        const unsubscribeForeground = messaging.default().onMessage(async (remoteMessage: any) => {
          console.log('🔔 DEBUG: Firebase foreground message received:', remoteMessage);
          
          // Show local notification for foreground messages
          if (remoteMessage.notification) {
            await this.sendImmediateNotification({
              title: remoteMessage.notification.title || 'New Notification',
              body: remoteMessage.notification.body || 'You have a new message',
              data: remoteMessage.data,
              sound: true,
              priority: 'high'
            });
          }
        });

        // Listen for background messages
        messaging.default().setBackgroundMessageHandler(async (remoteMessage: any) => {
          console.log('🔔 DEBUG: Firebase background message received:', remoteMessage);
        });

        // Listen for notification taps when app is in background
        messaging.default().onNotificationOpenedApp((remoteMessage: any) => {
          console.log('🔔 DEBUG: Firebase notification opened app:', remoteMessage);
          this.handleNotificationTap({ notification: { request: { content: { data: remoteMessage.data } } } });
        });

        // Check if app was opened from a notification
        messaging.default().getInitialNotification().then((remoteMessage: any) => {
          if (remoteMessage) {
            console.log('🔔 DEBUG: App opened from notification:', remoteMessage);
            this.handleNotificationTap({ notification: { request: { content: { data: remoteMessage.data } } } });
          }
        });

        console.log('✅ DEBUG: Firebase messaging listeners set up successfully');
        
      } catch (firebaseError) {
        console.error('❌ DEBUG: Error setting up Firebase listeners:', firebaseError);
      }
      
      // Set up Expo notification listeners (primary for Expo push notifications)
      const foregroundListener = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log('🔔 DEBUG: Expo foreground notification received:', notification);
        console.log('🔔 DEBUG: Notification data:', notification.request.content.data);
        console.log('🔔 DEBUG: Notification title:', notification.request.content.title);
        console.log('🔔 DEBUG: Notification body:', notification.request.content.body);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log('🔔 DEBUG: Expo notification response received:', response);
        console.log('🔔 DEBUG: Response data:', response.notification.request.content.data);
        this.handleNotificationTap(response);
      });

      // Store listeners for cleanup
      this.notificationListener = foregroundListener;
      this.responseListener = responseListener;
      
      console.log('✅ DEBUG: All notification listeners set up successfully');
      
    } catch (error) {
      console.error('❌ DEBUG: Error setting up notification listeners:', error);
    }
  }

  private handleNotificationTap(response: any): void {
    try {
      console.log('🔔 DEBUG: Handling notification tap...');
      const data = response.notification.request.content.data;
      console.log('🔔 DEBUG: Notification data:', data);
      
      // Handle different notification types
      if (data?.type === 'lead') {
        console.log('🔔 DEBUG: Lead notification tapped, navigate to lead:', data.leadId);
        // Navigate to lead details
      } else if (data?.type === 'task') {
        console.log('🔔 DEBUG: Task notification tapped, navigate to task:', data.taskId);
        // Navigate to task details
      } else if (data?.type === 'announcement') {
        console.log('🔔 DEBUG: Announcement notification tapped:', data.announcementId);
        // Show announcement
      }
    } catch (error) {
      console.error('❌ DEBUG: Error handling notification tap:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot request permissions - notifications not available in Expo Go');
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('NotificationContext: Permission status:', status);
      
      if (status === 'granted') {
        // Auto-register token after permission granted
        await this.autoRegisterToken();
      }
      
      return status === 'granted';
    } catch (error) {
      console.error('NotificationContext: Error requesting permissions:', error);
      return false;
    }
  }

  private async autoRegisterToken(): Promise<void> {
    try {
      console.log('🔔 DEBUG: Auto-registering token after permission granted...');
      
      // Get or generate push token
      const token = await this.getPushToken();
      if (token) {
        // Register with backend
        const result = await this.tokenRegistrationService?.registerToken(token);
        if (result?.success) {
          console.log('✅ DEBUG: Token auto-registered successfully');
        } else {
          console.error('❌ DEBUG: Token auto-registration failed:', result?.error);
        }
      }
    } catch (error) {
      console.error('❌ DEBUG: Error in auto-registration:', error);
    }
  }

  async getPushToken(): Promise<string | null> {
    console.log('🔔 DEBUG: getPushToken() called');
    console.log('🔔 DEBUG: notificationsAvailable:', this.notificationsAvailable);
    
    if (!this.notificationsAvailable) {
      console.log('⚠️ DEBUG: Cannot get push token - notifications not available in Expo Go');
      return null;
    }

    try {
      console.log('🔔 DEBUG: Getting push token...');
      
      // Check if we already have a token
      console.log('🔔 DEBUG: Checking for existing token...');
      const existingToken = await this.tokenRegistrationService?.getCurrentToken();
      console.log('🔔 DEBUG: Existing token check result:', !!existingToken, existingToken ? existingToken.substring(0, 20) + '...' : 'null');
      
      if (existingToken) {
        console.log('✅ DEBUG: Using existing token:', existingToken.substring(0, 20) + '...');
        return existingToken;
      }

      // Get real Expo push token
      console.log('🔔 DEBUG: Getting real Expo push token...');
      
      try {
        // Request permissions first
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('🔔 DEBUG: Permission status:', status);
        
        if (status !== 'granted') {
          console.log('⚠️ DEBUG: Notification permissions not granted');
          return null;
        }

        // Get Expo push token (primary method since backend is sending Expo notifications)
        console.log('🔔 DEBUG: Getting Expo push token...');
        
        try {
          const expoPushToken = await Notifications.getExpoPushTokenAsync({
            projectId: 'e54487e4-0b6f-4429-8b02-f1c84f6b0bba',
            experienceId: '@ranjeet1620/crmnativeexpo'
          });
          
          console.log('✅ DEBUG: Expo push token obtained:', expoPushToken.data.substring(0, 20) + '...');
          console.log('✅ DEBUG: Full Expo token length:', expoPushToken.data.length);
          console.log('🔔 DEBUG: Token type: Expo');
          return expoPushToken.data;
          
        } catch (expoError: any) {
          console.error('❌ DEBUG: Error getting Expo push token:', expoError);
          console.error('❌ DEBUG: Expo error message:', expoError.message);
          
          // Fallback: Try Firebase FCM token
          console.log('⚠️ DEBUG: Falling back to Firebase FCM token...');
          try {
            const messaging = await import('@react-native-firebase/messaging');
            
            const authStatus = await messaging.default().requestPermission();
            console.log('🔔 DEBUG: FCM permission status:', authStatus);
            
            if (authStatus === messaging.default.AuthorizationStatus.AUTHORIZED || 
                authStatus === messaging.default.AuthorizationStatus.PROVISIONAL) {
              const fcmToken = await messaging.default().getToken();
              console.log('✅ DEBUG: FCM token obtained:', fcmToken.substring(0, 20) + '...');
              console.log('🔔 DEBUG: Token type: FCM');
              return fcmToken;
            } else {
              console.log('⚠️ DEBUG: FCM permissions not granted');
              return null;
            }
            
          } catch (fcmError: any) {
            console.error('❌ DEBUG: Error getting FCM token:', fcmError);
            
            // Final fallback: create simple token for testing
            console.log('⚠️ DEBUG: Final fallback to simple token for testing...');
            const simpleToken = `expo-simple-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log('✅ DEBUG: Simple token created as final fallback:', simpleToken.substring(0, 20) + '...');
            return simpleToken;
          }
        }
        
      } catch (expoError: any) {
        console.error('❌ DEBUG: Error getting Expo push token:', expoError);
        console.error('❌ DEBUG: Expo error message:', expoError.message);
        
        // Fallback: create a simple token for testing
        console.log('⚠️ DEBUG: Falling back to simple token for testing...');
        const simpleToken = `expo-simple-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('✅ DEBUG: Simple token created as fallback:', simpleToken.substring(0, 20) + '...');
        return simpleToken;
      }
      
    } catch (error: any) {
      console.error('❌ DEBUG: Error in getPushToken():', error);
      console.error('❌ DEBUG: Error message:', error.message);
      console.error('❌ DEBUG: Error stack:', error.stack);
      return null;
    }
  }

  

  async scheduleLocalNotification(
    notification: NotificationData, 
    trigger?: any
  ): Promise<string> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot schedule notification - notifications not available in Expo Go');
      // Return a fallback ID for Expo Go
      return `expo-go-fallback-${Date.now()}`;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: notification.sound !== false,
          priority: notification.priority || 'default',
        },
        trigger,
      });
      console.log('NotificationService: Scheduled notification with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('NotificationService: Error scheduling notification:', error);
      throw error;
    }
  }

  async scheduleNotificationForDateTime(
    notification: NotificationData, 
    date: Date
  ): Promise<string> {
    return this.scheduleLocalNotification(notification, { date });
  }

  async scheduleNotificationWithDelay(
    notification: NotificationData, 
    seconds: number
  ): Promise<string> {
    return this.scheduleLocalNotification(notification, { seconds });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot cancel notification - notifications not available in Expo Go');
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('NotificationService: Cancelled notification:', notificationId);
    } catch (error) {
      console.error('NotificationService: Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot cancel all notifications - notifications not available in Expo Go');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('NotificationService: Cancelled all notifications');
    } catch (error) {
      console.error('NotificationService: Error cancelling all notifications:', error);
    }
  }

  async sendImmediateNotification(notification: NotificationData): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot send immediate notification - notifications not available in Expo Go');
      // Fallback: show alert in Expo Go
      if (typeof alert !== 'undefined') {
        alert(`🔔 ${notification.title}\n${notification.body}`);
      }
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: notification.sound !== false,
          priority: notification.priority || 'high',
        },
        trigger: null, // null trigger means immediate
      });
      console.log('NotificationService: Sent immediate notification');
    } catch (error) {
      console.error('NotificationService: Error sending immediate notification:', error);
      throw error;
    }
  }

  async getScheduledNotifications(): Promise<any[]> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot get scheduled notifications - notifications not available in Expo Go');
      return [];
    }

    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('NotificationService: Retrieved scheduled notifications:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('NotificationService: Error getting scheduled notifications:', error);
      return [];
    }
  }

  async getBadgeCount(): Promise<number> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot get badge count - notifications not available in Expo Go');
      return 0;
    }

    try {
      const count = await Notifications.getBadgeCountAsync();
      return count;
    } catch (error) {
      console.error('NotificationService: Error getting badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot set badge count - notifications not available in Expo Go');
      return;
    }

    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('NotificationService: Set badge count to:', count);
    } catch (error) {
      console.error('NotificationService: Error setting badge count:', error);
    }
  }

  // Check if notifications are fully supported
  isFullySupported(): boolean {
    return this.notificationsAvailable;
  }

  // Check if running in Expo Go
  isRunningInExpoGo(): boolean {
    return this.isExpoGo;
  }

  // Check if running in development build
  isRunningInDevelopmentBuild(): boolean {
    return this.isDevelopmentBuild;
  }

  // 🔔 PUSH NOTIFICATION TOKEN MANAGEMENT METHODS

  /**
   * Generate and register push token when user logs in
   */
  async onUserLogin(): Promise<string | null> {
    try {
      console.log('🔔 DEBUG: NotificationService.onUserLogin() called');
      
      if (!this.notificationsAvailable) {
        console.log('⚠️ DEBUG: Notifications not available, skipping token generation');
        return null;
      }

      // Check if we already have a token
      const existingToken = await AsyncStorage.getItem('pushToken');
      if (existingToken) {
        console.log('✅ DEBUG: Existing push token found, re-registering with backend');
        await this.tokenRegistrationService?.registerToken(existingToken);
        return existingToken;
      }

      // Generate new token
      console.log('🔔 DEBUG: Generating new push token...');
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'e54487e4-0b6f-4429-8b02-f1c84f6b0bba', // From your app.config.js
      });

      if (token.data) {
        console.log('✅ DEBUG: Push token generated:', token.data.substring(0, 20) + '...');
        
        // Save token locally
        await AsyncStorage.setItem('pushToken', token.data);
        
        // Register with backend
        if (this.tokenRegistrationService) {
          const success = await this.tokenRegistrationService.registerToken(token.data);
          if (success) {
            console.log('✅ DEBUG: Push token registered successfully with backend');
          } else {
            console.log('⚠️ DEBUG: Failed to register token with backend, will retry later');
          }
        }
        
        return token.data;
      }
      
      return null;
    } catch (error) {
      console.error('❌ DEBUG: Error in onUserLogin:', error);
      return null;
    }
  }

  /**
   * Deactivate push token when user logs out
   */
  async onUserLogout(): Promise<void> {
    try {
      console.log('🔔 DEBUG: NotificationService.onUserLogout() called');
      
      if (!this.notificationsAvailable) {
        console.log('⚠️ DEBUG: Notifications not available, skipping token deactivation');
        return;
      }

      // Get current token
      const currentToken = await AsyncStorage.getItem('pushToken');
      if (currentToken && this.tokenRegistrationService) {
        console.log('🔔 DEBUG: Deactivating push token on backend...');
        
        try {
          const authToken = await AsyncStorage.getItem('token');
          if (authToken) {
            const baseURL = getApiBaseUrl();
            const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.LOGOUT}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              console.log('✅ DEBUG: Push token deactivated successfully on backend');
            } else {
              console.log('⚠️ DEBUG: Failed to deactivate token on backend:', response.status);
            }
          }
        } catch (error) {
          console.error('❌ DEBUG: Error deactivating token on backend:', error);
        }
      }

      // Clear local token
      await AsyncStorage.removeItem('pushToken');
      console.log('✅ DEBUG: Local push token cleared');
      
    } catch (error) {
      console.error('❌ DEBUG: Error in onUserLogout:', error);
    }
  }

  /**
   * Get current push token
   */
  async getCurrentPushToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('pushToken');
    } catch (error) {
      console.error('❌ DEBUG: Error getting current push token:', error);
      return null;
    }
  }

  /**
   * Check if push token is registered with backend
   */
  async isTokenRegistered(): Promise<boolean> {
    try {
      const token = await this.getCurrentPushToken();
      if (!token) return false;

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) return false;

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.STATUS}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('❌ DEBUG: Error checking token registration status:', error);
      return false;
    }
  }
}

export default NotificationService;
