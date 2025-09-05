// Firebase Initialization - Safe version
let firebaseInitialized = false;
let firebaseError = null;
let firebaseApp = null;

const initializeFirebase = async () => {
  try {
    // Check if we're in a development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Firebase initialization skipped in development mode');
      return false;
    }

    // Dynamically import Firebase to avoid early initialization issues
    const firebase = await import('@react-native-firebase/app');
    const messaging = await import('@react-native-firebase/messaging');
    
    firebaseApp = firebase.default.app();
    
    if (!firebaseApp || !firebaseApp.options) {
      throw new Error('Firebase app not properly configured');
    }
    
    const apiKey = firebaseApp.options.apiKey;
    if (!apiKey || apiKey.includes('DummyKey') || apiKey.includes('123456789')) {
      throw new Error('Invalid Firebase API key');
    }
    
    // Set up background message handler
    messaging.default().setBackgroundMessageHandler(async remoteMessage => {
      // Handle background messages
    });
    
    firebaseInitialized = true;
    return true;
    
  } catch (error) {
    firebaseError = error.message;
    console.warn('Firebase initialization failed:', error.message);
    return false;
  }
};

// Initialize Firebase asynchronously
initializeFirebase();

export { firebaseApp, firebaseError, firebaseInitialized };
export default firebaseInitialized;
