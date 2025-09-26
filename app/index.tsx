// app/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/shared/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, loading, isReady: authReady, user } = useAuth();
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
        if (isAuthenticated && user) {
          console.log('Index: User authenticated, navigating to tabs');
          console.log('Index: User data:', { 
            role: user.role, 
            name: user.name, 
            userId: user.userId || user.id,
            companyId: user.companyId 
          });
          setHasNavigated(true);
          router.replace('/(tabs)');
        } else {
          console.log('Index: User not authenticated, navigating to login');
          setHasNavigated(true);
          router.replace('/login');
        }
      } catch (error) {
        console.error('Index: Navigation error:', error);
        // Fallback to login on error
        setHasNavigated(true);
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, user, router, hasNavigated, isReady, authReady]);

  if (loading || !isReady || !authReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1c69ff" />
        <Text style={styles.loadingText}>Initializing app...</Text>
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
