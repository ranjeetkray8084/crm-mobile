import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Start fade-in effect
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        console.log('Index screen - Authentication check:', { isAuthenticated, loading });
        if (isAuthenticated) {
          // User is authenticated, redirect to main app
          console.log('User is authenticated, redirecting to tabs');
          router.replace('/(tabs)');
        } else {
          // User is not authenticated, redirect to simple login for testing
          console.log('User is not authenticated, redirecting to login');
          router.replace('/auth/login-simple');
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  // Show beautiful loading screen while checking authentication
  return (
    <View style={[styles.container, { opacity: fadeIn ? 1 : 0 }]}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>LEADS TRACKER</Text>
        <Text style={styles.subtitle}>Track Leads, Close Faster</Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1c69ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1c69ff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#1c69ff',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 60,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    fontWeight: '500',
  },
});
