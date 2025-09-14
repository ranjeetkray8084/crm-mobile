import React, { useEffect } from 'react';

interface NotificationHandlerProps {
  onNotificationReceived?: (notification: any) => void;
  onNotificationTapped?: (response: any) => void;
}

export const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotificationReceived,
  onNotificationTapped
}) => {
  useEffect(() => {
    let unsubscribeForeground: any;
    let unsubscribeResponse: any;

    (async () => {
      try {
        const NotificationService = (await import('../../core/services/NotificationService')).default;
        const service = NotificationService.getInstance();
        await service.initialize();

        const Notifications = require('expo-notifications');
        unsubscribeForeground = Notifications.addNotificationReceivedListener((notification: any) => {
          if (onNotificationReceived) onNotificationReceived(notification);
        });
        unsubscribeResponse = Notifications.addNotificationResponseReceivedListener((response: any) => {
          if (onNotificationTapped) onNotificationTapped(response);
        });
      } catch (e) {
        console.log('⚠️ NotificationHandler init error', e);
      }
    })();

    return () => {
      try { if (unsubscribeForeground) unsubscribeForeground.remove?.(); } catch {}
      try { if (unsubscribeResponse) unsubscribeResponse.remove?.(); } catch {}
    };
  }, [onNotificationReceived, onNotificationTapped]);

  return null;
};

export default NotificationHandler;
