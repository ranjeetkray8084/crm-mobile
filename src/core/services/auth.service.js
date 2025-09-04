// Authentication Service - Reusable for Web & Mobile
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../legacy/api/axios';
import '../config/firebase.direct'; // Initialize Firebase
import { API_ENDPOINTS } from './api.endpoints';
import FCMService from './fcm.service';

export class AuthService {
  static SESSION_KEYS = {
    TOKEN: 'token',
    USER: 'user',
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
    
    try {
      console.log('AuthService: Attempting login to:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('AuthService: Credentials:', { email: credentials.email, password: '***' });
      
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

      // 🔔 Initialize and register push notifications (FCM)
      try {
        console.log('🔥 AuthService: Initializing FCM notifications...');
        const fcmService = new FCMService();
        
        // Force regenerate token for fresh login
        const tokenResult = await fcmService.regenerateFCMToken();
        if (!tokenResult.success) {
          console.log('🔥 AuthService: Failed to regenerate FCM token:', tokenResult.error);
        }
        
        const fcmResult = await fcmService.initialize();
        
        if (fcmResult.success) {
          console.log('🔥 AuthService: FCM service initialized successfully');
          
          // Store user ID for FCM service
          await AsyncStorage.setItem('user_id', user.userId.toString());
          
          // Register FCM token with backend
          const registerResult = await fcmService.registerFCMToken();
          if (registerResult.success) {
            console.log('🔥 AuthService: FCM token registered successfully');
          } else {
            console.log('🔥 AuthService: Failed to register FCM token:', registerResult.error);
          }
        } else {
          if (fcmResult.isFirebaseError) {
            console.log('🔥 AuthService: Firebase not configured - FCM disabled');
            console.log('🔥 AuthService: To enable FCM, ensure google-services.json is properly configured');
          } else {
            console.log('🔥 AuthService: FCM initialization failed:', fcmResult.error);
            // Try to register token anyway if we have one
            try {
              const registerResult = await fcmService.registerFCMToken();
              if (registerResult.success) {
                console.log('🔥 AuthService: FCM token registered successfully (fallback)');
              }
            } catch (error) {
              console.log('🔥 AuthService: Fallback token registration failed:', error.message);
            }
          }
        }
      } catch (fcmError) {
        console.error('🔥 AuthService: FCM error:', fcmError);
        // Don't fail login if FCM fails
      }

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
      // 🔥 Clear FCM notifications before logout
      try {
        console.log('🔥 AuthService: Clearing FCM notifications...');
        const fcmService = new FCMService();
        
        // First, get the current FCM token so we can properly unregister it
        const tokenResult = await fcmService.getFCMToken();
        if (tokenResult.success) {
          console.log('🔥 AuthService: FCM token loaded for logout');
        }
        
        const clearResult = await fcmService.clearAll();
        
        if (clearResult.success) {
          console.log('🔥 AuthService: FCM data cleared successfully');
        } else {
          console.log('🔥 AuthService: Failed to clear FCM data:', clearResult.error);
        }
      } catch (fcmError) {
        console.error('🔥 AuthService: FCM cleanup error:', fcmError);
        // Continue with logout even if FCM cleanup fails
      }

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
    // Backend doesn't have session check API, so we'll just return success
    // The token validation will happen naturally when making API calls
    console.log('AuthService.checkSession: Backend has no session check API, returning success');
    return {
      success: true,
      data: { message: 'No session check available' },
      message: 'Session check not implemented'
    };
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
      // Try new storage keys first
      let user = await AsyncStorage.getItem(this.SESSION_KEYS.USER);
      
      // If not found, try old storage keys and migrate
      if (!user) {
        const oldUser = await AsyncStorage.getItem('crm_user');
        if (oldUser) {
          console.log('AuthService: Found user in old storage key, migrating...');
          await this.migrateOldStorage();
          user = await AsyncStorage.getItem(this.SESSION_KEYS.USER);
        }
      }
      
      console.log('AuthService.getCurrentUser: Raw user data from storage:', user);
      const parsedUser = user ? JSON.parse(user) : null;
      console.log('AuthService.getCurrentUser: Parsed user data:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('AuthService.getCurrentUser: Error getting user:', error);
      return null;
    }
  }

  /**
   * Get current user token
   * @returns {string|null} JWT token
   */
  static async getToken() {
    try {
      // Try new storage keys first
      let token = await AsyncStorage.getItem(this.SESSION_KEYS.TOKEN);
      
      // If not found, try old storage keys and migrate
      if (!token) {
        const oldToken = await AsyncStorage.getItem('crm_token');
        if (oldToken) {
          console.log('AuthService: Found token in old storage key, migrating...');
          await this.migrateOldStorage();
          token = await AsyncStorage.getItem(this.SESSION_KEYS.TOKEN);
        }
      }
      
      console.log('AuthService.getToken: Token from storage:', token ? 'Present' : 'Missing');
      return token;
    } catch (error) {
      console.error('AuthService.getToken: Error getting token:', error);
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
      console.log('AuthService.saveSession: Starting...');
      console.log('AuthService.saveSession: userData:', userData);
      console.log('AuthService.saveSession: token:', token ? 'Present' : 'Missing');
      
      if (!userData) {
        console.error('AuthService.saveSession: No user data provided');
        return;
      }

      if (!token) {
        console.error('AuthService.saveSession: No token provided');
        return;
      }

      await AsyncStorage.setItem(this.SESSION_KEYS.USER, JSON.stringify(userData));
      await AsyncStorage.setItem(this.SESSION_KEYS.TOKEN, token);
      this.setAxiosHeader(token);
      
      console.log('AuthService.saveSession: Session saved successfully');
      console.log('AuthService.saveSession: User stored:', await this.getCurrentUser());
      console.log('AuthService.saveSession: Token stored:', await this.getToken());

    } catch (error) {
      console.error('AuthService.saveSession: Failed to save session:', error);
    }
  }

  /**
   * Set axios authorization header
   * @param {string} token - JWT token
   */
  static setAxiosHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Refresh session and validate token
   * @returns {Promise<Object>} Result
   */
  static async refreshSession() {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();

      if (!token || !user) {
        return {
          success: false,
          error: 'No stored session found'
        };
      }

      // Since backend doesn't have session check, we'll just refresh the axios header
      // Token validation will happen naturally when making API calls
      this.setAxiosHeader(token);
      
      console.log('Session refresh: Using stored credentials (no backend session check)');
      return {
        success: true,
        user,
        token,
        message: 'Session refreshed with stored credentials'
      };
    } catch (error) {
      console.error('Session refresh failed:', error);
      return {
        success: false,
        error: 'Failed to refresh session'
      };
    }
  }

  /**
   * Start automatic session refresh
   * @param {number} intervalMinutes - Refresh interval in minutes (default: 15)
   */
  static startSessionRefresh(intervalMinutes = 15) {
    // Since backend doesn't have session check, we don't need to refresh
    console.log('Session refresh: Not needed (no backend session check)');
    return;
    
    // Old code removed:
    // const intervalMs = intervalMinutes * 60 * 1000;
    // 
    // // Clear any existing interval
    // if (this.refreshInterval) {
    //   clearInterval(this.refreshInterval);
    // }
    // 
    // this.refreshInterval = setInterval(async () => {
    //   try {
    //     console.log('Refreshing session...');
    //     const result = await this.refreshSession();
    //     
    //     if (!result.success) {
    //       console.log('Session refresh failed:', result.error);
    //       // Could emit an event here to notify the app
    //     }
    //   } catch (error) {
    //     console.error('Session refresh error:', error);
    //   }
    // }, intervalMs);
    // 
    // console.log(`Session refresh started with ${intervalMinutes} minute interval`);
  }

  /**
   * Stop automatic session refresh
   */
  static stopSessionRefresh() {
    // Since we don't start refresh intervals, nothing to stop
    console.log('Session refresh: Nothing to stop (no refresh intervals)');
    return;
    
    // Old code removed:
    // if (this.refreshInterval) {
    //   clearInterval(this.refreshInterval);
    //   this.refreshInterval = null;
    //   console.log('Session refresh stopped');
    // }
  }

  /**
   * Migrate old storage keys to new ones
   */
  static async migrateOldStorage() {
    try {
      console.log('AuthService: Starting storage migration...');
      
      // Get old data
      const oldUser = await AsyncStorage.getItem('crm_user');
      const oldToken = await AsyncStorage.getItem('crm_token');
      
      if (oldUser && oldToken) {
        console.log('AuthService: Found old storage data, migrating...');
        
        // Save to new keys
        await AsyncStorage.setItem(this.SESSION_KEYS.USER, oldUser);
        await AsyncStorage.setItem(this.SESSION_KEYS.TOKEN, oldToken);
        
        // Clear old keys
        await AsyncStorage.removeItem('crm_user');
        await AsyncStorage.removeItem('crm_token');
        
        console.log('AuthService: Storage migration completed successfully');
        return true;
      } else {
        console.log('AuthService: No old storage data found to migrate');
        return false;
      }
    } catch (error) {
      console.error('AuthService: Storage migration failed:', error);
      return false;
    }
  }
}