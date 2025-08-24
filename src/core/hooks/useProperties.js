// useProperties Hook - Mobile-optimized version for React Native/Expo
import { useState, useCallback, useMemo } from 'react';
import { PropertyService } from '../services/property.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProperties = (companyId, userId, userRole) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const userInfo = useMemo(() => {
    // For React Native, we'll get user info from AsyncStorage when needed
    return {
      companyId,
      userId,
      role: userRole,
    };
  }, [companyId, userId, userRole]);

  const loadProperties = useCallback(
    async (page = 0, size = 10, searchParams = null) => {
      if (!userInfo.companyId) {
        setError('Company ID is missing.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let result;

        // Prepare role-based parameters
        const roleParams = {
          userId: userInfo.userId,
          role: userInfo.role
        };

        // Check if we have search parameters or filters
        const hasSearchParams = searchParams && Object.keys(searchParams).some(key => {
          const value = searchParams[key];
          return value && value.toString().trim() !== '';
        });

        if (hasSearchParams) {
          // Use search API if filters are applied
          result = await PropertyService.searchProperties(
            userInfo.companyId,
            { ...searchParams, ...roleParams },
            { page, size }
          );
        } else {
          // Use regular API if no filters
          result = await PropertyService.getPropertiesByCompany(userInfo.companyId, page, size, roleParams);
        }

        if (result.success) {
          const propertiesData = result.data.content || result.data || [];

          // Server handles all filtering and visibility - no client-side processing needed
          setProperties(propertiesData);

          const paginationData = {
            page: result.data.number ?? page,
            size: result.data.size ?? size,
            totalElements: result.data.totalElements ?? propertiesData.length,
            totalPages: result.data.totalPages ?? Math.ceil((result.data.totalElements || propertiesData.length) / size),
          };

          setPagination(paginationData);
        } else {
          throw new Error(result.error || 'Failed to fetch data.');
        }
      } catch (err) {
        const errorMsg = err.message || 'An unknown error occurred while fetching properties.';
        setError(errorMsg);
        console.error(`❌ ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    },
    [userInfo]
  );

  const executeApiCall = async (apiCall, successMsg, errorMsg, shouldReloadProperties = false) => {
    if (!userInfo.companyId) {
      console.error('Company ID is missing.');
      return { success: false, error: 'Company ID missing' };
    }
    try {
      const result = await apiCall();
      if (result.success) {
        console.log(`✅ ${successMsg}`);
        if (shouldReloadProperties) {
          // Don't show error if reload fails, just log it
          try {
            await loadProperties(0, 10);
          } catch (reloadError) {
            console.warn('Failed to reload properties after operation:', reloadError);
          }
        }
        return { success: true, data: result.data };
      } else {
        const errText = (result.error || errorMsg || '').toString().replace(/^([❌⚠️✅]\s*)+/, '').trim();
        // Avoid double ❌ and handle non-unique messaging uniformly
        const nonUnique = /Query did not return a unique result/i.test(errText) || /unique result: 2 results/i.test(errText);
        if (nonUnique) {
          console.log('⚠️ Created but duplicate match detected.');
          if (shouldReloadProperties) {
            try { await loadProperties(0, 10); } catch {} 
          }
          return { success: true };
        }
        console.error(`❌ ${errText}`);
        return { success: false, error: errText };
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data;
      const finalErrorMsg = (serverMsg || err.message || errorMsg || '').toString().replace(/^([❌⚠️✅]\s*)+/, '').trim();
      const nonUnique = /Query did not return a unique result/i.test(finalErrorMsg) || /unique result: 2 results/i.test(finalErrorMsg);
      if (nonUnique) {
        console.log('⚠️ Created but duplicate match detected.');
        if (shouldReloadProperties) {
          try { await loadProperties(0, 10); } catch {} 
        }
        return { success: true };
      }
      console.error(`❌ ${finalErrorMsg}`);
      return { success: false, error: finalErrorMsg };
    }
  };

  const createProperty = (data) =>
    executeApiCall(
      () => PropertyService.createProperty(userInfo.companyId, data),
      'Property created successfully',
      'Failed to create property',
      true
    );

  const updateProperty = (id, data) =>
    executeApiCall(
      () => PropertyService.updateProperty(userInfo.companyId, id, data),
      'Property updated successfully',
      'Failed to update property',
      true
    );

  const deleteProperty = (id) =>
    executeApiCall(
      () => PropertyService.deleteProperty(userInfo.companyId, id),
      'Property deleted successfully',
      'Failed to delete property',
      true
    );

  const addRemark = useCallback(
    async (propertyId, remarkData) => {
      if (!userInfo.userId) return { success: false, error: 'User ID is missing.' };
      const enrichedData = { ...remarkData, userId: userInfo.userId.toString() };

      return executeApiCall(
        () => PropertyService.addRemarkToProperty(userInfo.companyId, propertyId, enrichedData),
        'Remark added successfully',
        'Failed to add remark',
        true
      );
    },
    [userInfo, executeApiCall]
  );

  const getRemarks = useCallback(
    async (propertyId) => {
      console.log('useProperties: getRemarks called with propertyId:', propertyId);
      console.log('useProperties: userInfo.companyId:', userInfo.companyId);
      
      if (!userInfo.companyId) {
        console.log('useProperties: Company ID missing');
        return { success: false, data: [], error: 'Company ID is missing.' };
      }
      
      try {
        console.log('useProperties: Calling PropertyService.getRemarksByPropertyId');
        const result = await PropertyService.getRemarksByPropertyId(userInfo.companyId, propertyId);
        console.log('useProperties: PropertyService result:', result);
        return result;
      } catch (err) {
        console.error('useProperties: Exception in getRemarks:', err);
        return { success: false, data: [], error: 'Failed to get remarks' };
      }
    },
    [userInfo]
  );

  const searchProperties = useCallback(
    async (searchParams, page = 0, size = 10) => {
      return loadProperties(page, size, searchParams);
    },
    [loadProperties]
  );

  // Add the missing fetchProperties method that PropertiesSection expects
  const fetchProperties = useCallback(
    async (page = 0, size = 10, searchParams = null) => {
      return loadProperties(page, size, searchParams);
    },
    [loadProperties]
  );

  return {
    properties,
    loading,
    error,
    pagination,
    loadProperties,
    fetchProperties, // Add this to the return object
    searchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    addRemark,
    getRemarks,
  };
};
