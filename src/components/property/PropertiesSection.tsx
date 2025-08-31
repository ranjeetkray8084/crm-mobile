import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useProperties } from '../../core/hooks/useProperties';
import { usePropertySearch } from '../../core/hooks/usePropertySearch';
import { useUsers } from '../../core/hooks/useUsers';
import { exportProperties } from '../../core/utils/excelExport';
import PropertyToolbar from './PropertyToolbar';
import PropertyFilters from './PropertyFilters';
import PropertiesList from './PropertiesList';
import SearchResultsSummary from './SearchResultsSummary';


import UpdatePropertyModal from './modals/UpdatePropertyModal';
import AddRemarkModal from './modals/AddRemarkModal';
import PropertyRemarksModal from './modals/PropertyRemarksModal';

interface PropertiesSectionProps {
  userRole?: string;
  userId?: number;
  companyId?: number;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  userRole,
  userId,
  companyId
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoSearch] = useState(true); // Same as crm-frontend
  
  // Modal states
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [remarkingProperty, setRemarkingProperty] = useState<any>(null);
  const [viewingRemarksProperty, setViewingRemarksProperty] = useState<any>(null);

  // Property search hook
  const {
    searchTerm, searchTags, filters, isSearchActive, activeSearchParams,
    hasActiveFilters, searchParams, getActiveFiltersSummary, setSearchTerm,
    removeSearchTag, handleSearchEnter, updateFilter, searchTrigger,
    clearAll, clearSearch, applySearch
  } = usePropertySearch();

  const pageSize = 10;
  
  // Properties hook
  const {
    properties, loading, error, pagination, loadProperties, searchProperties, updateProperty, deleteProperty, addRemark, getRemarks
  } = useProperties(companyId, userId, userRole);

  // Users hook for filters
  const { users: filterUsers } = useUsers(companyId);

  // Refresh function
  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  // Clear all filters and search
  const handleClearAll = useCallback(() => {
    clearAll();
    setCurrentPage(0);
    // Force reload of original data after clearing
    setTimeout(() => {
      loadProperties(0, pageSize);
    }, 0);
  }, [clearAll, loadProperties, pageSize]);

  // Initial load and page changes
  useEffect(() => {
    if (!companyId) {
      return;
    }
    
    loadProperties(currentPage, pageSize);
  }, [companyId, currentPage, refreshKey, loadProperties, pageSize]);

  // Handle search when search params change or search is triggered
  useEffect(() => {
    if (!companyId) return;
    
    if (isSearchActive && activeSearchParams) {
      // Use searchProperties for search queries
      console.log('🔍 Searching properties with params:', activeSearchParams);
      searchProperties(activeSearchParams, currentPage, pageSize);
    } else if (!isSearchActive) {
      // When search becomes inactive (cleared), reload original data
      console.log('📋 Loading properties without search');
      loadProperties(currentPage, pageSize);
    }
  }, [companyId, isSearchActive, activeSearchParams, currentPage, searchProperties, searchTrigger, loadProperties, pageSize]);

  // Auto-search when filters change (if autoSearch is enabled) - same as crm-frontend
  useEffect(() => {
    if (autoSearch && companyId && hasActiveFilters) {
      setCurrentPage(0); // Reset to first page when filters change
      const timeoutId = setTimeout(() => {
        applySearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [autoSearch, companyId, filters, hasActiveFilters, applySearch]);

  // Manual search trigger
  const handleManualSearch = useCallback(() => {
    if (companyId && (searchTags.length > 0 || hasActiveFilters || searchTerm.trim())) {
      applySearch();
    }
  }, [companyId, searchTags.length, hasActiveFilters, searchTerm, applySearch]);

  // Property actions
  const handleStatusUpdate = async (propertyId: number, newStatus: string) => {
    try {
      const result = await updateProperty(propertyId, { status: newStatus });
      if (result.success) {
        Alert.alert('Success', `Property status updated to: ${newStatus}`);
      } else {
        Alert.alert('Error', `Failed to update property status: ${result.error}`);
      }
      handleRefresh();
    } catch (error: any) {
      Alert.alert('Error', `Failed to update property status: ${error.message}`);
    }
  };

  const handleDeleteProperty = (propertyId: number) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', `Failed to delete property: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const handleUpdateProperty = (property: any) => {
    setEditingProperty(property);
  };

  const handleConfirmUpdate = async (updatedPropertyData: any) => {
    if (!editingProperty) return;
    try {
      const result = await updateProperty(editingProperty.id || editingProperty.propertyId, updatedPropertyData);
      if (result.success) {
        Alert.alert('Success', 'Property updated successfully');
      } else {
        Alert.alert('Error', `Failed to update property: ${result.error}`);
      }
      setEditingProperty(null);
      handleRefresh();
    } catch (error: any) {
      Alert.alert('Error', `Failed to update property: ${error.message}`);
      setEditingProperty(null);
    }
  };

  const handleAddRemark = (property: any) => {
    setRemarkingProperty(property);
  };

  const handleConfirmAddRemark = async (remarkData: any) => {
    if (!remarkingProperty) return;
    try {
      const propertyId = remarkingProperty.id || remarkingProperty.propertyId;
      const result = await addRemark(propertyId, remarkData);
      if (result.success) {
        Alert.alert('Success', 'Remark added successfully');
      } else {
        Alert.alert('Error', `Failed to add remark: ${result.error}`);
      }
      setRemarkingProperty(null);
      handleRefresh();
    } catch (error: any) {
      Alert.alert('Error', `Failed to add remark: ${error.message}`);
      setRemarkingProperty(null);
    }
  };

  const handleViewRemarks = (property: any) => {
    setViewingRemarksProperty(property);
  };

  const handleOutOfBox = (property: any) => {
    Alert.alert('Out of Box', `Out of Box action triggered for: ${property.propertyName || property.name}`);
  };

  const handleExport = async () => {
    if (!properties || properties.length === 0) {
      Alert.alert('Export', 'No properties to export');
      return;
    }
    
    try {
      Alert.alert('Export', 'Exporting properties...', [], { cancelable: false });
      
      const result = await exportProperties(properties);
      
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Export Failed', result.message);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', `Failed to export properties: ${error.message}`);
    }
  };

  const handleAddProperty = () => {
    // TODO: Implement add property functionality
    Alert.alert('Add Property', 'Add property functionality coming soon');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const actionHandlers = {
    onStatusChange: handleStatusUpdate,
    onDelete: handleDeleteProperty,
    onUpdate: handleUpdateProperty,
    onAddRemark: handleAddRemark,
    onViewRemarks: handleViewRemarks,
    onOutOfBox: handleOutOfBox,
    companyId: companyId
  };

  return (
    <View style={styles.container}>
      <PropertyToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchEnter={handleSearchEnter}
        searchTags={searchTags}
        onRemoveSearchTag={removeSearchTag}
        onClearSearch={clearSearch}
        onClearFilters={handleClearAll}
        hasActiveFilters={hasActiveFilters}
        onToggleFilters={toggleFilters}
        isSearchActive={isSearchActive}
        onExport={handleExport}
      />

        {/* Desktop Filters - Always visible on mobile */}
        {showFilters && (
          <PropertyFilters
            filters={filters}
            onUpdateFilter={updateFilter}
            onClearFilters={handleClearAll}
            availableUsers={filterUsers || []}
            currentUserId={userId}
          />
        )}

      {isSearchActive && (
        <SearchResultsSummary
          searchParams={searchParams}
          resultsCount={properties.length}
          onClearAll={handleClearAll}
          getActiveFiltersSummary={getActiveFiltersSummary}
          currentUserId={userId || undefined}
          availableUsers={filterUsers || []}
        />
      )}

      <PropertiesList
        properties={properties}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onStatusChange={handleStatusUpdate}
        onDelete={handleDeleteProperty}
        onUpdate={handleUpdateProperty}
        onAddRemark={handleAddRemark}
        onViewRemarks={handleViewRemarks}
        onOutOfBox={handleOutOfBox}
        companyId={companyId}
        currentPage={currentPage}
        pagination={pagination}
        onPageChange={setCurrentPage}
      />

      {/* MODALS */}
      <UpdatePropertyModal
        isVisible={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        onUpdate={handleConfirmUpdate}
        property={editingProperty}
      />

      <AddRemarkModal
        isVisible={!!remarkingProperty}
        onClose={() => setRemarkingProperty(null)}
        onAddRemark={handleConfirmAddRemark}
        property={remarkingProperty}
      />

      <PropertyRemarksModal
        isVisible={!!viewingRemarksProperty}
        onClose={() => setViewingRemarksProperty(null)}
        property={viewingRemarksProperty}
        onGetRemarks={async (propertyId: number) => {
          try {
            console.log('PropertiesSection: Calling getRemarks for propertyId:', propertyId);
            const result = await getRemarks(propertyId);
            console.log('PropertiesSection: getRemarks result:', result);
            
            if (result.success) {
              console.log('PropertiesSection: Success, returning data:', result.data);
              return { success: true, data: result.data };
            } else {
              console.log('PropertiesSection: Error from getRemarks:', result.error);
              return { success: false, error: result.error || 'Failed to load remarks' };
            }
          } catch (error) {
            console.error('PropertiesSection: Exception in onGetRemarks:', error);
            return { success: false, error: 'Failed to load remarks' };
          }
        }}
      />
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
});

export default PropertiesSection;
