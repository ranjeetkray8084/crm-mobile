import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchResultsSummaryProps {
  isSearchActive: boolean;
  totalResults: number;
  currentPage: number;
  pageSize: number;
  hasActiveFilters: boolean;
  activeFiltersSummary: string;
  onClearAll: () => void;
}

const SearchResultsSummary: React.FC<SearchResultsSummaryProps> = ({
  isSearchActive,
  totalResults,
  currentPage,
  pageSize,
  hasActiveFilters,
  activeFiltersSummary,
  onClearAll
}) => {
  if (!isSearchActive) return null;

  const startResult = (currentPage * pageSize) + 1;
  const endResult = Math.min((currentPage + 1) * pageSize, totalResults);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.resultsInfo}>
          <Ionicons name="search" size={20} color="#3b82f6" />
          <Text style={styles.resultsText}>
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#ef4444" />
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilters && (
        <View style={styles.filtersInfo}>
          <Text style={styles.filtersLabel}>Active filters:</Text>
          <Text style={styles.filtersSummary}>{activeFiltersSummary}</Text>
        </View>
      )}

      {totalResults > 0 && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Showing {startResult}-{endResult} of {totalResults} results
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  resultsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  clearText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  filtersInfo: {
    marginBottom: 8,
  },
  filtersLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  filtersSummary: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default SearchResultsSummary;
