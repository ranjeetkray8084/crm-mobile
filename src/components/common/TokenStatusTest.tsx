import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import TokenRegistrationService from '../../core/services/TokenRegistrationService';

const TokenStatusTest: React.FC = () => {
  const [tokenStatus, setTokenStatus] = useState<string>('Checking...');
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const tokenService = TokenRegistrationService.getInstance();

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    try {
      setLoading(true);
      
      // Check if token is registered
      const registered = await tokenService.isTokenRegistered();
      setIsRegistered(registered);
      
      // Get current token
      const token = await tokenService.getCurrentToken();
      setCurrentToken(token);
      
      if (token) {
        setTokenStatus(`✅ Token Found: ${token.substring(0, 20)}...`);
      } else {
        setTokenStatus('❌ No Token Found');
      }
    } catch (error: any) {
      setTokenStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setLoading(true);
      const result = await tokenService.refreshTokenRegistration();
      
      if (result.success) {
        Alert.alert('✅ Success', 'Token registration refreshed successfully!');
        await checkTokenStatus();
      } else {
        Alert.alert('❌ Error', `Failed to refresh token: ${result.error}`);
      }
    } catch (error: any) {
      Alert.alert('❌ Error', `Error refreshing token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearToken = async () => {
    try {
      setLoading(true);
      const result = await tokenService.deactivateToken();
      
      if (result.success) {
        Alert.alert('✅ Success', 'Token deactivated successfully!');
        await checkTokenStatus();
      } else {
        Alert.alert('❌ Error', `Failed to deactivate token: ${result.error}`);
      }
    } catch (error: any) {
      Alert.alert('❌ Error', `Error deactivating token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectImport = async () => {
    try {
      setLoading(true);
      console.log('🔔 DEBUG: Testing direct import of TokenRegistrationService...');
      
      // Test if the service can be imported and instantiated
      const service = TokenRegistrationService.getInstance();
      console.log('✅ DEBUG: TokenRegistrationService imported successfully:', !!service);
      
      // Test basic functionality
      const isRegistered = await service.isTokenRegistered();
      console.log('✅ DEBUG: isTokenRegistered() works:', isRegistered);
      
      Alert.alert('✅ Success', 'TokenRegistrationService is working correctly!');
      
    } catch (error: any) {
      console.error('❌ DEBUG: Error testing direct import:', error);
      Alert.alert('❌ Error', `Import test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔑 Push Token Status</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{tokenStatus}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Registered:</Text>
        <Text style={styles.statusText}>
          {isRegistered ? '✅ Yes' : '❌ No'}
        </Text>
      </View>

      {currentToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Current Token:</Text>
          <Text style={styles.tokenText} numberOfLines={3}>
            {currentToken}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={checkTokenStatus}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Checking...' : '🔄 Check Status'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={refreshToken}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Refreshing...' : '🔄 Refresh Token'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={clearToken}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Clearing...' : '🗑️ Clear Token'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF9500' }]}
          onPress={testDirectImport}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Testing...' : '🧪 Test Import'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ How It Works:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Login:</Text> Automatically generates and registers push token
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Logout:</Text> Automatically deactivates token on backend
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>App Restart:</Text> Token is restored from storage
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Permission:</Text> Token is generated when notification permission is granted
        </Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>💡 Note:</Text>
        <Text style={styles.noteText}>
          If you see "No Token Found", try logging out and logging back in. 
          The token is automatically generated when you grant notification permissions.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  tokenContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  infoButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  noteContainer: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default TokenStatusTest;
