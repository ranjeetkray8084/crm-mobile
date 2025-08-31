import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotesFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  typeFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  onTypeFilterChange: (type: string) => void;
  uniqueTypes: string[];
  onClearFilters: () => void;
}

const NotesFilters: React.FC<NotesFiltersProps> = ({
  statusFilter,
  priorityFilter,
  typeFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onTypeFilterChange,
  uniqueTypes,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'PRIORITY_A', label: 'Priority A' },
    { value: 'PRIORITY_B', label: 'Priority B' },
    { value: 'PRIORITY_C', label: 'Priority C' }
  ];

  const typeOptions = uniqueTypes.length > 0 ? uniqueTypes : ['Note', 'Event'];

  const FilterSection: React.FC<{
    title: string;
    section: string;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <View style={styles.filterSection}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection(section)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={isSectionExpanded(section) ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>
      
      {isSectionExpanded(section) && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );

  const FilterChip: React.FC<{
    label: string;
    value: string;
    isSelected: boolean;
    onPress: () => void;
  }> = ({ label, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
        {/* Status Filter */}
        <FilterSection title="Status" section="status">
          <View style={styles.chipContainer}>
            {statusOptions.map(option => (
              <FilterChip
                key={option.value}
                label={option.label}
                value={option.value}
                isSelected={statusFilter === option.value}
                onPress={() => onStatusFilterChange(statusFilter === option.value ? '' : option.value)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Priority Filter */}
        <FilterSection title="Priority" section="priority">
          <View style={styles.chipContainer}>
            {priorityOptions.map(option => (
              <FilterChip
                key={option.value}
                label={option.label}
                value={option.value}
                isSelected={priorityFilter === option.value}
                onPress={() => onPriorityFilterChange(priorityFilter === option.value ? '' : option.value)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Type Filter */}
        <FilterSection title="Type" section="type">
          <View style={styles.chipContainer}>
            {typeOptions.map(type => (
              <FilterChip
                key={type}
                label={type}
                value={type}
                isSelected={typeFilter === type}
                onPress={() => onTypeFilterChange(typeFilter === type ? '' : type)}
              />
            ))}
          </View>
        </FilterSection>
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filtersContainer: {
    maxHeight: 400,
  },
  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#ffffff',
  },
});

export default NotesFilters;
