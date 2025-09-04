// Firebase Initialization
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

let firebaseInitialized = false;
let firebaseError = null;
let firebaseApp = null;

const initializeFirebase = () => {
  try {
    firebaseApp = firebase.app();
    
    if (!firebaseApp || !firebaseApp.options) {
      throw new Error('Firebase app not properly configured');
    }
    
    const apiKey = firebaseApp.options.apiKey;
    if (!apiKey || apiKey.includes('DummyKey') || apiKey.includes('123456789')) {
      throw new Error('Invalid Firebase API key');
    }
    
    // Set up background message handler
    const messaging = require('@react-native-firebase/messaging').default;
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // Handle background messages
    });
    
    firebaseInitialized = true;
    return true;
    
  } catch (error) {
    firebaseError = error.message;
    return false;
  }
};

initializeFirebase();

export { firebaseApp, firebaseError, firebaseInitialized };
export default firebaseInitialized;
