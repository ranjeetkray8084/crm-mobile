// useProperties Hook - Mobile-optimized version for React Native/Expo
import { useState, useEffect, useCallback } from 'react';
import { PropertyService } from '../services/property.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProperties = (companyId, userId, userRole) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user info from AsyncStorage
  const getUserInfo = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('crm_user');
      const tokenData = await AsyncStorage.getItem('crm_token');
      
      if (!userData || !tokenData) {
        return null;
      }
      
      const user = JSON.parse(userData);
      return {
        companyId: companyId || user.companyId,
        userId: userId || user.userId || user.id,
        role: userRole || user.role,
        token: tokenData
      };
    } catch (error) {
      console.warn('Failed to get user info from storage:', error);
      return null;
    }
  }, [companyId, userId, userRole]);

  const fetchProperties = useCallback(async () => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      setError('Company ID is missing or user not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (userInfo.role === 'DIRECTOR') {
        result = await PropertyService.getPropertiesByCompany(userInfo.companyId);
      } else if (userInfo.role === 'ADMIN') {
        result = await PropertyService.getPropertiesVisibleToAdmin(userInfo.companyId, userInfo.userId);
      } else {
        result = await PropertyService.getPropertiesByUser(userInfo.companyId, userInfo.userId);
      }

      if (result.success) {
        const propertiesData = result.data || [];
        setProperties(propertiesData);
      } else {
        setError(result.error);
        console.error('❌ ' + result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to fetch properties: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      console.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  const createProperty = useCallback(async (propertyData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await PropertyService.createProperty(propertyData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the properties list
        await fetchProperties();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to create property: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchProperties]);

  const updateProperty = useCallback(async (propertyId, updateData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await PropertyService.updateProperty(propertyId, updateData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the properties list
        await fetchProperties();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to update property: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchProperties]);

  const deleteProperty = useCallback(async (propertyId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await PropertyService.deleteProperty(propertyId, userInfo.companyId);
      
      if (result.success) {
        // Refresh the properties list
        await fetchProperties();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to delete property: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchProperties]);

  // Load properties on mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};
