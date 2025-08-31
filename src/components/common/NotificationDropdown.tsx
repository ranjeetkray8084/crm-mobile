import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../core/hooks/useNotifications';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface NotificationDropdownProps {
  onSectionChange?: (section: string) => void;
}

export default function NotificationDropdown({ onSectionChange }: NotificationDropdownProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const userId = user?.userId || user?.id;
  const companyId = user?.companyId;

  // Use the notifications hook to get unread count and markAllAsRead function
  const { unreadCount, markAllAsRead, loading, error } = useNotifications(userId, companyId);

  const handleNotificationClick = async () => {
    try {
      // Mark all notifications as read when bell icon is clicked
      if (unreadCount > 0) {
        const result = await markAllAsRead();
        if (!result.success) {
          Alert.alert('Error', 'Failed to mark notifications as read');
        }
      }
      
      // Show notifications content in main area
      if (onSectionChange) {
        onSectionChange('notifications');
      } else {
        // Fallback navigation
        router.push('/(tabs)/notifications');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process notifications');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={handleNotificationClick}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Ionicons name="notifications-outline" size={24} color="#1c69ff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  notificationButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    marginRight: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

