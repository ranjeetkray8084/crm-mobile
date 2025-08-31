import Constants from 'expo-constants';

// Import expo-notifications with error handling
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('⚠️ expo-notifications not available in BackgroundNotificationService:', error);
}

export interface BackgroundNotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: 'default' | 'normal' | 'high';
}

class BackgroundNotificationService {
  private static instance: BackgroundNotificationService;
  private isExpoGo: boolean;
  private isDevelopmentBuild: boolean;
  private notificationsAvailable: boolean;

  constructor() {
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.isDevelopmentBuild = Constants.appOwnership === 'standalone' || Constants.appOwnership === 'unknown';
    this.notificationsAvailable = !!(Notifications && !this.isExpoGo);
    
    console.log('BackgroundNotificationService: App ownership:', Constants.appOwnership);
    console.log('BackgroundNotificationService: Is Expo Go:', this.isExpoGo);
    console.log('BackgroundNotificationService: Is Development Build:', this.isDevelopmentBuild);
    console.log('BackgroundNotificationService: Notifications available:', this.notificationsAvailable);
  }

  static getInstance(): BackgroundNotificationService {
    if (!BackgroundNotificationService.instance) {
      BackgroundNotificationService.instance = new BackgroundNotificationService();
    }
    return BackgroundNotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      if (this.notificationsAvailable) {
        console.log('✅ BackgroundNotificationService: Initializing with full functionality');
        
        // Configure background notification behavior
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      } else {
        console.log('⚠️ BackgroundNotificationService: Running with limited functionality (Expo Go)');
      }
    } catch (error) {
      console.error('BackgroundNotificationService: Error during initialization:', error);
    }
  }

  async scheduleBackgroundNotification(
    notification: BackgroundNotificationData, 
    trigger?: any
  ): Promise<string> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot schedule background notification - notifications not available in Expo Go');
      // Return a fallback ID for Expo Go
      return `expo-go-bg-fallback-${Date.now()}`;
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
      console.log('BackgroundNotificationService: Scheduled background notification with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('BackgroundNotificationService: Error scheduling background notification:', error);
      throw error;
    }
  }

  async sendImmediateBackgroundNotification(
    notification: BackgroundNotificationData
  ): Promise<string> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot send immediate background notification - notifications not available in Expo Go');
      // Fallback: show alert in Expo Go
      if (typeof alert !== 'undefined') {
        alert(`🔔 Background: ${notification.title}\n${notification.body}`);
      }
      return `expo-go-bg-immediate-fallback-${Date.now()}`;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: notification.sound !== false,
          priority: notification.priority || 'high',
        },
        trigger: null, // null trigger means immediate
      });
      console.log('BackgroundNotificationService: Sent immediate background notification with ID:', identifier);
      return identifier;
    } catch (error) {
      console.error('BackgroundNotificationService: Error sending immediate background notification:', error);
      throw error;
    }
  }

  async scheduleBackgroundNotificationWithDelay(
    notification: BackgroundNotificationData, 
    seconds: number
  ): Promise<string> {
    return this.scheduleBackgroundNotification(notification, { seconds });
  }

  async cancelBackgroundNotification(notificationId: string): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot cancel background notification - notifications not available in Expo Go');
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('BackgroundNotificationService: Cancelled background notification:', notificationId);
    } catch (error) {
      console.error('BackgroundNotificationService: Error cancelling background notification:', error);
    }
  }

  async cancelAllBackgroundNotifications(): Promise<void> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot cancel all background notifications - notifications not available in Expo Go');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('BackgroundNotificationService: Cancelled all background notifications');
    } catch (error) {
      console.error('BackgroundNotificationService: Error cancelling all background notifications:', error);
    }
  }

  async getScheduledBackgroundNotifications(): Promise<any[]> {
    if (!this.notificationsAvailable) {
      console.log('⚠️ Cannot get scheduled background notifications - notifications not available in Expo Go');
      return [];
    }

    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('BackgroundNotificationService: Retrieved scheduled background notifications:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('BackgroundNotificationService: Error getting scheduled background notifications:', error);
      return [];
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
}

export default BackgroundNotificationService;
