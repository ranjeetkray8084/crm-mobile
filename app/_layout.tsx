import { Stack } from "expo-router";
import { AuthProvider } from "../src/shared/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AuthService } from "../src/core/services/auth.service";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        console.log('RootLayout: Checking initial authentication...');
        const token = await AuthService.getToken();
        const user = await AuthService.getCurrentUser();
        
        console.log('RootLayout: Token found:', !!token);
        console.log('RootLayout: User found:', !!user);
        
        if (token && user) {
          // User has valid stored credentials, start at tabs
          console.log('RootLayout: User authenticated, starting at tabs');
          setInitialRoute('(tabs)');
        } else {
          // No stored credentials, start at login
          console.log('RootLayout: No stored credentials, starting at login');
          setInitialRoute('login');
        }
      } catch (error) {
        console.error('RootLayout: Initial auth check failed:', error);
        setInitialRoute('login');
      } finally {
        setIsInitializing(false);
      }
    };

    checkInitialAuth();
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c69ff" />
      </View>
    );
  }

  console.log('RootLayout: Rendering with initial route:', initialRoute);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack initialRouteName={initialRoute || 'login'}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
