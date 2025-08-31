// Authentication Hook - Reusable for Web & Mobile
import React, { useState, useEffect } from 'react';

// Direct import - let's see if this works
import { AuthService } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setError(null);
        // Check for stored credentials
        const currentUser = await AuthService.getCurrentUser();
        const token = await AuthService.getToken();

        if (currentUser && token) {
          // Set axios header for future requests
          try {
            AuthService.setAxiosHeader(token);
          } catch (headerError) {
            console.warn('Could not set axios header:', headerError);
          }
          
          // Since backend doesn't have session check, we'll just use stored credentials
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('useAuth: Failed to initialize auth:', error);
        setError(error.message || 'Authentication initialization failed');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    console.log('useAuth: login function called with:', { email: credentials.email, password: '***' });
    setLoading(true);
    setError(null);
    
    try {
      console.log('useAuth: About to call AuthService.login...');
      console.log('useAuth: AuthService object:', AuthService);
      console.log('useAuth: AuthService.login method:', AuthService?.login);
      
      if (!AuthService || !AuthService.login) {
        const errorMsg = 'Authentication service not available';
        console.error('useAuth:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      const result = await AuthService.login(credentials);
      console.log('useAuth: AuthService.login result:', result);
      console.log('useAuth: Result type:', typeof result);
      console.log('useAuth: Result keys:', result ? Object.keys(result) : 'undefined');

      if (result && result.success) {
        console.log('useAuth: Login successful, saving session...');
        
        // Extract user and token from the result
        const userData = result.user || result.data;
        const token = result.token || result.data?.accessToken;
        
        if (userData && token) {
          try {
            await AuthService.saveSession(userData, token);
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
            
            // No need for session refresh since backend doesn't have session check
            console.log('useAuth: Session refresh not needed (no backend session check)');
            
            console.log('useAuth: User authenticated successfully:', userData);
            return { success: true, user: userData, message: result.message || 'Login successful' };
          } catch (sessionError) {
            console.error('useAuth: Failed to save session:', sessionError);
            setError('Failed to save session');
            return { success: false, error: 'Failed to save session' };
          }
        } else {
          const errorMsg = 'Invalid response from server';
          console.error('useAuth:', errorMsg);
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } else {
        const errorMsg = result?.error || 'Login failed';
        console.log('useAuth: Login failed:', errorMsg);
        setError(errorMsg);
        return { 
          success: false, 
          error: errorMsg,
          statusCode: result?.statusCode
        };
      }
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      console.error('useAuth: Login error caught:', error);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('useAuth: Logging out...');
      setError(null);
      
      // No need to stop session refresh since we don't start it
      console.log('useAuth: Session refresh stop not needed (no refresh intervals)');
      
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
      setError(error.message || 'Logout failed');
    } finally {
      // Always clear local state regardless of API call result
      console.log('useAuth: Clearing local auth state');
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
      console.warn('Failed to update user:', error);
      setError(error.message || 'Failed to update user');
    }
  };

  // ✅ ADD THESE METHODS
  const sendOtp = async (email) => {
    try {
      setError(null);
      return await AuthService.sendOtp(email);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      setError(error.message || 'Failed to send OTP');
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };
  
  const verifyOtp = async (email, otp) => {
    try {
      setError(null);
      return await AuthService.verifyOtp(email, otp);
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      setError(error.message || 'Failed to verify OTP');
      return { success: false, error: error.message || 'Failed to verify OTP' };
    }
  };
  
  const resetPasswordWithOtp = async (email, newPassword) => {
    try {
      setError(null);
      return await AuthService.resetPasswordWithOtp(email, newPassword);
    } catch (error) {
      console.error('Failed to reset password:', error);
      setError(error.message || 'Failed to reset password');
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    updateUser,
    sendOtp,
    verifyOtp,
    resetPasswordWithOtp
  };
};
