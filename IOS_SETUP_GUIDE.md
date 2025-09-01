# iOS App Setup Guide

## Overview
iOS app ke liye setup complete ho gaya hai. Ab aap iOS ke liye app build kar sakte hain.

## Prerequisites
1. **Apple Developer Account** - iOS app publish karne ke liye
2. **Xcode** - iOS development ke liye (optional, EAS build use kar sakte hain)
3. **EAS CLI** - Cloud builds ke liye

## Current Configuration

### Bundle ID
- **Bundle Identifier**: `com.ranjeet1620.crmnativeexpo`
- **App Name**: LeadsTracker
- **Version**: 1.0.1
- **Build Number**: 2

### iOS Permissions
- Internet access
- Network state
- Push notifications
- Background fetch
- URL scheme: `leadstracker://`

## Build Commands

### Development Build (Simulator)
```bash
npm run build:ios-preview
```

### Production Build
```bash
npm run build:ios
```

### Local Development
```bash
npm run ios
```

## EAS Build Profiles

### 1. Development
- **Profile**: `development`
- **Type**: Development client
- **Distribution**: Internal
- **Build Type**: Development

### 2. Preview
- **Profile**: `preview` or `ios-preview`
- **Type**: Archive
- **Distribution**: Internal
- **Build Type**: Archive

### 3. Production
- **Profile**: `production` or `ios-production`
- **Type**: Archive
- **Distribution**: Internal
- **Build Type**: Archive

## Firebase Setup (Optional)

Agar aap Firebase use karna chahte hain:

1. **Firebase Console** mein jao
2. **iOS app** add karo
3. **Bundle ID**: `com.ranjeet1620.crmnativeexpo`
4. **GoogleService-Info.plist** download karo
5. `ios/GoogleService-Info.plist` mein replace karo

## App Store Submission

### 1. Build Production App
```bash
eas build --platform ios --profile production
```

### 2. Submit to App Store
```bash
eas submit --platform ios
```

## Testing

### Simulator Testing
```bash
# Start development server
npm start

# Open iOS simulator
npm run ios
```

### Device Testing
1. **Development build** install karo device par
2. **TestFlight** use karo beta testing ke liye
3. **Internal distribution** use karo team testing ke liye

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check EAS build logs
   - Verify bundle identifier
   - Check Apple Developer account

2. **Simulator Issues**
   - Clear cache: `npm run clear-cache`
   - Reset simulator
   - Check Xcode installation

3. **Permission Issues**
   - Verify info.plist configuration
   - Check notification permissions

### Debug Commands
```bash
# Clear cache
npm run clear-cache

# Reset cache
npm run reset-cache

# Check build status
eas build:list
```

## Next Steps

1. **Test the app** on iOS simulator
2. **Build for device** testing
3. **Configure Firebase** (if needed)
4. **Submit to App Store**

## Support

Agar koi issue aaye to:
- EAS build logs check karo
- Expo documentation refer karo
- Apple Developer documentation check karo
