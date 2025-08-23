// Authentication Service - Reusable for Web & Mobile
import axios from '../../legacy/api/axios';
import { API_ENDPOINTS } from './api.endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static SESSION_KEYS = {
    TOKEN: 'crm_token',
    USER: 'crm_user',
    CURRENT_TASK: 'currentTaskId',
    EXCEL_STATE: 'excelEditorState',
    LAST_ROUTE: 'lastRoute'
  };
  
  // Test method to verify the class is working
  static test() {
    console.log('=== AuthService.test() called ===');
    return { success: true, message: 'AuthService is working' };
  }
  
  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data and token
   */
  static async login(credentials) {
    console.log('=== AuthService.login START ===');
    console.log('AuthService: Attempting login to:', API_ENDPOINTS.AUTH.LOGIN);
    console.log('AuthService: Credentials:', { email: credentials.email, password: '***' });
    
    try {
      console.log('AuthService: Making axios POST request...');
      // 🔍 CRITICAL: Log the exact data being sent
      console.log('AuthService: Data being sent to backend:', JSON.stringify(credentials));
      console.log('AuthService: Credentials object:', credentials);
      console.log('AuthService: Credentials.email:', credentials.email);
      console.log('AuthService: Credentials.password:', credentials.password);
      console.log('AuthService: Credentials.password type:', typeof credentials.password);
      console.log('AuthService: Credentials.password length:', credentials.password?.length);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('AuthService: Response status:', response.status);
      console.log('AuthService: Response data:', response.data);

      // Extract token and user data
      const token = response.data.accessToken || response.data.token;
      const user = {
        userId: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
        companyName: response.data.companyName,
        companyId: response.data.companyId,
        img: response.data.avatar,
      };

      console.log('AuthService: Extracted user data:', user);
      console.log('AuthService: Token received:', token ? 'Yes' : 'No');

      if (!token) {
        console.error('AuthService: No token received');
        return {
          success: false,
          error: 'No authentication token received from server'
        };
      }

      // Validate essential user data
      if (!user.userId || !user.role) {
        console.error('AuthService: Incomplete user data');
        return {
          success: false,
          error: 'Incomplete user data received from server'
        };
      }

      // For non-DEVELOPER roles, companyId should be present
      if (user.role !== 'DEVELOPER' && !user.companyId) {
        console.error('AuthService: Missing company information');
        return {
          success: false,
          error: 'Company information missing for user'
        };
      }

      // Save session
      await this.saveSession(user, token);
      console.log('AuthService: Session saved successfully');

      // Configure axios with new token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Return success response with backend message
      console.log('=== AuthService.login SUCCESS ===');
      const result = {
        success: true,
        data: response.data,
        user,
        token,
        message: response.data.message || 'Login successful',
        redirectTo: '/dashboard'
      };
      console.log('AuthService: Returning result:', result);
      return result;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      console.error('AuthService: Error response:', error.response?.data);
      console.error('AuthService: Error status:', error.response?.status);
      console.error('AuthService: Error message:', error.message);
      
      let errorMessage = 'Login failed';
      let errorDetails = {};

      if (error.response?.data) {
        const errorData = error.response.data;
        console.log('AuthService: Full error data:', errorData);
        
        // Try to extract meaningful error message
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.msg ||
          errorData.detail ||
          errorData.description ||
          (typeof errorData === 'string' ? errorData : 'Login failed');
        
        // Store additional error details
        errorDetails = {
          status: error.response.status,
          data: errorData,
          timestamp: new Date().toISOString()
        };
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific HTTP status codes
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account is deactivated or locked. Please contact support.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User account not found. Please check your email.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }

      console.log('=== AuthService.login ERROR ===');
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        statusCode: error.response?.status
      };
    }
  }

  /**
   * Send OTP for password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Result
   */
  static async sendOtp(email) {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.SEND_OTP, null, {
        params: { email }
      });

      return {
        success: true,
        data: response.data,
        message: 'OTP sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} Result
   */
  static async verifyOtp(email, otp) {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY_OTP, null, {
        params: { email, otp }
      });

      return {
        success: true,
        data: response.data,
        valid: response.data.valid
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'OTP verification failed'
      };
    }
  }

  /**
   * Reset password with OTP
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Result
   */
  static async resetPasswordWithOtp(email, newPassword) {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD_WITH_OTP, null, {
        params: { email, newPassword }
      });

      return {
        success: true,
        data: response.data,
        message: 'Password reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Password reset failed'
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Result
   */
  static async logout() {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.LOGOUT);
      await this.clearSession();
      return {
        success: true,
        data: response.data,
        message: 'Logged out successfully'
      };
    } catch (error) {
      await this.clearSession();
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed'
      };
    }
  }

  /**
   * Clear all session data
   */
  static async clearSession() {
    try {
      await Promise.all(
        Object.values(this.SESSION_KEYS).map(key => AsyncStorage.removeItem(key))
      );
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }

  /**
   * Check session validity
   * @returns {Promise<Object>} Result
   */
  static async checkSession() {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.CHECK_SESSION);
      return {
        success: true,
        data: response.data,
        message: 'Session active'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Session expired'
      };
    }
  }

  /**
   * Validate current token
   * @returns {Promise<Object>} Result
   */
  static async validateToken() {
    try {
      const response = await axios.get('/api/auth/validate-token');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token validation failed'
      };
    }
  }

  /**
   * Get current user from storage
   * @returns {Object|null} User data
   */
  static async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(this.SESSION_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get current user token
   * @returns {string|null} JWT token
   */
  static async getToken() {
    try {
      return await AsyncStorage.getItem(this.SESSION_KEYS.TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  static async isAuthenticated() {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch {
      return false;
    }
  }

  /**
   * Save user session
   * @param {Object} userData - User data
   * @param {string} token - JWT token
   */
  static async saveSession(userData, token) {
    try {
      if (!userData) {
        return;
      }

      if (!token) {
        return;
      }

      await AsyncStorage.setItem(this.SESSION_KEYS.USER, JSON.stringify(userData));
      await AsyncStorage.setItem(this.SESSION_KEYS.TOKEN, token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }
}