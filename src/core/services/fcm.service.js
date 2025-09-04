// FCM Service - Properly integrated with backend API
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import axios from '../../legacy/api/axios';
import { API_ENDPOINTS } from './api.endpoints';

class FCMService {
  static STORAGE_KEYS = {
    FCM_TOKEN: 'unified_fcm_token',
    USER_ID: 'unified_user_id',
    DEVICE_ID: 'unified_device_id',
    TOKEN_REGISTERED: 'unified_fcm_token_registered',
    PERMISSION_GRANTED: 'unified_permission_granted'
  };

  constructor() {
    this.fcmToken = null;
    this.userId = null;
    this.deviceId = null;
    this.isInitialized = false;
    this.messageHandlers = [];
    this.isPermissionGranted = false;
  }

  /**
   * Initialize FCM service
   */
  async initialize() {
    try {
      if (!messaging) {
        throw new Error('Firebase messaging not available');
      }

      const firebase = require('@react-native-firebase/app');
      const firebaseApp = firebase.default.app();
      
      if (!firebaseApp) {
        throw new Error('Firebase app not initialized');
      }

      const permissionResult = await this.requestNotificationPermissions();
      if (!permissionResult.success) {
        return { success: false, error: permissionResult.error };
      }

      this.isPermissionGranted = true;

      const tokenResult = await this.getFCMToken();
      if (!tokenResult.success) {
        return { success: false, error: tokenResult.error };
      }

      this.fcmToken = tokenResult.token;
      this.isInitialized = true;
      this.setupMessageHandlers();

      return { success: true, token: this.fcmToken };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Request notification permissions
   */
  async requestNotificationPermissions() {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      });

      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        return { success: false, error: 'Notification permission not granted' };
      }

      await AsyncStorage.setItem(FCMService.STORAGE_KEYS.PERMISSION_GRANTED, 'true');
      this.isPermissionGranted = true;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get FCM token
   */
  async getFCMToken() {
    try {
      const cachedToken = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.FCM_TOKEN);
      if (cachedToken && this.isValidFCMToken(cachedToken)) {
        this.fcmToken = cachedToken;
        return { success: true, token: cachedToken };
      }

      const firebase = require('@react-native-firebase/app');
      const firebaseApp = firebase.default.app();
      
      if (!firebaseApp || !firebaseApp.options) {
        throw new Error('Firebase app options not available - please check configuration files');
      }
      
      const apiKey = firebaseApp.options.apiKey;
      if (!apiKey || apiKey.includes('DummyKey') || apiKey.includes('123456789')) {
        throw new Error('Invalid Firebase API key - please update configuration files');
      }

      const token = await messaging().getToken();
      
      if (!token || !this.isValidFCMToken(token)) {
        throw new Error('Failed to get valid FCM token');
      }

      await AsyncStorage.setItem(FCMService.STORAGE_KEYS.FCM_TOKEN, token);
      this.fcmToken = token;
      
      return { success: true, token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate FCM token format
   */
  isValidFCMToken(token) {
    if (!token || typeof token !== 'string') return false;
    
    // FCM tokens should be long and contain specific patterns
    return token.length > 50 && (
      token.startsWith('d_') || // Expo FCM tokens
      token.startsWith('fMEP') || // Firebase FCM tokens
      token.startsWith('cpKFluBIRYi') || // Known working FCM token pattern
      token.includes(':APA91b') || // FCM token pattern
      token.length > 100 // FCM tokens are usually longer
    );
  }

  /**
   * Register FCM token with backend
   */
  async registerTokenWithBackend(userId) {
    try {
      console.log('🔥 FCMService: Registering token with backend...');
      
      if (!this.fcmToken) {
        return { success: false, error: 'No FCM token available' };
      }

      if (!this.isValidFCMToken(this.fcmToken)) {
        return { success: false, error: 'Invalid FCM token format' };
      }

      // Check if already registered for this user
      const isRegistered = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.TOKEN_REGISTERED);
      const registeredUserId = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.USER_ID);
      
      if (isRegistered === 'true' && registeredUserId === String(userId)) {
        console.log('🔥 FCMService: Token already registered for this user');
        return { success: true, data: { message: 'Token already registered' } };
      }

      // If different user, deactivate old token first
      if (isRegistered === 'true' && registeredUserId !== String(userId)) {
        console.log('🔥 FCMService: Different user, deactivating old token first');
        await this.deactivateToken();
      }

      await AsyncStorage.setItem(FCMService.STORAGE_KEYS.USER_ID, String(userId));
      this.userId = userId;

      const response = await axios.post(API_ENDPOINTS.PUSH_NOTIFICATIONS.REGISTER, {
        pushToken: this.fcmToken,
        deviceType: Platform.OS,
        userId: userId,
        isActive: true
      });

      // Mark as registered
      await AsyncStorage.setItem(FCMService.STORAGE_KEYS.TOKEN_REGISTERED, 'true');

      console.log('🔥 FCMService: FCM token registered successfully for user:', userId);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🔥 FCMService: Token registration failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Test FCM notification via backend
   */
  async testNotification() {
    try {
      console.log('🔥 FCMService: Testing FCM notification...');
      
      if (!this.fcmToken) {
        return { success: false, error: 'No FCM token available' };
      }

      if (!this.isValidFCMToken(this.fcmToken)) {
        return { success: false, error: 'Invalid FCM token format' };
      }

      const response = await axios.post(API_ENDPOINTS.PUSH_NOTIFICATIONS.TEST, {
        pushToken: this.fcmToken,
        deviceType: Platform.OS
      });

      console.log('🔥 FCMService: Test notification sent');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🔥 FCMService: Test notification failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Test FCM notification via backend TEST_FCM endpoint
   */
  async testFCMNotification() {
    try {
      console.log('🔥 FCMService: Testing FCM notification via TEST_FCM endpoint...');
      
      if (!this.fcmToken) {
        return { success: false, error: 'No FCM token available' };
      }

      if (!this.isValidFCMToken(this.fcmToken)) {
        return { success: false, error: 'Invalid FCM token format' };
      }

      const response = await axios.post(API_ENDPOINTS.PUSH_NOTIFICATIONS.TEST_FCM, {
        pushToken: this.fcmToken,
        deviceType: Platform.OS
      });

      console.log('🔥 FCMService: FCM test notification sent');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🔥 FCMService: FCM test notification failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  /**
   * Set up FCM message handlers
   */
  setupMessageHandlers() {
    console.log('🔥 FCMService: Setting up FCM message handlers...');

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('🔥 FCMService: Background message received:', remoteMessage);
      this.handleNotificationReceived(remoteMessage);
    });

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔥 FCMService: Foreground message received:', remoteMessage);
      this.handleNotificationReceived(remoteMessage);
    });

    // Handle notification tap
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔥 FCMService: Notification opened app:', remoteMessage);
      this.handleNotificationResponse(remoteMessage);
    });

    // Handle notification tap when app is closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🔥 FCMService: App opened from notification:', remoteMessage);
          this.handleNotificationResponse(remoteMessage);
        }
      });

    // Store unsubscribe function
    this.messageHandlers.push(unsubscribe);
  }

  /**
   * Handle notification received
   */
  handleNotificationReceived(notification) {
    console.log('🔥 FCMService: Processing notification:', notification);
    
    // Show local notification for better visibility
    this.showLocalNotification(notification);
    
    // Log notification type
    const data = notification.data || {};
    const type = data.type || 'unknown';
    
    switch (type) {
      case 'test':
        console.log('🔥 FCMService: Test notification received');
        break;
      case 'lead_update':
        console.log('🔥 FCMService: Lead update notification received');
        break;
      case 'task_reminder':
        console.log('🔥 FCMService: Task reminder notification received');
        break;
      case 'follow_up':
        console.log('🔥 FCMService: Follow-up notification received');
        break;
      case 'announcement':
        console.log('🔥 FCMService: Announcement notification received');
        break;
      default:
        console.log('🔥 FCMService: Unknown notification type:', type);
    }
  }

  /**
   * Show local notification for better visibility
   */
  async showLocalNotification(notification) {
    try {
      const Notifications = require('expo-notifications');
      
      const title = notification.notification?.title || 'CRM Notification';
      const body = notification.notification?.body || 'You have a new notification';
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔔 ${title}`,
          body: body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
      
      console.log('🔥 FCMService: Local notification scheduled successfully');
    } catch (error) {
      console.error('🔥 FCMService: Failed to show local notification:', error);
    }
  }

  /**
   * Handle notification response (tap)
   */
  handleNotificationResponse(notification) {
    console.log('🔥 FCMService: Processing notification response:', notification);
    
    // Handle navigation based on notification type
    this.handleNotificationNavigation(notification);
  }

  /**
   * Handle notification navigation
   */
  handleNotificationNavigation(notification) {
    const data = notification.data || {};
    const type = data.type || 'unknown';
    
    console.log('🔥 FCMService: Navigating based on notification type:', type);
    
    switch (type) {
      case 'lead_update':
        console.log('🔥 FCMService: Navigate to lead details:', data.leadId);
        // TODO: Navigate to lead details screen
        break;
      case 'task_reminder':
        console.log('🔥 FCMService: Navigate to task details:', data.taskId);
        // TODO: Navigate to task details screen
        break;
      case 'follow_up':
        console.log('🔥 FCMService: Navigate to follow-up details:', data.followUpId);
        // TODO: Navigate to follow-up details screen
        break;
      case 'announcement':
        console.log('🔥 FCMService: Navigate to announcements');
        // TODO: Navigate to announcements screen
        break;
      default:
        console.log('🔥 FCMService: No specific navigation for type:', type);
    }
  }

  /**
   * Clear all FCM data (for logout)
   */
  async clearAll() {
    try {
      console.log('🔥 FCMService: Clearing all FCM data...');
      
      // Deactivate token from backend first
      try {
        if (this.fcmToken) {
          await this.deactivateToken();
        }
      } catch (error) {
        console.log('🔥 FCMService: Failed to deactivate token from backend, continuing with local cleanup');
      }
      
      // Clear local storage
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.FCM_TOKEN);
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.USER_ID);
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.DEVICE_ID);
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.TOKEN_REGISTERED);
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.PERMISSION_GRANTED);
      
      // Clear instance variables
      this.fcmToken = null;
      this.userId = null;
      this.deviceId = null;
      this.isInitialized = false;
      this.isPermissionGranted = false;
      
      // Unsubscribe from message handlers
      this.messageHandlers.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      this.messageHandlers = [];
      
      console.log('🔥 FCMService: All FCM data cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('🔥 FCMService: Failed to clear FCM data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Force refresh FCM token
   */
  async forceRefreshToken() {
    try {
      console.log('🔥 FCMService: Force refreshing FCM token...');
      
      // Clear cached token
      await AsyncStorage.removeItem(FCMService.STORAGE_KEYS.FCM_TOKEN);
      this.fcmToken = null;
      
      // Get new token
      const tokenResult = await this.getFCMToken();
      if (tokenResult.success) {
        console.log('🔥 FCMService: FCM token refreshed successfully');
        return { success: true, token: tokenResult.token };
      } else {
        return { success: false, error: tokenResult.error };
      }
    } catch (error) {
      console.error('🔥 FCMService: Failed to refresh FCM token:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deactivate FCM token (for logout)
   */
  async deactivateToken() {
    try {
      if (!this.fcmToken) {
        return { success: true, message: 'No token to deactivate' };
      }

      console.log('🔥 FCMService: Deactivating FCM token...');

      // Try to deactivate from backend
      await axios.post(API_ENDPOINTS.PUSH_NOTIFICATIONS.LOGOUT, {
        pushToken: this.fcmToken,
        deviceType: Platform.OS,
        isActive: false
      });

      console.log('🔥 FCMService: Token deactivated from backend');
      return { success: true };
    } catch (error) {
      console.error('🔥 FCMService: Failed to deactivate token:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get FCM service status
   */
  async getStatus() {
    try {
      const token = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.FCM_TOKEN);
      const userId = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.USER_ID);
      const isRegistered = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.TOKEN_REGISTERED);
      const permissionGranted = await AsyncStorage.getItem(FCMService.STORAGE_KEYS.PERMISSION_GRANTED);
      
      return {
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : null,
        userId: userId,
        isRegistered: isRegistered === 'true',
        isInitialized: this.isInitialized,
        isPermissionGranted: permissionGranted === 'true',
        isValidToken: token ? this.isValidFCMToken(token) : false
      };
    } catch (error) {
      console.error('🔥 FCMService: Failed to get status:', error);
      return {
        hasToken: false,
        token: null,
        userId: null,
        isRegistered: false,
        isInitialized: false,
        isPermissionGranted: false,
        isValidToken: false,
        error: error.message
      };
    }
  }
}

export default FCMService;
