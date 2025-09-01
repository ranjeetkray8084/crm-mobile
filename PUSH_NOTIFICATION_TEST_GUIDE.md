# Push Notification Test Guide

## 🎯 Overview
This guide will help you test push notifications in your CRM app. We've created two test interfaces:

1. **Simple Test** - Basic notification testing (accessible from dashboard)
2. **Advanced Test** - Comprehensive testing with detailed results

## 📱 How to Access Tests

### Method 1: From Dashboard
1. Open the app and go to the main dashboard
2. Look for the "🔔 Push Notifications Test" section
3. Click "Simple Test" for basic testing
4. Click "Advanced Test" for comprehensive testing

### Method 2: Direct Navigation
- **Simple Test**: Navigate to `/notification-test`
- **Advanced Test**: Navigate to `/push-test`

## 🧪 Test Features

### Basic Tests
- ✅ **Request Permissions** - Ask for notification permissions
- ✅ **Generate Push Token** - Create Expo push token
- ✅ **Register Token** - Send token to backend

### Notification Tests
- ✅ **Send Local Notification** - Immediate notification
- ✅ **Schedule Notification** - 5-second delayed notification
- ✅ **Test Backend Notification** - Server-sent notification
- ✅ **Test Multiple Notifications** - Send 4 notifications with delays

### Advanced Features
- ✅ **Export Results** - Save test results to console
- ✅ **Clear Results** - Reset test history
- ✅ **Device Info** - Display device and app details

## 🔧 Step-by-Step Testing

### Step 1: Basic Setup
1. **Request Permissions**
   - Click "Request Permissions"
   - Allow notifications when prompted
   - Check that permission status shows "granted"

2. **Generate Push Token**
   - Click "Generate Push Token"
   - Verify token is generated (should show first 20 characters)
   - Check token length (should be around 150+ characters)

3. **Register Token**
   - Click "Register Token"
   - Verify successful registration with backend
   - Check that "Registered" status shows "Yes"

### Step 2: Local Notifications
1. **Send Local Notification**
   - Click "Send Local Notification"
   - Check that notification appears on device
   - Verify notification content and sound

2. **Schedule Notification**
   - Click "Schedule Notification (5s)"
   - Wait 5 seconds for notification to appear
   - Verify scheduled notification works

### Step 3: Advanced Testing
1. **Test Multiple Notifications**
   - Click "Test Multiple Notifications"
   - Watch for 4 notifications with 1-second delays
   - Verify all notifications appear correctly

2. **Test Backend Notification**
   - Click "Test Backend Notification"
   - Check that server-sent notification arrives
   - Verify backend integration works

## 📊 Understanding Test Results

### Status Indicators
- ✅ **Success** - Operation completed successfully
- ❌ **Error** - Operation failed with error message
- ⚠️ **Warning** - Potential issue or limitation
- 🔔 **Info** - General information or progress

### Device Information
- **Platform**: Android/iOS version
- **Device**: Physical device or simulator
- **Ownership**: Expo Go, standalone, or development build
- **Token**: Push token status and length

### Test Results Format
```
[Timestamp]: [Status] [Description]
Example: 14:30:25: ✅ Push token generated: ExponentPushToken[ABC123...
```

## 🚨 Troubleshooting

### Common Issues

**Issue: Notifications not appearing**
- Solution: Check device notification settings
- Ensure app has notification permissions
- Verify device is not in Do Not Disturb mode

**Issue: Token generation fails**
- Solution: Ensure you're on a physical device
- Check internet connection
- Verify Expo project configuration

**Issue: Backend registration fails**
- Solution: Check network connectivity
- Verify backend is running and accessible
- Check authentication token is valid

**Issue: Scheduled notifications not working**
- Solution: Ensure app has background permissions
- Check device battery optimization settings
- Verify notification channel configuration

### Debug Information
The test interface provides detailed logging:
- Device information and capabilities
- Permission status and changes
- Token generation and registration details
- Notification delivery status
- Error messages and stack traces

## 📋 Test Checklist

### Pre-Test Setup
- [ ] App installed on physical device
- [ ] Internet connection available
- [ ] Backend server running
- [ ] User logged in to app

### Basic Functionality
- [ ] Permission request works
- [ ] Push token generated successfully
- [ ] Token registered with backend
- [ ] Local notifications appear
- [ ] Scheduled notifications work

### Advanced Features
- [ ] Multiple notifications sent correctly
- [ ] Backend notifications received
- [ ] Notification content is correct
- [ ] Notification sounds play
- [ ] Notification badges update

### Error Handling
- [ ] Permission denied handled gracefully
- [ ] Network errors show appropriate messages
- [ ] Invalid tokens handled properly
- [ ] Backend errors logged correctly

## 🎯 Expected Results

### Successful Test Run
```
14:30:25: 📱 Device Info: android 13, Device: true, Ownership: standalone
14:30:26: ✅ Push token found in storage
14:30:27: ✅ Notification permissions granted
14:30:28: ✅ Push token generated: ExponentPushToken[ABC123...
14:30:29: ✅ Token registered successfully with backend
14:30:30: ✅ Local notification sent successfully
14:30:31: ✅ Notification scheduled successfully
14:30:32: ✅ Backend notification test sent successfully
14:30:33: ✅ All multiple notifications sent successfully
```

### Common Error Patterns
```
14:30:25: ❌ Permission request failed: Notifications not available
14:30:26: ❌ Token generation failed: Device not supported
14:30:27: ❌ Registration error: Network error
14:30:28: ❌ Backend test failed: 401 Unauthorized
```

## 🔄 Testing Scenarios

### Scenario 1: Fresh Install
1. Install app on new device
2. Grant notification permissions
3. Generate and register token
4. Test all notification types

### Scenario 2: Permission Denied
1. Deny notification permissions
2. Try to generate token
3. Check error handling
4. Guide user to settings

### Scenario 3: Network Issues
1. Disconnect internet
2. Try backend operations
3. Check error messages
4. Reconnect and retry

### Scenario 4: App Background
1. Send notification while app is open
2. Send notification while app is in background
3. Send notification while app is closed
4. Verify all scenarios work

## 📈 Performance Testing

### Load Testing
- Send 10+ notifications rapidly
- Test with multiple devices
- Monitor app performance
- Check memory usage

### Stress Testing
- Generate multiple tokens
- Register/unregister repeatedly
- Send notifications continuously
- Monitor for crashes or errors

## 🎉 Success Criteria

A successful push notification implementation should:

1. **Request permissions** without errors
2. **Generate tokens** consistently
3. **Register with backend** successfully
4. **Display notifications** immediately
5. **Schedule notifications** accurately
6. **Handle errors** gracefully
7. **Work in background** when app is closed
8. **Support multiple notifications** without conflicts

## 📞 Support

If you encounter issues:

1. Check the test results for specific error messages
2. Verify all prerequisites are met
3. Test on a physical device (not simulator)
4. Check device notification settings
5. Verify backend connectivity
6. Review console logs for additional details

## 🔗 Related Files

- `PushNotificationTest.tsx` - Advanced test component
- `SimpleNotificationTest.tsx` - Basic test component
- `NotificationService.ts` - Core notification logic
- `TokenRegistrationService.ts` - Backend integration
- `PUSH_NOTIFICATIONS_SETUP.md` - Setup instructions
