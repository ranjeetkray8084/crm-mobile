import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../../core/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a proper fallback context instead of just logging a warning
    console.log('🔧 useAuth: Context not available, using fallback (this is normal during initial render)');
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      isReady: false,
      error: null,
      login: async () => ({ success: false, error: 'Auth context not available' }),
      logout: async () => {},
      updateUser: async () => {},
      sendOtp: async () => ({ success: false, error: 'Auth context not available' }),
      verifyOtp: async () => ({ success: false, error: 'Auth context not available' }),
      resetPasswordWithOtp: async () => ({ success: false, error: 'Auth context not available' })
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔧 AuthProvider: Initializing...');
        setError(null);
        
        // Check for stored credentials
        const currentUser = await AuthService.getCurrentUser();
        const token = await AuthService.getToken();

        console.log('🔧 AuthProvider: Stored user:', !!currentUser, 'Stored token:', !!token);

        if (currentUser && token) {
          // Set axios header for future requests
          try {
            AuthService.setAxiosHeader(token);
          } catch (headerError) {
            console.warn('🔧 Could not set axios header:', headerError);
          }
          
          // Since backend doesn't have session check, we'll just use stored credentials
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('🔧 AuthProvider: User authenticated from stored credentials');

          // Ensure notification setup also runs on cold start if not done
          try {
            const setupDone = await AsyncStorage.getItem('notificationSetupComplete');
            if (setupDone !== 'true') {
              console.log('🔔 SIMPLE: Notification setup not complete on startup, initiating...');
              setTimeout(async () => {
                await checkAndShowNotificationPrompt(currentUser);
              }, 1000);
            }
          } catch (e) {
            console.warn('🔔 SIMPLE: Could not read notification setup flag:', e);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('🔧 AuthProvider: No stored credentials found');
        }
      } catch (error) {
        console.error('🔧 AuthProvider: Failed to initialize auth:', error);
        setError(error.message || 'Authentication initialization failed');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        // Mark the context as ready after initialization
        setTimeout(() => {
          setIsReady(true);
          console.log('🔧 AuthProvider: Context ready');
        }, 100);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    console.log('🔧 AuthProvider: login function called with:', { email: credentials.email, password: '***' });
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔧 AuthProvider: About to call AuthService.login...');
      
      if (!AuthService || !AuthService.login) {
        const errorMsg = 'Authentication service not available';
        console.error('🔧 AuthProvider:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      const result = await AuthService.login(credentials);
      console.log('🔧 AuthProvider: AuthService.login result:', result);

      if (result && result.success) {
        console.log('🔧 AuthProvider: Login successful, saving session...');
        
        // Extract user and token from the result
        const userData = result.user || result.data;
        const token = result.token || result.data?.accessToken;
        
        if (userData && token) {
          try {
            await AuthService.saveSession(userData, token);
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
            
            console.log('🔧 AuthProvider: User authenticated successfully:', userData);
            
            // Check if we should show notification permission prompt
            setTimeout(async () => {
              await checkAndShowNotificationPrompt(userData);
            }, 2000);
            
            return { success: true, user: userData, message: result.message || 'Login successful' };
          } catch (sessionError) {
            console.error('🔧 AuthProvider: Failed to save session:', sessionError);
            setError('Failed to save session');
            return { success: false, error: 'Failed to save session' };
          }
        } else {
          const errorMsg = 'Invalid response from server';
          console.error('🔧 AuthProvider:', errorMsg);
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } else {
        const errorMsg = result?.error || 'Login failed';
        console.log('🔧 AuthProvider: Login failed:', errorMsg);
        setError(errorMsg);
        return { 
          success: false, 
          error: errorMsg,
          statusCode: result?.statusCode
        };
      }
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      console.error('🔧 AuthProvider: Login error caught:', error);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔧 SIMPLE: Logging out...');
      setError(null);
      
      // Deactivate push token before logout
      if (user && user.id) {
        try {
          console.log('🔔 SIMPLE: Deactivating push token for current device...');
          const SimpleTokenService = (await import('../../core/services/SimpleTokenService')).default;
          const tokenService = SimpleTokenService.getInstance();
          
          await tokenService.deactivateCurrentDevice();
          console.log('✅ SIMPLE: Push token deactivated');
        } catch (tokenError) {
          console.warn('⚠️ SIMPLE: Failed to deactivate push token:', tokenError);
        }
      }
      
      // Clear notification setup
      await AsyncStorage.removeItem('notificationSetupComplete');
      
      // Call auth service logout
      await AuthService.logout();
    } catch (error) {
      console.warn('🔧 SIMPLE: Logout error:', error);
      setError(error.message || 'Logout failed');
    } finally {
      // Always clear local state regardless of API call result
      console.log('🔧 SIMPLE: Clearing local auth state');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      setError(null);
      const newUserData = { ...user, ...updatedUserData };
      const token = await AuthService.getToken();
      await AuthService.saveSession(newUserData, token);
      setUser(newUserData);
    } catch (error) {
      console.warn('🔧 Failed to update user:', error);
      setError(error.message || 'Failed to update user');
    }
  };

  const sendOtp = async (email) => {
    try {
      setError(null);
      return await AuthService.sendOtp(email);
    } catch (error) {
      console.error('🔧 Failed to send OTP:', error);
      setError(error.message || 'Failed to send OTP');
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };
  
  const verifyOtp = async (email, otp) => {
    try {
      setError(null);
      return await AuthService.verifyOtp(email, otp);
    } catch (error) {
      console.error('🔧 Failed to verify OTP:', error);
      setError(error.message || 'Failed to verify OTP');
      return { success: false, error: error.message || 'Failed to verify OTP' };
    }
  };
  
  const resetPasswordWithOtp = async (email, newPassword) => {
    try {
      setError(null);
      return await AuthService.resetPasswordWithOtp(email, newPassword);
    } catch (error) {
      console.error('🔧 Failed to reset password:', error);
      setError(error.message || 'Failed to reset password');
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  const checkAndShowNotificationPrompt = async (userData) => {
    try {
      console.log('🔔 SIMPLE: Setting up notifications for user:', userData.email);
      
      // Import notification service and simple token service
      const NotificationService = (await import('../../core/services/NotificationService')).default;
      const SimpleTokenService = (await import('../../core/services/SimpleTokenService')).default;
      
      const notificationService = NotificationService.getInstance();
      const tokenService = SimpleTokenService.getInstance();
      
      // Check if notifications are supported (not in Expo Go)
      if (!notificationService.isFullySupported()) {
        console.log('⚠️ SIMPLE: Notifications not supported in current environment (Expo Go)');
        return;
      }
      
      // Simple approach: Always try to setup notifications on login
      console.log('🔔 SIMPLE: Requesting notification permission...');
      
      // Request permission
      const permissionGranted = await notificationService.requestPermissions();
      
      if (permissionGranted) {
        console.log('✅ SIMPLE: Notification permission granted');
        
        // Generate push token
        const pushToken = await notificationService.getPushToken();

        if (!pushToken) {
          console.log('⚠️ SIMPLE: No real Expo token (likely Expo Go). Skipping registration.');
          return;
        }

        const resolvedUserId = userData?.userId ?? userData?.id;
        if (resolvedUserId) {
          console.log('🔔 SIMPLE: Registering push token with backend for userId:', resolvedUserId);
          
          const result = await tokenService.registerToken(resolvedUserId, pushToken);
          
          if (result.success) {
            console.log('✅ SIMPLE: Push token registered successfully');
            await AsyncStorage.setItem('notificationSetupComplete', 'true');
          } else {
            console.error('❌ SIMPLE: Failed to register push token:', result.error);
          }
        }
      } else {
        console.log('🔕 SIMPLE: Notification permission denied');
        await AsyncStorage.setItem('notificationSetupComplete', 'false');
      }
    } catch (error) {
      console.error('❌ SIMPLE: Error setting up notifications:', error);
    }
  };

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    isReady,
    error,
    login,
    logout,
    updateUser,
    sendOtp,
    verifyOtp,
    resetPasswordWithOtp
  };

  console.log('🔧 AuthProvider: Rendering with context value:', {
    user: !!user,
    loading,
    isAuthenticated,
    isReady,
    error: !!error
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};