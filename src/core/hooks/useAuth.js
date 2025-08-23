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
        const currentUser = await AuthService.getCurrentUser();
        const token = await AuthService.getToken();

        if (currentUser && token) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Failed to initialize auth:', error);
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
        await AuthService.saveSession(result.user, result.token);
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        console.log('useAuth: Login failed:', result?.error || 'Unknown error');
        return { success: false, error: result?.error || 'Login failed' };
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
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Always clear local state regardless of API call result
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
