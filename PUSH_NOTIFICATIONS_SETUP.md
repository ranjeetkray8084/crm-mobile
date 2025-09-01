# Push Notifications Setup Guide

## Overview
This guide will help you set up push notifications for your CRM React Native Expo app. The app uses Expo Notifications as the primary method and Firebase as a fallback.

## Prerequisites
- Expo CLI installed
- Firebase project created
- Physical device for testing (push notifications don't work in simulators)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "leadstracker-crm"
3. Enable Cloud Messaging

### 1.2 Get Firebase Configuration
1. In Firebase Console, go to Project Settings
2. Add Android app with package name: `com.ranjeet1620.crmnativeexpo`
3. Download the `google-services.json` file
4. Replace the placeholder file in `android/app/google-services.json`

### 1.3 Update Firebase Configuration
Replace the placeholder values in `google-services.json` with your actual Firebase project details:

```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "leadstracker-crm",
    "storage_bucket": "leadstracker-crm.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "YOUR_MOBILE_SDK_APP_ID",
        "android_client_info": {
          "package_name": "com.ranjeet1620.crmnativeexpo"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_CLIENT_ID",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "YOUR_API_KEY"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "YOUR_CLIENT_ID",
              "client_type": 3
            }
          ]
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

## Step 2: Expo Configuration

### 2.1 Verify app.config.js
The app.config.js already has the correct configuration for push notifications:

```javascript
plugins: [
  [
    "expo-notifications",
    {
      "icon": "./assets/icon.png",
      "color": "#ffffff",
      "mode": "production",
      "androidMode": "default",
      "androidCollapsedTitle": "New Notification",
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
  ],
  [
    "@react-native-firebase/app",
    {
      "android_package_name": "com.ranjeet1620.crmnativeexpo",
      "google_services_file": "./android/app/google-services.json"
    }
  ],
  [
    "@react-native-firebase/messaging",
    {
      "android_package_name": "com.ranjeet1620.crmnativeexpo",
      "google_services_file": "./android/app/google-services.json"
    }
  ]
]
```

### 2.2 Project ID
The project ID in the configuration is: `7b166f07-1eab-40be-8faf-4252befa0675`

## Step 3: Backend Integration

### 3.1 API Endpoints
The app expects these endpoints for push notifications:

- `POST /api/push-notifications/register` - Register push token
- `POST /api/push-notifications/logout` - Deactivate token on logout
- `GET /api/push-notifications/status` - Check token status
- `POST /api/push-notifications/test` - Test notification

### 3.2 Token Registration
The app automatically registers the push token with the backend when:
- User logs in
- App starts up
- Token is refreshed

## Step 4: Testing

### 4.1 Build Development Version
```bash
cd CRMNativeExpo
npx expo run:android --device
```

### 4.2 Use Test Component
The app includes a `NotificationTest` component that you can use to test:

1. Permission requests
2. Token generation
3. Token registration
4. Local notifications
5. Scheduled notifications

### 4.3 Manual Testing Steps
1. Open the app on a physical device
2. Grant notification permissions when prompted
3. Check that push token is generated and registered
4. Test local notifications
5. Test scheduled notifications
6. Verify backend receives the token

## Step 5: Troubleshooting

### 5.1 Common Issues

**Issue: Notifications not working in Expo Go**
- Solution: Build a development build using `expo run:android`

**Issue: Firebase not initialized**
- Solution: Ensure `google-services.json` is properly configured
- Check that Firebase project is set up correctly

**Issue: Token not registering with backend**
- Solution: Check network connectivity
- Verify backend endpoints are working
- Check authentication token is valid

**Issue: Notifications not showing**
- Solution: Check device notification settings
- Verify app has notification permissions
- Check notification channel configuration

### 5.2 Debug Information
The app includes extensive debug logging. Check the console for:
- `🔔 DEBUG:` - Notification service logs
- `✅ DEBUG:` - Success messages
- `❌ DEBUG:` - Error messages
- `⚠️ DEBUG:` - Warning messages

### 5.3 Testing Commands
```bash
# Clear cache and restart
npx expo start --clear

# Build for Android
npx expo run:android

# Build for iOS
npx expo run:ios

# Check build status
npx expo doctor
```

## Step 6: Production Deployment

### 6.1 Build Production Version
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### 6.2 Update Firebase Configuration
For production, ensure:
- Firebase project is in production mode
- API keys are properly configured
- Cloud Messaging is enabled

### 6.3 Backend Configuration
Ensure your backend:
- Has proper SSL certificates
- Can handle the notification load
- Has proper error handling
- Logs notification delivery status

## Step 7: Monitoring

### 7.1 Firebase Analytics
Monitor notification delivery through Firebase Console:
- Delivery rates
- Open rates
- Error rates

### 7.2 Backend Monitoring
Monitor your backend for:
- Token registration success/failure
- Notification sending success/failure
- API response times

## Additional Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase Documentation](https://rnfirebase.io/messaging/usage)

## Support

If you encounter issues:
1. Check the debug logs in the console
2. Verify all configuration files are correct
3. Test on a physical device
4. Check network connectivity
5. Verify backend endpoints are working
