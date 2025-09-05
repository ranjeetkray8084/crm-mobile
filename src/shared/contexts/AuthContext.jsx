import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../../core/services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a proper fallback context instead of just logging a warning
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
        setError(null);
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000);
        });
        
        const authPromise = (async () => {
          // Check for stored credentials
          const currentUser = await AuthService.getCurrentUser();
          const token = await AuthService.getToken();

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
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        })();
        
        await Promise.race([authPromise, timeoutPromise]);
        
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
        }, 100);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      
      if (!AuthService || !AuthService.login) {
        const errorMsg = 'Authentication service not available';
        console.error('🔧 AuthProvider:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      const result = await AuthService.login(credentials);

      if (result && result.success) {
        
        // Extract user and token from the result
        const userData = result.user || result.data;
        const token = result.token || result.data?.accessToken;
        
        if (userData && token) {
          try {
            await AuthService.saveSession(userData, token);
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
            
            
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
      console.log('🔧 AuthProvider: Logging out...');
      setError(null);
      
      await AuthService.logout();
    } catch (error) {
      console.warn('🔧 Logout error:', error);
      setError(error.message || 'Logout failed');
    } finally {
      // Always clear local state regardless of API call result
      console.log('🔧 AuthProvider: Clearing local auth state');
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