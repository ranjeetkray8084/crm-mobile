// Test Firebase in React Native app
// Run this in your app console

console.log('🧪 Testing Firebase in React Native app...');

// Test 1: Check if FirebaseMessagingService is available
if (typeof FirebaseMessagingService !== 'undefined') {
  console.log('✅ FirebaseMessagingService is available');
  
  // Test 2: Test Firebase modules
  const moduleTest = FirebaseMessagingService.testFirebaseModules();
  console.log('📦 Module test result:', moduleTest);
  
  // Test 3: Get service instance
  const firebaseService = FirebaseMessagingService.getInstance();
  console.log('🔧 Firebase service instance:', firebaseService);
  
  // Test 4: Check debug status
  const debugStatus = firebaseService.getDebugStatus();
  console.log('🔍 Debug status:', debugStatus);
  
  // Test 5: Force re-initialization
  console.log('🔄 Forcing re-initialization...');
  firebaseService.forceReinitialize().then(() => {
    console.log('✅ Re-initialization complete');
    const newStatus = firebaseService.getDebugStatus();
    console.log('🔍 New debug status:', newStatus);
    
    // Test 6: Try to get FCM token
    firebaseService.getFCMTokenAsync().then((token) => {
      if (token) {
        console.log('🎉 FCM Token:', token.substring(0, 20) + '...');
      } else {
        console.log('❌ No FCM token available');
      }
    });
  });
  
} else {
  console.log('❌ FirebaseMessagingService not available');
  console.log('🔍 Check if the service is properly imported');
}

console.log('🧪 Firebase test completed');
