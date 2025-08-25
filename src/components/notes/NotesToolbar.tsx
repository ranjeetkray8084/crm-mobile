import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotesToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleFilters: () => void;
  onAddNote: () => void;
  notesCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const NotesToolbar: React.FC<NotesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onToggleFilters,
  onAddNote,
  notesCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <View style={styles.toolbar}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes Management</Text>
        <Text style={styles.subtitle}>{notesCount} note{notesCount !== 1 ? 's' : ''}</Text>
      </View>

      {/* Search and Actions Row */}
      <View style={styles.actionsRow}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchTerm}
            onChangeText={onSearchChange}
            placeholderTextColor="#9ca3af"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearch}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.toolbarButton, styles.filterButton]} 
            onPress={onToggleFilters}
          >
            <Ionicons name="filter" size={20} color="#1c69ff" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolbarButton, styles.addButton]} 
            onPress={onAddNote}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <View style={styles.filtersIndicator}>
          <View style={styles.filtersInfo}>
            <Ionicons name="information-circle" size={16} color="#1c69ff" />
            <Text style={styles.filtersText}>Filters are active</Text>
          </View>
          <TouchableOpacity onPress={onClearFilters} style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    height: 44,
    fontSize: 16,
    color: '#1f2937',
  },
  clearSearch: {
    padding: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  filterButton: {
    borderColor: '#1c69ff',
    backgroundColor: '#f0f9ff',
  },
  filterButtonText: {
    color: '#1c69ff',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    borderColor: '#1c69ff',
    backgroundColor: '#1c69ff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c69ff',
  },
  filtersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtersText: {
    color: '#1c69ff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1c69ff',
    borderRadius: 6,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NotesToolbar;
