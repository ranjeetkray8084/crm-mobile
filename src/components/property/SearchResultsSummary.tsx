import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchResultsSummaryProps {
  searchParams: any;
  resultsCount: number;
  onClearAll: () => void;
  getActiveFiltersSummary: (currentUserId?: number, availableUsers?: any[]) => string;
  currentUserId?: number;
  availableUsers: any[];
}

const SearchResultsSummary: React.FC<SearchResultsSummaryProps> = ({
  searchParams,
  resultsCount,
  onClearAll,
  getActiveFiltersSummary,
  currentUserId,
  availableUsers
}) => {
  const activeFiltersSummary = getActiveFiltersSummary(currentUserId, availableUsers);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.resultsInfo}>
          <Ionicons name="search" size={20} color="#3b82f6" />
          <Text style={styles.resultsText}>
            {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        <TouchableOpacity style={styles.clearAllButton} onPress={onClearAll}>
          <Ionicons name="close-circle" size={20} color="#ef4444" />
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {activeFiltersSummary && (
        <View style={styles.filtersSummary}>
          <Text style={styles.filtersLabel}>Active filters:</Text>
          <Text style={styles.filtersText}>{activeFiltersSummary}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },
  filtersSummary: {
    gap: 4,
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filtersText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default SearchResultsSummary;
