import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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
  isSearchActive: boolean;
  onExport: () => void;
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
  isSearchActive,
  onExport
}) => {

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      onSearchEnter();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        {/* Single Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={onSearchChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Filter Button */}
        <TouchableOpacity 
          style={[styles.filterToggleButton, hasActiveFilters && styles.filterToggleButtonActive]}
          onPress={onToggleFilters}
        >
          <Ionicons 
            name="filter" 
            size={18} 
            color={hasActiveFilters ? "#ffffff" : "#6b7280"} 
          />
        </TouchableOpacity>

        {/* Export Button */}
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={onExport}
        >
          <Ionicons 
            name="download-outline" 
            size={18} 
            color="#6b7280" 
          />
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
  exportButton: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
});

export default PropertyToolbar;
