import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface StatusUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
  title: string;
  subtitle: string;
  statusOptions: string[] | Array<{ value: string; label: string }>;
  currentStatus?: string;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  visible,
  onClose,
  onStatusUpdate,
  title,
  subtitle,
  statusOptions,
  currentStatus
}) => {
  const handleStatusSelect = (status: string) => {
    onStatusUpdate(status);
    onClose();
  };

  const getStatusValue = (option: string | { value: string; label: string }): string => {
    return typeof option === 'string' ? option : option.value;
  };

  const getStatusLabel = (option: string | { value: string; label: string }): string => {
    return typeof option === 'string' ? option : option.label;
  };

  const isCurrentStatus = (option: string | { value: string; label: string }): boolean => {
    const value = getStatusValue(option);
    return currentStatus === value;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          
          <View style={styles.optionsContainer}>
            {statusOptions.map((status, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isCurrentStatus(status) && styles.optionButtonActive
                ]}
                onPress={() => handleStatusSelect(getStatusValue(status))}
              >
                <Text style={[
                  styles.optionText,
                  isCurrentStatus(status) && styles.optionTextActive
                ]}>
                  {getStatusLabel(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default StatusUpdateModal;
