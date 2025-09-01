import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNotifications } from '../../shared/contexts/NotificationContext';
import NotificationService from '../../core/services/NotificationService';
import TokenRegistrationService from '../../core/services/TokenRegistrationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationTest: React.FC = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const {
    expoNotificationsAvailable,
    requestPermissions,
    scheduleNotification,
    sendImmediateNotification,
    isSupported,
  } = useNotifications();

  useEffect(() => {
    checkCurrentStatus();
  }, []);

  const checkCurrentStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('pushToken');
      if (token) {
        setPushToken(token);
        setIsRegistered(true);
        addTestResult('✅ Push token found in storage');
      } else {
        addTestResult('⚠️ No push token found in storage');
      }
    } catch (error) {
      addTestResult('❌ Error checking token status');
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testPermissionRequest = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing permission request...');
    
    try {
      const granted = await requestPermissions();
      if (granted) {
        addTestResult('✅ Notification permissions granted');
      } else {
        addTestResult('❌ Notification permissions denied');
      }
    } catch (error: any) {
      addTestResult(`❌ Permission request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenGeneration = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing token generation...');
    
    try {
      const notificationService = NotificationService.getInstance();
      const token = await notificationService.getPushToken();
      
      if (token) {
        setPushToken(token);
        addTestResult(`✅ Push token generated: ${token.substring(0, 20)}...`);
      } else {
        addTestResult('❌ Failed to generate push token');
      }
    } catch (error: any) {
      addTestResult(`❌ Token generation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenRegistration = async () => {
    if (!pushToken) {
      addTestResult('❌ No push token available for registration');
      return;
    }

    setIsLoading(true);
    addTestResult('🔔 Testing token registration with backend...');
    
    try {
      const tokenService = TokenRegistrationService.getInstance();
      const result = await tokenService.registerToken(pushToken);
      
      if (result.success) {
        setIsRegistered(true);
        addTestResult('✅ Token registered successfully with backend');
      } else {
        addTestResult(`❌ Token registration failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Registration error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLocalNotification = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing local notification...');
    
    try {
      const identifier = await sendImmediateNotification(
        'Test Notification',
        'This is a test notification from your CRM app!',
        { type: 'test', timestamp: Date.now() }
      );
      
      if (identifier) {
        addTestResult('✅ Local notification sent successfully');
      } else {
        addTestResult('❌ Failed to send local notification');
      }
    } catch (error: any) {
      addTestResult(`❌ Local notification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testScheduledNotification = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing scheduled notification (5 seconds)...');
    
    try {
      const identifier = await scheduleNotification(
        'Scheduled Test',
        'This notification was scheduled 5 seconds ago',
        { type: 'scheduled_test', timestamp: Date.now() },
        { seconds: 5 }
      );
      
      if (identifier) {
        addTestResult('✅ Notification scheduled successfully');
      } else {
        addTestResult('❌ Failed to schedule notification');
      }
    } catch (error: any) {
      addTestResult(`❌ Scheduled notification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Push Notification Test</Text>
        <Text style={styles.subtitle}>
          Status: {isSupported ? '✅ Supported' : '❌ Not Supported'}
        </Text>
        <Text style={styles.subtitle}>
          Expo Notifications: {expoNotificationsAvailable ? '✅ Available' : '❌ Not Available'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <Text style={styles.statusText}>
          Push Token: {pushToken ? `${pushToken.substring(0, 20)}...` : 'Not available'}
        </Text>
        <Text style={styles.statusText}>
          Registered: {isRegistered ? '✅ Yes' : '❌ No'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testPermissionRequest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Request Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testTokenGeneration}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Generate Push Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testTokenRegistration}
          disabled={isLoading || !pushToken}
        >
          <Text style={styles.buttonText}>Register Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testLocalNotification}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Send Local Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testScheduledNotification}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Schedule Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.resultsContainer}>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No test results yet</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    maxHeight: 200,
  },
  noResults: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default NotificationTest;
