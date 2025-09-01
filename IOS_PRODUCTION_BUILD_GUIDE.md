# iOS Production Build Guide

## 🚨 Important Note
iOS production build ke liye **Apple Developer Account** chahiye. Windows par iOS development nahi kar sakte.

## Prerequisites

### 1. Apple Developer Account
- **Apple Developer Program** membership ($99/year)
- **Apple ID** with developer access
- **Xcode** (macOS only)

### 2. Alternative Solutions

#### Option A: Use macOS Machine
1. **MacBook** ya **Mac** computer use karo
2. **Xcode** install karo
3. **Apple Developer Account** setup karo
4. **EAS CLI** install karo

#### Option B: Use EAS Build (Recommended)
1. **Apple Developer Account** chahiye
2. **EAS Build** cloud service use karo
3. **Apple credentials** manually provide karo

#### Option C: Use Expo Development Build
1. **Expo Go** app use karo testing ke liye
2. **Production features** limited honge
3. **App Store submission** nahi kar sakte

## Current Status

### ✅ What's Ready
- iOS configuration complete
- Bundle ID: `com.ranjeet1620.crmnativeexpo`
- App version: 1.0.1
- Build number: 2
- EAS project linked
- All assets ready

### ❌ What's Missing
- Apple Developer Account credentials
- iOS build certificates
- App Store provisioning profiles

## Build Commands

### 1. With Apple Developer Account
```bash
# Login to Apple Developer Account
eas build --platform ios --profile production

# Follow prompts to enter Apple ID and password
```

### 2. Manual Credentials Setup
```bash
# Set up credentials manually
eas credentials

# Configure iOS credentials
eas credentials:configure
```

### 3. Test Build (Development)
```bash
# Development build for testing
npm run build:ios-preview
```

## Apple Developer Account Setup

### Step 1: Create Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com)
2. Sign up for **Apple Developer Program**
3. Pay $99/year fee
4. Complete verification

### Step 2: Configure App ID
1. Go to **Certificates, Identifiers & Profiles**
2. Create new **App ID**
3. Bundle ID: `com.ranjeet1620.crmnativeexpo`
4. Enable required capabilities

### Step 3: Create Certificates
1. **Development Certificate** (for testing)
2. **Distribution Certificate** (for App Store)
3. **Provisioning Profiles**

## EAS Build Configuration

### Current Configuration
```json
{
  "ios": {
    "buildConfiguration": "Release",
    "credentialsSource": "remote"
  }
}
```

### Required Credentials
- **Apple Developer Account** email/password
- **App Store Connect** access
- **Provisioning Profile** for distribution

## Alternative: Android Only Release

### Current Android Status
- ✅ Android build working
- ✅ APK generation successful
- ✅ Firebase configured
- ✅ Production ready

### Android Build Commands
```bash
# Production Android build
npm run build:android

# Preview Android build
npm run build:android-preview

# Development Android build
npm run android
```

## Next Steps

### Option 1: iOS Production Build
1. **Apple Developer Account** setup karo
2. **Apple ID credentials** provide karo
3. **iOS build** run karo
4. **App Store** submit karo

### Option 2: Android Only Release
1. **Android APK** build karo
2. **Google Play Store** submit karo
3. **iOS version** later add karo

### Option 3: Hybrid Approach
1. **Android** release karo first
2. **iOS** setup later karo
3. **Cross-platform** testing karo

## Troubleshooting

### Common Issues

1. **Apple ID Login Failed**
   - Check Apple ID and password
   - Enable 2FA if required
   - Use App-Specific Password

2. **Build Fails**
   - Check EAS build logs
   - Verify bundle identifier
   - Check Apple Developer account status

3. **Credentials Issues**
   - Run `eas credentials:configure`
   - Check provisioning profiles
   - Verify certificates

### Support Commands
```bash
# Check EAS status
eas whoami

# List builds
eas build:list

# Check project status
eas project:info

# Configure credentials
eas credentials:configure
```

## Cost Breakdown

### Apple Developer Program
- **Annual Fee**: $99/year
- **App Store**: Free
- **TestFlight**: Free
- **Analytics**: Free

### EAS Build
- **Free Tier**: 30 builds/month
- **Paid Tier**: $10/month for more builds
- **iOS Builds**: Included in plan

## Recommendation

### For Quick Release
1. **Android APK** release karo first
2. **User feedback** collect karo
3. **iOS version** later add karo

### For Complete Release
1. **Apple Developer Account** setup karo
2. **Both platforms** simultaneously release karo
3. **Cross-platform** testing karo

## Contact Support

Agar koi issue aaye to:
- **EAS Documentation**: https://docs.expo.dev
- **Apple Developer Support**: https://developer.apple.com/support
- **Expo Discord**: https://discord.gg/expo
