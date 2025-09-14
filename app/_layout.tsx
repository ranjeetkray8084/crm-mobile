import { Stack } from "expo-router";
import { AuthProvider } from "../src/shared/contexts/AuthContext";
import { NotificationProvider } from "../src/shared/contexts/NotificationContext";
import NotificationHandler from "../src/components/common/NotificationHandler";
import { useEffect } from "react";

export default function RootLayout() {
  console.log('🔔 DEBUG: RootLayout: Rendering...');

  // Firebase initialization removed (simple push implementation)

  return (
    <NotificationProvider>
      <AuthProvider>
        <NotificationHandler />
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
          {/* Test screens removed */}
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </NotificationProvider>
  );
}


