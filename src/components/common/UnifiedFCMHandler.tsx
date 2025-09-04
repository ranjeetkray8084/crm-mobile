// FCM Handler - Integrates FCM with backend API
import React, { useEffect, useState } from 'react';
import FCMService from '../../core/services/fcm.service';
import { useAuth } from '../../shared/contexts/AuthContext';

const FCMHandler: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [fcmService] = useState(new FCMService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        console.log('🔥 FCMHandler: Initializing FCM...');
        
        const result = await fcmService.initialize();
        if (result.success) {
          setIsInitialized(true);
          setInitializationError(null);
          console.log('🔥 FCMHandler: FCM initialized successfully');
        } else {
          console.error('🔥 FCMHandler: FCM initialization failed:', result.error);
          setInitializationError(result.error);
        }
      } catch (error) {
        console.error('🔥 FCMHandler: FCM initialization error:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeFCM();
  }, [fcmService]);

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user && isInitialized) {
        try {
          console.log('🔥 FCMHandler: User logged in, registering FCM token...');
          
          // Force refresh token for new login
          const refreshResult = await fcmService.forceRefreshToken();
          if (!refreshResult.success) {
            console.error('🔥 FCMHandler: Failed to refresh FCM token:', refreshResult.error);
            return;
          }
          
          const result = await fcmService.registerTokenWithBackend(user.userId);
          if (result.success) {
            console.log('🔥 FCMHandler: FCM token registered with backend for user:', user.userId);
          } else {
            console.error('🔥 FCMHandler: FCM token registration failed:', result.error);
          }
        } catch (error) {
          console.error('🔥 FCMHandler: User login handling error:', error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user, isInitialized, fcmService]);

  useEffect(() => {
    const handleUserLogout = async () => {
      if (!isAuthenticated && isInitialized) {
        try {
          console.log('🔥 FCMHandler: User logged out, cleaning up FCM...');
          
          await fcmService.clearAll();
          console.log('🔥 FCMHandler: FCM cleanup completed');
        } catch (error) {
          console.error('🔥 FCMHandler: FCM cleanup error:', error);
        }
      }
    };

    handleUserLogout();
  }, [isAuthenticated, isInitialized, fcmService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🔥 FCMHandler: Cleaning up...');
      fcmService.clearAll();
    };
  }, [fcmService]);

  // Expose FCM service for testing
  useEffect(() => {
    // Make FCM service available globally for testing
    (global as any).fcmService = fcmService;
  }, [fcmService]);

  return null; // This component doesn't render anything
};

export default FCMHandler;
