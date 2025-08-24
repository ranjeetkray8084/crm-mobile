import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PropertyToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchEnter: () => void;
  searchTags: string[];
  onRemoveSearchTag: (tag: string) => void;
  onClearSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onToggleFilters: () => void;
  onExport: () => void;
  propertiesCount: number;
  isSearchActive: boolean;
}

const PropertyToolbar: React.FC<PropertyToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchEnter,
  searchTags,
  onRemoveSearchTag,
  onClearSearch,
  onClearFilters,
  hasActiveFilters,
  onToggleFilters,
  onExport,
  propertiesCount,
  isSearchActive
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      onSearchEnter();
    }
  };

  const handleClearAll = () => {
    onClearSearch();
    onClearFilters();
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Property Management</Text>
          <Text style={styles.subtitle}>
            {isSearchActive ? 'Search Results' : `${propertiesCount} Properties`}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={onExport}>
            <Ionicons name="download-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties by name, location, type..."
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={onSearchChange}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterToggleButton, hasActiveFilters && styles.filterToggleButtonActive]}
          onPress={onToggleFilters}
        >
          <Ionicons 
            name="filter" 
            size={18} 
            color={hasActiveFilters ? "#ffffff" : "#6b7280"} 
          />
          {hasActiveFilters && (
            <View style={styles.activeFilterIndicator}>
              <Text style={styles.activeFilterText}>!</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Tags */}
      {searchTags.length > 0 && (
        <View style={styles.searchTagsContainer}>
          <Text style={styles.searchTagsLabel}>Search terms:</Text>
          <View style={styles.searchTags}>
            {searchTags.map((tag, index) => (
              <View key={index} style={styles.searchTag}>
                <Text style={styles.searchTagText}>{tag}</Text>
                <TouchableOpacity 
                  onPress={() => onRemoveSearchTag(tag)}
                  style={styles.removeTagButton}
                >
                  <Ionicons name="close" size={14} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={onClearSearch} style={styles.clearAllTagsButton}>
              <Text style={styles.clearAllTagsText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersLabel}>Active filters:</Text>
          <TouchableOpacity onPress={onClearFilters} style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 12,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterToggleButton: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  filterToggleButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  activeFilterIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchTagsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchTagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  searchTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  searchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  searchTagText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  removeTagButton: {
    padding: 2,
  },
  clearAllTagsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllTagsText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fef3c7',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  activeFiltersLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
  },
});

export default PropertyToolbar;
