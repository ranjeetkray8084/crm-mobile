// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/shared/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1c69ff" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
