import React, { createContext, useContext } from 'react';
import { useAuth as useAuthCore } from '../../core/hooks/useAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Use the core useAuth hook
  const authCore = useAuthCore();
  
  // Provide the same interface
  const contextValue = {
    ...authCore,
    // Add any additional context-specific methods here if needed
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};