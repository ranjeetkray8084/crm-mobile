// Notification Permission Service
import { Alert, Linking, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export class NotificationPermissionService {
  
  /**
   * Check if notification permission is granted
   */
  static async checkPermission() {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
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
      console.log('🔥 NotificationPermissionService: Requesting notification permission...');
      
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      });
      
      const granted = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
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
        status: granted ? messaging.AuthorizationStatus.AUTHORIZED : messaging.AuthorizationStatus.DENIED
      };
      
    } catch (error) {
      console.error('🔥 NotificationPermissionService: Error in initialize:', error);
      return { granted: false, status: null };
    }
  }
}

export default NotificationPermissionService;
