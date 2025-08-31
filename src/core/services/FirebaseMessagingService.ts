import { Platform } from 'react-native';
import Constants from 'expo-constants';

let messaging: any = null;
let app: any = null;
let firebaseModulesLoaded = false;

// Function to load Firebase modules dynamically
const loadFirebaseModules = () => {
  if (firebaseModulesLoaded) {
    return { messaging, app };
  }

  try {
    console.log('🔥 Loading Firebase modules...');

    // Import Firebase App
    try {
      app = require('@react-native-firebase/app').default;
      console.log('✅ @react-native-firebase/app imported');
    } catch (error: any) {
      console.log('❌ Failed to import @react-native-firebase/app:', error.message);
      return { messaging: null, app: null };
    }

    // Import Firebase Messaging
    try {
      messaging = require('@react-native-firebase/messaging').default;
      console.log('✅ @react-native-firebase/messaging imported');
    } catch (error: any) {
      console.log('❌ Failed to import @react-native-firebase/messaging:', error.message);
      return { messaging: null, app: null };
    }

    firebaseModulesLoaded = true;
    console.log('✅ Firebase modules loaded successfully');
    return { messaging, app };
  } catch (error: any) {
    console.log('❌ Could not load Firebase modules:', error);
    return { messaging: null, app: null };
  }
};

export interface FirebaseMessage {
  data?: { [key: string]: string };
  notification?: {
    title?: string;
    body?: string;
  };
  messageId: string;
  sentTime: number;
  from: string;
}

export class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private isInitialized: boolean = false;
  private fcmToken: string | null = null;
  private messageListener: any = null;
  private backgroundMessageListener: any = null;

  private constructor() {}

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  public async initialize(): Promise<void> {
    console.log('🔥 FirebaseMessagingService: initialize() called');

    if (this.isInitialized) {
      console.log('🔥 FirebaseMessagingService: Already initialized');
      return;
    }

    // Handle app ownership (Expo Go vs Bare workflow)
    const ownership = Constants.appOwnership || 'bare';
    const isExpoGo = ownership === 'expo';
    console.log('🔍 App ownership:', ownership);
    console.log('🔍 Is Expo Go:', isExpoGo);

    if (isExpoGo) {
      console.log('⚠️ Running in Expo Go - Firebase messaging not supported');
      this.isInitialized = true;
      return;
    }

    const { messaging: messagingModule } = loadFirebaseModules();

    if (!messagingModule) {
      console.log('❌ Firebase messaging not available');
      this.isInitialized = true;
      return;
    }

    try {
      console.log('🔥 FirebaseMessagingService: Requesting permission...');
      const authStatus = await messagingModule().requestPermission();
      const { AuthorizationStatus } = messagingModule;

      const enabled =
        authStatus === AuthorizationStatus?.AUTHORIZED ||
        authStatus === AuthorizationStatus?.PROVISIONAL ||
        authStatus === 1 ||
        authStatus === 2;

      if (enabled) {
        console.log('✅ Firebase messaging permission granted');
        await this.setupFirebaseMessaging(messagingModule);
      } else {
        console.log('❌ Firebase messaging permission denied');
      }
      this.isInitialized = true;
    } catch (error: any) {
      console.log('❌ Firebase messaging initialization failed:', error);
      this.isInitialized = true;
    }
  }

  private async setupFirebaseMessaging(messagingModule: any): Promise<void> {
    try {
      console.log('🔥 FirebaseMessagingService: Getting FCM token...');
      const token = await messagingModule().getToken();
      if (token) {
        console.log('✅ FCM token generated:', token.substring(0, 20) + '...');
        this.fcmToken = token;
      } else {
        console.log('⚠️ No FCM token generated');
      }

      // Set up foreground message handler
      this.messageListener = messagingModule().onMessage(async (remoteMessage: any) => {
        console.log('📱 Foreground message received:', remoteMessage);
        
        // Display notification when app is in foreground
        await this.displayForegroundNotification(remoteMessage);
      });

      // Set up background message handler
      this.backgroundMessageListener = messagingModule().setBackgroundMessageHandler(
        async (remoteMessage: any) => {
          console.log('📱 Background message received:', remoteMessage);
          
          // For background messages, FCM will automatically show the notification
          // based on the notification payload in the message
          return Promise.resolve();
        }
      );

      console.log('✅ Message listeners set up successfully');
      console.log('✅ FirebaseMessagingService initialized successfully');
    } catch (error: any) {
      console.log('❌ Failed to setup Firebase messaging:', error);
    }
  }

  /**
   * Display notification when app is in foreground
   */
  private async displayForegroundNotification(remoteMessage: any): Promise<void> {
    try {
      // Import expo-notifications dynamically
      let Notifications: any = null;
      try {
        Notifications = require('expo-notifications');
      } catch (error) {
        console.log('⚠️ expo-notifications not available for foreground notification');
        return;
      }

      const { notification, data } = remoteMessage;
      
      if (notification) {
        // Show local notification for foreground messages
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title || 'New Message',
            body: notification.body || 'You have a new message',
            data: data || {},
            sound: true,
            priority: 'high',
          },
          trigger: null, // Show immediately
        });
        
        console.log('✅ Foreground notification displayed');
      }
    } catch (error: any) {
      console.log('❌ Failed to display foreground notification:', error);
    }
  }

  public getFCMToken(): string | null {
    return this.fcmToken;
  }

  public async getFCMTokenAsync(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.fcmToken;
  }

  public isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  public cleanup(): void {
    if (this.messageListener) {
      this.messageListener();
      this.messageListener = null;
    }
    if (this.backgroundMessageListener) {
      this.backgroundMessageListener = null;
    }
    console.log('🧹 FirebaseMessagingService cleaned up');
  }
}

export default FirebaseMessagingService;
