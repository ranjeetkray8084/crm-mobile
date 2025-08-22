// Authentication Service - Reusable for Web & Mobile
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from './api.endpoints';

// Configure base URL - can be overridden by environment variables
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.26:8082';
axios.defaults.baseURL = BASE_URL;

console.log('API Base URL:', BASE_URL);

export class AuthService {
  static SESSION_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    CURRENT_TASK: 'currentTaskId',
    EXCEL_STATE: 'excelEditorState',
    LAST_ROUTE: 'lastRoute'
  };

  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data and token
   */
  static async login(credentials) {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Extract token and user data - EXACTLY matching crm-frontend structure
      const token = response.data.accessToken || response.data.token;
      const user = {
        userId: response.data.userId || response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
        companyName: response.data.companyName,
        companyId: response.data.companyId,
        img: response.data.avatar || response.data.img,
      };

      if (!token) {
        return {
          success: false,
          error: 'No authentication token received from server'
        };
      }

      // Validate essential user data - EXACTLY matching crm-frontend validation
      if (!user.userId || !user.role) {
        return {
          success: false,
          error: 'Incomplete user data received from server'
        };
      }

      // For non-DEVELOPER roles, companyId should be present - EXACTLY matching crm-frontend
      if (user.role !== 'DEVELOPER' && !user.companyId) {
        return {
          success: false,
          error: 'Company information missing for user'
        };
      }

      // Save session with EXACTLY the same data structure
      await this.saveSession(user, token);

      // Configure axios with new token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Return success response matching crm-frontend structure
      return {
        success: true,
        user,
        token,
        redirectTo: '/dashboard'
      };
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.msg ||
          errorData.detail ||
          errorData.description ||
          (typeof errorData === 'string' ? errorData : 'Login failed');
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Check if user is deactivated - EXACTLY matching crm-frontend
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        if (errorData.message && errorData.message.includes('deactivated')) {
          return {
            success: false,
            error: errorMessage,
            isDeactivated: true,
            userEmail: credentials.email
          };
        }
      }

      return {
        success: false,
        error: errorMessage
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
   * Clear all session data - EXACTLY matching crm-frontend
   */
  static async clearSession() {
    try {
      await AsyncStorage.multiRemove(Object.values(this.SESSION_KEYS));
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error clearing session:', error);
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
   * Get current user from storage - EXACTLY matching crm-frontend
   * @returns {Promise<Object|null>} User data
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
   * Get current user token - EXACTLY matching crm-frontend
   * @returns {Promise<string|null>} JWT token
   */
  static async getToken() {
    try {
      return await AsyncStorage.getItem(this.SESSION_KEYS.TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated - EXACTLY matching crm-frontend
   * @returns {Promise<boolean>}
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
   * Save user session - EXACTLY matching crm-frontend structure
   * @param {Object} userData - User data with userId, email, name, role, companyName, companyId, img
   * @param {string} token - JWT token
   */
  static async saveSession(userData, token) {
    try {
      if (!userData || !token) {
        return;
      }

      // Store user data with EXACTLY the same structure as crm-frontend
      await AsyncStorage.setItem(this.SESSION_KEYS.USER, JSON.stringify(userData));
      await AsyncStorage.setItem(this.SESSION_KEYS.TOKEN, token);
      
      // Set axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Update user data - EXACTLY matching crm-frontend
   * @param {Object} updatedUserData - Updated user data
   */
  static async updateUser(updatedUserData) {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updatedUserData };
        await AsyncStorage.setItem(this.SESSION_KEYS.USER, JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  /**
   * Refresh token - EXACTLY matching crm-frontend
   * @returns {Promise<Object>} Result
   */
  static async refreshToken() {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      const newToken = response.data.accessToken || response.data.token;
      
      if (newToken) {
        await AsyncStorage.setItem(this.SESSION_KEYS.TOKEN, newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { success: true, token: newToken };
      }
      
      return { success: false, error: 'No new token received' };
    } catch (error) {
      return { success: false, error: 'Token refresh failed' };
    }
  }
}