import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  const userId = user?.userId || user?.id;
  const companyId = user?.companyId;

  // Use the notifications hook to get unread count and markAllAsRead function
  const { unreadCount, markAllAsRead, markAsRead, loading, error } = useNotifications(userId, companyId);

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
      
      setShowDropdown(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to process notifications');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'information-circle-outline';
      case 'warning':
        return 'warning-outline';
      case 'success':
        return 'checkmark-circle-outline';
      case 'error':
        return 'close-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Use real notifications from the API
  const { notifications: realNotifications } = useNotifications(userId, companyId);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => setShowDropdown(!showDropdown)}
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

      {showDropdown && (
        <View style={styles.dropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Notifications</Text>
            <TouchableOpacity
              style={styles.markAllReadButton}
              onPress={handleNotificationClick}
            >
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {realNotifications && realNotifications.length > 0 ? (
              realNotifications.map((notification: any) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.isRead && styles.unreadNotification
                  ]}
                  onPress={async () => {
                    // Mark notification as read when tapped
                    try {
                      if (!notification.isRead) {
                        const result = await markAsRead(notification.id);
                        if (!result.success) {
                          Alert.alert('Error', 'Failed to mark notification as read');
                        }
                      }
                    } catch (error) {
                      Alert.alert('Error', 'Failed to mark notification as read');
                    }
                    setShowDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons
                      name={getNotificationIcon(notification.type || 'info') as any}
                      size={20}
                      color={getNotificationColor(notification.type || 'info')}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </Text>
                  </View>
                  {!notification.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No notifications</Text>
                <Text style={styles.emptyStateSubtext}>You're all caught up!</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleNotificationClick}
          >
            <Text style={styles.viewAllText}>View All Notifications</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: 320,
    maxHeight: 400,
    marginTop: 8,
    zIndex: 1000,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  markAllReadButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllReadText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'flex-start',
  },
  unreadNotification: {
    backgroundColor: '#f8fafc',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },

  notificationMessage: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
    marginTop: 8,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
});

