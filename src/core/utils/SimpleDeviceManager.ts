import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple device info without complex dependencies
class SimpleDeviceManager {
  private static instance: SimpleDeviceManager;

  static getInstance(): SimpleDeviceManager {
    if (!SimpleDeviceManager.instance) {
      SimpleDeviceManager.instance = new SimpleDeviceManager();
    }
    return SimpleDeviceManager.instance;
  }

  /**
   * Get simple device info for push notifications
   */
  async getDeviceInfo(): Promise<{
    deviceId: string;
    deviceName: string;
    platform: string;
  }> {
    try {
      console.log('📱 Getting simple device info...');

      // Try to get stored device ID first
      let deviceId = await AsyncStorage.getItem('simple_device_id');
      
      if (!deviceId) {
        // Generate simple unique device ID
        deviceId = this.generateSimpleDeviceId();
        await AsyncStorage.setItem('simple_device_id', deviceId);
        console.log('📱 Generated new device ID:', deviceId);
      } else {
        console.log('📱 Using existing device ID:', deviceId);
      }

      // Get platform info
      const platform = Platform.OS;
      
      // Generate simple device name
      const deviceName = this.generateDeviceName(platform);

      const deviceInfo = {
        deviceId,
        deviceName,
        platform
      };

      console.log('📱 Device info:', deviceInfo);
      return deviceInfo;

    } catch (error) {
      console.error('❌ Error getting device info:', error);
      
      // Fallback device info
      const fallbackInfo = {
        deviceId: `fallback-${Date.now()}`,
        deviceName: `${Platform.OS} Device`,
        platform: Platform.OS
      };
      
      console.log('📱 Using fallback device info:', fallbackInfo);
      return fallbackInfo;
    }
  }

  /**
   * Generate simple unique device ID
   */
  private generateSimpleDeviceId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const platform = Platform.OS;
    
    return `${platform}-${timestamp}-${random}`;
  }

  /**
   * Generate simple device name
   */
  private generateDeviceName(platform: string): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    switch (platform) {
      case 'ios':
        return `iPhone (${timestamp})`;
      case 'android':
        return `Android Device (${timestamp})`;
      default:
        return `Mobile Device (${timestamp})`;
    }
  }

  /**
   * Clear device info (for logout)
   */
  async clearDeviceInfo(): Promise<void> {
    try {
      console.log('📱 Clearing device info...');
      await AsyncStorage.removeItem('simple_device_id');
      console.log('✅ Device info cleared');
    } catch (error) {
      console.error('❌ Error clearing device info:', error);
    }
  }

  /**
   * Get current device ID
   */
  async getCurrentDeviceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('simple_device_id');
    } catch (error) {
      console.error('❌ Error getting current device ID:', error);
      return null;
    }
  }
}

export default SimpleDeviceManager;