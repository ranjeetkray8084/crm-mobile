// Authentication Hook - Reusable for Web & Mobile
import { useState, useEffect } from 'react';

// Direct import - let's see if this works
import { AuthService } from '../services/auth.service';

console.log('=== useAuth hook loaded ===');
console.log('AuthService imported:', AuthService);
console.log('AuthService type:', typeof AuthService);
console.log('AuthService.login exists:', !!AuthService?.login);
console.log('AuthService.login type:', typeof AuthService?.login);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('useAuth: Initializing authentication...');
        
        // Check for stored credentials
        const currentUser = await AuthService.getCurrentUser();
        const token = await AuthService.getToken();

        console.log('useAuth: Stored user:', currentUser ? 'Yes' : 'No');
        console.log('useAuth: Stored token:', token ? 'Yes' : 'No');

        if (currentUser && token) {
          // Set axios header for future requests
          AuthService.setAxiosHeader(token);
          
          // Since backend doesn't have session check, we'll just use stored credentials
          console.log('useAuth: Using stored credentials (no backend session check)');
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // No need for session refresh since backend doesn't have session check
          console.log('useAuth: Session refresh not needed (no backend session check)');
        } else {
          console.log('useAuth: No stored credentials found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('useAuth: Failed to initialize auth:', error);
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
    
    try {
      console.log('useAuth: About to call AuthService.login...');
      console.log('useAuth: AuthService object:', AuthService);
      console.log('useAuth: AuthService.login method:', AuthService?.login);
      
      if (!AuthService || !AuthService.login) {
        console.error('useAuth: AuthService or AuthService.login is not available');
        return { success: false, error: 'Authentication service not available' };
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
          await AuthService.saveSession(userData, token);
          setUser(userData);
          setIsAuthenticated(true);
          
          // No need for session refresh since backend doesn't have session check
          console.log('useAuth: Session refresh not needed (no backend session check)');
          
          console.log('useAuth: User authenticated successfully:', userData);
          return { success: true, user: userData, message: result.message || 'Login successful' };
        } else {
          console.error('useAuth: Missing user data or token in response');
          return { success: false, error: 'Invalid response from server' };
        }
      } else {
        console.log('useAuth: Login failed:', result?.error || 'Unknown error');
        return { 
          success: false, 
          error: result?.error || 'Login failed',
          statusCode: result?.statusCode
        };
      }
    } catch (error) {
      console.error('useAuth: Login error caught:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('useAuth: Logging out...');
      
      // No need to stop session refresh since we don't start it
      console.log('useAuth: Session refresh stop not needed (no refresh intervals)');
      
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Always clear local state regardless of API call result
      console.log('useAuth: Clearing local auth state');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      const token = await AuthService.getToken();
      await AuthService.saveSession(newUserData, token);
      setUser(newUserData);
    } catch (error) {
      console.warn('Failed to update user:', error);
    }
  };

  // ✅ ADD THESE METHODS
  const sendOtp = (email) => AuthService.sendOtp(email);
  const verifyOtp = (email, otp) => AuthService.verifyOtp(email, otp);
  const resetPasswordWithOtp = (email, newPassword) =>
    AuthService.resetPasswordWithOtp(email, newPassword);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    sendOtp,
    verifyOtp,
    resetPasswordWithOtp
  };
};
