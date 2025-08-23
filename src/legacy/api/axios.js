// src/legacy/api/axios.js - Mobile-optimized version
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  // Try to get from expo constants first
  if (Constants.expoConfig?.extra?.apiBaseUrl) {
    console.log('Using API base URL from expo config:', Constants.expoConfig.extra.apiBaseUrl);
    return Constants.expoConfig.extra.apiBaseUrl;
  }
  
  // Fallback to environment variable or default
  const fallbackUrl = process.env.API_BASE_URL || 'http://192.168.1.26:8082';
  console.log('Using fallback API base URL:', fallbackUrl);
  return fallbackUrl;
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ✅ Enhanced request interceptor with security measures
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      console.log('Making request to:', config.baseURL + config.url);
      
      // Add authentication token if available
      const token = await AsyncStorage.getItem('crm_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
    // Enhanced error handling with security
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
      const isFollowUpEndpoint = error.config?.url?.includes('/followups');
      
      if (!isAuthEndpoint && !isFollowUpEndpoint) {
        // Clear invalid token and redirect to login
        try {
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
