console.log('🧪 Testing Firebase Initialization...\n');

// Test Firebase module imports
try {
  console.log('📦 Testing Firebase module imports...');
  
  // Try to require Firebase modules
  const firebaseApp = require('@react-native-firebase/app');
  console.log('✅ @react-native-firebase/app imported successfully');
  
  const firebaseMessaging = require('@react-native-firebase/messaging');
  console.log('✅ @react-native-firebase/messaging imported successfully');
  
  // Check if Firebase is initialized
  console.log('🔍 Checking Firebase initialization...');
  console.log('Firebase apps count:', firebaseApp.apps.length);
  
  if (firebaseApp.apps.length > 0) {
    console.log('✅ Firebase is already initialized');
    console.log('App name:', firebaseApp.apps[0].name);
  } else {
    console.log('⚠️ Firebase is not initialized yet');
    console.log('This is normal - it will auto-initialize when needed');
  }
  
  // Test messaging module
  console.log('🔍 Testing messaging module...');
  if (typeof firebaseMessaging === 'function') {
    console.log('✅ Messaging module is available as function');
  } else {
    console.log('❌ Messaging module is not available as function');
  }
  
} catch (error) {
  console.log('❌ Error importing Firebase modules:', error.message);
  console.log('This is expected when running in Node.js environment');
  console.log('Firebase modules are designed for React Native runtime');
}

console.log('\n🔍 Firebase Module Test Complete!');
console.log('\n💡 Results:');
console.log('• If you see import errors, that\'s normal in Node.js');
console.log('• Firebase modules only work in React Native runtime');
console.log('• To test Firebase, you need to run the app');
console.log('\n🚀 Next Steps:');
console.log('1. Run "expo start" to start the development server');
console.log('2. Test push notifications in the app');
console.log('3. Check logs for Firebase initialization');
console.log('4. Verify FCM token generation');
