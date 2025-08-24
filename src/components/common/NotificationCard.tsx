import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  message: string;
  type?: string;
  createdAt: string;
  isRead?: boolean;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onPress?: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onPress
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getNotificationType = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('follow-up') || lowerMessage.includes('followup')) {
      return 'follow-up';
    } else if (lowerMessage.includes('lead') || lowerMessage.includes('property')) {
      return 'business';
    } else if (lowerMessage.includes('user') || lowerMessage.includes('admin')) {
      return 'user';
    } else if (lowerMessage.includes('task') || lowerMessage.includes('assignment')) {
      return 'task';
    }
    return 'general';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'follow-up':
        return '#10b981';
      case 'business':
        return '#3b82f6';
      case 'user':
        return '#8b5cf6';
      case 'task':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow-up':
        return 'calendar';
      case 'business':
        return 'business';
      case 'user':
        return 'people';
      case 'task':
        return 'checkmark-circle';
      default:
        return 'notifications';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const notificationType = getNotificationType(notification.message);
  const typeColor = getTypeColor(notificationType);
  const priorityColor = getPriorityColor(notification.priority);

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
        notification.priority === 'high' && styles.highPriorityContainer
      ]}
      onPress={() => onPress?.(notification)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Ionicons name={getTypeIcon(notificationType) as any} size={14} color="#fff" />
            <Text style={styles.typeText}>
              {notificationType.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
          
          {notification.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
              <Text style={styles.priorityText}>
                {notification.priority.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.timestamp}>{formatDate(notification.createdAt)}</Text>
      </View>

      {/* Message */}
      <View style={styles.messageContainer}>
        <Text style={[
          styles.messageText,
          !notification.isRead && styles.unreadMessageText
        ]}>
          {notification.message}
        </Text>
      </View>

      {/* Related Entity Info */}
      {notification.relatedEntity && (
        <View style={styles.relatedEntityContainer}>
          <Ionicons name="link" size={14} color="#6b7280" />
          <Text style={styles.relatedEntityText}>
            {notification.relatedEntity.type}: {notification.relatedEntity.name}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {onMarkAsRead && !notification.isRead && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onMarkAsRead(notification.id)}
          >
            <Ionicons name="checkmark" size={16} color="#10b981" />
            <Text style={styles.actionButtonText}>Mark Read</Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onDelete(notification.id)}
          >
            <Ionicons name="trash" size={16} color="#ef4444" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <View style={[styles.unreadIndicator, { backgroundColor: typeColor }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#e5e7eb',
  },
  unreadContainer: {
    borderLeftColor: '#3b82f6',
    backgroundColor: '#f8fafc',
  },
  highPriorityContainer: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  unreadMessageText: {
    fontWeight: '500',
    color: '#1e293b',
  },
  relatedEntityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    gap: 6,
  },
  relatedEntityText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationCard;
