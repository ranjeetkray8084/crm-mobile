import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../core/hooks/useNotifications';
import { useAuth } from '../../shared/contexts/AuthContext';

interface NotificationsSectionProps {
  onSectionChange?: (section: string) => void;
}

export default function NotificationsSection({ onSectionChange }: NotificationsSectionProps) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  const userId = user?.userId || user?.id;
  const companyId = user?.companyId;

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications(userId, companyId);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshNotifications();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const result = await markAsRead(notificationId);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAsRead();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load notifications</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshNotifications}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => handleMarkAsRead(notification.id)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationIcon}>
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={24}
                  color={getNotificationColor(notification.type)}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {formatDate(notification.createdAt)}
                </Text>
              </View>
              {!notification.isRead && (
                <View style={styles.unreadIndicator} />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
  },
  backButtonText: {
    fontSize: 14,
    color: '#1c69ff',
    fontWeight: '500',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1c69ff',
    borderRadius: 8,
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#1c69ff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1c69ff',
  },
  notificationIcon: {
    marginRight: 18,
    marginTop: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  notificationTime: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1c69ff',
    marginLeft: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#1c69ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#374151',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1c69ff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
