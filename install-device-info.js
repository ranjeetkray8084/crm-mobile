#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing react-native-device-info for multi-device support...');

try {
  // Install the package
  console.log('📦 Installing react-native-device-info...');
  execSync('npm install react-native-device-info@^13.0.0', { stdio: 'inherit' });
  
  // For iOS, we need to run pod install
  const iosDir = path.join(__dirname, 'ios');
  if (fs.existsSync(iosDir)) {
    console.log('🍎 Running pod install for iOS...');
    try {
      execSync('cd ios && pod install', { stdio: 'inherit' });
      console.log('✅ iOS pods installed successfully');
    } catch (iosError) {
      console.log('⚠️ iOS pod install failed, you may need to run it manually:');
      console.log('   cd ios && pod install');
    }
  }
  
  console.log('✅ react-native-device-info installed successfully!');
  console.log('');
  console.log('📱 Multi-device push notification support is now available.');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Rebuild your app: npx expo run:android or npx expo run:ios');
  console.log('2. Test the multi-device functionality using MultiDeviceTestComponent');
  console.log('3. Each device will now have a unique device ID for push notifications');
  console.log('');
  console.log('🔍 Features added:');
  console.log('- Unique device identification');
  console.log('- Device-specific logout (logout from one device only)');
  console.log('- Multi-device push notification support');
  console.log('- Backend integration with device ID tracking');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  console.log('');
  console.log('🔧 Manual installation steps:');
  console.log('1. npm install react-native-device-info@^13.0.0');
  console.log('2. cd ios && pod install (for iOS)');
  console.log('3. Rebuild your app');
}