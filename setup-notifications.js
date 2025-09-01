#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔔 Push Notifications Setup Script');
console.log('=====================================\n');

// Check if google-services.json exists
const googleServicesPath = path.join(__dirname, 'android', 'app', 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  console.log('✅ google-services.json found');
  
  try {
    const config = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
    const projectId = config.project_info?.project_id;
    const projectNumber = config.project_info?.project_number;
    
    if (projectId && projectNumber && projectNumber !== '123456789012') {
      console.log(`✅ Firebase project configured: ${projectId}`);
      console.log(`✅ Project number: ${projectNumber}`);
    } else {
      console.log('⚠️  Firebase configuration needs to be updated with real values');
      console.log('   Please replace placeholder values in google-services.json');
    }
  } catch (error) {
    console.log('❌ Error reading google-services.json:', error.message);
  }
} else {
  console.log('❌ google-services.json not found');
  console.log('   Please create it in android/app/google-services.json');
}

// Check app.config.js
const appConfigPath = path.join(__dirname, 'app.config.js');
if (fs.existsSync(appConfigPath)) {
  console.log('\n✅ app.config.js found');
  
  try {
    const configContent = fs.readFileSync(appConfigPath, 'utf8');
    
    // Check for expo-notifications plugin
    if (configContent.includes('expo-notifications')) {
      console.log('✅ expo-notifications plugin configured');
    } else {
      console.log('❌ expo-notifications plugin missing');
    }
    
    // Check for Firebase plugins
    if (configContent.includes('@react-native-firebase/app')) {
      console.log('✅ Firebase app plugin configured');
    } else {
      console.log('❌ Firebase app plugin missing');
    }
    
    if (configContent.includes('@react-native-firebase/messaging')) {
      console.log('✅ Firebase messaging plugin configured');
    } else {
      console.log('❌ Firebase messaging plugin missing');
    }
    
    // Check project ID
    const projectIdMatch = configContent.match(/projectId:\s*["']([^"']+)["']/);
    if (projectIdMatch) {
      console.log(`✅ Project ID found: ${projectIdMatch[1]}`);
    } else {
      console.log('❌ Project ID not found in configuration');
    }
    
  } catch (error) {
    console.log('❌ Error reading app.config.js:', error.message);
  }
} else {
  console.log('\n❌ app.config.js not found');
}

// Check package.json dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('\n✅ package.json found');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    if (dependencies['expo-notifications']) {
      console.log('✅ expo-notifications installed');
    } else {
      console.log('❌ expo-notifications not installed');
    }
    
    if (dependencies['@react-native-firebase/app']) {
      console.log('✅ @react-native-firebase/app installed');
    } else {
      console.log('❌ @react-native-firebase/app not installed');
    }
    
    if (dependencies['@react-native-firebase/messaging']) {
      console.log('✅ @react-native-firebase/messaging installed');
    } else {
      console.log('❌ @react-native-firebase/messaging not installed');
    }
    
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
  }
} else {
  console.log('\n❌ package.json not found');
}

// Check notification service files
const notificationServicePath = path.join(__dirname, 'src', 'core', 'services', 'NotificationService.ts');
if (fs.existsSync(notificationServicePath)) {
  console.log('\n✅ NotificationService.ts found');
} else {
  console.log('\n❌ NotificationService.ts not found');
}

const tokenServicePath = path.join(__dirname, 'src', 'core', 'services', 'TokenRegistrationService.ts');
if (fs.existsSync(tokenServicePath)) {
  console.log('✅ TokenRegistrationService.ts found');
} else {
  console.log('❌ TokenRegistrationService.ts not found');
}

const notificationContextPath = path.join(__dirname, 'src', 'shared', 'contexts', 'NotificationContext.tsx');
if (fs.existsSync(notificationContextPath)) {
  console.log('✅ NotificationContext.tsx found');
} else {
  console.log('❌ NotificationContext.tsx not found');
}

console.log('\n📋 Next Steps:');
console.log('1. Update google-services.json with your Firebase project details');
console.log('2. Build the app: npx expo run:android');
console.log('3. Test notifications on a physical device');
console.log('4. Navigate to /notification-test in the app to test functionality');
console.log('\n📚 For detailed instructions, see PUSH_NOTIFICATIONS_SETUP.md');
