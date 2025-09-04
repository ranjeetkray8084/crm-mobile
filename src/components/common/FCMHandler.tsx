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
        const result = await fcmService.initialize();
        if (result.success) {
          setIsInitialized(true);
          setInitializationError(null);
        } else {
          setInitializationError(result.error);
        }
      } catch (error) {
        setInitializationError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeFCM();
  }, [fcmService]);

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user && isInitialized) {
        try {
          const refreshResult = await fcmService.forceRefreshToken();
          if (refreshResult.success) {
            await fcmService.registerTokenWithBackend(user.userId);
          }
        } catch (error) {
          // Handle error silently
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user, isInitialized, fcmService]);

  useEffect(() => {
    const handleUserLogout = async () => {
      if (!isAuthenticated && isInitialized) {
        try {
          await fcmService.clearAll();
        } catch (error) {
          // Handle error silently
        }
      }
    };

    handleUserLogout();
  }, [isAuthenticated, isInitialized, fcmService]);

  useEffect(() => {
    return () => {
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
