# 🚀 Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### **Step 1: Install Dependencies**
```bash
cd CRMNativeExpo
npm install
npm run install-device-info
```

### **Step 2: Test Setup**
```bash
npm run test-setup
```

### **Step 3: Run the App**
```bash
# For Android (recommended)
npx expo run:android --device

# For iOS
npx expo run:ios --device

# Development server only
npx expo start --clear
```

## 🔧 Windows Users

Use the provided batch file:
```cmd
run-app.bat
```

## ❌ Common Command Errors

### **Wrong:** `npm expo run:android`
### **Correct:** `npx expo run:android --device`

### **Wrong:** `expo run:android`  
### **Correct:** `npx expo run:android --device`

## 📱 Device Requirements

- **Physical device required** (not emulator)
- **USB debugging enabled** (Android)
- **Device trusted** (iOS)
- **Internet connection** for backend

## 🧪 Testing Multi-Device Features

1. **Run the app** on your device
2. **Login** with your credentials
3. **Navigate to settings** or dashboard
4. **Look for** `MultiDeviceTestComponent` or `PushNotificationManager`
5. **Test** token registration and notifications

## 🔍 Verify Installation

```bash
npm run test-setup
```

This will check:
- ✅ Dependencies installed
- ✅ Files updated correctly  
- ✅ API endpoints configured
- ✅ Multi-device support ready

## 🆘 If Something Goes Wrong

1. **Clear cache:** `npx expo start --clear`
2. **Reinstall:** `rm -rf node_modules && npm install`
3. **Check device:** Make sure physical device is connected
4. **Check backend:** Verify `https://backend.leadstracker.in` is accessible

## 🎯 Expected Results

After setup, you should have:
- ✅ Multi-device push notification support
- ✅ Device-specific logout functionality
- ✅ Automatic backend integration
- ✅ Real-time notification delivery

## 📖 Full Documentation

For detailed information, see:
- `BACKEND_INTEGRATION_UPDATE.md` - Complete setup guide
- `MULTI_DEVICE_SETUP.md` - Multi-device testing
- `PUSH_NOTIFICATIONS_IMPLEMENTATION.md` - Implementation details