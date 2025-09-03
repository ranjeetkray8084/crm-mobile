import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
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
  const [permissionStatus, setPermissionStatus] = useState<string>('denied');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkExistingToken();
  }, []);

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
    console.log('🔧 Notifications disabled - cannot request permission');
    Alert.alert(
      'Notifications Disabled',
      'Push notifications are currently disabled in development mode to prevent native module errors.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const generateAndRegisterToken = async () => {
    console.log('🔧 Notifications disabled - cannot generate token');
    Alert.alert(
      'Notifications Disabled',
      'Push notifications are currently disabled in development mode to prevent native module errors.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getStatusText = () => {
    return '🔧 Notifications Disabled (Development Mode)';
  };

  const getStatusColor = () => {
    return '#6b7280';
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
        
        <Text style={styles.disabledText}>
          Notifications are disabled to prevent native module errors in development mode.
        </Text>
      </View>
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
  disabledText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
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
