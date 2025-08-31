import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, API_ENDPOINTS } from '../../core/config/api.config';
import { useNotifications } from '../../shared/contexts/NotificationContext';

export const PushNotificationTest: React.FC = () => {
  const { sendImmediateNotification, scheduleNotification } = useNotifications();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testLocalNotification = async () => {
    try {
      addTestResult('🧪 Testing local immediate notification...');
      const identifier = await sendImmediateNotification(
        '🧪 Local Test',
        'This is a local test notification!',
        { type: 'local_test', timestamp: Date.now() }
      );
      addTestResult(`✅ Local notification sent with ID: ${identifier}`);
    } catch (error: any) {
      addTestResult(`❌ Local notification failed: ${error.message}`);
    }
  };

  const testDelayedNotification = async () => {
    try {
      addTestResult('⏰ Testing delayed notification (5 seconds)...');
      const identifier = await scheduleNotification(
        '⏰ Delayed Test',
        'This notification was scheduled for 5 seconds later',
        { type: 'delayed_test', timestamp: Date.now() },
        { seconds: 5 }
      );
      addTestResult(`✅ Delayed notification scheduled with ID: ${identifier}`);
    } catch (error: any) {
      addTestResult(`❌ Delayed notification failed: ${error.message}`);
    }
  };

  const testBackendConnection = async () => {
    try {
      addTestResult('📡 Testing backend connection...');
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addTestResult('❌ No auth token available');
        return;
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.STATUS}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult(`✅ Backend connection successful: ${data.message || 'OK'}`);
      } else {
        addTestResult(`❌ Backend connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Backend connection error: ${error.message}`);
    }
  };

  const sendTestNotification = async () => {
    try {
      addTestResult('📱 Sending test notification via backend...');
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addTestResult('❌ No auth token available');
        return;
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.TEST}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '🧪 Test notification from mobile app',
          priority: 'HIGH',
          data: { type: 'test', timestamp: Date.now() }
        }),
      });

      if (response.ok) {
        addTestResult('✅ Test notification sent successfully via backend!');
        addTestResult('💡 Check if you see a push notification on your phone screen');
      } else {
        addTestResult(`❌ Failed to send test notification: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Error sending test notification: ${error.message}`);
    }
  };

  const testNotificationSettings = async () => {
    try {
      addTestResult('⚙️ Testing notification settings...');
      
      // Test if we can schedule a notification
      const identifier = await scheduleNotification(
        '⚙️ Settings Test',
        'Testing notification settings and permissions',
        { type: 'settings_test' },
        { seconds: 2 }
      );
      
      addTestResult(`✅ Notification settings test passed: ${identifier}`);
      addTestResult('💡 If you see this notification, your settings are correct');
      
    } catch (error: any) {
      addTestResult(`❌ Notification settings test failed: ${error.message}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Push Notification Test</Text>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>🔧 Test Local Notifications</Text>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.primaryButton]} 
          onPress={testLocalNotification}
        >
          <Text style={styles.buttonText}>📱 Test Local Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, styles.successButton]} 
          onPress={testDelayedNotification}
        >
          <Text style={styles.buttonText}>⏰ Test Delayed Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, styles.warningButton]} 
          onPress={testNotificationSettings}
        >
          <Text style={styles.buttonText}>⚙️ Test Notification Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>🌐 Test Backend Integration</Text>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.infoButton]} 
          onPress={testBackendConnection}
        >
          <Text style={styles.buttonText}>📡 Test Backend Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, styles.dangerButton]} 
          onPress={sendTestNotification}
        >
          <Text style={styles.buttonText}>🚀 Send Backend Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>📋 Test Results</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResultsText}>No test results yet. Run a test to see results.</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.testButton, styles.secondaryButton]} 
          onPress={clearTestResults}
        >
          <Text style={styles.buttonText}>🗑️ Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ How to Test Push Notifications:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Local Tests</Text> - Verify app can send notifications
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Backend Tests</Text> - Verify backend can send push notifications
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Check Phone Screen</Text> - Look for push notifications on your device
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Test with App Closed</Text> - Close app and wait for backend notification
        </Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>💡 Important Notes:</Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Push notifications</Text> appear on your phone screen
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Local notifications</Text> appear only when app is open
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Background notifications</Text> should show even when app is closed
        </Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Check phone settings</Text> if notifications don't appear
        </Text>
      </View>
    </ScrollView>
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
  testSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  testButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
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
  infoButton: {
    backgroundColor: '#06b6d4',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#475569',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 20,
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

export default PushNotificationTest;
