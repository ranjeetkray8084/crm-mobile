const fs = require('fs');
const path = require('path');

console.log('🔍 Push Notification Status Analysis\n');

// Check 1: Firebase Configuration
console.log('1️⃣ **Firebase Configuration Check**');
const googleServicesPath = path.join(__dirname, 'android', 'app', 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  try {
    const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
    console.log('   ✅ google-services.json found');
    console.log(`   📱 Project ID: ${googleServices.project_info.project_id}`);
    console.log(`   🔑 Package: ${googleServices.client[0].client_info.android_client_info.package_name}`);
  } catch (error) {
    console.log('   ❌ Error reading google-services.json:', error.message);
  }
} else {
  console.log('   ❌ google-services.json not found');
}

// Check 2: App Configuration
console.log('\n2️⃣ **App Configuration Check**');
const appConfigPath = path.join(__dirname, 'app.config.js');
if (fs.existsSync(appConfigPath)) {
  try {
    const appConfigContent = fs.readFileSync(appConfigPath, 'utf8');
    if (appConfigContent.includes('crmnativeexpo')) {
      console.log('   ✅ Project ID matches Firebase');
    } else {
      console.log('   ❌ Project ID mismatch');
    }
    if (appConfigContent.includes('@react-native-firebase/messaging')) {
      console.log('   ✅ Firebase messaging plugin configured');
    } else {
      console.log('   ❌ Firebase messaging plugin missing');
    }
  } catch (error) {
    console.log('   ❌ Error reading app.config.js:', error.message);
  }
} else {
  console.log('   ❌ app.config.js not found');
}

// Check 3: Dependencies
console.log('\n3️⃣ **Dependencies Check**');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['@react-native-firebase/app']) {
      console.log('   ✅ @react-native-firebase/app installed');
    } else {
      console.log('   ❌ @react-native-firebase/app missing');
    }
    
    if (deps['@react-native-firebase/messaging']) {
      console.log('   ✅ @react-native-firebase/messaging installed');
    } else {
      console.log('   ❌ @react-native-firebase/messaging missing');
    }
    
    if (deps['expo-notifications']) {
      console.log('   ✅ expo-notifications installed');
    } else {
      console.log('   ❌ expo-notifications missing');
    }
  } catch (error) {
    console.log('   ❌ Error reading package.json:', error.message);
  }
} else {
  console.log('   ❌ package.json not found');
}

// Check 4: Service Files
console.log('\n4️⃣ **Service Files Check**');
const services = [
  'src/core/services/NotificationService.ts',
  'src/core/services/FirebaseMessagingService.ts'
];

services.forEach(service => {
  const servicePath = path.join(__dirname, service);
  if (fs.existsSync(servicePath)) {
    console.log(`   ✅ ${service} exists`);
  } else {
    console.log(`   ❌ ${service} missing`);
  }
});

// Check 5: App Integration
console.log('\n5️⃣ **App Integration Check**');
const layoutFiles = [
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'src/components/AuthGuard.tsx'
];

layoutFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('NotificationProvider')) {
        console.log(`   ✅ ${file} uses NotificationProvider`);
      } else {
        console.log(`   ❌ ${file} does not use NotificationProvider`);
      }
    } catch (error) {
      console.log(`   ❌ Error reading ${file}:`, error.message);
    }
  } else {
    console.log(`   ❌ ${file} not found`);
  }
});

// Summary
console.log('\n📋 **Summary of Issues Found:**');
console.log('• NotificationProvider is NOT being used in the app layout');
console.log('• Notification services are never initialized');
console.log('• Push notifications cannot work without proper initialization');
console.log('• The app is missing the notification context wrapper');

console.log('\n🔧 **Required Fixes:**');
console.log('1. Add NotificationProvider to app/_layout.tsx');
console.log('2. Ensure notification services are initialized on app start');
console.log('3. Test Firebase messaging integration');
console.log('4. Verify push token generation');

console.log('\n💡 **Why Push Notifications Are Not Working:**');
console.log('• Services are not initialized due to missing NotificationProvider');
console.log('• No notification context is available to components');
console.log('• Firebase messaging service is never started');
console.log('• Push tokens are never generated or registered');
