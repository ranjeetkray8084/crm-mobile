# Push Notifications Setup Guide

This guide explains how to set up and use push notifications in your CRM React Native Expo app.

## 🚀 Features

- **Local Notifications**: Schedule notifications for specific times
- **Push Notifications**: Server-sent notifications via Expo
- **Quick Reminders**: 5 min, 15 min, 1 hour, 1 day options
- **Event Reminders**: Automatic reminders for events
- **Test Notifications**: Immediate notifications for testing
- **Notification Management**: View and cancel scheduled notifications
- **Permission Management**: User-friendly permission requests

## 📱 Installation

The required packages have already been installed:

```bash
npm install expo-notifications expo-device
```

## ⚙️ Configuration

### 1. Project ID Configuration ✅

Your project ID is already configured in `app.config.js`:
```javascript
eas: {
  projectId: "e54487e4-0b6f-4429-8b02-f1c84f6b0bba"
}
```

**Important**: This project ID is used in:
- `app.config.js` (EAS configuration)
- `NotificationService.ts` (fallback)
- `NotificationTest.tsx` (testing)

### 2. App Configuration ✅

Your `app.config.js` includes comprehensive notification configuration:

```javascript
plugins: [
  [
    "expo-notifications",
    {
      "icon": "./assets/icon.png",
      "color": "#ffffff",
      "mode": "production",
      "androidMode": "default",
      "androidChannelId": "default",
      "androidChannelName": "Default",
      "androidChannelDescription": "Default notification channel for leads, tasks, and announcements",
      "androidChannelImportance": "max",
      "androidShowBadge": true,
      "androidVibrate": true,
      "androidSound": true,
      "androidColor": "#FF231F7C",
      "androidSticky": false,
      "androidPriority": "max",
      "iosDisplayInForeground": true,
      "iosSound": "default",
      "iosBadge": true,
      "iosCritical": false
    }
  ]
]
```

### 3. Permissions Configuration ✅

**Android Permissions** (already configured):
```javascript
permissions: [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.VIBRATE",
  "android.permission.WAKE_LOCK",
  "android.permission.RECEIVE_BOOT_COMPLETED",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.RECEIVE_NOTIFICATIONS",
  "android.permission.SCHEDULE_EXACT_ALARM"
]
```

**iOS Permissions** (already configured):
```javascript
UIBackgroundModes: ["remote-notification", "background-fetch"],
NSUserNotificationAlertStyle: "alert",
NSUserNotificationUsageDescription: "This app uses notifications to keep you updated about leads, tasks, and important announcements."
```

## 🔧 Usage

### Basic Usage

The notification system is automatically initialized when the app starts. You can use it in any component:

```typescript
import { useNotifications } from '../shared/contexts/NotificationContext';

const MyComponent = () => {
  const { 
    sendImmediateNotification, 
    scheduleNotificationWithDelay,
    checkPermissionStatus,
    requestPermissions 
  } = useNotifications();

  const handleNotification = async () => {
    // Check permissions first
    const status = await checkPermissionStatus();
    if (status !== 'granted') {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    await sendImmediateNotification({
      title: 'Hello!',
      body: 'This is a test notification',
      data: { type: 'test' },
      sound: true,
      priority: 'high',
    });
  };

  // ... rest of component
};
```

### Permission Management

Use the `NotificationPermissionRequest` component for user-friendly permission requests:

```typescript
import NotificationPermissionRequest from '../components/notes/NotificationPermissionRequest';

const MyScreen = () => {
  return (
    <View>
      <NotificationPermissionRequest
        onPermissionGranted={() => console.log('Permissions granted!')}
        onPermissionDenied={() => console.log('Permissions denied')}
      />
    </View>
  );
};
```

### Available Methods

- `sendImmediateNotification()` - Send notification immediately
- `scheduleNotificationWithDelay()` - Schedule notification with delay in seconds
- `scheduleNotificationForDateTime()` - Schedule notification for specific date/time
- `cancelNotification()` - Cancel specific notification
- `cancelAllNotifications()` - Cancel all scheduled notifications
- `checkPermissionStatus()` - Check current permission status
- `requestPermissions()` - Request notification permissions

### Notification Data Structure

```typescript
interface NotificationData {
  title: string;           // Notification title
  body: string;            // Notification body text
  data?: any;              // Custom data payload
  sound?: boolean;         // Play sound (default: true)
  priority?: 'default' | 'normal' | 'high'; // Priority level
}
```

## 🎯 Integration with Notes

The notification system is integrated with the NoteDetails component:

1. **Notification Button**: Click the bell icon (🔔) in the note details header
2. **Quick Options**: Choose from preset reminder times
3. **Event Reminders**: For events, automatically schedule reminders before the event
4. **Manage Notifications**: View and cancel scheduled notifications

## 🧪 Testing

### Test Component

Use the `NotificationTest` component to test notifications:

```typescript
import NotificationTest from '../components/notes/NotificationTest';

// In your component
<NotificationTest />
```

### Manual Testing

1. **Immediate Notification**: Test instant notifications
2. **Delayed Notification**: Test scheduled notifications
3. **Device Settings**: Ensure notifications are enabled in device settings

### Test Push Notification

Use the backend endpoint to test push notifications:

```bash
POST /api/push-notifications/test
{
  "pushToken": "your-expo-token",
  "deviceType": "android"
}
```

## 📋 Permissions

The app will automatically request notification permissions when first launched. Users can:

- **Allow**: Full notification functionality
- **Deny**: Limited functionality (local notifications only)
- **Settings**: Users can change permissions in device settings

## 🔄 Notification Lifecycle

1. **Permission Request**: App requests notification permissions
2. **Token Generation**: Expo generates push token for the device
3. **Token Registration**: Token is sent to backend
4. **Notification Scheduling**: Users can schedule notifications
5. **Delivery**: Notifications are delivered at scheduled times
6. **Interaction**: Users can tap notifications to open the app

## 🚨 Troubleshooting

### Common Issues

1. **Notifications not showing**: Check device notification settings
2. **Permission denied**: Guide user to device settings
3. **Token not generated**: Ensure physical device (not simulator)
4. **Scheduled notifications not working**: Check app background permissions

### Debug Information

Check the console for:
- Permission status
- Push token generation
- Notification scheduling success/failure
- Error messages

## 📱 Platform Differences

### iOS
- Requires explicit permission
- Background app refresh for scheduled notifications
- Rich notification support

### Android
- Automatic permission handling
- Notification channels
- Background service for reliable delivery

## 🔮 Future Enhancements

- **Rich Notifications**: Images, actions, and custom layouts
- **Notification Groups**: Organize related notifications
- **Custom Sounds**: App-specific notification sounds
- **Deep Linking**: Navigate to specific screens from notifications
- **Analytics**: Track notification delivery and engagement

## 📚 Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native Push Notifications](https://github.com/zo0r/react-native-push-notification)
- [iOS Notification Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/user-interface/notifications/)
- [Android Notification Guidelines](https://developer.android.com/guide/topics/ui/notifiers/notifications)

## 🤝 Support

If you encounter issues:

1. Check the console for error messages
2. Verify device notification settings
3. Test on physical device (not simulator)
4. Ensure all dependencies are properly installed
5. Check Expo project configuration

---

**Note**: Push notifications require a physical device for testing. Simulators cannot receive or display notifications.

**Current Configuration Status**: ✅ All configurations are properly set up and ready to use!
