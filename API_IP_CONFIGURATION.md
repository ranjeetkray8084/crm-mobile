# 🌐 API IP Configuration Guide

## Overview
This guide explains how to configure the API base URL in your CRMNativeExpo app to connect to your local backend server.

## 🚀 Quick Setup

### 1. Find Your Computer's IP Address

#### **Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

#### **Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

#### **Auto-detect (Recommended):**
```bash
node change-api-ip.js auto
```

### 2. Update API IP Address

#### **Manual Update:**
```bash
node change-api-ip.js backend.leadstracker.in
```

#### **Common IP Addresses:**
- **Home Network**: `backend.leadstracker.in` or `192.168.0.100`
- **Office Network**: `10.0.0.100`
- **Mobile Hotspot**: `172.20.10.100`

## 📁 Configuration Files

### **app.config.js**
```javascript
extra: {
  apiBaseUrl: process.env.API_BASE_URL || 'https://backend.leadstracker.in',
  // ... other config
}
```

### **src/core/config/api.config.js**
```javascript
export const API_CONFIG = {
  DEVELOPMENT: {
    baseURL: 'https://backend.leadstracker.in', // Change this IP
    // ... other settings
  }
};
```

## 🔧 How to Change IP Address

### **Option 1: Use the Utility Script (Recommended)**
```bash
# Navigate to CRMNativeExpo directory
cd CRMNativeExpo

# Auto-detect and set IP
node change-api-ip.js auto

# Or manually set IP
node change-api-ip.js backend.leadstracker.in
```

### **Option 2: Manual Edit**
1. Open `app.config.js`
2. Find `apiBaseUrl` line
3. Change IP address to your computer's IP
4. Save the file

### **Option 3: Environment Variable**
```bash
export API_BASE_URL=https://backend.leadstracker.in
```

## 🌍 Network Requirements

### **Same Network**
- Your phone and computer must be on the same WiFi network
- Both devices should be connected to the same router

### **Port 8082**
- Your backend server must be running on port 8082
- Make sure no firewall is blocking the connection

### **Network Access**
- Some networks (public WiFi, corporate) may block device-to-device communication
- Use home/private networks for development

## 🧪 Testing Connection

### **1. Check Backend Status**
Make sure your Spring Boot backend is running:
```bash
# Check if port 8082 is listening
netstat -an | grep 8082
```

### **2. Test from Phone**
- Open the app on your phone
- Try to login or make any API call
- Check console logs for connection status

### **3. Check Logs**
Look for these log messages:
```
✅ Using API base URL from expo config: https://backend.leadstracker.in
🔗 Making request to: https://backend.leadstracker.in/api/auth/login
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Connection Refused**
```
❌ Network Error: connect ECONNREFUSED backend.leadstracker.in:8082
```
**Solution**: Check if backend is running on port 8082

#### **2. Timeout Error**
```
❌ Request timeout after 30000ms
```
**Solution**: Check firewall settings and network connectivity

#### **3. Wrong IP Address**
```
❌ Could not connect to server
```
**Solution**: Verify IP address with `ipconfig` or `ifconfig`

### **Debug Steps**

1. **Verify Backend Status**
   ```bash
   curl https://backend.leadstracker.in/actuator/health
   ```

2. **Check Network Connectivity**
   ```bash
   ping backend.leadstracker.in
   ```

3. **Test Port Access**
   ```bash
   telnet backend.leadstracker.in 8082
   ```

4. **Restart Expo Server**
   ```bash
   npx expo start --clear
   ```

## 🔄 Switching Between Environments

### **Development (Local)**
```bash
node change-api-ip.js backend.leadstracker.in
```

### **Production**
```bash
node change-api-ip.js production
# This will use: https://backend.leadstracker.in
```

### **Different Networks**
```bash
# Home network
node change-api-ip.js backend.leadstracker.in

# Office network  
node change-api-ip.js 10.0.0.50

# Mobile hotspot
node change-api-ip.js 172.20.10.100
```

## 📱 Mobile App Testing

### **After Changing IP:**
1. **Restart Expo Server**
   ```bash
   npx expo start --clear
   ```

2. **Reload App on Phone**
   - Shake device to open developer menu
   - Tap "Reload" or restart Expo Go

3. **Test API Calls**
   - Try to login
   - Check if data loads
   - Monitor console logs

## 🔒 Security Notes

### **Development Only**
- HTTP connections are only for local development
- Never use HTTP in production
- Always use HTTPS for production APIs

### **Network Security**
- Local network should be private/secure
- Avoid using public WiFi for development
- Consider VPN if on corporate network

## 📚 Additional Resources

- [Expo Network Configuration](https://docs.expo.dev/guides/network-requests/)
- [React Native Network Security](https://reactnative.dev/docs/network-security)
- [Spring Boot Port Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties.environment-variables)

## 🤝 Support

If you encounter issues:

1. **Check Network**: Ensure both devices are on same network
2. **Verify IP**: Use `ipconfig` or `ifconfig` to confirm IP
3. **Test Backend**: Verify backend is running on port 8082
4. **Check Logs**: Look for error messages in console
5. **Restart Services**: Restart both backend and Expo server

---

**Remember**: Always restart your Expo development server after changing the API IP address!
