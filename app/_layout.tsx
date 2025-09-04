// Import Firebase initialization first
import "../src/core/config/firebase.direct";

import { Stack } from "expo-router";
import FCMHandler from "../src/components/common/FCMHandler";
import { AuthProvider } from "../src/shared/contexts/AuthContext";
import { NotificationProvider } from "../src/shared/contexts/NotificationContext";

export default function RootLayout() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FCMHandler />
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
  );
}