# 🔑 Automatic Push Token Management System

## 🎯 **Overview**

The CRM mobile app now automatically manages push notification tokens throughout the user's authentication lifecycle. This ensures that:

- ✅ **Login** → Token automatically generated and registered
- ✅ **Logout** → Token automatically deactivated and cleaned up  
- ✅ **Re-login** → New token generated and registered
- ✅ **App Startup** → Tokens managed based on authentication status

## 🚀 **How It Works**

### **1. App Startup Flow**

```
App Launches
     ↓
NotificationService.initialize()
     ↓
Firebase FCM Token Generation (Priority 1)
     ↓
Expo Push Token (Priority 2, if FCM fails)
     ↓
Fallback Token (Development only)
     ↓
Check if user is logged in
     ↓
Auto-register token if authenticated
```

### **2. Login Flow**

```
User enters credentials
     ↓
AuthService.login() called
     ↓
Backend authentication successful
     ↓
Session saved locally
     ↓
🔔 AUTOMATIC: NotificationService.onUserLogin()
     ↓
Generate/refresh push token
     ↓
Register token with backend
     ↓
Token ready for notifications
```

### **3. Logout Flow**

```
User clicks logout
     ↓
AuthService.logout() called
     ↓
🔔 AUTOMATIC: NotificationService.onUserLogout()
     ↓
Deactivate token on backend
     ↓
Clear local token
     ↓
Session cleared
     ↓
Token no longer receives notifications
```

### **4. Re-login Flow**

```
User logs in again
     ↓
AuthService.login() called
     ↓
🔔 AUTOMATIC: NotificationService.onUserLogin()
     ↓
Generate NEW push token
     ↓
Register new token with backend
     ↓
Old token automatically invalidated
     ↓
New token ready for notifications
```

## 🔧 **Technical Implementation**

### **Core Components Modified:**

#### **1. NotificationService.ts**
```typescript
// New methods added:
public async onUserLogin(): Promise<void>
public async onUserLogout(): Promise<void>
private async autoRegisterTokenIfLoggedIn(token: string): Promise<void>
private async deactivateTokenOnBackend(token: string): Promise<void>
```

#### **2. AuthService.js**
```javascript
// Login method enhanced:
static async login(credentials) {
  // ... existing login logic ...
  
  // 🔔 AUTOMATIC PUSH TOKEN MANAGEMENT
  const { NotificationService } = await import('./NotificationService');
  const notificationService = NotificationService.getInstance();
  await notificationService.onUserLogin();
}

// Logout method enhanced:
static async logout() {
  // 🔔 AUTOMATIC PUSH TOKEN CLEANUP
  const { NotificationService } = await import('./NotificationService');
  const notificationService = NotificationService.getInstance();
  await notificationService.onUserLogout();
  
  // ... existing logout logic ...
}
```

#### **3. NotificationContext.tsx**
```typescript
// Enhanced with automatic token management:
useEffect(() => {
  // Check authentication status periodically
  const checkAuthAndManageTokens = async () => {
    // Ensure tokens are properly managed based on auth status
  };
  
  checkAuthAndManageTokens();
  const interval = setInterval(checkAuthAndManageTokens, 30000);
  return () => clearInterval(interval);
}, [notificationService]);
```

### **Backend Integration:**

The system automatically calls these backend endpoints:

- **Token Registration**: `POST /api/push-notifications/register`
- **Token Deactivation**: `POST /api/push-notifications/logout`
- **Token Status**: `GET /api/push-notifications/status`

## 📱 **User Experience**

### **What Users See:**

1. **First Time Login**: 
   - App automatically requests notification permissions
   - Push token generated in background
   - Token registered with backend
   - User receives notifications immediately

2. **Subsequent Logins**:
   - New push token generated
   - Old token automatically invalidated
   - New token registered
   - Seamless notification delivery

3. **Logout**:
   - Push token automatically deactivated
   - No more notifications received
   - Clean state for next user

4. **Re-login**:
   - Fresh push token generated
   - Immediate notification capability restored

## 🧪 **Testing the System**

### **PushTokenManager Component:**

A new testing component has been created at `src/components/notes/PushTokenManager.tsx` that allows you to:

- ✅ **View Current Status**: See token generation and registration status
- 🧪 **Test Token Generation**: Force token generation
- 🔑 **Test Token Registration**: Simulate login token registration
- 🧹 **Test Token Cleanup**: Simulate logout token cleanup
- 🔄 **Refresh Status**: Check current system state

### **How to Test:**

1. **Navigate to PushTokenManager** in your app
2. **Check Current Status** to see system state
3. **Test Token Generation** to verify token creation
4. **Test Token Registration** to verify backend integration
5. **Test Token Cleanup** to verify logout functionality
6. **Perform actual login/logout** to see automatic behavior

## 🔍 **Debugging & Troubleshooting**

### **Common Issues:**

#### **1. Token Not Generating**
```
❌ Issue: No push token available
🔍 Check: Firebase configuration, device permissions
✅ Solution: Ensure app is built as native (not Expo Go)
```

#### **2. Token Not Registering**
```
❌ Issue: Token not sent to backend
🔍 Check: Authentication status, network connectivity
✅ Solution: Verify user is logged in, check API endpoints
```

#### **3. Notifications Not Received**
```
❌ Issue: Token registered but no notifications
🔍 Check: Backend push service, token validity
✅ Solution: Verify backend configuration, test with backend endpoints
```

### **Debug Logs:**

The system provides comprehensive logging:

```
🔔 NotificationService: User logged in, managing push token...
✅ FCM token available: d_abc123...
✅ Push token registered with backend successfully
🔔 NotificationService: User logging out, cleaning up push token...
✅ Push token deactivated on backend successfully
```

## 🚨 **Security Features**

### **Automatic Token Management:**

- **No Manual Token Handling**: Users never see or manage tokens
- **Automatic Cleanup**: Tokens deactivated on logout
- **Fresh Tokens**: New token on each login
- **Backend Validation**: All token operations require authentication

### **Token Lifecycle:**

```
Token Generated → Token Registered → Token Active → Token Deactivated
     ↓              ↓                ↓              ↓
  On Login     On Login         During Session   On Logout
```

## 🔮 **Future Enhancements**

### **Planned Features:**

1. **Multi-Device Support**: Handle multiple devices per user
2. **Token Refresh**: Automatic token renewal before expiration
3. **Offline Queue**: Queue notifications when offline
4. **Smart Routing**: Route notifications based on user preferences
5. **Analytics**: Track notification delivery and engagement

### **Advanced Scenarios:**

1. **Device Switching**: Handle user switching between devices
2. **Company Changes**: Handle user moving between companies
3. **Role Changes**: Adjust notification permissions based on role
4. **Geographic Routing**: Route notifications based on location

## 📚 **API Reference**

### **NotificationService Methods:**

```typescript
// Core lifecycle methods
onUserLogin(): Promise<void>           // Called automatically on login
onUserLogout(): Promise<void>          // Called automatically on logout
initialize(): Promise<void>            // Initialize service and generate token
getPushToken(): string | null         // Get current push token

// Backend integration
registerTokenWithBackend(token: string): Promise<void>
deactivateTokenOnBackend(token: string): Promise<void>
```

### **Backend Endpoints:**

```http
# Token Registration
POST /api/push-notifications/register
Authorization: Bearer {token}
{
  "pushToken": "FCM_TOKEN_HERE",
  "deviceType": "android|ios"
}

# Token Deactivation (Logout)
POST /api/push-notifications/logout
Authorization: Bearer {token}

# Service Status
GET /api/push-notifications/status
Authorization: Bearer {token}
```

## 🎉 **Summary**

The automatic push token management system provides:

- **🔄 Seamless Experience**: Users never need to manage tokens manually
- **🔒 Enhanced Security**: Automatic token lifecycle management
- **📱 Reliable Notifications**: Tokens always up-to-date and valid
- **🧪 Easy Testing**: Built-in testing and debugging tools
- **📊 Comprehensive Logging**: Full visibility into system operation

This system ensures that push notifications work reliably for all users while maintaining security and providing a smooth user experience.
