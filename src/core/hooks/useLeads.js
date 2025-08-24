// useLeads Hook - Mobile-optimized version for React Native/Expo
import { useState, useEffect, useCallback } from 'react';
import { LeadService } from '../services/lead.service';
import { FollowUpService } from '../services/followup.service';
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
      const result = await LeadService.createLead(userInfo.companyId, leadData);
      
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
      const result = await LeadService.updateLead(userInfo.companyId, leadId, updateData);
      
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
      const result = await LeadService.deleteLead(userInfo.companyId, leadId);
      
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

  const updateLeadStatus = useCallback(async (leadId, status) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.updateLeadStatus(userInfo.companyId, leadId, status);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to update lead status: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const addRemark = useCallback(async (leadId, remarkData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      return { success: false, error: 'Company ID is missing or user not authenticated.' };
    }

    if (!userInfo.userId) {
      return { success: false, error: 'User ID is missing or user not authenticated.' };
    }

    try {
      // Add userId to the remark data as required by the backend (same as web version)
      const data = { ...remarkData, userId: userInfo.userId };
      
      console.log('useLeads: Adding remark with data:', {
        companyId: userInfo.companyId,
        leadId: leadId,
        remarkData: remarkData,
        data: data,
        userId: userInfo.userId
      });
      
      const result = await LeadService.addRemarkToLead(userInfo.companyId, leadId, data);
      
      if (result.success) {
        console.log('✅ Remark added successfully');
        return { success: true, data: result.data };
      } else {
        console.error('❌ ' + (result.error || 'Failed to add remark'));
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Failed to add remark:', err);
      return { success: false, error: 'Failed to add remark' };
    }
  }, [getUserInfo]);

  const assignLead = useCallback(async (leadId, userId, userName) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.assignLead(userInfo.companyId, leadId, userId, userInfo.userId);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to assign lead: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const unassignLead = useCallback(async (leadId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await LeadService.unassignLead(userInfo.companyId, leadId, userInfo.userId);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to unassign lead: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const getRemarks = useCallback(async (leadId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    try {
      const result = await LeadService.getRemarksByLeadId(userInfo.companyId, leadId);
      return result;
    } catch (err) {
      const errorMsg = `Failed to get remarks: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [getUserInfo]);

  const addFollowUp = useCallback(async (leadId, followUpData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      // Add leadId to the followUpData
      const followUpWithLead = { ...followUpData, leadId };
      const result = await FollowUpService.createFollowUp(userInfo.companyId, followUpWithLead);
      
      if (result.success) {
        // Refresh the leads list
        await _fetchLeads(0, pagination.size);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to add follow-up: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, _fetchLeads, pagination.size]);

  const getFollowUps = useCallback(async (leadId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    try {
      const result = await FollowUpService.getFollowUpsByLeadId(userInfo.companyId, leadId);
      return result;
    } catch (err) {
      const errorMsg = `Failed to get follow-ups: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [getUserInfo]);

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
    updateLeadStatus,
    addRemark,
    assignLead,
    unassignLead,
    getRemarks,
    addFollowUp,
    getFollowUps,
  };
};
