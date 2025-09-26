import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  taskStatus: string;
  setTaskStatus: (status: string) => void;
  createdByFilter: string;
  setCreatedByFilter: (filter: string) => void;
  assignedToFilter: string;
  setAssignedToFilter: (filter: string) => void;
  availableCreators: any[];
  availableAssignees: any[];
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  taskStatus,
  setTaskStatus,
  createdByFilter,
  setCreatedByFilter,
  assignedToFilter,
  setAssignedToFilter,
  availableCreators,
  availableAssignees,
  onClearFilters,
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'NEW', label: 'New' },
    { value: 'UNDER_PROCESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const createdByOptions = [
    { value: 'ALL', label: 'All Creators' },
    { value: 'CURRENT_USER', label: 'Me' },
    ...availableCreators
      .filter(creator => creator && creator.id != null)
      .map(creator => ({
        value: creator.id.toString(),
        label: creator.name || creator.username || 'Unknown'
      }))
  ];

  const assignedToOptions = [
    { value: 'ALL', label: 'All Assignees' },
    { value: 'CURRENT_USER', label: 'Me' },
    { value: 'UNASSIGNED', label: 'Unassigned' },
    ...availableAssignees
      .filter(assignee => assignee && assignee.id != null)
      .map(assignee => ({
        value: assignee.id.toString(),
        label: assignee.name || assignee.username || 'Unknown'
      }))
  ];

  const hasActiveFilters = taskStatus !== 'ALL' || 
    createdByFilter !== 'ALL' || 
    assignedToFilter !== 'ALL';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Filters & Search</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.optionsContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    taskStatus === option.value && styles.selectedOption
                  ]}
                  onPress={() => setTaskStatus(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    taskStatus === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {taskStatus === option.value && (
                    <Ionicons name="checkmark" size={16} color="#1c69ff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Created By Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created By</Text>
            <View style={styles.optionsContainer}>
              {createdByOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    createdByFilter === option.value && styles.selectedOption
                  ]}
                  onPress={() => setCreatedByFilter(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    createdByFilter === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {createdByFilter === option.value && (
                    <Ionicons name="checkmark" size={16} color="#1c69ff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Assigned To Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned To</Text>
            <View style={styles.optionsContainer}>
              {assignedToOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    assignedToFilter === option.value && styles.selectedOption
                  ]}
                  onPress={() => setAssignedToFilter(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    assignedToFilter === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {assignedToFilter === option.value && (
                    <Ionicons name="checkmark" size={16} color="#1c69ff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#1c69ff',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#1c69ff',
    fontWeight: '500',
  },
});

export default FilterModal;
