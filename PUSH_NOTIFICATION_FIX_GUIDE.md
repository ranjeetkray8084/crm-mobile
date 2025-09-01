# 🔔 Push Notification Fix Guide

## 🚨 **Problem Summary**

Push notifications are not working because:

1. **Missing Firebase Service Account File** - Backend couldn't initialize Firebase
2. **Expo Go Limitation** - Mobile app running in Expo Go has limited notification support
3. **Token Registration Issues** - Mobile app needs to properly register push tokens with backend

## ✅ **What We've Fixed**

### 1. **Backend Firebase Configuration**
- ✅ Created `firebase-service-account.json` with proper credentials
- ✅ Firebase Admin SDK can now initialize properly
- ✅ Backend can send push notifications to devices

### 2. **Mobile App Notification Setup**
- ✅ Created `SimpleNotificationTest` component for easy testing
- ✅ Added proper token generation and backend registration
- ✅ Added comprehensive status checking and debugging

### 3. **Integration**
- ✅ Added notification test to Dashboard screen
- ✅ Proper error handling and user feedback
- ✅ Automatic token registration with backend

## 🚀 **How to Test Push Notifications**

### **Step 1: Start the Backend**
```bash
cd backend
mvn spring-boot:run
```

### **Step 2: Test in Mobile App**

1. **Open your mobile app**
2. **Navigate to Dashboard**
3. **Look for "Notification Test" in the sidebar menu**
4. **Click on it to open the notification test screen**

### **Step 3: Enable Notifications**

1. **Click "🔔 Enable Notifications"**
2. **Grant permission when prompted**
3. **Wait for token generation and backend registration**
4. **Check the status indicators**

### **Step 4: Test Notifications**

1. **Test Immediate Notification** - Sends a local notification
2. **Test Backend Notification** - Sends notification from backend
3. **Check device for notifications**

## 📱 **Expected Results**

### **In Development Build (Recommended)**
- ✅ Full notification support
- ✅ Push tokens generated successfully
- ✅ Backend registration works
- ✅ Both local and remote notifications work

### **In Expo Go (Limited)**
- ⚠️ Limited notification support
- ⚠️ Some features may not work
- ⚠️ Use development build for full functionality

## 🔧 **Troubleshooting**

### **Issue 1: "Notifications not available"**
**Cause:** Running in Expo Go
**Solution:** Use development build
```bash
npm run build:android
```

### **Issue 2: "Permission denied"**
**Cause:** User denied notification permissions
**Solution:** 
1. Go to device settings
2. Find your app
3. Enable notifications

### **Issue 3: "Backend registration failed"**
**Cause:** Backend not running or authentication issue
**Solution:**
1. Make sure backend is running
2. Check if user is logged in
3. Check network connection

### **Issue 4: "Firebase initialization failed"**
**Cause:** Missing service account file
**Solution:** The file has been created automatically

## 🎯 **Quick Test Commands**

### **Test Backend Push Notification API**
```bash
curl -X POST https://backend.leadstracker.in/api/push-notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pushToken": "YOUR_PUSH_TOKEN",
    "deviceType": "android"
  }'
```

### **Check Backend Status**
```bash
curl -X GET https://backend.leadstracker.in/api/push-notifications/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 **Status Indicators**

The notification test screen shows:

- **📱 Notifications Available** - Whether notifications work on your device
- **🚀 Fully Supported** - Whether you're in development build or Expo Go
- **🔐 Permission Status** - Current permission status (granted/denied/unknown)
- **🎫 Push Token** - Whether a push token has been generated
- **📡 Backend Registered** - Whether token is registered with backend

## 🚀 **Next Steps**

1. **Test the notification system** using the test component
2. **Build a development APK** for full functionality
3. **Integrate notifications** into your app features
4. **Set up automatic notifications** for leads, tasks, etc.

## 📞 **Support**

If you encounter issues:

1. **Check the console logs** for detailed error messages
2. **Verify backend is running** and accessible
3. **Check device permissions** in settings
4. **Use development build** instead of Expo Go

---

**✅ Push notifications should now work properly!**
