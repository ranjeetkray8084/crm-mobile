# Firebase Debug Commands

Run these commands in your React Native app console to debug Firebase:

## 🔍 **Step 1: Check Firebase Service Availability**
```javascript
// Check if FirebaseMessagingService is available
console.log('FirebaseMessagingService available:', typeof FirebaseMessagingService !== 'undefined');

// Check if NotificationService is available
console.log('NotificationService available:', typeof NotificationService !== 'undefined');
```

## 🧪 **Step 2: Test Firebase Modules**
```javascript
// Test if Firebase modules can be loaded
if (typeof FirebaseMessagingService !== 'undefined') {
  const moduleTest = FirebaseMessagingService.testFirebaseModules();
  console.log('Module test result:', moduleTest);
}
```

## 🔧 **Step 3: Check Service Status**
```javascript
// Get Firebase service instance
const firebaseService = FirebaseMessagingService.getInstance();

// Check debug status
const debugStatus = firebaseService.getDebugStatus();
console.log('Debug status:', debugStatus);

// Check if service is initialized
console.log('Is initialized:', firebaseService.isServiceInitialized());
```

## 🔄 **Step 4: Force Re-initialization**
```javascript
// Force re-initialization
firebaseService.forceReinitialize().then(() => {
  console.log('Re-initialization complete');
  
  // Check new status
  const newStatus = firebaseService.getDebugStatus();
  console.log('New debug status:', newStatus);
  
  // Try to get FCM token
  firebaseService.getFCMTokenAsync().then((token) => {
    if (token) {
      console.log('FCM Token:', token.substring(0, 20) + '...');
    } else {
      console.log('No FCM token available');
    }
  });
});
```

## 📱 **Step 5: Test Notification Service**
```javascript
// Get notification service instance
const notificationService = NotificationService.getInstance();

// Check current status
console.log('Current push token:', notificationService.getPushToken());
console.log('Using fallbacks:', notificationService.isUsingFallbacks());

// Force re-initialization
notificationService.forceReinitialize().then(() => {
  console.log('Notification service re-initialized');
  console.log('New push token:', notificationService.getPushToken());
  console.log('Using fallbacks:', notificationService.isUsingFallbacks());
});
```

## 🚨 **Expected Results:**

### ✅ **Success Case:**
1. Firebase modules load successfully
2. FCM token is generated (real token, not fallback)
3. Push notifications work properly

### ❌ **Failure Cases:**
1. **Modules not loading**: Check if Firebase packages are properly installed
2. **Permission denied**: Check notification permissions in app settings
3. **No FCM token**: Check Firebase project configuration
4. **Still using fallbacks**: Firebase initialization failed

## 🔧 **If Still Using Fallbacks:**

1. **Check Firebase project**: Verify `google-services.json` is correct
2. **Rebuild app**: Run `npx expo run:android` again
3. **Check permissions**: Ensure notification permissions are granted
4. **Verify device**: Make sure you're testing on a physical device, not emulator

## 📋 **Debug Checklist:**

- [ ] Firebase modules can be imported
- [ ] Firebase app is initialized
- [ ] Notification permissions are granted
- [ ] FCM token is generated
- [ ] Real token is used (not fallback)
- [ ] Push notifications are received

Run these commands step by step and let me know what you see in the logs!
