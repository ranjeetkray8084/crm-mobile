// Test Firebase module loading and FCM token generation
console.log('🧪 Testing Firebase modules...');

try {
  // Test 1: Check if modules can be imported
  console.log('📦 Testing module imports...');
  
  const firebaseApp = require('@react-native-firebase/app');
  console.log('✅ @react-native-firebase/app imported successfully');
  console.log('📱 Firebase apps:', firebaseApp.apps);
  
  const firebaseMessaging = require('@react-native-firebase/messaging');
  console.log('✅ @react-native-firebase/messaging imported successfully');
  
  // Test 2: Check if Firebase is initialized
  if (firebaseApp.apps.length > 0) {
    console.log('✅ Firebase is initialized');
    console.log('🔑 App name:', firebaseApp.apps[0].name);
  } else {
    console.log('⚠️ Firebase not initialized, attempting to initialize...');
    // Firebase should auto-initialize with google-services.json
  }
  
  // Test 3: Try to get FCM token
  console.log('🔥 Attempting to get FCM token...');
  
  // Request permission first
  firebaseMessaging()
    .requestPermission()
    .then((authStatus) => {
      console.log('🔐 Permission status:', authStatus);
      
      if (authStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === firebaseMessaging.AuthorizationStatus.PROVISIONAL) {
        
        console.log('✅ Permission granted, getting token...');
        
        // Get FCM token
        return firebaseMessaging().getToken();
      } else {
        console.log('❌ Permission denied');
        return null;
      }
    })
    .then((token) => {
      if (token) {
        console.log('🎉 FCM Token generated successfully!');
        console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
        console.log('📏 Token length:', token.length);
      } else {
        console.log('❌ No FCM token generated');
      }
    })
    .catch((error) => {
      console.log('❌ Error getting FCM token:', error);
      console.log('🔍 Error details:', JSON.stringify(error, null, 2));
    });
    
} catch (error) {
  console.log('❌ Failed to import Firebase modules:', error);
  console.log('🔍 Error details:', JSON.stringify(error, null, 2));
}

console.log('🧪 Firebase test completed');
