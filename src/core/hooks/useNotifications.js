// useNotifications Hook - For regular in-app notifications
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../shared/contexts/AuthContext';
import { NotificationService } from '../services/notification.service';

export const useNotifications = (userId, companyId) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use provided userId/companyId or fallback to current user
  const effectiveUserId = userId || user?.userId || user?.id;
  const effectiveCompanyId = companyId || user?.companyId;

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!effectiveUserId || !effectiveCompanyId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await NotificationService.getNotificationsByUserAndCompany(
        effectiveUserId, 
        effectiveCompanyId
      );

      if (result.success) {
        setNotifications(result.data || []);
        setUnreadCount(result.data?.filter(n => !n.isRead).length || 0);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, effectiveCompanyId]);

  // Load unread count only
  const loadUnreadCount = useCallback(async () => {
    if (!effectiveUserId || !effectiveCompanyId) return;

    try {
      const result = await NotificationService.getUnreadCountByUserAndCompany(
        effectiveUserId, 
        effectiveCompanyId
      );

      if (result.success) {
        setUnreadCount(result.data || 0);
      }
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  }, [effectiveUserId, effectiveCompanyId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!effectiveUserId || !effectiveCompanyId) return { success: false };

    try {
      const result = await NotificationService.markAsRead(
        notificationId, 
        effectiveUserId, 
        effectiveCompanyId
      );

      if (result.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [effectiveUserId, effectiveCompanyId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!effectiveUserId || !effectiveCompanyId) return { success: false };

    try {
      const result = await NotificationService.markAllAsRead(
        effectiveUserId, 
        effectiveCompanyId
      );

      if (result.success) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }

      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [effectiveUserId, effectiveCompanyId]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Load notifications on mount and when dependencies change
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Set up periodic refresh for unread count
  useEffect(() => {
    if (!effectiveUserId || !effectiveCompanyId) return;

    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadUnreadCount, effectiveUserId, effectiveCompanyId]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    loadNotifications,
    loadUnreadCount
  };
};
