import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationHandlerProps {
  onNotificationReceived?: (notification: any) => void;
  onNotificationTapped?: (response: any) => void;
}

export const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotificationReceived,
  onNotificationTapped
}) => {
  useEffect(() => {
    console.log('🔔 DEBUG: NotificationHandler: Setting up...');
    
    const setupNotifications = async () => {
      try {
        // Configure notification behavior
        console.log('🔔 DEBUG: Setting notification handler...');
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
        console.log('✅ DEBUG: Notification handler configured');

        // Set up Android notification channel
        if (Platform.OS === 'android') {
          console.log('🔔 DEBUG: Setting up Android notification channel...');
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: false,
          });
          console.log('✅ DEBUG: Android notification channel configured');
        }

        // Set up notification listeners
        console.log('🔔 DEBUG: Setting up notification listeners...');
        
        // Foreground notifications
        const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
          console.log('🔔 DEBUG: Foreground notification received:', notification);
          if (onNotificationReceived) {
            onNotificationReceived(notification);
          }
        });

        // Background/response notifications
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('🔔 DEBUG: Notification response received:', response);
          if (onNotificationTapped) {
            onNotificationTapped(response);
          }
          handleNotificationTap(response);
        });

        console.log('✅ DEBUG: Notification listeners set up successfully');

        // Cleanup function
        return () => {
          console.log('🔔 DEBUG: Cleaning up notification listeners...');
          foregroundListener.remove();
          responseListener.remove();
        };

      } catch (error) {
        console.error('❌ DEBUG: Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [onNotificationReceived, onNotificationTapped]);

  const handleNotificationTap = (response: any) => {
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
      } else {
        console.log('🔔 DEBUG: Unknown notification type:', data?.type);
      }
    } catch (error) {
      console.error('❌ DEBUG: Error handling notification tap:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default NotificationHandler;
