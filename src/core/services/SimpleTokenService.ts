import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../config/api.config';
import SimpleDeviceManager from '../utils/SimpleDeviceManager';

interface TokenRegistrationData {
  userId: number;
  pushToken: string;
  deviceId: string;
  deviceName: string;
  platform: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class SimpleTokenService {
  private static instance: SimpleTokenService;
  private deviceManager: SimpleDeviceManager;

  constructor() {
    this.deviceManager = SimpleDeviceManager.getInstance();
  }

  static getInstance(): SimpleTokenService {
    if (!SimpleTokenService.instance) {
      SimpleTokenService.instance = new SimpleTokenService();
    }
    return SimpleTokenService.instance;
  }

  /**
   * Register push token with backend - SIMPLE APPROACH
   */
  async registerToken(userId: number, pushToken: string): Promise<ApiResponse> {
    try {
      console.log('🔔 SIMPLE: Registering push token for user:', userId);

      // Get device info
      const deviceInfo = await this.deviceManager.getDeviceInfo();

      // Prepare registration data
      const registrationData: TokenRegistrationData = {
        userId,
        pushToken,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform
      };

      console.log('🔔 SIMPLE: Registration data:', {
        userId: registrationData.userId,
        deviceId: registrationData.deviceId,
        deviceName: registrationData.deviceName,
        platform: registrationData.platform,
        tokenLength: pushToken.length
      });

      // Get auth token
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      // Send to backend
      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}/api/push-tokens/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ SIMPLE: Push token registered successfully');
        
        // Store token locally for reference
        await AsyncStorage.setItem('current_push_token', pushToken);
        await AsyncStorage.setItem('token_registered', 'true');
        
        return { success: true, message: 'Token registered successfully' };
      } else {
        console.error('❌ SIMPLE: Token registration failed:', result);
        return { success: false, error: result.error || 'Registration failed' };
      }

    } catch (error: any) {
      console.error('❌ SIMPLE: Error registering token:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  /**
   * Deactivate current device token
   */
  async deactivateCurrentDevice(): Promise<ApiResponse> {
    try {
      console.log('🔔 SIMPLE: Deactivating current device token...');

      const deviceId = await this.deviceManager.getCurrentDeviceId();
      if (!deviceId) {
        console.log('⚠️ SIMPLE: No device ID found, nothing to deactivate');
        return { success: true, message: 'No device to deactivate' };
      }

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}/api/push-tokens/device/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log('✅ SIMPLE: Device token deactivated successfully');
        
        // Clear local storage
        await AsyncStorage.removeItem('current_push_token');
        await AsyncStorage.removeItem('token_registered');
        
        return { success: true, message: 'Device token deactivated' };
      } else {
        const result = await response.json();
        console.error('❌ SIMPLE: Failed to deactivate device token:', result);
        return { success: false, error: result.error || 'Deactivation failed' };
      }

    } catch (error: any) {
      console.error('❌ SIMPLE: Error deactivating device token:', error);
      return { success: false, error: error.message || 'Deactivation failed' };
    }
  }

  /**
   * Deactivate all user tokens (complete logout)
   */
  async deactivateAllUserTokens(userId: number): Promise<ApiResponse> {
    try {
      console.log('🔔 SIMPLE: Deactivating all tokens for user:', userId);

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}/api/push-tokens/user/${userId}/deactivate-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log('✅ SIMPLE: All user tokens deactivated successfully');
        
        // Clear local storage
        await AsyncStorage.removeItem('current_push_token');
        await AsyncStorage.removeItem('token_registered');
        
        return { success: true, message: 'All user tokens deactivated' };
      } else {
        const result = await response.json();
        console.error('❌ SIMPLE: Failed to deactivate all user tokens:', result);
        return { success: false, error: result.error || 'Deactivation failed' };
      }

    } catch (error: any) {
      console.error('❌ SIMPLE: Error deactivating all user tokens:', error);
      return { success: false, error: error.message || 'Deactivation failed' };
    }
  }

  /**
   * Check if token is registered
   */
  async isTokenRegistered(): Promise<boolean> {
    try {
      const registered = await AsyncStorage.getItem('token_registered');
      return registered === 'true';
    } catch (error) {
      console.error('❌ SIMPLE: Error checking token registration:', error);
      return false;
    }
  }

  /**
   * Get current stored token
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('current_push_token');
    } catch (error) {
      console.error('❌ SIMPLE: Error getting current token:', error);
      return null;
    }
  }

  /**
   * Send test notification to current device
   */
  async sendTestNotification(): Promise<ApiResponse> {
    try {
      console.log('🧪 SIMPLE: Sending test notification...');

      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}/api/push-tokens/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test notification from your CRM app!',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ SIMPLE: Test notification sent successfully');
        return { success: true, message: 'Test notification sent' };
      } else {
        console.error('❌ SIMPLE: Test notification failed:', result);
        return { success: false, error: result.error || 'Test notification failed' };
      }

    } catch (error: any) {
      console.error('❌ SIMPLE: Error sending test notification:', error);
      return { success: false, error: error.message || 'Test notification failed' };
    }
  }
}

export default SimpleTokenService;