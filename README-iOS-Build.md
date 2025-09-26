# iOS Build Guide

## Prerequisites for iOS Build

### 1. Mac Computer Required
- iOS apps can only be built on macOS
- You need Xcode installed (latest version recommended)
- Apple Developer Account (for production builds)

### 2. Apple Developer Account Setup
- Sign up at [developer.apple.com](https://developer.apple.com)
- Enroll in Apple Developer Program ($99/year)
- This is required for:
  - App Store distribution
  - TestFlight distribution
  - Device installation

### 3. EAS CLI Setup
```bash
npm install -g @expo/eas-cli
eas login
```

## Build Commands

### For Production Build (.ipa file)
```bash
# Windows
build-ios.bat

# Mac/Linux
./build-ios.sh

# Or directly with EAS
eas build --platform ios --profile production
```

### For Preview/Testing Build
```bash
# Windows
build-ios-preview.bat

# Mac/Linux
eas build --platform ios --profile preview
```

## Build Process

1. **EAS Build**: Creates .ipa file in the cloud
2. **Download**: Get .ipa file from EAS dashboard
3. **Install**: Use TestFlight or direct installation

## Installation Methods

### Method 1: TestFlight (Recommended)
1. Upload .ipa to App Store Connect
2. Add testers via TestFlight
3. Testers install via TestFlight app

### Method 2: Direct Installation
1. Use Apple Configurator 2
2. Use Xcode (for development)
3. Use third-party tools like AltStore

## Important Notes

- **Mac Required**: iOS builds must be done on macOS
- **Apple Developer Account**: Required for production builds
- **Certificates**: EAS handles certificate management automatically
- **Provisioning Profiles**: EAS manages these automatically

## Troubleshooting

### Common Issues:
1. **Certificate Issues**: EAS handles this automatically
2. **Bundle Identifier**: Make sure it's unique in app.config.js
3. **Apple Developer Account**: Must be active and paid

### Build Status:
- Check build status: `eas build:list`
- View build logs: `eas build:view [BUILD_ID]`

## File Outputs

- **Android**: .apk file (like `./gradlew assembleRelease`)
- **iOS**: .ipa file (similar to APK but for iOS)

The .ipa file is the iOS equivalent of Android's .apk file.
