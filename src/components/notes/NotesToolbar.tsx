import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';

interface NotesToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleFilters: () => void;
  onAddNote: () => void;
  notesCount: number;
  showFilters: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
}

const NotesToolbar: React.FC<NotesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onToggleFilters,
  onAddNote,
  notesCount,
  showFilters,
  currentPage = 0,
  totalPages = 1,
  pageSize = 10,
}) => {
  const fromResult = currentPage * pageSize + 1;
  const toResult = Math.min((currentPage + 1) * pageSize, notesCount);
  
  const actions = [
    {
      label: 'Add Note',
      icon: <Ionicons name="add" size={14} color="#6b7280" />,
      onClick: onAddNote
    },
    {
      label: 'Add Event',
      icon: <Ionicons name="calendar" size={14} color="#6b7280" />,
      onClick: onAddNote
    }
  ];
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Notes & Events</Text>
        </View>
      </View>

      {/* Search and Actions Row */}
      <View style={styles.searchSection}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes & events..."
            value={searchTerm}
            onChangeText={onSearchChange}
            placeholderTextColor="#9ca3af"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.filterToggleButton, showFilters && styles.filterToggleButtonActive]} 
          onPress={onToggleFilters}
        >
          <Ionicons name="filter" size={20} color={showFilters ? "#fff" : "#1c69ff"} />
        </TouchableOpacity>
      </View>
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
    lineHeight: 20,
  },
  subtitleNote: {
    color: '#9ca3af',
  },
  pageInfo: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#10b981',
    gap: 6,
  },
  addNoteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
  },
  filterToggleButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
});

export default NotesToolbar;
