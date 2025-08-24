import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../shared/contexts/AuthContext';
import { AuthService } from '../core/services/auth.service';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('AuthGuard: Checking authentication status...');
        console.log('AuthGuard: useAuth state - user:', !!user, 'isAuthenticated:', isAuthenticated, 'loading:', loading);
        
        // Wait for useAuth to finish initializing
        if (loading) {
          console.log('AuthGuard: Waiting for useAuth to initialize...');
          return;
        }

        // Check if we have stored credentials
        const token = await AuthService.getToken();
        const storedUser = await AuthService.getCurrentUser();

        console.log('AuthGuard: Stored token:', !!token, 'Stored user:', !!storedUser);

        if (token && storedUser) {
          // Since backend doesn't have session check, we'll just use stored credentials
          console.log('AuthGuard: Using stored credentials (no backend session check)');
          console.log('AuthGuard: Allowing user to stay logged in with stored credentials');
          setIsChecking(false);
        } else {
          // No stored credentials, redirect to login
          console.log('AuthGuard: No stored credentials, redirecting to login');
          router.replace('/login');
          return;
        }
      } catch (error) {
        console.error('AuthGuard: Auth check error:', error);
        // On error, redirect to login for safety
        router.replace('/login');
        return;
      } finally {
        setIsChecking(false);
      }
    };

    // Only check auth status when not loading and we have user data
    if (!loading && (user || isAuthenticated)) {
      checkAuthStatus();
    } else if (!loading && !user && !isAuthenticated) {
      // No authentication, redirect to login
      console.log('AuthGuard: No authentication, redirecting to login');
      router.replace('/login');
      setIsChecking(false);
    }
  }, [loading, user, isAuthenticated, router]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c69ff" />
      </View>
    );
  }

  // If not authenticated, don't render children (will redirect to login)
  if (!isAuthenticated || !user) {
    console.log('AuthGuard: Not authenticated, not rendering children');
    return null;
  }

  // User is authenticated, render the protected content
  console.log('AuthGuard: User authenticated, rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
