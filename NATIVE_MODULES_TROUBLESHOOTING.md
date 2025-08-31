# Native Module Troubleshooting Guide

## Common Issues

### 1. "Cannot find native module 'ExpoPushTokenManager'" Error

This error occurs when the Expo notifications native modules are not properly linked or available in the development environment.

**Symptoms:**
- Error: `Cannot find native module 'ExpoPushTokenManager'`
- Error: `Cannot find native module 'ExpoNetwork'`
- Warnings about missing default exports in notification test routes

**Causes:**
- Development build without proper native module linking
- Metro cache issues
- Incomplete installation of expo-notifications

## Solutions

### Quick Fix (Most Common)
```bash
# Stop the development server (Ctrl+C)
npm run clear-cache
# or
npx expo start --clear
```

### If Quick Fix Doesn't Work
```bash
# Stop the development server (Ctrl+C)
npm run reset-cache
# or
npx expo start --reset-cache
```

### For Persistent Issues
```bash
# Stop the development server (Ctrl+C)
rm -rf node_modules
npm install
npx expo start --clear
```

### Nuclear Option (Last Resort)
```bash
# Stop the development server (Ctrl+C)
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

## Why This Happens

1. **Development vs Production**: Native modules like `expo-notifications` require proper linking that may not be available in development builds
2. **Metro Cache**: The Metro bundler cache can become corrupted
3. **Module Resolution**: Sometimes the module resolution gets confused

## What We've Fixed

1. **Error Handling**: Added proper error handling in `NotificationService.ts`
2. **Fallbacks**: Implemented fallback behavior when native modules aren't available
3. **Graceful Degradation**: The app now works even when notifications aren't available
4. **Better Logging**: Clear console messages about what's happening

## Expected Behavior

### Development Builds
- ✅ App loads without crashing
- ⚠️ Warning messages about missing native modules
- 📱 Fallback notification behavior
- 🔔 Notification test screens show appropriate warnings

### Production Builds
- ✅ Full notification functionality
- ✅ Push notifications work
- ✅ All notification features available

## Testing Notifications

1. **Development**: Use the notification test screens to verify fallback behavior
2. **Production**: Test on physical device with proper build
3. **Simulator**: Notifications won't work (this is normal)

## Files Modified

- `src/core/services/NotificationService.ts` - Added error handling and fallbacks
- `src/components/notes/QuickNotificationTest.tsx` - Added module availability checks
- `src/components/notes/NotificationTest.tsx` - Added error handling
- `src/shared/contexts/NotificationContext.tsx` - Added safe imports
- `app.config.js` - Enhanced notification configuration
- `package.json` - Added cache clearing scripts

## Prevention

1. Always use `npm run start` (which includes `--clear`)
2. Clear cache when switching between development and production
3. Restart development server after installing new packages
4. Use physical devices for testing notifications

## Still Having Issues?

1. Check if you're using the latest Expo SDK
2. Verify all dependencies are properly installed
3. Try building a production version
4. Check Expo documentation for your specific SDK version

Remember: **Native module errors in development are normal and expected**. The app will work properly in production builds.
