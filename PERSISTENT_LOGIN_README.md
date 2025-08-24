# Persistent Login System - CRMNativeExpo

## Overview
This app now implements a persistent login system that keeps users logged in until they explicitly log out or their session expires.

## How It Works

### 1. Session Storage
- User credentials (JWT token + user data) are stored in AsyncStorage
- Data persists across app restarts and device reboots
- Secure storage using React Native's AsyncStorage

### 2. Authentication Flow
1. **App Startup**: 
   - Checks for stored credentials
   - If valid credentials exist, user is automatically logged in
   - If no credentials or expired, redirects to login screen

2. **Login Process**:
   - User enters credentials
   - Backend validates and returns JWT token
   - Token and user data are stored locally
   - User is redirected to main app

3. **Session Persistence**:
   - User stays logged in across app restarts
   - Automatic session validation every 15 minutes
   - Seamless experience without re-authentication

4. **Logout Process**:
   - User clicks logout button
   - Local credentials are cleared
   - Session refresh is stopped
   - User is redirected to login screen

### 3. Security Features
- **Token Validation**: Regular checks with backend to ensure token validity
- **Automatic Cleanup**: Expired sessions are automatically cleared
- **Secure Storage**: Credentials stored in device's secure storage
- **Session Refresh**: Automatic token validation every 15 minutes

## Components

### AuthGuard
- Protects all authenticated routes
- Checks authentication status before rendering protected content
- Automatically redirects to login if session is invalid

### AuthContext
- Manages authentication state globally
- Provides login/logout functions
- Handles session persistence

### AuthService
- Core authentication logic
- Session management
- API communication
- Automatic session refresh

## Usage

### For Users
1. **First Time**: Login with email/password
2. **Subsequent Visits**: App automatically logs you in
3. **Stay Logged In**: No need to re-enter credentials
4. **Logout**: Use logout button in header to sign out

### For Developers
```javascript
// Check if user is authenticated
const { isAuthenticated, user } = useAuth();

// Login
const { login } = useAuth();
const result = await login({ email, password });

// Logout
const { logout } = useAuth();
await logout();
```

## Configuration

### Session Refresh Interval
- Default: 15 minutes
- Configurable in `AuthService.startSessionRefresh(intervalMinutes)`

### Storage Keys
- Token: `crm_token`
- User: `crm_user`
- Other session data as needed

## Benefits

1. **Better User Experience**: No need to login every time
2. **Increased Security**: Regular token validation
3. **Offline Capability**: App works with stored credentials
4. **Seamless Navigation**: Smooth transitions between app restarts

## Troubleshooting

### Common Issues
1. **Session Expired**: User will be redirected to login automatically
2. **Token Invalid**: Local session is cleared and user must login again
3. **Network Issues**: App falls back to stored credentials

### Debug Mode
Enable console logging to see authentication flow:
- Session checks
- Token validation
- Login/logout events
- Session refresh status

## Security Considerations

- JWT tokens have expiration times
- Regular validation with backend
- Automatic cleanup of expired sessions
- Secure storage using device's native security
- No sensitive data stored in plain text

## Future Enhancements

- Biometric authentication
- Multi-factor authentication
- Session sharing across devices
- Advanced token refresh mechanisms
