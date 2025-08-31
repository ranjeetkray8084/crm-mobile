# 🚀 Production APK - Quick Reference

## ⚡ **One-Command Build**
```bash
npm run build:production
```

## 🔥 **Manual Build Commands**

### **Production APK (Recommended)**
```bash
npm run build:android
```

### **Preview APK (Testing)**
```bash
npm run build:android-preview
```

### **Direct EAS Commands**
```bash
# Production
eas build --platform android --profile production

# Preview
eas build --platform android --profile preview
```

## 📱 **What You Get**

- ✅ **Production APK** - Ready for distribution
- ✅ **Optimized performance** - Best user experience
- ✅ **Smaller file size** - Faster downloads
- ✅ **Production notifications** - Full functionality
- ✅ **Release-ready code** - No development tools

## ⏱️ **Build Time**
- **Typical**: 10-20 minutes
- **Fast**: 5-10 minutes (if cached)
- **Slow**: 20-30 minutes (first build)

## 📋 **Before Building**

1. **Login to Expo:**
   ```bash
   eas login
   ```

2. **Clear cache:**
   ```bash
   npm run clear-cache
   ```

3. **Check dependencies:**
   ```bash
   npm install
   ```

## 🎯 **After Build**

1. **Download APK** from provided link
2. **Test on device** before distribution
3. **Share with testers** for feedback
4. **Deploy to production** when ready

## 🆘 **Troubleshooting**

### **Build Fails**
```bash
npm run clear-cache
npm run build:android
```

### **Not Logged In**
```bash
eas login
```

### **No EAS Credits**
- Check your Expo account
- Purchase EAS credits if needed

## 📚 **Full Documentation**
See `PRODUCTION_BUILD_GUIDE.md` for complete details.

---

**🚀 Ready to build your production APK!**
