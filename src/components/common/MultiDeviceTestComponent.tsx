import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../../core/services/NotificationService';
import SimpleTokenService from '../../core/services/SimpleTokenService';
import SimpleDeviceManager from '../../core/utils/SimpleDeviceManager';
import { getApiBaseUrl, API_ENDPOINTS } from '../../core/config/api.config';

interface MultiDeviceTestProps {
  userId?: number;
  authToken?: string;
}

const MultiDeviceTestComponent: React.FC<MultiDeviceTestProps> = ({ userId, authToken }) => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string>('Unknown');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const notificationService = NotificationService.getInstance();
  const tokenService = SimpleTokenService.getInstance();

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      const info = await SimpleDeviceManager.getInstance().getDeviceInfo();
      setDeviceInfo(info);
      
      const token = await tokenService.getCurrentToken();
      setPushToken(token);
      
      const isRegistered = await tokenService.isTokenRegistered();
      setRegistrationStatus(isRegistered ? 'Registered' : 'Not Registered');
    } catch (error) {
      console.error('Error loading device info:', error);
    }
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testTokenGeneration = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing token generation...');
      const token = await notificationService.getPushToken();
      
      if (token) {
        setPushToken(token);
        addTestResult(`✅ Token generated: ${token.substring(0, 20)}...`);
      } else {
        addTestResult('❌ Failed to generate token');
      }
    } catch (error: any) {
      addTestResult(`❌ Token generation error: ${error.message}`);
    }
    setLoading(false);
  };

  const testTokenRegistration = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing token registration...');
      
      if (!pushToken) {
        addTestResult('⚠️ No push token available, generating first...');
        await testTokenGeneration();
        return;
      }

      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        addTestResult('❌ No user found in storage - please login first');
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const result = await tokenService.registerToken(user.id, pushToken);
      
      if (result.success) {
        setRegistrationStatus('Registered');
        addTestResult(`✅ Token registered successfully: ${result.message}`);
        if (result.deviceId) {
          addTestResult(`📱 Device ID: ${result.deviceId}`);
        }
      } else {
        addTestResult(`❌ Registration failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Registration error: ${error.message}`);
    }
    setLoading(false);
  };

  const testDeviceLogout = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing device-specific logout...');
      
      const result = await tokenService.deactivateCurrentDevice();
      
      if (result.success) {
        setRegistrationStatus('Not Registered');
        setPushToken(null);
        addTestResult(`✅ Device logout successful: ${result.message}`);
        if (result.deviceId) {
          addTestResult(`📱 Deactivated device: ${result.deviceId}`);
        }
      } else {
        addTestResult(`❌ Device logout failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Device logout error: ${error.message}`);
    }
    setLoading(false);
  };

  const testAllDevicesLogout = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing all devices logout...');
      
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        addTestResult('❌ No user found in storage - please login first');
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const result = await tokenService.deactivateAllUserTokens(user.id);
      
      if (result.success) {
        setRegistrationStatus('Not Registered');
        setPushToken(null);
        addTestResult(`✅ All devices logout successful: ${result.message}`);
      } else {
        addTestResult(`❌ All devices logout failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ All devices logout error: ${error.message}`);
    }
    setLoading(false);
  };

  const testNotificationSend = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing notification send to this user...');
      
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addTestResult('❌ No auth token available');
        setLoading(false);
        return;
      }

      if (!userId) {
        addTestResult('❌ No user ID provided');
        setLoading(false);
        return;
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.SEND_TO_USER(userId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: '🧪 Multi-Device Test',
          body: 'This notification should appear on all your devices!',
          data: {
            type: 'test',
            timestamp: Date.now(),
            deviceId: deviceInfo?.deviceId
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult(`✅ Notification sent to ${data.recipientsCount} devices`);
        addTestResult(`📱 Target devices: ${JSON.stringify(data.devices)}`);
      } else {
        const errorData = await response.text();
        addTestResult(`❌ Failed to send notification: ${response.status} ${errorData}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Send notification error: ${error.message}`);
    }
    setLoading(false);
  };

  const testBackendStatus = async () => {
    setLoading(true);
    try {
      addTestResult('🔔 Testing backend status...');
      
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        addTestResult('❌ No auth token available');
        setLoading(false);
        return;
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.STATUS}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult('✅ Backend status retrieved');
        addTestResult(`📊 Status: ${JSON.stringify(data.status, null, 2)}`);
      } else {
        addTestResult(`❌ Failed to get backend status: ${response.status}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Backend status error: ${error.message}`);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const showDeviceInfo = () => {
    Alert.alert(
      'Device Information',
      JSON.stringify(deviceInfo, null, 2),
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
        🔔 Multi-Device Push Notification Test
      </Text>

      {/* Device Info Section */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2 text-gray-800">📱 Device Information</Text>
        <Text className="text-gray-600 mb-1">Device ID: {deviceInfo?.deviceId || 'Loading...'}</Text>
        <Text className="text-gray-600 mb-1">Platform: {deviceInfo?.platform || 'Unknown'}</Text>
        <Text className="text-gray-600 mb-1">Push Token: {pushToken ? `${pushToken.substring(0, 20)}...` : 'None'}</Text>
        <Text className="text-gray-600 mb-3">Status: {registrationStatus}</Text>
        
        <TouchableOpacity
          onPress={showDeviceInfo}
          className="bg-blue-500 rounded-lg py-2 px-4 self-start"
        >
          <Text className="text-white font-medium">View Full Info</Text>
        </TouchableOpacity>
      </View>

      {/* Test Buttons */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3 text-gray-800">🧪 Test Functions</Text>
        
        <View className="space-y-2">
          <TouchableOpacity
            onPress={testTokenGeneration}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-green-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '🔑 Generate Push Token'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testTokenRegistration}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '📝 Register Token'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testNotificationSend}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-purple-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '📤 Send Test Notification'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testDeviceLogout}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-orange-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '📱 Logout This Device'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testAllDevicesLogout}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-red-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '🚪 Logout All Devices'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testBackendStatus}
            disabled={loading}
            className={`rounded-lg py-3 px-4 ${loading ? 'bg-gray-300' : 'bg-indigo-500'}`}
          >
            <Text className="text-white font-medium text-center">
              {loading ? 'Testing...' : '📊 Check Backend Status'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Results */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-800">📋 Test Results</Text>
          <TouchableOpacity
            onPress={clearResults}
            className="bg-gray-500 rounded-lg py-1 px-3"
          >
            <Text className="text-white text-sm">Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView className="max-h-64">
          {testResults.length === 0 ? (
            <Text className="text-gray-500 italic">No test results yet. Run a test to see results here.</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} className="text-sm text-gray-700 mb-1 font-mono">
                {result}
              </Text>
            ))
          )}
        </ScrollView>
      </View>

      {/* Instructions */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <Text className="text-lg font-semibold mb-2 text-yellow-800">📖 Testing Instructions</Text>
        <Text className="text-yellow-700 text-sm mb-2">
          1. Generate and register a push token for this device
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          2. Test sending notifications to all your devices
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          3. Test device-specific logout (affects only this device)
        </Text>
        <Text className="text-yellow-700 text-sm">
          4. Test all-devices logout (affects all your devices)
        </Text>
      </View>
    </ScrollView>
  );
};

export default MultiDeviceTestComponent;