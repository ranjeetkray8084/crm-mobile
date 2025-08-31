#!/usr/bin/env node

/**
 * Notification Test Script
 * Run this script to test your notification setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔔 Notification Setup Verification Script');
console.log('=====================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');
const appConfigPath = path.join(currentDir, 'app.config.js');

console.log('📁 Current directory:', currentDir);

// Check package.json
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasExpoNotifications = packageJson.dependencies && packageJson.dependencies['expo-notifications'];
    
    if (hasExpoNotifications) {
      console.log('✅ expo-notifications dependency found');
      console.log(`   Version: ${hasExpoNotifications}`);
    } else {
      console.log('❌ expo-notifications dependency NOT found');
      console.log('   Run: npm install expo-notifications');
    }
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
  }
} else {
  console.log('❌ package.json not found');
}

// Check app.config.js
if (fs.existsSync(appConfigPath)) {
  console.log('✅ app.config.js found');
  
  try {
    const appConfigContent = fs.readFileSync(appConfigPath, 'utf8');
    
    // Check for project ID
    const projectIdMatch = appConfigContent.match(/projectId:\s*["']([^"']+)["']/);
    if (projectIdMatch) {
      console.log('✅ Project ID found:', projectIdMatch[1]);
    } else {
      console.log('❌ Project ID not found in app.config.js');
    }
    
    // Check for expo-notifications plugin
    if (appConfigContent.includes('expo-notifications')) {
      console.log('✅ expo-notifications plugin configured');
    } else {
      console.log('❌ expo-notifications plugin NOT configured');
    }
    
    // Check for Android permissions
    if (appConfigContent.includes('POST_NOTIFICATIONS')) {
      console.log('✅ Android notification permissions configured');
    } else {
      console.log('❌ Android notification permissions NOT configured');
    }
    
    // Check for iOS background modes
    if (appConfigContent.includes('remote-notification')) {
      console.log('✅ iOS background modes configured');
    } else {
      console.log('❌ iOS background modes NOT configured');
    }
    
  } catch (error) {
    console.log('❌ Error reading app.config.js:', error.message);
  }
} else {
  console.log('❌ app.config.js not found');
}

// Check for notification service files
const notificationServicePath = path.join(currentDir, 'src', 'core', 'services', 'NotificationService.ts');
const backgroundServicePath = path.join(currentDir, 'src', 'core', 'services', 'BackgroundNotificationService.ts');

if (fs.existsSync(notificationServicePath)) {
  console.log('✅ NotificationService.ts found');
} else {
  console.log('❌ NotificationService.ts not found');
}

if (fs.existsSync(backgroundServicePath)) {
  console.log('✅ BackgroundNotificationService.ts found');
} else {
  console.log('❌ BackgroundNotificationService.ts not found');
}

// Check for notification context
const notificationContextPath = path.join(currentDir, 'src', 'shared', 'contexts', 'NotificationContext.tsx');
if (fs.existsSync(notificationContextPath)) {
  console.log('✅ NotificationContext.tsx found');
} else {
  console.log('❌ NotificationContext.tsx not found');
}

// Check for test component
const testComponentPath = path.join(currentDir, 'src', 'components', 'notes', 'NotificationTest.tsx');
if (fs.existsSync(testComponentPath)) {
  console.log('✅ NotificationTest.tsx found');
} else {
  console.log('❌ NotificationTest.tsx not found');
}

console.log('\n🔍 Verification Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Ensure you have a physical device (not simulator)');
console.log('2. Build and install the app on your device');
console.log('3. Open the app and navigate to the notification test component');
console.log('4. Run the notification tests');
console.log('5. Check console logs for any errors');
console.log('\n📚 For detailed troubleshooting, see: PUSH_NOTIFICATIONS_TROUBLESHOOTING.md');

// Check for common issues
console.log('\n🚨 Common Issues to Check:');
console.log('- Are you testing on a physical device? (Required)');
console.log('- Does your device have internet connection?');
console.log('- Are notification permissions granted?');
console.log('- Is the app in Do Not Disturb mode?');
console.log('- Does your project ID match Expo dashboard?');
console.log('- Are you using a development/production build (not Expo Go)?');

console.log('\n✨ If everything looks good above, try running the notification tests in your app!');
