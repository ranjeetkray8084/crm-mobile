import { Stack } from "expo-router";
import ErrorBoundary from "../src/components/common/ErrorBoundary";
import { AuthProvider } from "../src/shared/contexts/AuthContext";
import { NotificationProvider } from "../src/shared/contexts/NotificationContext";

// Conditionally import Firebase and FCM only in production builds
let FCMHandler = null;
if (process.env.NODE_ENV === 'production') {
  try {
    // Import Firebase initialization first
    require("../src/core/config/firebase.direct");
    FCMHandler = require("../src/components/common/FCMHandler").default;
  } catch (error) {
    console.warn('Firebase/FCM not available:', error.message);
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          {FCMHandler && <FCMHandler />}
          <Stack 
            initialRouteName="login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-lead" />
            <Stack.Screen name="add-property" />
            <Stack.Screen name="add-note" />
            <Stack.Screen name="add-task" />
            <Stack.Screen name="add-user" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}