const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Push Notification Setup...\n');

// Check Firebase configuration
const googleServicesPath = path.join(__dirname, 'android', 'app', 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  console.log('✅ google-services.json found');
  
  try {
    const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
    console.log(`📱 Firebase Project ID: ${googleServices.project_info.project_id}`);
    console.log(`🔑 Package Name: ${googleServices.client[0].client_info.android_client_info.package_name}`);
  } catch (error) {
    console.log('❌ Error reading google-services.json');
  }
} else {
  console.log('❌ google-services.json not found');
}

// Check app.config.js
const appConfigPath = path.join(__dirname, 'app.config.js');
if (fs.existsSync(appConfigPath)) {
  console.log('✅ app.config.js found');
  
  try {
    const appConfigContent = fs.readFileSync(appConfigPath, 'utf8');
    
    if (appConfigContent.includes('@react-native-firebase/app')) {
      console.log('✅ Firebase app plugin configured');
    } else {
      console.log('❌ Firebase app plugin not configured');
    }
    
    if (appConfigContent.includes('@react-native-firebase/messaging')) {
      console.log('✅ Firebase messaging plugin configured');
    } else {
      console.log('❌ Firebase messaging plugin not configured');
    }
    
    if (appConfigContent.includes('expo-notifications')) {
      console.log('✅ Expo notifications plugin configured');
    } else {
      console.log('❌ Expo notifications plugin not configured');
    }
  } catch (error) {
    console.log('❌ Error reading app.config.js');
  }
} else {
  console.log('❌ app.config.js not found');
}

// Check package.json dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    if (dependencies['@react-native-firebase/app']) {
      console.log(`✅ Firebase app: ${dependencies['@react-native-firebase/app']}`);
    } else {
      console.log('❌ Firebase app not installed');
    }
    
    if (dependencies['@react-native-firebase/messaging']) {
      console.log(`✅ Firebase messaging: ${dependencies['@react-native-firebase/messaging']}`);
    } else {
      console.log('❌ Firebase messaging not installed');
    }
    
    if (dependencies['expo-notifications']) {
      console.log(`✅ Expo notifications: ${dependencies['expo-notifications']}`);
    } else {
      console.log('❌ Expo notifications not installed');
    }
  } catch (error) {
    console.log('❌ Error reading package.json');
  }
} else {
  console.log('❌ package.json not found');
}

console.log('\n🔍 Push Notification Setup Analysis Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Ensure you have a physical device (not emulator)');
console.log('2. Build and install the app using: expo run:android');
console.log('3. Grant notification permissions when prompted');
console.log('4. Test push notifications from your backend');
console.log('5. Check logs for FCM token generation');
console.log('\n🚨 Common Issues & Solutions:');
console.log('• If running in Expo Go: Use "expo run:android" instead');
console.log('• If FCM token not generated: Check Firebase console configuration');
console.log('• If permissions denied: Check device notification settings');
console.log('• If backend not receiving tokens: Verify API endpoint and auth');
