import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNotifications } from '../../shared/contexts/NotificationContext';

export const SimpleNotificationTest: React.FC = () => {
  const { 
    expoNotificationsAvailable, 
    isSupported, 
    requestPermissions, 
    scheduleNotification,
    sendImmediateNotification
  } = useNotifications();
  
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

  console.log('🔔 DEBUG: SimpleNotificationTest rendering...');
  console.log('🔔 DEBUG: expoNotificationsAvailable:', expoNotificationsAvailable);
  console.log('🔔 DEBUG: isSupported:', isSupported);
  console.log('🔔 DEBUG: permissionStatus:', permissionStatus);

  useEffect(() => {
    console.log('🔔 DEBUG: SimpleNotificationTest useEffect running...');
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    console.log('🔔 DEBUG: checkPermissionStatus called');
    try {
      console.log('🔔 DEBUG: Checking current permission status...');
      // We'll get the status when the user clicks the button
      console.log('🔔 DEBUG: Permission status check completed');
    } catch (error) {
      console.error('🔔 DEBUG: Error checking permission status:', error);
    }
  };

  const checkPermissions = async () => {
    console.log('🔔 DEBUG: checkPermissions button pressed');
    try {
      console.log('🔔 DEBUG: Calling requestPermissions from context...');
      const granted = await requestPermissions();
      console.log('🔔 DEBUG: Permission request result:', granted);
      setPermissionStatus(granted ? 'granted' : 'denied');
      
      if (granted) {
        console.log('🔔 DEBUG: Permission granted successfully');
        Alert.alert('✅ Success', 'Notification permissions granted!');
      } else {
        console.log('🔔 DEBUG: Permission denied');
        Alert.alert('❌ Denied', 'Notification permissions denied');
      }
    } catch (error: any) {
      console.error('🔔 DEBUG: Error in checkPermissions:', error);
      Alert.alert('❌ Error', `Failed to request permissions: ${error.message}`);
    }
  };

  const testLocalNotification = async () => {
    console.log('🔔 DEBUG: testLocalNotification button pressed');
    try {
      console.log('🔔 DEBUG: Calling sendImmediateNotification...');
      const identifier = await sendImmediateNotification(
        '🧪 Test Notification',
        'This is a test notification from the app!',
        { type: 'test', timestamp: Date.now() }
      );
      console.log('✅ DEBUG: Test notification sent successfully with ID:', identifier);
      Alert.alert('✅ Success', 'Test notification sent!');
    } catch (error: any) {
      console.error('🔔 DEBUG: Error in testLocalNotification:', error);
      Alert.alert('❌ Error', `Failed to send notification: ${error.message}`);
    }
  };

  const testDelayedNotification = async () => {
    console.log('🔔 DEBUG: testDelayedNotification button pressed');
    try {
      console.log('🔔 DEBUG: Calling scheduleNotification with delay...');
      const identifier = await scheduleNotification(
        '⏰ Delayed Test',
        'This notification was scheduled for 5 seconds later',
        { type: 'delayed_test' },
        { seconds: 5 }
      );
      console.log('✅ DEBUG: Delayed notification scheduled with ID:', identifier);
      Alert.alert('✅ Success', `Delayed notification scheduled with ID: ${identifier}`);
    } catch (error: any) {
      console.error('🔔 DEBUG: Error in testDelayedNotification:', error);
      Alert.alert('❌ Error', `Failed to schedule notification: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Simple Notification Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status:</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Notifications Available:</Text>
          <Text style={[styles.statusValue, { 
            color: expoNotificationsAvailable ? '#10B981' : '#EF4444' 
          }]}>
            {expoNotificationsAvailable ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Fully Supported:</Text>
          <Text style={[styles.statusValue, { 
            color: isSupported ? '#10B981' : '#F59E0B' 
          }]}>
            {isSupported ? '✅ Yes' : '⚠️ Limited (Expo Go)'}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Permission Status:</Text>
          <Text style={[styles.statusValue, { 
            color: permissionStatus === 'granted' ? '#10B981' : 
                   permissionStatus === 'denied' ? '#EF4444' : '#6B7280' 
          }]}>
            {permissionStatus === 'granted' ? '✅ Granted' :
             permissionStatus === 'denied' ? '❌ Denied' : '⏳ Unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={checkPermissions}
        >
          <Text style={styles.buttonText}>🔔 Request Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.successButton]} 
          onPress={testLocalNotification}
          disabled={!expoNotificationsAvailable}
        >
          <Text style={styles.buttonText}>
            📱 Test Immediate Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={testDelayedNotification}
          disabled={!expoNotificationsAvailable}
        >
          <Text style={styles.buttonText}>
            ⏰ Test Delayed Notification
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ How It Works:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Request Permissions</Text> - Ask user for notification access
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Test Immediate</Text> - Send notification right now
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Test Delayed</Text> - Schedule notification for 5 seconds later
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Status Check</Text> - See what's available on your device
        </Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>💡 Important Notes:</Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Expo Go:</Text> Limited notification support
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Development Build:</Text> Full notification support
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Physical Device:</Text> Required for testing
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Permissions:</Text> Must be granted by user
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  warningButton: {
    backgroundColor: '#f59e0b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1e40af',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: '#1e40af',
  },
  bold: {
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#92400e',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: '#92400e',
  },
});

export default SimpleNotificationTest;
