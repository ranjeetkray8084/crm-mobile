// FCM Handler - Integrates FCM with backend API
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../shared/contexts/AuthContext';

const FCMHandler: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [fcmService, setFcmService] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Dynamically import FCMService to avoid early initialization issues
        const FCMServiceModule = await import('../../core/services/fcm.service');
        const FCMService = FCMServiceModule.default;
        const service = new FCMService();
        setFcmService(service);

        const result = await service.initialize();
        if (result.success) {
          setIsInitialized(true);
          setInitializationError(null);
        } else {
          setInitializationError(result.error);
          console.warn('FCM initialization failed:', result.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setInitializationError(errorMessage);
        console.warn('FCM service not available:', errorMessage);
        // Don't crash the app, just log the warning
      }
    };

    // Only initialize if we're in a production build or if Firebase is available
    if (process.env.NODE_ENV === 'production' || typeof window !== 'undefined') {
      initializeFCM();
    } else {
      console.log('FCM initialization skipped in development mode');
    }
  }, []);

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user && isInitialized && fcmService) {
        try {
          const refreshResult = await fcmService.forceRefreshToken();
          if (refreshResult.success) {
            await fcmService.registerTokenWithBackend(user.userId);
          }
        } catch (error) {
          console.warn('FCM user login handling failed:', error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user, isInitialized, fcmService]);

  useEffect(() => {
    const handleUserLogout = async () => {
      if (!isAuthenticated && isInitialized && fcmService) {
        try {
          await fcmService.clearAll();
        } catch (error) {
          console.warn('FCM user logout handling failed:', error);
        }
      }
    };

    handleUserLogout();
  }, [isAuthenticated, isInitialized, fcmService]);

  useEffect(() => {
    return () => {
      if (fcmService) {
        try {
          fcmService.clearAll();
        } catch (error) {
          console.warn('FCM cleanup failed:', error);
        }
      }
    };
  }, [fcmService]);

  // Expose FCM service for testing
  useEffect(() => {
    if (fcmService) {
      // Make FCM service available globally for testing
      (global as any).fcmService = fcmService;
    }
  }, [fcmService]);

  return null; // This component doesn't render anything
};

export default FCMHandler;
