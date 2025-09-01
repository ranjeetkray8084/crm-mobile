import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, API_ENDPOINTS } from '../../core/config/api.config';

interface NotificationPermissionRequestProps {
  onPermissionGranted?: (token: string) => void;
  onPermissionDenied?: () => void;
  showRequestButton?: boolean;
}

export const NotificationPermissionRequest: React.FC<NotificationPermissionRequestProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  showRequestButton = true
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
    checkExistingToken();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        await generateAndRegisterToken();
      }
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const checkExistingToken = async () => {
    try {
      const existingToken = await AsyncStorage.getItem('pushToken');
      if (existingToken) {
        setPushToken(existingToken);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error checking existing token:', error);
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      setIsLoading(true);
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
        
        if (status === 'granted') {
          await generateAndRegisterToken();
        } else {
          if (onPermissionDenied) {
            onPermissionDenied();
          }
          Alert.alert(
            'Permission Required',
            'To receive important updates about leads, tasks, and announcements, please enable notifications in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Notifications.openSettingsAsync() }
            ]
          );
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
        Alert.alert('Error', 'Failed to request notification permission');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Android doesn't need explicit permission request for basic notifications
      await generateAndRegisterToken();
    }
  };

  const generateAndRegisterToken = async () => {
    try {
      setIsLoading(true);
      
      if (!Device.isDevice) {
        Alert.alert('Error', 'Push notifications are only available on physical devices');
        return;
      }

      // Generate push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'e54487e4-0b6f-4429-8b02-f1c84f6b0bba', // From your app.config.js
      });

      if (token.data) {
        setPushToken(token.data);
        await AsyncStorage.setItem('pushToken', token.data);
        
        // Register with backend
        const success = await registerTokenWithBackend(token.data);
        if (success) {
          setIsRegistered(true);
          if (onPermissionGranted) {
            onPermissionGranted(token.data);
          }
        }
      }
    } catch (error: any) {
      console.error('Error generating/registering token:', error);
      Alert.alert('Error', `Failed to setup notifications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const registerTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        console.log('No auth token available for token registration');
        return false;
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          pushToken: token,
          deviceType: Platform.OS,
        }),
      });

      if (response.ok) {
        console.log('✅ Push token registered successfully with backend');
        return true;
      } else {
        console.error('❌ Failed to register token:', response.status, response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error registering token with backend:', error);
      return false;
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return isRegistered ? '✅ Notifications Enabled & Registered' : '✅ Notifications Enabled';
      case 'denied':
        return '❌ Notifications Disabled';
      case 'undetermined':
        return '❓ Permission Not Determined';
      default:
        return '❓ Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return isRegistered ? '#22c55e' : '#eab308';
      case 'denied':
        return '#ef4444';
      case 'undetermined':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (permissionStatus === 'granted' && isRegistered && !showRequestButton) {
    return null; // Don't show if everything is working
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.title}>🔔 Push Notifications</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        
        {pushToken && (
          <Text style={styles.tokenText}>
            Token: {pushToken.substring(0, 20)}...
          </Text>
        )}
      </View>

      {permissionStatus !== 'granted' && showRequestButton && (
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={requestPermission}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Setting up...' : '🔔 Enable Notifications'}
          </Text>
        </TouchableOpacity>
      )}

      {permissionStatus === 'granted' && !isRegistered && (
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={generateAndRegisterToken}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Registering...' : '📱 Register Device'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1e293b',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationPermissionRequest;
