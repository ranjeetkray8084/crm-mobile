# 🚀 Production APK Build Guide

## 📱 **Quick Start - Production APK**

```bash
# Build production APK
npm run build:android

# Or use EAS directly
eas build --platform android --profile production
```

## 🔧 **Prerequisites**

1. **EAS CLI installed:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Logged into Expo:**
   ```bash
   eas login
   ```

3. **EAS project configured:**
   ```bash
   eas build:configure
   ```

## 🏗️ **Build Profiles**

### **Production Build (Recommended)**
```bash
npm run build:android
# or
eas build --platform android --profile production
```

**Features:**
- ✅ Optimized for performance
- ✅ Smaller APK size
- ✅ Production notifications
- ✅ Release-ready code
- ✅ No development tools

### **Preview Build (Testing)**
```bash
npm run build:android-preview
# or
eas build --platform android --profile preview
```

**Features:**
- 🔍 Good for testing
- 📱 Internal distribution
- ⚡ Faster builds
- 🧪 Development features enabled

## 📋 **Build Process**

### **Step 1: Prepare Your App**
```bash
# Clear any development cache
npm run clear-cache

# Ensure all dependencies are installed
npm install

# Check for any linting issues
npm run lint
```

### **Step 2: Build Production APK**
```bash
# Start the production build
npm run build:android
```

### **Step 3: Monitor Build Progress**
- Build will be processed on EAS servers
- You'll get a build URL to monitor progress
- Typical build time: 10-20 minutes
- You'll receive an email when complete

### **Step 4: Download APK**
- Download link will be provided
- APK will be optimized for production
- Ready for distribution

## ⚙️ **Configuration Details**

### **app.config.js Settings**
```javascript
{
  version: "1.0.0",           // App version
  android: {
    versionCode: 1,           // Android version code
    package: "com.ranjeet1620.crmnativeexpo"
  },
  extra: {
    environment: "production" // Production environment
  }
}
```

### **eas.json Configuration**
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 📊 **Build Optimization**

### **APK Size Optimization**
- ✅ Tree shaking enabled
- ✅ Unused code removed
- ✅ Assets optimized
- ✅ ProGuard enabled (Android)

### **Performance Optimization**
- ✅ Hermes engine enabled
- ✅ Code minification
- ✅ Asset compression
- ✅ Bundle splitting

## 🚨 **Common Issues & Solutions**

### **Build Fails with Native Module Errors**
```bash
# Clear cache and rebuild
npm run clear-cache
npm run build:android
```

### **APK Too Large**
- Check asset sizes
- Remove unused dependencies
- Optimize images
- Use asset bundles

### **Build Stuck**
- Check EAS status page
- Restart build process
- Contact EAS support if persistent

## 📱 **Testing Production Build**

### **Before Distribution**
1. **Install on test device:**
   ```bash
   adb install -r your-app.apk
   ```

2. **Test all features:**
   - ✅ Notifications
   - ✅ API calls
   - ✅ Navigation
   - ✅ Data persistence

3. **Performance check:**
   - App startup time
   - Memory usage
   - Battery consumption

## 🎯 **Distribution Options**

### **Internal Testing**
- Share APK directly
- Use preview build profile
- Test on multiple devices

### **Google Play Store**
- Use production build
- Follow Play Store guidelines
- Implement app signing

### **Direct APK Distribution**
- Host APK on your server
- Share download links
- Use QR codes for easy access

## 🔐 **Security Considerations**

### **Production Security**
- ✅ HTTPS API calls only
- ✅ No debug logging
- ✅ Production environment variables
- ✅ Secure storage implementation

### **App Signing**
- EAS handles signing automatically
- Consistent signatures across builds
- Secure key management

## 📈 **Monitoring & Analytics**

### **Production Monitoring**
- Crash reporting enabled
- Performance metrics
- User analytics
- Error tracking

## 🚀 **Next Steps After Build**

1. **Test thoroughly** on multiple devices
2. **Distribute to testers** for feedback
3. **Monitor performance** in production
4. **Plan next release** with version updates

## 💡 **Pro Tips**

- **Always test** production builds before distribution
- **Keep build logs** for debugging
- **Use semantic versioning** for releases
- **Automate builds** with CI/CD if possible
- **Monitor app performance** after release

## 🆘 **Need Help?**

- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **Expo Discord:** https://chat.expo.dev/
- **EAS Status:** https://status.expo.dev/

---

**Happy Building! 🎉**
