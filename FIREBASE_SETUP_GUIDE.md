# 🔥 Firebase FCM Setup Guide

## Current Issues Found

The mobile app has **dummy/placeholder Firebase configuration** that needs to be replaced with real Firebase project credentials.

### ❌ Current Problems:
1. **google-services.json** has dummy values:
   - `project_number: "123456789"`
   - `api_key: "AIzaSyBvOkBwqUeXzYdQfGhIjKlMnOpQrStUvWx"`

2. **GoogleService-Info.plist** has different values:
   - `API_KEY: "AIzaSyCAZZLVIJ5jZt-kCFaR6GbOf6mHejhP8js"`
   - `GCM_SENDER_ID: "1050289385914"`

3. **Backend is properly configured** with project ID: `crmnativeexpo-37b6d`

## ✅ Solution Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing project: `crmnativeexpo-37b6d`
3. Enable Firebase Cloud Messaging (FCM)

### 2. Configure Android App
1. In Firebase Console, go to Project Settings → General
2. Add Android app with package name: `com.ranjeet1620.crmnativeexpo`
3. Download the **real** `google-services.json` file
4. Replace the dummy file at: `android/app/google-services.json`

### 3. Configure iOS App
1. In Firebase Console, add iOS app with bundle ID: `com.ranjeet1620.crmnativeexpo`
2. Download the **real** `GoogleService-Info.plist` file
3. Replace the dummy file at: `ios/GoogleService-Info.plist`

### 4. Configure Backend Service Account
1. In Firebase Console, go to Project Settings → Service Accounts
2. Generate new private key (JSON file)
3. Save as `backend/src/main/resources/firebase-service-account.json`
4. Update `backend/src/main/resources/application.properties`:
   ```properties
   firebase.project.id=crmnativeexpo-37b6d
   firebase.service.account.path=classpath:firebase-service-account.json
   ```

### 5. Test Configuration
After updating the configuration files:

1. **Clean and rebuild the app:**
   ```bash
   npx expo run:android --clear
   npx expo run:ios --clear
   ```

2. **Test FCM in the app:**
   - Go to Dashboard
   - Tap "Test FCM" button
   - Should see "FCM Test Success" message

3. **Check logs:**
   - Look for "🔥 Firebase Config: Valid API key detected"
   - Should NOT see "Invalid Firebase API key" errors

## 🔧 What Was Fixed

### 1. Created Unified FCM Service
- **File:** `src/core/services/unifiedFCM.service.js`
- **Features:**
  - Proper FCM token validation
  - No fallback tokens (fails fast if Firebase not configured)
  - Better error handling
  - Unified API for all FCM operations

### 2. Updated Dashboard
- **File:** `src/components/Dashboard.tsx`
- **Changes:**
  - Uses `UnifiedFCMService` instead of multiple conflicting services
  - Cleaner test functions
  - Better error messages

### 3. Created Unified FCM Handler
- **File:** `src/components/common/UnifiedFCMHandler.tsx`
- **Features:**
  - Handles user login/logout
  - Registers FCM tokens with backend
  - Sets up message handlers
  - Proper cleanup

### 4. Updated App Layout
- **File:** `app/_layout.tsx`
- **Changes:**
  - Uses `UnifiedFCMHandler` instead of `BackendFCMHandler`

### 5. Enhanced Firebase Config
- **File:** `src/core/config/firebase.config.js`
- **Features:**
  - Validates Firebase configuration
  - Better error messages
  - Proper initialization checks

## 🚀 Expected Results

After proper Firebase configuration:

1. **FCM tokens will be real** (not fallback tokens)
2. **Push notifications will work** from backend to mobile app
3. **Test buttons will show success** messages
4. **Console logs will show** "Valid API key detected"

## 🔍 Debugging

If FCM still doesn't work:

1. **Check console logs** for Firebase initialization errors
2. **Verify configuration files** have real values (not dummy values)
3. **Test backend** push notification endpoints directly
4. **Check device permissions** for notifications

## 📱 Testing

1. **Test FCM Button:** Tests basic FCM functionality
2. **Test Backend FCM Button:** Tests backend integration
3. **Check FCM Status:** Shows token and registration status

The unified FCM service will now properly validate Firebase configuration and provide clear error messages if something is wrong.
