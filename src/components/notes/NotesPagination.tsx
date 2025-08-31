import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotesPaginationProps {
  currentPage: number;
  pagination: {
    totalPages: number;
    totalElements: number;
    size: number;
  };
  onPageChange: (page: number) => void;
}

const NotesPagination: React.FC<NotesPaginationProps> = ({ currentPage, pagination, onPageChange }) => {
  const { totalPages, totalElements, size = 10 } = pagination;

  if (totalPages <= 1) return null;

  const fromResult = currentPage * size + 1;
  const toResult = Math.min((currentPage + 1) * size, totalElements);

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Showing {fromResult}-{toResult} of {totalElements} results
        </Text>
      </View>

      {/* Pagination Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, currentPage === 0 && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={currentPage === 0}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-back" 
            size={18} 
            color={currentPage === 0 ? '#9ca3af' : '#3b82f6'} 
          />
          <Text style={[styles.buttonText, currentPage === 0 && styles.buttonTextDisabled]}>
            Prev
          </Text>
        </TouchableOpacity>

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            Page {currentPage + 1} of {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, currentPage >= totalPages - 1 && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={currentPage >= totalPages - 1}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, currentPage >= totalPages - 1 && styles.buttonTextDisabled]}>
            Next
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={currentPage >= totalPages - 1 ? '#9ca3af' : '#3b82f6'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8, // Match LeadCard exactly
    borderWidth: 1,
    borderColor: '#e5e7eb', // Match LeadCard exactly
    padding: 16, // Match LeadCard exactly
    marginBottom: 16, // Match LeadCard exactly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Match LeadCard exactly
    shadowOpacity: 0.05, // Match LeadCard exactly
    shadowRadius: 2, // Match LeadCard exactly
    elevation: 2, // Match LeadCard exactly
    overflow: 'hidden', // Ensure content stays within bounds
  },
  resultsInfo: {
    alignItems: 'center',
    marginBottom: 16, // Match LeadCard spacing
  },
  resultsText: {
    fontSize: 14, // Match LeadCard detailValue size
    color: '#374151', // Match LeadCard detailValue color
    fontWeight: '500', // Match LeadCard detailValue weight
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, // Take full available width
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, // Reduced to fit better
    paddingVertical: 8, // Match LeadCard button style
    borderRadius: 8, // Match LeadCard style
    backgroundColor: '#f8fafc',
    minWidth: 80, // Reduced to fit better
    maxWidth: 100, // Constrain maximum width
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexShrink: 1, // Allow button to shrink if needed
  },
  buttonDisabled: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 12, // Match LeadCard detailLabel size
    fontWeight: '600',
    color: '#3b82f6',
    marginHorizontal: 4,
    flexShrink: 1, // Allow text to shrink if needed
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  pageIndicator: {
    alignItems: 'center',
    paddingHorizontal: 12, // Reduced to fit better
    paddingVertical: 6, // Reduced to fit better
    backgroundColor: '#f8fafc',
    borderRadius: 8, // Match LeadCard style
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexShrink: 0, // Don't allow page indicator to shrink
  },
  pageText: {
    fontSize: 12, // Match LeadCard detailLabel size
    fontWeight: '600',
    color: '#374151', // Match LeadCard detailValue color
  },
});

export default NotesPagination;
