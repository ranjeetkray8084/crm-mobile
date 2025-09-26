import React, { useState, useEffect, useCallback } from 'react';
import { FollowUpService } from '../services/followup.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTodayFollowUps = (companyId) => {
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get companyId from AsyncStorage if not provided
  const getCompanyId = useCallback(async () => {
    if (companyId) return companyId;
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.companyId;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from AsyncStorage:', error);
      return null;
    }
  }, [companyId]);

  const loadTodayFollowUps = useCallback(async () => {
    const currentCompanyId = await getCompanyId();
    if (!currentCompanyId) {
      setError('Company ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await FollowUpService.getTodayFollowUps(currentCompanyId);
      console.log('📞 useTodayFollowUps: API result:', result);
      
      if (result.success) {
        console.log('📞 useTodayFollowUps: Setting follow-ups:', result.data);
        setTodayFollowUps(result.data);
      } else {
        console.log('📞 useTodayFollowUps: Error:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('📞 useTodayFollowUps: Exception:', err);
      setError('Failed to load today\'s follow-ups');
    } finally {
      setLoading(false);
    }
  }, [getCompanyId]);

  // Load follow-ups on mount
  useEffect(() => {
    loadTodayFollowUps();
  }, [loadTodayFollowUps]);

  return {
    todayFollowUps,
    loading,
    error,
    loadTodayFollowUps
  };
}; 