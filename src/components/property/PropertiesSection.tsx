import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useProperties } from '../../core/hooks/useProperties';
import { usePropertySearch } from '../../core/hooks/usePropertySearch';
import { useUsers } from '../../core/hooks/useUsers';
import PropertyToolbar from './PropertyToolbar';
import PropertyFilters from './PropertyFilters';
import PropertiesList from './PropertiesList';
import SearchResultsSummary from './SearchResultsSummary';
import PropertiesFeedback from './PropertiesFeedback';
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

  // Properties hook
  const {
    properties, loading, error, fetchProperties, updateProperty, deleteProperty, addRemark, getRemarks
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
    // Force reload of original data after clearing
    setTimeout(() => {
      fetchProperties();
    }, 0);
  }, [clearAll, fetchProperties]);

  // Initial load
  useEffect(() => {
    if (companyId) {
      fetchProperties();
    }
  }, [companyId, refreshKey, fetchProperties]);

  // Handle search when search params change
  useEffect(() => {
    if (!companyId) return;
    
    if (isSearchActive && activeSearchParams) {
      // For now, we'll use the existing fetchProperties
      // In a full implementation, you'd call a search function
      fetchProperties();
    } else if (!isSearchActive) {
      fetchProperties();
    }
  }, [companyId, isSearchActive, activeSearchParams, searchTrigger, fetchProperties]);

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

  const handleExport = () => {
    if (!properties || properties.length === 0) {
      Alert.alert('Export', 'No properties to export');
      return;
    }
    
    // TODO: Implement export functionality
    Alert.alert('Export', 'Export functionality coming soon');
  };

  const handleAddProperty = () => {
    // TODO: Implement add property functionality
    Alert.alert('Add Property', 'Add property functionality coming soon');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
          onClearFilters={clearAll}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={toggleFilters}
          onExport={handleExport}
          propertiesCount={properties.length}
          isSearchActive={isSearchActive}
        />

      {showFilters && (
        <PropertyFilters
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearAll}
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
          currentUserId={userId}
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
      />

      <PropertiesFeedback
        loading={loading}
        error={error}
        propertiesCount={properties.length}
        isSearchActive={isSearchActive}
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
