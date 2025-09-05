// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/shared/contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, loading, isReady: authReady } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for both the layout and auth context to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevent multiple navigation attempts and wait for both to be ready
    if (hasNavigated || !isReady || !authReady) return;

    if (!loading) {
      try {
        // Add a small delay to ensure everything is properly initialized
        const navigationTimer = setTimeout(() => {
          if (isAuthenticated) {
            console.log('Index: User authenticated, navigating to tabs');
            setHasNavigated(true);
            router.replace('/(tabs)');
          } else {
            console.log('Index: User not authenticated, navigating to login');
            setHasNavigated(true);
            router.replace('/login');
          }
        }, 200);

        return () => clearTimeout(navigationTimer);
      } catch (error) {
        console.error('Index: Navigation error:', error);
        // Fallback to login on error
        setHasNavigated(true);
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router, hasNavigated, isReady, authReady]);

  if (loading || !isReady || !authReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1c69ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show loading while waiting for navigation
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1c69ff" />
      <Text style={styles.loadingText}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
