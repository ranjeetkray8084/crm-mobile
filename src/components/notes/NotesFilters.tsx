import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotesFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  typeFilter: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onTypeChange: (type: string) => void;
  uniqueTypes: string[];
  onClearFilters: () => void;
}

const NotesFilters: React.FC<NotesFiltersProps> = ({
  statusFilter,
  priorityFilter,
  typeFilter,
  onStatusChange,
  onPriorityChange,
  onTypeChange,
  uniqueTypes,
  onClearFilters,
}) => {
  const statusOptions = ['NEW', 'PROCESSING', 'COMPLETED'];
  const priorityOptions = ['PRIORITY_A', 'PRIORITY_B', 'PRIORITY_C'];

  const FilterChip = ({ 
    label, 
    value, 
    isSelected, 
    onPress, 
    color = '#1c69ff' 
  }: {
    label: string;
    value: string;
    isSelected: boolean;
    onPress: (value: string) => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isSelected && { backgroundColor: color, borderColor: color }
      ]}
      onPress={() => onPress(isSelected ? '' : value)}
    >
      <Text style={[
        styles.filterChipText,
        isSelected && styles.filterChipTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filtersHeader}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <TouchableOpacity onPress={onClearFilters} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {/* Status Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Status</Text>
          <View style={styles.filterChips}>
            {statusOptions.map((status) => (
              <FilterChip
                key={status}
                label={status}
                value={status}
                isSelected={statusFilter === status}
                onPress={onStatusChange}
                color="#f59e0b"
              />
            ))}
          </View>
        </View>

        {/* Priority Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Priority</Text>
          <View style={styles.filterChips}>
            {priorityOptions.map((priority) => (
              <FilterChip
                key={priority}
                label={priority.replace('PRIORITY_', 'Priority ')}
                value={priority}
                isSelected={priorityFilter === priority}
                onPress={onPriorityChange}
                color="#ef4444"
              />
            ))}
          </View>
        </View>

        {/* Type Filter */}
        {uniqueTypes.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Type</Text>
            <View style={styles.filterChips}>
              {uniqueTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  value={type}
                  isSelected={typeFilter === type}
                  onPress={onTypeChange}
                  color="#10b981"
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  clearAllText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterSection: {
    marginRight: 24,
    minWidth: 120,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  filterChips: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
});

export default NotesFilters;
