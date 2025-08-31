import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getApiBaseUrl, API_ENDPOINTS } from '../config/api.config';

export interface TokenRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class TokenRegistrationService {
  private static instance: TokenRegistrationService;
  private currentToken: string | null = null;

  static getInstance(): TokenRegistrationService {
    console.log('🔔 DEBUG: TokenRegistrationService.getInstance() called');
    if (!TokenRegistrationService.instance) {
      console.log('🔔 DEBUG: Creating new TokenRegistrationService instance');
      TokenRegistrationService.instance = new TokenRegistrationService();
      console.log('✅ DEBUG: New TokenRegistrationService instance created');
    } else {
      console.log('🔔 DEBUG: Returning existing TokenRegistrationService instance');
    }
    return TokenRegistrationService.instance;
  }

  constructor() {
    console.log('🔔 DEBUG: TokenRegistrationService constructor called');
    this.currentToken = null;
    console.log('✅ DEBUG: TokenRegistrationService constructor completed');
  }

  /**
   * Register push token with backend
   */
  async registerToken(token: string): Promise<TokenRegistrationResponse> {
    try {
      console.log('🔔 DEBUG: TokenRegistrationService.registerToken() called');
      console.log('🔔 DEBUG: Token to register:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('🔔 DEBUG: Token length:', token?.length);
      
      const authToken = await AsyncStorage.getItem('token');
      console.log('🔔 DEBUG: Auth token available:', !!authToken, authToken ? authToken.substring(0, 20) + '...' : 'null');
      
      if (!authToken) {
        console.log('⚠️ DEBUG: No auth token available for token registration');
        return {
          success: false,
          error: 'No authentication token available'
        };
      }

      const baseURL = getApiBaseUrl();
      console.log('🔔 DEBUG: Using base URL:', baseURL);
      console.log('🔔 DEBUG: Full API endpoint:', `${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.REGISTER}`);
      
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

      console.log('🔔 DEBUG: Backend response status:', response.status);
      console.log('🔔 DEBUG: Backend response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ DEBUG: Token registered successfully with backend:', data);
        
        // Store token locally
        this.currentToken = token;
        await AsyncStorage.setItem('pushToken', token);
        
        return {
          success: true,
          message: 'Push token registered successfully'
        };
      } else {
        const errorData = await response.text();
        console.error('❌ DEBUG: Failed to register token:', response.status, response.statusText, errorData);
        
        return {
          success: false,
          error: `Backend error: ${response.status} ${response.statusText}`
        };
      }
    } catch (error: any) {
      console.error('❌ DEBUG: Error registering token with backend:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  /**
   * Deactivate token on logout
   */
  async deactivateToken(): Promise<TokenRegistrationResponse> {
    try {
      console.log('🔔 DEBUG: TokenRegistrationService: Deactivating token...');
      
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        console.log('⚠️ DEBUG: No auth token available for token deactivation');
        return {
          success: false,
          error: 'No authentication token available'
        };
      }

      const baseURL = getApiBaseUrl();
      const response = await fetch(`${baseURL}${API_ENDPOINTS.PUSH_NOTIFICATIONS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log('✅ DEBUG: Token deactivated successfully');
        
        // Clear local token
        this.currentToken = null;
        await AsyncStorage.removeItem('pushToken');
        
        return {
          success: true,
          message: 'Token deactivated successfully'
        };
      } else {
        console.error('❌ DEBUG: Failed to deactivate token:', response.status, response.statusText);
        return {
          success: false,
          error: `Backend error: ${response.status} ${response.statusText}`
        };
      }
    } catch (error: any) {
      console.error('❌ DEBUG: Error deactivating token:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  /**
   * Get current registered token
   */
  async getCurrentToken(): Promise<string | null> {
    if (this.currentToken) {
      return this.currentToken;
    }
    
    const storedToken = await AsyncStorage.getItem('pushToken');
    if (storedToken) {
      this.currentToken = storedToken;
      return storedToken;
    }
    
    return null;
  }

  /**
   * Check if token is registered
   */
  async isTokenRegistered(): Promise<boolean> {
    const token = await this.getCurrentToken();
    return token !== null;
  }

  /**
   * Refresh token registration (useful after app restart)
   */
  async refreshTokenRegistration(): Promise<TokenRegistrationResponse> {
    try {
      console.log('🔔 DEBUG: TokenRegistrationService: Refreshing token registration...');
      
      const token = await this.getCurrentToken();
      if (!token) {
        console.log('⚠️ DEBUG: No token available to refresh');
        return {
          success: false,
          error: 'No token available to refresh'
        };
      }

      return await this.registerToken(token);
    } catch (error: any) {
      console.error('❌ DEBUG: Error refreshing token registration:', error);
      return {
        success: false,
        error: `Refresh error: ${error.message}`
      };
    }
  }
}

export default TokenRegistrationService;
