// app/(tabs)/index.tsx - Dashboard Screen (Default Route)
import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Dashboard } from '../../src/components';
import { useAuth } from '../../src/shared/contexts/AuthContext';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';

export default function DashboardScreen() {
  const router = useRouter();
  const auth = useAuth();

  const handleMenuPress = () => {
    // Handle menu button press
    Alert.alert('Menu', 'Menu functionality coming soon');
  };

  const handleNotificationPress = () => {
    // Handle notification button press
    Alert.alert('Notifications', 'Notification functionality coming soon');
  };

  const handleLogoutPress = async () => {
    try {
      if (auth && auth.logout) {
        await auth.logout();
        router.replace('/login');
      } else {
        console.warn('Logout function not available');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
      // Force navigation to login even if logout fails
      router.replace('/login');
    }
  };

  // Render the full Dashboard
  return (
    <TabScreenWrapper>
      <Dashboard
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onLogoutPress={handleLogoutPress}
      />
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1c69ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
