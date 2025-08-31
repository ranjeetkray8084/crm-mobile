#!/usr/bin/env node

/**
 * Push Notification Test Script
 * Tests the complete push notification flow from backend to device
 */

const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = 'https://backend.leadstracker.in'; // Update this to your backend URL
const TEST_EMAIL = 'admin@example.com'; // Update this to a valid user email
const TEST_PASSWORD = 'admin123'; // Update this to a valid password

console.log('🔔 Push Notification Test Script');
console.log('================================\n');

console.log('📋 Configuration:');
console.log(`   Backend URL: ${BACKEND_URL}`);
console.log(`   Test Email: ${TEST_EMAIL}`);
console.log(`   Test Password: ${TEST_PASSWORD}\n`);

let authToken = null;

/**
 * Step 1: Login to get authentication token
 */
async function login() {
  try {
    console.log('🔐 Step 1: Logging in to get authentication token...');
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (response.data && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login successful! Token received.');
      return true;
    } else {
      console.log('❌ Login failed: No token in response');
      return false;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Step 2: Test push notification endpoint
 */
async function testPushNotification() {
  try {
    console.log('\n🔔 Step 2: Testing push notification endpoint...');
    
    if (!authToken) {
      console.log('❌ No auth token available. Please login first.');
      return false;
    }
    
    // First, get user's push tokens
    const tokensResponse = await axios.get(`${BACKEND_URL}/api/push-notifications/tokens`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('📱 User push tokens:', tokensResponse.data);
    
    if (!tokensResponse.data.tokens || tokensResponse.data.tokens.length === 0) {
      console.log('⚠️ No push tokens found for user. Please register a token first.');
      return false;
    }
    
    // Test sending a push notification
    const testResponse = await axios.post(`${BACKEND_URL}/api/push-notifications/test`, {
      pushToken: tokensResponse.data.tokens[0].pushToken,
      deviceType: 'android' // or 'ios'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Test notification sent successfully!');
    console.log('Response:', testResponse.data);
    return true;
    
  } catch (error) {
    console.error('❌ Push notification test failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Step 3: Test announcement with push notification
 */
async function testAnnouncementWithPush() {
  try {
    console.log('\n📢 Step 3: Testing announcement with push notification...');
    
    if (!authToken) {
      console.log('❌ No auth token available. Please login first.');
      return false;
    }
    
    const announcementResponse = await axios.post(`${BACKEND_URL}/api/announcements`, {
      title: 'Test Announcement',
      message: 'This is a test announcement with push notification!',
      priority: 'HIGH',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      sendPushNotification: true
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Announcement with push notification created successfully!');
    console.log('Response:', announcementResponse.data);
    return true;
    
  } catch (error) {
    console.error('❌ Announcement test failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Step 4: Test direct notification sending
 */
async function testDirectNotification() {
  try {
    console.log('\n📤 Step 4: Testing direct notification sending...');
    
    if (!authToken) {
      console.log('❌ No auth token available. Please login first.');
      return false;
    }
    
    const notificationResponse = await axios.post(`${BACKEND_URL}/api/push-notifications/send`, {
      title: 'Direct Test Notification',
      body: 'This is a direct test notification sent via API!',
      data: {
        type: 'test',
        timestamp: Date.now()
      },
      companyId: 1 // Update this to a valid company ID
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Direct notification sent successfully!');
    console.log('Response:', notificationResponse.data);
    return true;
    
  } catch (error) {
    console.error('❌ Direct notification test failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting push notification tests...\n');
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without authentication. Exiting.');
    return;
  }
  
  // Step 2: Test push notification
  await testPushNotification();
  
  // Step 3: Test announcement with push
  await testAnnouncementWithPush();
  
  // Step 4: Test direct notification
  await testDirectNotification();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Check your device for push notifications');
  console.log('2. Check backend logs for any errors');
  console.log('3. Verify tokens are registered in database');
  console.log('4. Test with different notification types');
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});

console.log('🧪 Testing Push Notification Setup...\n');

// Check if running in Expo Go
try {
  const expoGoCheck = execSync('expo diagnostics', { encoding: 'utf8' });
  console.log('✅ Expo CLI available');
  
  if (expoGoCheck.includes('Expo Go')) {
    console.log('⚠️  Running in Expo Go - Push notifications may have limitations');
  }
} catch (error) {
  console.log('❌ Expo CLI not available or error running diagnostics');
}

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
