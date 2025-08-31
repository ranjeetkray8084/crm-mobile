console.log('🧪 Testing Notification Service Debug...\n');

// Test the current notification service status
try {
  console.log('📦 Testing NotificationService import...');
  
  // This will only work in React Native runtime, not in Node.js
  console.log('⚠️ Note: This test is designed for React Native runtime');
  console.log('📱 To test properly, run this in your app and check the logs');
  
  console.log('\n🔍 Expected Logs When Testing:');
  console.log('1. 🔔 NotificationService: initialize() called');
  console.log('2. 🔥 Initializing Firebase messaging service...');
  console.log('3. 🔥 FirebaseMessagingService: initialize() called');
  console.log('4. 🔥 FirebaseMessagingService: Requesting permission...');
  console.log('5. 🔥 FirebaseMessagingService: Permission status: [status]');
  console.log('6. 🔥 FirebaseMessagingService: Getting FCM token...');
  console.log('7. ✅ FCM token generated: [token]...');
  console.log('8. ✅ FirebaseMessagingService initialized successfully');
  console.log('9. ✅ NotificationService: Firebase initialization successful');
  
  console.log('\n🚀 To Test in Your App:');
  console.log('1. Open your app (Expo Go or physical device)');
  console.log('2. Check the logs for Firebase initialization');
  console.log('3. Use the test button to trigger push notifications');
  console.log('4. Look for FCM token generation');
  
  console.log('\n🔧 If Still Not Working:');
  console.log('1. Check if Firebase modules are properly imported');
  console.log('2. Verify google-services.json is in the right location');
  console.log('3. Ensure you have notification permissions');
  console.log('4. Try on a physical device instead of simulator');
  
} catch (error) {
  console.log('❌ Error:', error.message);
  console.log('This is expected when running in Node.js environment');
}

console.log('\n🔍 Debug Test Complete!');
