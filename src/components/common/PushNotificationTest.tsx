import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../../shared/contexts/NotificationContext';
import NotificationService from '../../core/services/NotificationService';
import TokenRegistrationService from '../../core/services/TokenRegistrationService';
import { getApiBaseUrl, API_ENDPOINTS } from '../../core/config/api.config';

export const PushNotificationTest: React.FC = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  
  const {
    expoNotificationsAvailable,
    requestPermissions,
    scheduleNotification,
    sendImmediateNotification,
    isSupported,
  } = useNotifications();

  useEffect(() => {
    checkCurrentStatus();
    getDeviceInfo();
  }, []);

  const getDeviceInfo = () => {
    const info = {
      platform: Platform.OS,
      version: Platform.Version,
      isDevice: Constants.isDevice,
      appOwnership: Constants.appOwnership,
      expoVersion: Constants.expoVersion,
      deviceName: Constants.deviceName,
      deviceYearClass: Constants.deviceYearClass,
    };
    setDeviceInfo(info);
    addTestResult(`📱 Device Info: ${Platform.OS} ${Platform.Version}, Device: ${Constants.isDevice}, Ownership: ${Constants.appOwnership}`);
  };

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
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp}: ${result}`]);
  };

  const testPermissionRequest = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing permission request...');
    
    try {
      const granted = await requestPermissions();
      if (granted) {
        setPermissionStatus('granted');
        addTestResult('✅ Notification permissions granted');
      } else {
        setPermissionStatus('denied');
        addTestResult('❌ Notification permissions denied');
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to test push notifications.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
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
        addTestResult(`📏 Token length: ${token.length} characters`);
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
        '🧪 Test Notification',
        'This is a test notification from your CRM app!',
        { 
          type: 'test', 
          timestamp: Date.now(),
          testId: Math.random().toString(36).substr(2, 9)
        }
      );
      
      if (identifier) {
        addTestResult('✅ Local notification sent successfully');
        addTestResult(`🆔 Notification ID: ${identifier}`);
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
        '⏰ Scheduled Test',
        'This notification was scheduled 5 seconds ago',
        { 
          type: 'scheduled_test', 
          timestamp: Date.now(),
          testId: Math.random().toString(36).substr(2, 9)
        },
        { seconds: 5 }
      );
      
      if (identifier) {
        addTestResult('✅ Notification scheduled successfully');
        addTestResult(`🆔 Scheduled ID: ${identifier}`);
      } else {
        addTestResult('❌ Failed to schedule notification');
      }
    } catch (error: any) {
      addTestResult(`❌ Scheduled notification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendNotification = async () => {
    if (!pushToken) {
      addTestResult('❌ No push token available for backend test');
      return;
    }

    setIsLoading(true);
    addTestResult('🔔 Testing backend notification...');
    
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addTestResult('❌ No auth token available');
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}${API_ENDPOINTS.PUSH_NOTIFICATIONS.TEST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          pushToken: pushToken,
          deviceType: Platform.OS,
          message: 'Test notification from CRM app',
          title: '🧪 Backend Test',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult('✅ Backend notification test sent successfully');
        addTestResult(`📊 Response: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addTestResult(`❌ Backend test failed: ${response.status} ${response.statusText}`);
        addTestResult(`📄 Error: ${errorText}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Backend test error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testMultipleNotifications = async () => {
    setIsLoading(true);
    addTestResult('🔔 Testing multiple notifications...');
    
    try {
      const notifications = [
        { title: '📊 Lead Update', body: 'New lead added to your pipeline' },
        { title: '✅ Task Complete', body: 'Task "Follow up call" completed' },
        { title: '📅 Meeting Reminder', body: 'Meeting with client in 30 minutes' },
        { title: '💰 Deal Closed', body: 'Congratulations! Deal worth $50K closed' },
      ];

      for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        
        const identifier = await sendImmediateNotification(
          notification.title,
          notification.body,
          { 
            type: 'multiple_test', 
            index: i,
            timestamp: Date.now()
          }
        );
        
        addTestResult(`✅ Notification ${i + 1} sent: ${notification.title}`);
      }
      
      addTestResult('✅ All multiple notifications sent successfully');
    } catch (error: any) {
      addTestResult(`❌ Multiple notifications failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      deviceInfo,
      pushToken: pushToken ? pushToken.substring(0, 20) + '...' : null,
      isRegistered,
      permissionStatus,
      testResults,
    };
    
    console.log('📊 Test Results Export:', JSON.stringify(results, null, 2));
    Alert.alert('Results Exported', 'Check console for detailed test results');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Push Notification Test</Text>
        <Text style={styles.subtitle}>
          Status: {isSupported ? '✅ Supported' : '❌ Not Supported'}
        </Text>
        <Text style={styles.subtitle}>
          Expo Notifications: {expoNotificationsAvailable ? '✅ Available' : '❌ Not Available'}
        </Text>
        <Text style={styles.subtitle}>
          Platform: {Platform.OS} {Platform.Version}
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
        <Text style={styles.statusText}>
          Permission: {permissionStatus}
        </Text>
        <Text style={styles.statusText}>
          Device: {Constants.isDevice ? 'Physical Device' : 'Simulator'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Tests</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.permissionButton, isLoading && styles.buttonDisabled]}
          onPress={testPermissionRequest}
          disabled={isLoading}
        >
          <Ionicons name="shield-checkmark" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Request Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tokenButton, isLoading && styles.buttonDisabled]}
          onPress={testTokenGeneration}
          disabled={isLoading}
        >
          <Ionicons name="key" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Generate Push Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton, isLoading && styles.buttonDisabled]}
          onPress={testTokenRegistration}
          disabled={isLoading || !pushToken}
        >
          <Ionicons name="cloud-upload" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Register Token</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Tests</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.notificationButton, isLoading && styles.buttonDisabled]}
          onPress={testLocalNotification}
          disabled={isLoading}
        >
          <Ionicons name="notifications" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Send Local Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.scheduleButton, isLoading && styles.buttonDisabled]}
          onPress={testScheduledNotification}
          disabled={isLoading}
        >
          <Ionicons name="time" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Schedule Notification (5s)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backendButton, isLoading && styles.buttonDisabled]}
          onPress={testBackendNotification}
          disabled={isLoading || !pushToken}
        >
          <Ionicons name="server" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Test Backend Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.multipleButton, isLoading && styles.buttonDisabled]}
          onPress={testMultipleNotifications}
          disabled={isLoading}
        >
          <Ionicons name="layers" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Test Multiple Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.exportButton]}
          onPress={exportResults}
        >
          <Ionicons name="download" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Export Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Ionicons name="trash" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results ({testResults.length})</Text>
        <View style={styles.resultsContainer}>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No test results yet. Start testing to see results here.</Text>
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
  },
  tokenButton: {
    backgroundColor: '#5856D6',
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  notificationButton: {
    backgroundColor: '#10b981',
  },
  scheduleButton: {
    backgroundColor: '#f59e0b',
  },
  backendButton: {
    backgroundColor: '#8b5cf6',
  },
  multipleButton: {
    backgroundColor: '#06b6d4',
  },
  exportButton: {
    backgroundColor: '#6366f1',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    maxHeight: 300,
  },
  noResults: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default PushNotificationTest;
