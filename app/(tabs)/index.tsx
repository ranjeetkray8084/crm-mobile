// app/(tabs)/index.tsx - Dashboard Screen
import React from 'react';
import { Alert } from "react-native";
import { useRouter } from 'expo-router';
import { Dashboard } from '../../src/components';
import { useAuth } from '../../src/shared/contexts/AuthContext';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';

export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();

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
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

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
