// Auth Context for Mobile CRM App
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../core/services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from AsyncStorage on app start - EXACTLY matching crm-frontend
    const loadUser = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (isAuth) {
          const userData = await AuthService.getCurrentUser();
          const token = await AuthService.getToken();
          if (userData && token) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear any invalid data - EXACTLY matching crm-frontend
        await AuthService.clearSession();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData, token) => {
    try {
      // Store user data and token - EXACTLY matching crm-frontend structure
      await AuthService.saveSession(userData, token);
      
      // Update context state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login context error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process');
      await AuthService.logout();
      console.log('AuthContext: AuthService.logout completed');
      setUser(null);
      setIsAuthenticated(false);
      console.log('AuthContext: State updated, isAuthenticated set to false');
      
      return { success: true };
    } catch (error) {
      console.error('Logout context error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await AuthService.updateUser(updatedUser);
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Update user context error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshAuth = async () => {
    try {
      await AuthService.refreshToken();
      const userData = await AuthService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      throw new Error('No user data after refresh');
    } catch (error) {
      console.error('Refresh auth error:', error);
      await logout();
      return { success: false, error: error.message };
    }
  };

  // OTP Methods - EXACTLY matching crm-frontend
  const sendOtp = async (email) => {
    try {
      return await AuthService.sendOtp(email);
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      return await AuthService.verifyOtp(email, otp);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPasswordWithOtp = async (email, newPassword) => {
    try {
      return await AuthService.resetPasswordWithOtp(email, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshAuth,
    sendOtp,
    verifyOtp,
    resetPasswordWithOtp,
    // Helper getters - EXACTLY matching crm-frontend structure
    get userId() {
      return user?.userId || user?.id;
    },
    get userRole() {
      return user?.role;
    },
    get companyId() {
      return user?.companyId;
    },
    get companyName() {
      return user?.companyName;
    },
    get userName() {
      return user?.name;
    },
    get userEmail() {
      return user?.email;
    },
    get userAvatar() {
      return user?.img;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
