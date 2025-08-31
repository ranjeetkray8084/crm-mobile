import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickNotificationTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testLocalNotification = async () => {
    try {
      setIsLoading(true);
      
      // Simple alert for testing
      Alert.alert(
        '🔔 Test Notification',
        'This is a test notification from Quick Test!',
        [
          { text: 'OK', onPress: () => console.log('Notification test successful') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      
      console.log('✅ Test notification sent successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to send test notification: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendNotification = async () => {
    try {
      setIsLoading(true);
      
      const apiBaseUrl = 'https://backend.leadstracker.in'; // Update this to your backend URL
      
      const response = await fetch(`${apiBaseUrl}/api/push-notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: 'test-token',
          deviceType: Platform.OS,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Backend notification sent! Check your device.');
      } else {
        const errorData = await response.text();
        Alert.alert('Error', `Backend request failed: ${errorData}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send backend notification: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Quick Notification Test</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • This is a simple test without complex notification services
        </Text>
        <Text style={styles.infoText}>
          • Use development build for full push notification functionality
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.localButton]}
          onPress={testLocalNotification}
          disabled={isLoading}
        >
          <Ionicons name="notifications" size={20} color="white" />
          <Text style={styles.buttonText}>Test Local Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backendButton]}
          onPress={testBackendNotification}
          disabled={isLoading}
        >
          <Ionicons name="cloud-upload" size={20} color="white" />
          <Text style={styles.buttonText}>Test Backend</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Sending notification...</Text>
        </View>
      )}

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📋 Instructions:</Text>
        <Text style={styles.instructionsText}>1. Test Local Alert: Shows alert dialog</Text>
        <Text style={styles.instructionsText}>2. Test Backend: Tests API connection</Text>
        <Text style={styles.instructionsText}>3. Check console logs for results</Text>
        <Text style={styles.instructionsText}>4. Use development build for real notifications</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#0c4a6e',
    marginBottom: 5,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  localButton: {
    backgroundColor: '#10b981',
  },
  backendButton: {
    backgroundColor: '#f59e0b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  instructionsContainer: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0c4a6e',
  },
  instructionsText: {
    fontSize: 14,
    color: '#0c4a6e',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default QuickNotificationTest;
