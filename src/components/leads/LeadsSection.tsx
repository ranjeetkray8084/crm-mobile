import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLeads } from '../../core/hooks/useLeads';
import { useLeadSearch } from '../../core/hooks/useLeadSearch';
import { useUsers } from '../../core/hooks/useUsers';
import { exportLeads } from '../../core/utils/excelExport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Import components
import LeadToolbar from './LeadToolbar';
import LeadFilters from './LeadFilters';
import LeadsList from './LeadsList';
import LeadsFeedback from './LeadsFeedback';
import SearchResultsSummary from './SearchResultsSummary';
import ConfirmModal from '../common/ConfirmModal';
import AssignLeadModal from './modals/AssignLeadModal';
import UpdateLeadModal from './modals/UpdateLeadModal';
import AddRemarkModal from './modals/AddRemarkModal';
import LeadRemarksModal from './modals/LeadRemarksModal';
import AddFollowUpModal from './modals/AddFollowUpModal';
import ViewFollowUpsModal from './modals/ViewFollowUpsModal';
import AddLeadForm from './AddLeadForm';
import Logo from '../common/Logo';
import { Lead } from '../../types/lead';

interface LeadsSectionProps {
  userRole?: string;
  userId?: string;
  companyId?: string;
}

const LeadsSection: React.FC<LeadsSectionProps> = ({ userRole, userId, companyId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [remarkingLead, setRemarkingLead] = useState<Lead | null>(null);
  const [viewingRemarksLead, setViewingRemarksLead] = useState<Lead | null>(null);
  const [followUpLead, setFollowUpLead] = useState<Lead | null>(null);
  const [viewFollowUpsLead, setViewFollowUpsLead] = useState<Lead | null>(null);
  const [assignModal, setAssignModal] = useState({ isOpen: false, leadId: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null as (() => void) | null
  });
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 10;

  const {
    searchTerm, searchTags, filters, isSearchActive, activeSearchParams,
    hasActiveFilters, searchParams, getActiveFiltersSummary, setSearchTerm,
    removeSearchTag, handleSearchEnter, updateFilter,
    clearAll, clearSearch, applySearch, setActiveSearchParams, setIsSearchActive
  } = useLeadSearch();

  const {
    leads, loading, error, pagination, loadLeads, searchLeads,
    updateLeadStatus, updateLead, deleteLead, addRemark,
    assignLead, unassignLead, getRemarks, addFollowUp
  } = useLeads(companyId, userId, userRole);

  const { users: filterUsers } = useUsers(companyId);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  // Handle page changes while maintaining search state
  const handlePageChange = useCallback((newPage: number) => {
    console.log('📄 Page change requested:', newPage, 'Current search state:', { isSearchActive, activeSearchParams });
    setCurrentPage(newPage);
  }, [isSearchActive, activeSearchParams]);

  // Clear all filters and search
  const handleClearAll = useCallback(() => {
    clearAll();
    // Force reload of original data after clearing
    setTimeout(() => {
      loadLeads(currentPage, pageSize);
    }, 0);
  }, [clearAll, loadLeads, currentPage, pageSize]);

  useEffect(() => {
    if (!companyId) return;
    if (isSearchActive && activeSearchParams) {
      console.log('🔍 Searching leads with params:', activeSearchParams, 'page:', currentPage);
      searchLeads(activeSearchParams, currentPage, pageSize);
    } else {
      console.log('📋 Loading leads without search, page:', currentPage);
      loadLeads(currentPage, pageSize);
    }
  }, [companyId, currentPage, isSearchActive, activeSearchParams, refreshKey, searchLeads, loadLeads, pageSize]);

  // Reset page when filters change (search is handled by useLeadSearch hook)
  useEffect(() => {
    if (companyId && hasActiveFilters) {
      setCurrentPage(0); // Reset to first page when filters change
    }
  }, [companyId, hasActiveFilters]);

  // Reset page when search changes (search is handled by useLeadSearch hook)
  useEffect(() => {
    if (companyId && (searchTerm.trim() || searchTags.length > 0)) {
      setCurrentPage(0); // Reset to first page when search changes
    }
  }, [companyId, searchTerm, searchTags.length]);

  // Clear search when all search terms and filters are removed
  useEffect(() => {
    if (companyId && !hasActiveFilters) {
      console.log('🔍 Clearing search state - no active filters or search terms');
      setActiveSearchParams(null);
      setIsSearchActive(false);
      setCurrentPage(0);
    }
  }, [companyId, hasActiveFilters]);

  // Manual search trigger
  const handleManualSearch = useCallback(() => {
    if (companyId && (searchTags.length > 0 || hasActiveFilters || searchTerm.trim())) {
      applySearch();
    }
  }, [companyId, searchTags.length, hasActiveFilters, searchTerm, applySearch]);

  const handleUpdateLead = (lead: Lead) => setEditingLead(lead);

  const handleConfirmUpdate = async (updatedLeadData: Partial<Lead>) => {
    if (!editingLead) return;
    await updateLead(editingLead.id || editingLead.leadId, updatedLeadData);
    setEditingLead(null);
    handleRefresh();
  };

  const handleAddRemark = (lead: Lead) => setRemarkingLead(lead);

  const handleConfirmAddRemark = async (remarkData: any) => {
    if (!remarkingLead) return;
    const leadId = remarkingLead.id || remarkingLead.leadId;
    
    try {
      const result = await addRemark(leadId, remarkData);
      
      if (result && result.success) {
        setRemarkingLead(null);
        handleRefresh();
        return result; // Return the result so the modal can handle it properly
      } else {
        // Show error to user
        const errorMsg = result?.error || 'Failed to add remark';
        Alert.alert('Error', errorMsg, [{ text: 'OK' }]);
        return result; // Return the result even if it failed
      }
    } catch (error: any) {
      console.error('Error adding remark:', error);
      
      // Show authentication error to user
      if (error.message && error.message.includes('Authentication failed')) {
        Alert.alert(
          'Authentication Error',
          'Your session has expired. Please login again to continue.',
          [
            { text: 'OK', onPress: () => {
              // You can add navigation to login here if needed
              console.log('User needs to login again');
            }}
          ]
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Failed to add remark. Please try again.',
          [{ text: 'OK' }]
        );
      }
      
      // Return error result for the modal
      return { success: false, error: error.message || 'Failed to add remark' };
    }
  };

  const handleGetRemarks = (lead: Lead) => setViewingRemarksLead(lead);

  const handleAddFollowUp = (lead: Lead) => setFollowUpLead(lead);

  const handleViewFollowUps = (lead: Lead) => setViewFollowUpsLead(lead);

  const handleConfirmAddFollowUp = async (followUpData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!followUpLead) {
      return { success: false, error: 'No lead selected' };
    }
    
    const leadId = followUpLead.id || followUpLead.leadId;
    
    try {
      const result = await addFollowUp(leadId, followUpData);
      
      // Type guard to ensure result has the expected structure
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          // Success - close modal and refresh
          setFollowUpLead(null);
          handleRefresh();
          return result;
        } else {
          // Error from the hook
          const errorMsg = result.error || 'Failed to add follow-up';
          console.error('Error adding follow-up:', errorMsg);
          
          // Show error to user
          Alert.alert('Error', errorMsg, [{ text: 'OK' }]);
          
          // Return error result for the modal
          return { success: false, error: errorMsg };
        }
      } else {
        // Unexpected result format
        const errorMsg = 'Unexpected response format from server';
        console.error('Unexpected result format:', result);
        Alert.alert('Error', errorMsg, [{ text: 'OK' }]);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      console.error('Unexpected error adding follow-up:', error);
      
      // Show authentication error to user
      if (error.message && error.message.includes('Authentication failed')) {
        Alert.alert(
          'Authentication Error',
          'Your session has expired. Please login again to continue.',
          [
            { text: 'OK', onPress: () => {
              // You can add navigation to login here if needed
              console.log('User needs to login again');
            }}
          ]
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Failed to add follow-up. Please try again.',
          [{ text: 'OK' }]
        );
      }
      
      // Return error result for the modal
      return { success: false, error: error.message || 'Failed to add follow-up' };
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
    handleRefresh();
  };

  const handleDeleteLead = (leadId: string) => {
    showConfirmModal(
      'Delete Lead',
      'Are you sure you want to delete this lead?',
      async () => {
        await deleteLead(leadId);
        handleRefresh();
      }
    );
  };

  const handleAssignLead = (leadId: string) => {
    setAssignModal({ isOpen: true, leadId });
  };

  const handleUnassignLead = (leadId: string) => {
    showConfirmModal(
      'Unassign Lead',
      'Are you sure you want to unassign this lead?',
      async () => {
        await unassignLead(leadId);
        handleRefresh();
      }
    );
  };

  const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const handleAddLeadSuccess = () => {
    setShowAddLeadForm(false);
    handleRefresh();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = async () => {
    if (!leads || leads.length === 0) {
      Alert.alert('Export', 'No leads to export');
      return;
    }
    
    try {
      Alert.alert('Export', 'Exporting leads...', [], { cancelable: false });
      
      const result = await exportLeads(leads);
      
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Export Failed', result.message);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', `Failed to export leads: ${error.message}`);
    }
  };

  const actionHandlers = {
    onStatusUpdate: handleStatusUpdate,
    onDelete: handleDeleteLead,
    onAssign: handleAssignLead,
    onUnassign: handleUnassignLead,
    onUpdate: handleUpdateLead,
    onAddRemark: handleAddRemark,
    onViewRemarks: handleGetRemarks,
    onAddFollowUp: handleAddFollowUp,
    onViewFollowUps: handleViewFollowUps,
    companyId: companyId || ''
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
    
        
        <LeadToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchEnter={handleSearchEnter}
          searchTags={searchTags}
          onRemoveSearchTag={removeSearchTag}
          onClearSearch={clearSearch}
          onClearFilters={clearAll}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={toggleFilters}
          onExport={handleExport}
          onAddLead={() => setShowAddLeadForm(true)}
          leadsCount={leads.length}
          isSearchActive={isSearchActive}
        />

        {showFilters && (
          <LeadFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearAll}
            hasActiveFilters={hasActiveFilters}
            activeFiltersSummary={getActiveFiltersSummary()}
            userRole={userRole}
            userId={userId}
            companyId={companyId}
            availableUsers={filterUsers || []}
          />
        )}

        {isSearchActive && (
          <SearchResultsSummary
            isSearchActive={isSearchActive}
            totalResults={pagination?.totalElements || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            hasActiveFilters={hasActiveFilters}
            activeFiltersSummary={getActiveFiltersSummary()}
            onClearAll={handleClearAll}
          />
        )}

        <LeadsFeedback loading={loading} error={error} isEmpty={!loading && leads.length === 0} />

        {!loading && !error && leads.length > 0 && (
          <LeadsList 
            leads={leads} 
            searchTerm={searchTerm} 
            refreshing={loading}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            pagination={pagination}
            onPageChange={handlePageChange}
            {...actionHandlers} 
          />
        )}

        {/* Pagination Controls - Removed as it's now part of LeadsList */}
      </View>

     

      {/* MODALS */}
      <AddLeadForm
        isVisible={showAddLeadForm}
        onClose={() => setShowAddLeadForm(false)}
        onSuccess={handleAddLeadSuccess}
        companyId={companyId}
        userId={userId}
        userRole={userRole}
      />

      <UpdateLeadModal
        isVisible={!!editingLead}
        onClose={() => setEditingLead(null)}
        lead={editingLead}
        onUpdate={handleConfirmUpdate}
      />

      <AddRemarkModal
        isVisible={!!remarkingLead}
        onClose={() => setRemarkingLead(null)}
        onAddRemark={handleConfirmAddRemark}
        lead={remarkingLead}
      />

      <LeadRemarksModal
        isVisible={!!viewingRemarksLead}
        onClose={() => setViewingRemarksLead(null)}
        lead={viewingRemarksLead}
        companyId={companyId}
        onGetRemarks={getRemarks}
      />

      <AddFollowUpModal
        isVisible={!!followUpLead}
        onClose={() => setFollowUpLead(null)}
        onAddFollowUp={handleConfirmAddFollowUp}
        lead={followUpLead}
      />

      <ViewFollowUpsModal
        isVisible={!!viewFollowUpsLead}
        onClose={() => setViewFollowUpsLead(null)}
        lead={viewFollowUpsLead}
        companyId={companyId}
      />

      <AssignLeadModal
        isVisible={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, leadId: null })}
        onAssign={async (leadId, userId, userName) => {
          await assignLead(leadId, userId, userName);
          handleRefresh();
        }}
        leadId={assignModal.leadId}
        companyId={companyId}
        userRole={userRole}
        currentUserId={userId}
      />

      <ConfirmModal
        isVisible={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Add Lead Form Modal - Removed */}
      {/* {showAddLeadForm && (
        <View style={styles.addLeadModal}>
          <AddLeadForm
            onSuccess={handleAddLeadSuccess}
            onCancel={() => setShowAddLeadForm(false)}
          />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  // fab: {
  //   position: 'absolute',
  //   bottom: 20,
  //   right: 20,
  //   width: 56,
  //   height: 56,
  //   borderRadius: 28,
  //   backgroundColor: '#10b981',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 8,
  // },
  // addLeadModal: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: '#fff',
  //   zIndex: 1000,
  // },
});

export default LeadsSection;
