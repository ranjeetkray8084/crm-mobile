import React from 'react';

interface NotificationHandlerProps {
  onNotificationReceived?: (notification: any) => void;
  onNotificationTapped?: (response: any) => void;
}

export const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotificationReceived,
  onNotificationTapped
}) => {
  console.log('🔧 NotificationHandler: Using simplified handler (notifications disabled)');

  // This component doesn't render anything and doesn't set up any listeners
  // All notification functionality is disabled to prevent native module errors
  return null;
};

export default NotificationHandler;
