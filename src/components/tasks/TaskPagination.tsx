import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

const TaskPagination: React.FC<TaskPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex
}) => {
  return (
    <View style={styles.container}>
      {/* Page info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} calling data
        </Text>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Pagination buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, currentPage === 1 && styles.disabledButton]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentPage === 1 ? '#9ca3af' : '#374151'} 
          />
          <Text style={[styles.buttonText, currentPage === 1 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, currentPage === totalPages && styles.disabledButton]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.buttonText, currentPage === totalPages && styles.disabledText]}>
            Next
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentPage === totalPages ? '#9ca3af' : '#374151'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pageText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    minWidth: 100,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginHorizontal: 4,
  },
  disabledText: {
    color: '#9ca3af',
  },
});

export default TaskPagination;

