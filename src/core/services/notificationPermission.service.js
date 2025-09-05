// Notification Permission Service
import { Alert, Linking, Platform } from 'react-native';

export class NotificationPermissionService {
  
  /**
   * Check if notification permission is granted
   */
  static async checkPermission() {
    try {
      // Check if we're in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('NotificationPermissionService: Skipped in development mode');
        return { granted: false, status: null };
      }

      // Dynamically import Firebase messaging
      const messaging = await import('@react-native-firebase/messaging');
      const authStatus = await messaging.default().hasPermission();
      const enabled = authStatus === messaging.default.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.default.AuthorizationStatus.PROVISIONAL;
      
      return {
        granted: enabled,
        status: authStatus
      };
    } catch (error) {
      console.error('🔥 NotificationPermissionService: Error checking permission:', error);
      return { granted: false, status: null };
    }
  }

  /**
   * Request notification permission with user-friendly dialog
   */
  static async requestPermission() {
    try {
      // Check if we're in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('NotificationPermissionService: Skipped in development mode');
        return { granted: false, status: null };
      }

      console.log('🔥 NotificationPermissionService: Requesting notification permission...');
      
      // Dynamically import Firebase messaging
      const messaging = await import('@react-native-firebase/messaging');
      const authStatus = await messaging.default().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      });
      
      const granted = authStatus === messaging.default.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.default.AuthorizationStatus.PROVISIONAL;
      
      console.log('🔥 NotificationPermissionService: Permission result:', authStatus, 'Granted:', granted);
      
      return {
        granted,
        status: authStatus
      };
    } catch (error) {
      console.error('🔥 NotificationPermissionService: Error requesting permission:', error);
      return { granted: false, status: null };
    }
  }

  /**
   * Show permission denied dialog with option to open settings
   */
  static showPermissionDeniedDialog() {
    Alert.alert(
      'Notification Permission Required',
      'To receive important updates about leads, tasks, and announcements, please enable notifications in your device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        }
      ]
    );
  }

  /**
   * Show permission request dialog
   */
  static showPermissionRequestDialog() {
    return new Promise((resolve) => {
      Alert.alert(
        'Enable Notifications',
        'Would you like to receive notifications for leads, tasks, and important updates?',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => resolve(false)
          },
          {
            text: 'Enable',
            onPress: async () => {
              const result = await this.requestPermission();
              if (!result.granted) {
                this.showPermissionDeniedDialog();
              }
              resolve(result.granted);
            }
          }
        ]
      );
    });
  }

  /**
   * Initialize notification permission flow
   */
  static async initialize() {
    try {
      // Check current permission status
      const currentStatus = await this.checkPermission();
      
      if (currentStatus.granted) {
        console.log('🔥 NotificationPermissionService: Permission already granted');
        return { granted: true, status: currentStatus.status };
      }
      
      // Show permission request dialog
      const granted = await this.showPermissionRequestDialog();
      
      return {
        granted,
        status: granted ? 'AUTHORIZED' : 'DENIED'
      };
      
    } catch (error) {
      console.error('🔥 NotificationPermissionService: Error in initialize:', error);
      return { granted: false, status: null };
    }
  }
}

export default NotificationPermissionService;
