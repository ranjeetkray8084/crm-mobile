// Notification Settings Component
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FCMService from '../../core/services/fcm.service';
import NotificationPermissionService from '../../core/services/notificationPermission.service';

interface NotificationSettingsProps {
  onPermissionChange?: (granted: boolean) => void;
}

export default function NotificationSettings({ onPermissionChange }: NotificationSettingsProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const result = await NotificationPermissionService.checkPermission();
      setPermissionGranted(result.granted);
      if (onPermissionChange) {
        onPermissionChange(result.granted);
      }
    } catch (error) {
      console.error('🔥 NotificationSettings: Error checking permission:', error);
    }
  };

  const handleToggleNotification = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (permissionGranted) {
        // Permission is granted, show info about disabling
        Alert.alert(
          'Disable Notifications',
          'To disable notifications, please go to your device settings and turn off notifications for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
      } else {
        // Request permission
        const result = await NotificationPermissionService.requestPermission();
        setPermissionGranted(result.granted);
        
        if (result.granted) {
          // Initialize FCM service
          const fcmService = new FCMService();
          const fcmResult = await fcmService.initialize();
          
          if (fcmResult.success) {
            Alert.alert(
              'Notifications Enabled',
              'You will now receive notifications for leads, tasks, and important updates.'
            );
          }
        } else {
          NotificationPermissionService.showPermissionDeniedDialog();
        }
        
        if (onPermissionChange) {
          onPermissionChange(result.granted);
        }
      }
    } catch (error) {
      console.error('🔥 NotificationSettings: Error toggling notification:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Push Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive notifications for leads, tasks, and important updates
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            permissionGranted ? styles.toggleButtonActive : styles.toggleButtonInactive,
            loading && styles.toggleButtonDisabled
          ]}
          onPress={handleToggleNotification}
          disabled={loading}
        >
          <Text style={[
            styles.toggleButtonText,
            permissionGranted ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
          ]}>
            {loading ? '...' : (permissionGranted ? 'ON' : 'OFF')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {!permissionGranted && (
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Enable notifications to stay updated with important information about your leads and tasks.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#10b981',
  },
  toggleButtonInactive: {
    backgroundColor: '#e5e7eb',
  },
  toggleButtonDisabled: {
    opacity: 0.6,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  toggleButtonTextInactive: {
    color: '#6b7280',
  },
  helpContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
