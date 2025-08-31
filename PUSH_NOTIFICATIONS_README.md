# Push Notifications Setup Guide

This guide explains how to set up and use push notifications in your CRM React Native Expo app.

## 🚀 Features

- **Local Notifications**: Schedule notifications for specific times
- **Quick Reminders**: 5 min, 15 min, 1 hour, 1 day options
- **Event Reminders**: Automatic reminders for events
- **Test Notifications**: Immediate notifications for testing
- **Notification Management**: View and cancel scheduled notifications

## 📱 Installation

The required packages have already been installed:

```bash
npm install expo-notifications expo-device
```

## ⚙️ Configuration

### 1. Update Project ID

In `src/core/services/NotificationService.ts`, replace `'your-project-id'` with your actual Expo project ID:

```typescript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-actual-project-id', // Replace this
});
```

### 2. App Configuration

Make sure your `app.json` or `app.config.js` includes notification permissions:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

## 🔧 Usage

### Basic Usage

The notification system is automatically initialized when the app starts. You can use it in any component:

```typescript
import { useNotifications } from '../shared/contexts/NotificationContext';

const MyComponent = () => {
  const { sendImmediateNotification, scheduleNotificationWithDelay } = useNotifications();

  const handleNotification = async () => {
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

### Available Methods

- `sendImmediateNotification()` - Send notification immediately
- `scheduleNotificationWithDelay()` - Schedule notification with delay in seconds
- `scheduleNotificationForDateTime()` - Schedule notification for specific date/time
- `cancelNotification()` - Cancel specific notification
- `cancelAllNotifications()` - Cancel all scheduled notifications

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

## 📋 Permissions

The app will automatically request notification permissions when first launched. Users can:

- **Allow**: Full notification functionality
- **Deny**: Limited functionality (local notifications only)
- **Settings**: Users can change permissions in device settings

## 🔄 Notification Lifecycle

1. **Permission Request**: App requests notification permissions
2. **Token Generation**: Expo generates push token for the device
3. **Notification Scheduling**: Users can schedule notifications
4. **Delivery**: Notifications are delivered at scheduled times
5. **Interaction**: Users can tap notifications to open the app

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

- **Push Notifications**: Server-sent notifications
- **Rich Notifications**: Images, actions, and custom layouts
- **Notification Groups**: Organize related notifications
- **Custom Sounds**: App-specific notification sounds
- **Deep Linking**: Navigate to specific screens from notifications

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
