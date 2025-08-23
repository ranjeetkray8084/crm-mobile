// useLeads Hook - Mobile-optimized version for React Native/Expo
import { useState, useEffect, useCallback } from 'react';
import { LeadService } from '../services/lead.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLeads = (companyId, userId, userRole) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

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

  const _fetchLeads = useCallback(async (page = 0, size = 10, searchParams = null) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      setError('Company ID is missing or user not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      const isSearching = searchParams && Object.keys(searchParams).length > 0;

      const backendSearchParams = {
        search: searchParams?.query,
        status: searchParams?.status,
        source: searchParams?.source,
        createdBy: searchParams?.createdBy,
        minBudget: searchParams?.budget?.split('-')[0],
        maxBudget: searchParams?.budget?.split('-')[1],
      };

      // Map assignedTo filter to action parameter
      if (searchParams?.assignedTo) {
        if (searchParams.assignedTo === 'assigned') {
          backendSearchParams.action = 'ASSIGNED';
        } else if (searchParams.assignedTo === 'unassigned') {
          backendSearchParams.action = 'UNASSIGNED';
        }
      } else if (searchParams?.action) {
        backendSearchParams.action = searchParams.action;
      }

      // Remove any undefined or null values
      Object.keys(backendSearchParams).forEach(key => {
        if (backendSearchParams[key] === undefined || backendSearchParams[key] === null || backendSearchParams[key] === '') {
          delete backendSearchParams[key];
        }
      });

      const isBackendSearching = Object.keys(backendSearchParams).length > 0;

      // SEARCH
      if (isBackendSearching) {
        if (userInfo.role === 'DIRECTOR') {
          result = await LeadService.searchLeads(userInfo.companyId, backendSearchParams, { page, size });
        } else if (userInfo.role === 'ADMIN') {
          result = await LeadService.searchLeadsVisibleToAdmin(userInfo.companyId, userInfo.userId, backendSearchParams, { page, size });
        } else {
          result = await LeadService.searchLeadsCreatedOrAssigned(userInfo.companyId, userInfo.userId, backendSearchParams, { page, size });
        }
      } 
      // GET
      else {
        if (userInfo.role === 'DIRECTOR') {
          result = await LeadService.getLeadsByCompany(userInfo.companyId, page, size);
        } else if (userInfo.role === 'ADMIN') {
          result = await LeadService.getLeadsVisibleToAdmin(userInfo.companyId, userInfo.userId, page, size);
        } else {
          result = await LeadService.getLeadsCreatedOrAssigned(userInfo.companyId, userInfo.userId, page, size);
        }
      }

      if (result.success) {
        const leadsData = result.data.content || result.data || [];

        const finalLeads = !isSearching
          ? [...leadsData.filter(l => l.status !== 'CLOSED' && l.status !== 'DROPED'), ...leadsData.filter(l => l.status === 'DROPED'), ...leadsData.filter(l => l.status === 'CLOSED')]
          : leadsData;

        setLeads(finalLeads);
        setPagination({
          page: result.data.number ?? page,
          size: result.data.size ?? size,
          totalElements: result.data.totalElements ?? finalLeads.length,
          totalPages: result.data.totalPages ?? 1,
        });
      } else {
        setError(result.error);
        console.error('❌ ' + result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to fetch leads: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      console.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  const loadLeads = useCallback((page = 0, size = 10) => _fetchLeads(page, size, null), [_fetchLeads]);

  const searchLeads = useCallback((searchParams, page = 0, size = 10) => _fetchLeads(page, size, searchParams), [_fetchLeads]);

  const refreshLeads = useCallback(() => _fetchLeads(0, pagination.size), [_fetchLeads, pagination.size]);

  const createLead = useCallback(async (leadData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.createLead(leadData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to create lead: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const updateLead = useCallback(async (leadId, updateData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.updateLead(leadId, updateData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to update lead: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const deleteLead = useCallback(async (leadId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.deleteLead(leadId, userInfo.companyId);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to delete lead: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  // Load leads on mount
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return {
    leads,
    loading,
    error,
    pagination,
    loadLeads,
    searchLeads,
    refreshLeads,
    createLead,
    updateLead,
    deleteLead,
  };
};
