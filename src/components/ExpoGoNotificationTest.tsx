import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const ExpoGoNotificationTest: React.FC = () => {
  const [isExpoGo, setIsExpoGo] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Check if running in Expo Go
    const checkExpoGo = Constants.appOwnership === 'expo';
    setIsExpoGo(checkExpoGo);
    
    if (checkExpoGo) {
      setTestResults(prev => [...prev, '⚠️ Expo Go detected - Push notifications limited']);
      setTestResults(prev => [...prev, '📱 Use development build for full functionality']);
    } else {
      setTestResults(prev => [...prev, '✅ Development build detected']);
    }
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const testLocalAlert = () => {
    try {
      Alert.alert(
        '🔔 Test Notification',
        'This is a test notification using Alert!',
        [
          { text: 'OK', onPress: () => addTestResult('✅ Local alert test successful') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      addTestResult(`❌ Local alert test failed: ${error}`);
    }
  };

  const testConsoleLog = () => {
    try {
      console.log('🔔 Console Notification Test');
      console.log('Title: Test Notification');
      console.log('Body: This is a test notification in console');
      addTestResult('✅ Console log test successful');
    } catch (error) {
      addTestResult(`❌ Console log test failed: ${error}`);
    }
  };

  const testBackendConnection = async () => {
    try {
      addTestResult('🔄 Testing backend connection...');
      
      const apiBaseUrl = 'https://backend.leadstracker.in'; // Update this to your backend URL
      const response = await fetch(`${apiBaseUrl}/api/push-notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: 'expo-go-test-token',
          deviceType: Platform.OS,
        }),
      });

      if (response.ok) {
        addTestResult('✅ Backend connection successful');
        const data = await response.text();
        addTestResult(`📡 Backend response: ${data}`);
      } else {
        addTestResult(`❌ Backend connection failed: ${response.status}`);
      }
    } catch (error) {
      addTestResult(`❌ Backend test failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Expo Go Notification Test</Text>
        <Text style={styles.subtitle}>
          {isExpoGo ? 'Expo Go Mode (Limited)' : 'Development Build Mode (Full)'}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📋 Important Notes:</Text>
        <Text style={styles.infoText}>
          • Expo Go mein push notifications properly work nahi karte
        </Text>
        <Text style={styles.infoText}>
          • Local notifications test kar sakte hain
        </Text>
        <Text style={styles.infoText}>
          • Full functionality ke liye development build banayein
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.alertButton]}
          onPress={testLocalAlert}
        >
          <Ionicons name="notifications" size={20} color="white" />
          <Text style={styles.buttonText}>Test Local Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.consoleButton]}
          onPress={testConsoleLog}
        >
          <Ionicons name="terminal" size={20} color="white" />
          <Text style={styles.buttonText}>Test Console Log</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backendButton]}
          onPress={testBackendConnection}
        >
          <Ionicons name="cloud-upload" size={20} color="white" />
          <Text style={styles.buttonText}>Test Backend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>📊 Test Results:</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No tests run yet</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))
        )}
      </View>

      <View style={styles.solutionContainer}>
        <Text style={styles.solutionTitle}>🚀 Solution for Full Push Notifications:</Text>
        <Text style={styles.solutionText}>1. Install EAS CLI: npm install -g @expo/eas-cli</Text>
        <Text style={styles.solutionText}>2. Login: eas login</Text>
        <Text style={styles.solutionText}>3. Build: eas build --profile development --platform android</Text>
        <Text style={styles.solutionText}>4. Install development build on device</Text>
        <Text style={styles.solutionText}>5. Test push notifications</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#856404',
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  alertButton: {
    backgroundColor: '#4CAF50',
  },
  consoleButton: {
    backgroundColor: '#2196F3',
  },
  backendButton: {
    backgroundColor: '#FF9800',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  noResults: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    fontFamily: 'monospace',
  },
  solutionContainer: {
    backgroundColor: '#d4edda',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#155724',
  },
  solutionText: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default ExpoGoNotificationTest;
