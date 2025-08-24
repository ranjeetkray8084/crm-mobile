import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLeads } from '../../core/hooks/useLeads';
import { useLeadSearch } from '../../core/hooks/useLeadSearch';
import { useUsers } from '../../core/hooks/useUsers';
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
    onConfirm: null
  });
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 10;

  const {
    searchTerm, searchTags, filters, isSearchActive, activeSearchParams,
    hasActiveFilters, searchParams, getActiveFiltersSummary, setSearchTerm,
    removeSearchTag, handleSearchEnter, updateFilter,
    clearAll, clearSearch, applySearch
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
      searchLeads(activeSearchParams, currentPage, pageSize);
    } else {
      loadLeads(currentPage, pageSize);
    }
  }, [companyId, currentPage, isSearchActive, activeSearchParams, refreshKey, searchLeads, loadLeads, pageSize]);

  // Auto-search when filters change
  useEffect(() => {
    if (companyId && hasActiveFilters) {
      const timeoutId = setTimeout(() => {
        applySearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [companyId, filters, hasActiveFilters, applySearch]);

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
    await addRemark(leadId, remarkData);
    setRemarkingLead(null);
    handleRefresh();
  };

  const handleGetRemarks = (lead: Lead) => setViewingRemarksLead(lead);

  const handleAddFollowUp = (lead: Lead) => setFollowUpLead(lead);

  const handleViewFollowUps = (lead: Lead) => setViewFollowUpsLead(lead);

  const handleConfirmAddFollowUp = async (followUpData: any) => {
    if (!followUpLead) return;
    const leadId = followUpLead.id || followUpLead.leadId;
    
    try {
      await addFollowUp(leadId, followUpData);
      setFollowUpLead(null);
      handleRefresh();
    } catch (error) {
      console.error('Error adding follow-up:', error);
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
        await unassignLead(leadId, userId);
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

  const handleExport = () => {
    if (!leads || leads.length === 0) {
      // Show alert for no leads to export
      return;
    }
    
    // TODO: Implement export functionality
    console.log('Export functionality coming soon');
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
    companyId: companyId
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
            {...actionHandlers} 
          />
        )}
      </View>

      {/* Floating Action Button - Removed */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddLeadForm(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity> */}

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
