import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NotificationService } from '../../core/services/NotificationService';
import { AuthService } from '../../core/services/auth.service';

interface PushTokenStatus {
  isInitialized: boolean;
  hasToken: boolean;
  tokenPreview: string;
  isRegistered: boolean;
  userAuthenticated: boolean;
}

export const PushTokenManager: React.FC = () => {
  const [status, setStatus] = useState<PushTokenStatus>({
    isInitialized: false,
    hasToken: false,
    tokenPreview: '',
    isRegistered: false,
    userAuthenticated: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      const currentUser = await AuthService.getCurrentUser();
      const authToken = await AuthService.getToken();
      
      const token = notificationService.getPushToken();
      
      setStatus({
        isInitialized: notificationService['isInitialized'] || false,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        isRegistered: false, // This would need backend check
        userAuthenticated: !!(currentUser && authToken),
      });
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const testTokenGeneration = async () => {
    setLoading(true);
    try {
      const notificationService = NotificationService.getInstance();
      
      // Force re-initialization
      await notificationService.initialize();
      
      const token = notificationService.getPushToken();
      if (token) {
        Alert.alert(
          '✅ Token Generated',
          `New token: ${token.substring(0, 30)}...`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('❌ Error', 'Failed to generate token');
      }
      
      await checkStatus();
    } catch (error) {
      Alert.alert('❌ Error', `Failed to generate token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTokenRegistration = async () => {
    setLoading(true);
    try {
      const notificationService = NotificationService.getInstance();
      const token = notificationService.getPushToken();
      
      if (!token) {
        Alert.alert('❌ Error', 'No token available to register');
        return;
      }

      // Simulate login to test token registration
      await notificationService.onUserLogin();
      
      Alert.alert('✅ Success', 'Token registration test completed');
      await checkStatus();
    } catch (error) {
      Alert.alert('❌ Error', `Failed to test token registration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTokenCleanup = async () => {
    setLoading(true);
    try {
      const notificationService = NotificationService.getInstance();
      
      // Simulate logout to test token cleanup
      await notificationService.onUserLogout();
      
      Alert.alert('✅ Success', 'Token cleanup test completed');
      await checkStatus();
    } catch (error) {
      Alert.alert('❌ Error', `Failed to test token cleanup: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Push Token Manager</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status:</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Service Initialized:</Text>
          <Text style={[styles.statusValue, { color: status.isInitialized ? '#10B981' : '#EF4444' }]}>
            {status.isInitialized ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Has Token:</Text>
          <Text style={[styles.statusValue, { color: status.hasToken ? '#10B981' : '#EF4444' }]}>
            {status.hasToken ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Token Preview:</Text>
          <Text style={styles.statusValue}>{status.tokenPreview}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>User Authenticated:</Text>
          <Text style={[styles.statusValue, { color: status.userAuthenticated ? '#10B981' : '#EF4444' }]}>
            {status.userAuthenticated ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={testTokenGeneration}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Testing...' : '🧪 Test Token Generation'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.successButton]} 
          onPress={testTokenRegistration}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Testing...' : '🔑 Test Token Registration'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={testTokenCleanup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Testing...' : '🧹 Test Token Cleanup'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.infoButton]} 
          onPress={checkStatus}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            🔄 Refresh Status
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ How It Works:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Login:</Text> Automatically generates and registers push token
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Logout:</Text> Automatically deactivates and cleans up token
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Re-login:</Text> Generates new token and registers it
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>App Startup:</Text> Checks auth status and manages tokens accordingly
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
  infoButton: {
    backgroundColor: '#06b6d4',
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
});

export default PushTokenManager;
