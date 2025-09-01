import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../../core/services/NotificationService';
import TokenRegistrationService from '../../core/services/TokenRegistrationService';

interface PushNotificationDebuggerProps {
  onClose?: () => void;
}

export const PushNotificationDebugger: React.FC<PushNotificationDebuggerProps> = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 400;
  const isTablet = screenWidth > 768;

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateDebugInfo = async () => {
    try {
      setIsLoading(true);
      addLog('🔍 Updating debug information...');

      const notificationService = NotificationService.getInstance();
      const tokenService = TokenRegistrationService.getInstance();

      // Check app environment
      const Constants = await import('expo-constants');
      const appOwnership = (Constants.default as any).appOwnership;
      const isExpoGo = appOwnership === 'expo';
      const isDevelopmentBuild = appOwnership === 'standalone' || appOwnership === null;
      
      addLog(`📱 App Environment:`);
      addLog(`   - Expo Go: ${isExpoGo}`);
      addLog(`   - Development Build: ${isDevelopmentBuild}`);
      addLog(`   - App Ownership: ${appOwnership}`);

      // Get current token
      const currentToken = await tokenService.getCurrentToken();
      addLog(`📱 Current token: ${currentToken ? currentToken.substring(0, 30) + '...' : 'None'}`);

      // Check if token is registered
      const isRegistered = await tokenService.isTokenRegistered();
      addLog(`✅ Token registered: ${isRegistered}`);

      // Check notification permissions
      const hasPermission = await notificationService.requestPermissions();
      addLog(`🔔 Permissions granted: ${hasPermission}`);

      // Check if notifications are supported
      const isSupported = notificationService.isFullySupported();
      addLog(`📲 Notifications supported: ${isSupported}`);

      // Get stored auth token
      const authToken = await AsyncStorage.getItem('token');
      addLog(`🔐 Auth token available: ${!!authToken}`);

      // Check if push notifications will work
      if (isExpoGo) {
        addLog('⚠️ WARNING: Running in Expo Go - Push notifications will NOT work!');
        addLog('💡 Solution: Build a development build or use EAS Build');
      } else {
        addLog('✅ Running in development build - Push notifications should work');
      }

      setDebugInfo({
        currentToken: currentToken ? currentToken.substring(0, 30) + '...' : 'None',
        isRegistered,
        hasPermission,
        isSupported,
        hasAuthToken: !!authToken,
        isExpoGo,
        isDevelopmentBuild,
        timestamp: new Date().toLocaleString()
      });

      addLog('✅ Debug information updated');
    } catch (error: any) {
      addLog(`❌ Error updating debug info: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenGeneration = async () => {
    try {
      setIsLoading(true);
      addLog('🧪 Testing token generation...');

      const notificationService = NotificationService.getInstance();
      const token = await notificationService.getPushToken();
      
      if (token) {
        addLog(`✅ Token generated: ${token.substring(0, 30)}...`);
        addLog(`📏 Token length: ${token.length}`);
      } else {
        addLog('❌ Failed to generate token');
      }
    } catch (error: any) {
      addLog(`❌ Token generation error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenRegistration = async () => {
    try {
      setIsLoading(true);
      addLog('📤 Testing token registration...');

      const tokenService = TokenRegistrationService.getInstance();
      const currentToken = await tokenService.getCurrentToken();
      
      if (!currentToken) {
        addLog('❌ No token available for registration');
        return;
      }

      const result = await tokenService.registerToken(currentToken);
      
      if (result.success) {
        addLog('✅ Token registration successful');
      } else {
        addLog(`❌ Token registration failed: ${result.error}`);
      }
    } catch (error: any) {
      addLog(`❌ Registration error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLocalNotification = async () => {
    try {
      setIsLoading(true);
      addLog('🔔 Testing local notification...');

      const notificationService = NotificationService.getInstance();
      await notificationService.sendImmediateNotification({
        title: 'Test Notification',
        body: 'This is a test notification from the debugger',
        data: { test: true, timestamp: Date.now() },
        sound: true,
        priority: 'high'
      });

      addLog('✅ Local notification sent');
    } catch (error: any) {
      addLog(`❌ Local notification error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testExpoPushNotification = async () => {
    try {
      setIsLoading(true);
      addLog('📤 Testing Expo push notification...');

      const tokenService = TokenRegistrationService.getInstance();
      const currentToken = await tokenService.getCurrentToken();
      
      if (!currentToken) {
        addLog('❌ No token available for testing');
        return;
      }

      addLog(`📱 Using token: ${currentToken.substring(0, 30)}...`);
      addLog('📤 Triggering backend notification...');

      // Since your backend is already sending notifications successfully,
      // let's trigger a notification by creating a test notification record
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addLog('❌ No auth token available');
        return;
      }

      const requestBody = {
        pushToken: currentToken,
        deviceType: 'android'
      };
      
      addLog('📤 Sending request...');

      // Use the /send endpoint to send push notification
      const response = await fetch('https://backend.leadstracker.in/api/push-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        addLog('✅ Test push notification sent successfully!');
        addLog('📱 Check your device for the push notification');
      } else {
        const errorText = await response.text();
        addLog(`❌ Backend error: ${response.status} ${response.statusText}`);
        addLog(`❌ Error details: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`❌ Test push notification error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkJWTToken = async () => {
    try {
      setIsLoading(true);
      addLog('🔍 Checking JWT Token...');

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addLog('❌ No JWT token found');
        return;
      }

      addLog(`🔑 JWT Token: ${authToken.substring(0, 50)}...`);
      addLog(`📏 Token Length: ${authToken.length}`);
      
      // Try to decode JWT token (basic check)
      try {
        const tokenParts = authToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          addLog(`📅 Token Expiry: ${new Date(payload.exp * 1000).toLocaleString()}`);
          addLog(`👤 User ID: ${payload.sub || payload.userId || 'Unknown'}`);
          addLog(`🏢 Company ID: ${payload.companyId || 'Unknown'}`);
          
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            addLog('⚠️ Token is EXPIRED!');
          } else {
            addLog('✅ Token is valid');
          }
        } else {
          addLog('⚠️ Token format seems incorrect');
        }
      } catch (decodeError) {
        addLog('⚠️ Could not decode JWT token');
      }

      // Test token with a simple API call
      addLog('🧪 Testing token with API call...');
      const response = await fetch('https://backend.leadstracker.in/api/notifications/user/25/company/4/unread-count', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      addLog(`📊 Test API Response: ${response.status} ${response.statusText}`);
      if (response.ok) {
        addLog('✅ JWT Token is working with API');
      } else {
        addLog('❌ JWT Token is not working with API');
      }

    } catch (error: any) {
      addLog(`❌ JWT Token check error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFCMNotification = async () => {
    try {
      setIsLoading(true);
      addLog('🧪 Testing FCM Push Notification...');

      const tokenService = TokenRegistrationService.getInstance();
      const currentToken = await tokenService.getCurrentToken();
      
      if (!currentToken) {
        addLog('❌ No token available for testing');
        return;
      }

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addLog('❌ No auth token available');
        return;
      }

      const requestBody = {
        pushToken: currentToken,
        deviceType: 'android'
      };
      
      addLog('📤 Sending FCM test request...');

      const response = await fetch('https://backend.leadstracker.in/api/push-notifications/test-fcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        addLog('✅ FCM test notification sent successfully!');
        addLog('📱 Check your device for the FCM push notification');
      } else {
        const errorText = await response.text();
        addLog(`❌ FCM Backend error: ${response.status} ${response.statusText}`);
        addLog(`❌ FCM Error details: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`❌ FCM Test error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPushNotification = async () => {
    try {
      setIsLoading(true);
      addLog('📤 Sending Push Notification via /send endpoint...');

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addLog('❌ No auth token available');
        return;
      }

      addLog('🔍 Send Request Details:');
      addLog(`📡 URL: https://backend.leadstracker.in/api/push-notifications/send`);
      addLog(`🔑 JWT Token: ${authToken.substring(0, 50)}...`);
      
      const requestBody = {
        title: 'Test Push Notification',
        body: 'This is a test push notification from the debugger!',
        data: { 
          test: true, 
          timestamp: Date.now(),
          source: 'debugger'
        },
        userIds: [25] // Send to current user (userId 25 from logs)
      };
      
      addLog(`📦 Request Body: ${JSON.stringify(requestBody, null, 2)}`);
      addLog('📤 Sending request...');

      const response = await fetch('https://backend.leadstracker.in/api/push-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      addLog(`📊 Response Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const responseData = await response.json();
        addLog(`✅ Response Data: ${JSON.stringify(responseData, null, 2)}`);
        addLog('✅ Push notification sent successfully via /send endpoint!');
        addLog('📱 Check your device for the push notification');
      } else {
        const errorText = await response.text();
        addLog(`❌ Backend error: ${response.status} ${response.statusText}`);
        addLog(`❌ Error details: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`❌ Send notification error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };



  const buildDevelopmentBuild = () => {
    addLog('🔨 Building Development Build...');
    addLog('📱 This will create a standalone app that supports push notifications');
    addLog('💡 Run this command in your terminal:');
    addLog('   npx expo run:android --variant debug');
    addLog('   or');
    addLog('   eas build --platform android --profile development');
    addLog('⚠️ This will take 5-10 minutes to build');
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs cleared');
  };

  useEffect(() => {
    updateDebugInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Push Notification Debugger</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Debug Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Current Status</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Token: {debugInfo.currentToken || 'Loading...'}</Text>
            <Text style={styles.infoText}>Registered: {debugInfo.isRegistered ? '✅' : '❌'}</Text>
            <Text style={styles.infoText}>Permissions: {debugInfo.hasPermission ? '✅' : '❌'}</Text>
            <Text style={styles.infoText}>Supported: {debugInfo.isSupported ? '✅' : '❌'}</Text>
            <Text style={styles.infoText}>Auth Token: {debugInfo.hasAuthToken ? '✅' : '❌'}</Text>
            <Text style={styles.infoText}>Expo Go: {debugInfo.isExpoGo ? '⚠️ YES' : '✅ NO'}</Text>
            <Text style={styles.infoText}>Dev Build: {debugInfo.isDevelopmentBuild ? '✅ YES' : '❌ NO'}</Text>
            <Text style={styles.infoText}>Updated: {debugInfo.timestamp || 'Never'}</Text>
          </View>
        </View>

        {/* Test Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Test Functions</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={updateDebugInfo}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>🔄 Refresh Status</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={testTokenGeneration}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>🔑 Generate Token</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={testTokenRegistration}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>📤 Register Token</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.tertiaryButton]} 
              onPress={testLocalNotification}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>🔔 Test Local Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.expoButton]} 
              onPress={testExpoPushNotification}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>📤 Test Expo Push</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.fcmButton]} 
              onPress={testFCMNotification}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>🔥 Test FCM Push</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.sendButton]} 
              onPress={sendPushNotification}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>📤 Send Push (/send)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.jwtButton]} 
              onPress={checkJWTToken}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>🔍 Check JWT Token</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buildButton]} 
              onPress={buildDevelopmentBuild}
            >
              <Text style={styles.buttonText}>🔨 Build Dev Build</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.dangerButton]} 
              onPress={clearLogs}
            >
              <Text style={styles.buttonText}>🧹 Clear Logs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Debug Logs</Text>
          <View style={styles.logsContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>{log}</Text>
            ))}
            {logs.length === 0 && (
              <Text style={styles.emptyLogsText}>No logs yet. Run some tests to see debug information.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    minHeight: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 6,
    color: '#666',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  tertiaryButton: {
    backgroundColor: '#FF9800',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  expoButton: {
    backgroundColor: '#00D4AA',
  },
  fcmButton: {
    backgroundColor: '#FF6B35',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
  },
  jwtButton: {
    backgroundColor: '#673AB7',
  },
  buildButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  logsContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    maxHeight: 250,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logText: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 3,
    color: '#333',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  emptyLogsText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
    lineHeight: 18,
  },
});

export default PushNotificationDebugger;
