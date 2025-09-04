// src/legacy/api/axios.js - Mobile-optimized version
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

// Safely import expo-network with fallback
let Network;
try {
  Network = require('expo-network');
} catch (error) {
  console.warn('expo-network not available:', error.message);
  Network = null;
}

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  // Try to get from expo constants first
  if (Constants.expoConfig?.extra?.apiBaseUrl) {
    console.log('Using API base URL from expo config:', Constants.expoConfig.extra.apiBaseUrl);
    return Constants.expoConfig.extra.apiBaseUrl;
  }
  
  // Try to get from local config
  try {
    const { getApiBaseUrl: getLocalApiUrl } = require('../../core/config/api.config');
    const localUrl = getLocalApiUrl();
    if (localUrl) {
      console.log('Using API base URL from local config:', localUrl);
      return localUrl;
    }
  } catch (error) {
    console.log('Local config not available, using fallback');
  }
  
  // Fallback to environment variable or default
  const fallbackUrl = process.env.API_BASE_URL || 'https://backend.leadstracker.in';
  console.log('Using fallback API base URL:', fallbackUrl);
  return fallbackUrl;
};

// Check network connectivity with fallback
const checkNetworkConnectivity = async () => {
  try {
    // Try to use expo-network if available
    if (Network && typeof Network.getNetworkStateAsync === 'function') {
      const networkState = await Network.getNetworkStateAsync();
      console.log('Network state:', networkState);
      return networkState.isConnected && networkState.isInternetReachable;
    }
    
    // Fallback: assume connected if expo-network is not available
    console.log('expo-network not available, assuming network is connected');
    return true;
  } catch (error) {
    console.warn('Failed to check network state:', error);
    // Assume connected if check fails to avoid blocking requests
    return true;
  }
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000,
});

// ✅ Enhanced request interceptor with security measures
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Check network connectivity first
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        throw new Error('No network connectivity');
      }

      console.log('Making request to:', config.baseURL + config.url);
      
      // Add authentication token if available - use same key as web version
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token found and added to request');
      } else {
        console.log('⚠️ No authentication token found');
      }

      // Add security headers
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['X-Client-Version'] = '1.0.0';
      
      // Add timestamp for request tracking
      config.headers['X-Request-Timestamp'] = new Date().toISOString();

      // Validate request data
      if (config.data && typeof config.data === 'object') {
        // Don't remove password for authentication endpoints
        const isAuthEndpoint = config.url && config.url.includes('/api/auth/');
        
        if (!isAuthEndpoint) {
          // Remove sensitive fields only for non-auth endpoints
          const sensitiveFields = ['password', 'ssn', 'creditCard'];
          sensitiveFields.forEach(field => {
            if (config.data[field]) {
              delete config.data[field];
            }
          });
        }
      }

      return config;
    } catch (error) {
      console.warn('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Enhanced response interceptor with security measures
axiosInstance.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (response.data && typeof response.data === 'object') {
      // Remove sensitive data from response if needed
      if (response.data.password) {
        delete response.data.password;
      }
    }
    return response;
  },
  async (error) => {
    // Enhanced error handling with network diagnostics
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network Error Details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        isNetworkConnected: await checkNetworkConnectivity()
      });
      
      // Provide more helpful error message
      error.message = 'Network connection failed. Please check your internet connection and try again.';
    }
    
    // Enhanced error handling with security
          if (error.response?.status === 401) {
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
        const isFollowUpEndpoint = error.config?.url?.includes('/followups');
        const isPushNotificationEndpoint = error.config?.url?.includes('/push-notifications');
        
        if (!isAuthEndpoint && !isFollowUpEndpoint && !isPushNotificationEndpoint) {
          // Clear invalid token and redirect to login
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('crm_token');
            await AsyncStorage.removeItem('crm_user');
          } catch (storageError) {
            console.warn('Failed to clear storage:', storageError);
          }
          
          // In React Native, you might want to trigger navigation to login
          // This could be done through a navigation service or context
          console.log('Authentication failed, please login again');
        }
      }
    
    return Promise.reject(error);
  }
);

// ✅ Security utilities
export const securityUtils = {
  // Validate token format
  isValidToken: (token) => {
    if (!token || typeof token !== 'string') return false;
    // Basic JWT format validation
    const parts = token.split('.');
    return parts.length === 3;
  },
  
  // Sanitize input data
  sanitizeInput: (data) => {
    if (typeof data === 'string') {
      // Remove potentially dangerous characters
      return data.replace(/[<>]/g, '');
    }
    return data;
  }
};

export default axiosInstance;
