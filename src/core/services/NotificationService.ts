import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  private notificationListener: any;
  private responseListener: any;

  constructor() {
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.isDevelopmentBuild = Constants.appOwnership !== 'expo';
    this.notificationsAvailable = !!(Notifications && !this.isExpoGo);

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

        // Set up Firebase foreground/background handlers
        await this.setupFirebaseMessageHandlers();

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
      console.log('🔔 DEBUG: Setting up Expo notification listeners...');

      // Set up Expo notification listeners for push notifications
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

      console.log('✅ DEBUG: Expo notification listeners set up successfully');

    } catch (error) {
      console.error('❌ DEBUG: Error setting up notification listeners:', error);
    }
  }

  private async setupFirebaseMessageHandlers(): Promise<void> {
    try {
      const messaging = require('@react-native-firebase/messaging').default;

      messaging().onMessage(async (remoteMessage: any) => {
        try {
          const title = remoteMessage?.notification?.title ?? 'Notification';
          const body = remoteMessage?.notification?.body ?? '';
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data: remoteMessage?.data,
              sound: true,
              priority: Notifications.AndroidImportance.MAX,
            },
            trigger: null,
          });
        } catch (e) {
          console.log('⚠️ DEBUG: Error displaying foreground FCM notification', e);
        }
      });

      try {
        messaging().setBackgroundMessageHandler(async (_remoteMessage: any) => {
          return;
        });
      } catch (e) {
        console.log('⚠️ DEBUG: setBackgroundMessageHandler not available', (e as any)?.message || e);
      }
    } catch (e) {
      console.log('⚠️ DEBUG: Firebase messaging not available, skipping FCM handlers');
    }
  }

  private handleNotificationTap(response: any): void {
    try {
      console.log('🔔 DEBUG: Handling notification tap...');
      const data = response.notification.request.content.data;
      console.log('🔔 DEBUG: Notification data:', data);

      // Handle different notification types
      const { router } = require('expo-router');
      const r = router;
      if (!r || typeof r.push !== 'function') {
        console.log('⚠️ DEBUG: Router not available while handling notification');
        return;
      }

      if (data?.type === 'lead' && data?.leadId) {
        r.push(`/lead/${data.leadId}`);
        return;
      }
      if (data?.type === 'task' && data?.taskId) {
        r.push('/(tabs)/tasks');
        return;
      }
      if (data?.type === 'announcement' && data?.announcementId) {
        r.push('/(tabs)');
        return;
      }

      // Default: open dashboard
      r.push('/(tabs)');
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

      // Note: Token registration is handled by AuthContext after login

      return status === 'granted';
    } catch (error) {
      console.error('NotificationContext: Error requesting permissions:', error);
      return false;
    }
  }



  async getPushToken(): Promise<string | null> {
    console.log('🔔 DEBUG: getPushToken() called - SIMPLE APPROACH');

    if (!this.notificationsAvailable) {
      console.log('⚠️ DEBUG: Cannot get push token - notifications not available in Expo Go');
      return null;
    }

    try {
      // Simple approach: Just get Expo push token
      console.log('🔔 DEBUG: Getting simple Expo push token...');

      // Request permissions first
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('🔔 DEBUG: Permission status:', status);

      if (status !== 'granted') {
        console.log('⚠️ DEBUG: Notification permissions not granted');
        return null;
      }

      // Prefer FCM token on Android via RN Firebase Messaging
      try {
        const messaging = require('@react-native-firebase/messaging').default;
        const authStatus = await messaging().requestPermission();
        if (authStatus) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('✅ DEBUG: FCM token obtained:', fcmToken.substring(0, 30) + '...');
            return fcmToken;
          }
        }
      } catch (e) {
        console.log('⚠️ DEBUG: FCM token not available, falling back to Expo token');
      }

      // Fallback to Expo token
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      if (expoPushToken?.data) {
        console.log('✅ DEBUG: Expo token obtained:', expoPushToken.data.substring(0, 30) + '...');
        return expoPushToken.data;
      }
      console.log('⚠️ DEBUG: No push token available');
      return null;

    } catch (error: any) {
      console.error('❌ DEBUG: Error in getPushToken():', error);
      // Do not register fake tokens
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

  // Simple token management - token registration is handled by SimpleTokenService in AuthContext
  
  // Method called by AuthService on user login
  async onUserLogin(): Promise<void> {
    console.log('🔔 DEBUG: NotificationService.onUserLogin() called');
    try {
      // Initialize notification service
      await this.initialize();
      
      // Request permissions and get push token
      const permissionGranted = await this.requestPermissions();
      if (permissionGranted) {
        console.log('✅ DEBUG: Notification permissions granted on login');
        const pushToken = await this.getPushToken();
        if (pushToken) {
          console.log('✅ DEBUG: Push token obtained on login:', pushToken.substring(0, 30) + '...');
        } else {
          console.log('⚠️ DEBUG: No push token available on login');
        }
      } else {
        console.log('⚠️ DEBUG: Notification permissions not granted on login');
      }
    } catch (error) {
      console.error('❌ DEBUG: Error in onUserLogin():', error);
      // Don't throw error to avoid breaking login flow
    }
  }

  // Method called by AuthService on user logout
  async onUserLogout(): Promise<void> {
    console.log('🔔 DEBUG: NotificationService.onUserLogout() called');
    try {
      // Clean up notification listeners
      if (this.notificationListener) {
        this.notificationListener.remove();
        this.notificationListener = null;
        console.log('✅ DEBUG: Notification listener removed');
      }
      
      if (this.responseListener) {
        this.responseListener.remove();
        this.responseListener = null;
        console.log('✅ DEBUG: Response listener removed');
      }
      
      // Clear badge count
      await this.setBadgeCount(0);
      console.log('✅ DEBUG: Badge count cleared');
      
      // Cancel all scheduled notifications
      await this.cancelAllNotifications();
      console.log('✅ DEBUG: All notifications cancelled');
      
    } catch (error) {
      console.error('❌ DEBUG: Error in onUserLogout():', error);
      // Don't throw error to avoid breaking logout flow
    }
  }
}

export default NotificationService;
