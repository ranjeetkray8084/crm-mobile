import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../shared/contexts/NotificationContext';
import { NotificationData } from '../../core/services/NotificationService';

interface NotificationPanelProps {
  noteId: number;
  noteTitle: string;
  noteType: 'NOTE' | 'EVENT';
  eventDateTime?: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  noteId,
  noteTitle,
  noteType,
  eventDateTime,
  isVisible,
  onClose,
}) => {
  const { 
    scheduleNotification, 
    scheduleNotificationForDateTime, 
    scheduleNotificationWithDelay,
    scheduledNotifications,
    cancelNotification,
    sendImmediateNotification 
  } = useNotifications();

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleScheduleNotification = async (option: string) => {
    try {
      let notificationId: string;
      const notificationData: NotificationData = {
        title: `${noteType === 'EVENT' ? '📅 Event Reminder' : '📝 Note Reminder'}`,
        body: noteTitle,
        data: {
          type: noteType.toLowerCase(),
          noteId: noteId,
          title: noteTitle,
        },
        sound: true,
        priority: 'high',
      };

      switch (option) {
        case '5min':
          notificationId = await scheduleNotificationWithDelay(notificationData, 5 * 60);
          Alert.alert('Success', 'Notification scheduled for 5 minutes from now');
          break;

        case '15min':
          notificationId = await scheduleNotificationWithDelay(notificationData, 15 * 60);
          Alert.alert('Success', 'Notification scheduled for 15 minutes from now');
          break;

        case '1hour':
          notificationId = await scheduleNotificationWithDelay(notificationData, 60 * 60);
          Alert.alert('Success', 'Notification scheduled for 1 hour from now');
          break;

        case '1day':
          notificationId = await scheduleNotificationWithDelay(notificationData, 24 * 60 * 60);
          Alert.alert('Success', 'Notification scheduled for 1 day from now');
          break;

        case 'custom':
          // For custom time, you could show a date picker
          Alert.alert('Custom Time', 'Custom time scheduling feature coming soon!');
          return;

        case 'event':
          if (eventDateTime) {
            const eventDate = new Date(eventDateTime);
            // Schedule 1 hour before event
            const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000);
            notificationId = await scheduleNotificationForDateTime(notificationData, reminderDate);
            Alert.alert('Success', 'Event reminder scheduled for 1 hour before the event');
          } else {
            Alert.alert('Error', 'No event date/time available');
            return;
          }
          break;

        case 'test':
          await sendImmediateNotification(notificationData);
          Alert.alert('Test Notification', 'Test notification sent!');
          return;

        default:
          return;
      }

      setSelectedOption('');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
      console.error('Error scheduling notification:', error);
    }
  };

  const getScheduledNotificationsForNote = () => {
    return scheduledNotifications.filter(notification => 
      notification.content.data?.noteId === noteId
    );
  };

  const handleCancelNotification = async (notificationId: string) => {
    try {
      await cancelNotification(notificationId);
      Alert.alert('Success', 'Notification cancelled');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel notification');
      console.error('Error cancelling notification:', error);
    }
  };

  const renderQuickOptions = () => (
    <View style={styles.quickOptions}>
      <Text style={styles.sectionTitle}>Quick Reminders</Text>
      <View style={styles.optionsGrid}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleScheduleNotification('5min')}
        >
          <Ionicons name="time" size={20} color="#3b82f6" />
          <Text style={styles.optionText}>5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleScheduleNotification('15min')}
        >
          <Ionicons name="time" size={20} color="#3b82f6" />
          <Text style={styles.optionText}>15 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleScheduleNotification('1hour')}
        >
          <Ionicons name="time" size={20} color="#3b82f6" />
          <Text style={styles.optionText}>1 hour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleScheduleNotification('1day')}
        >
          <Ionicons name="calendar" size={20} color="#3b82f6" />
          <Text style={styles.optionText}>1 day</Text>
        </TouchableOpacity>

        {noteType === 'EVENT' && eventDateTime && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleScheduleNotification('event')}
          >
            <Ionicons name="alarm" size={20} color="#ef4444" />
            <Text style={styles.optionText}>Event</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleScheduleNotification('test')}
        >
          <Ionicons name="flash" size={20} color="#10b981" />
          <Text style={styles.optionText}>Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScheduledNotifications = () => {
    const noteNotifications = getScheduledNotificationsForNote();
    
    if (noteNotifications.length === 0) {
      return (
        <View style={styles.noNotifications}>
          <Ionicons name="notifications-off" size={48} color="#9ca3af" />
          <Text style={styles.noNotificationsText}>No notifications scheduled</Text>
        </View>
      );
    }

    return (
      <View style={styles.scheduledSection}>
        <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
        <ScrollView style={styles.notificationsList}>
          {noteNotifications.map((notification) => (
            <View key={notification.identifier} style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  {notification.content.title}
                </Text>
                <Text style={styles.notificationBody}>
                  {notification.content.body}
                </Text>
                <Text style={styles.notificationTime}>
                  {notification.trigger && 'date' in notification.trigger
                    ? new Date(notification.trigger.date).toLocaleString()
                    : 'Scheduled'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelNotification(notification.identifier)}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderQuickOptions()}
          {renderScheduledNotifications()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  quickOptions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  scheduledSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  noNotifications: {
    alignItems: 'center',
    padding: 32,
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  cancelButton: {
    padding: 4,
  },
});

export default NotificationPanel;
