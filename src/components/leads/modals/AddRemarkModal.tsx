import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
}

interface AddRemarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddRemark: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  lead: Lead | null;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  isVisible,
  onClose,
  onAddRemark,
  lead
}) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The modal now depends on the `lead` object instead of just the ID.
  if (!isVisible || !lead) {
    return null;
  }

  const handleSubmit = async () => {
    if (!remark.trim()) {
      Alert.alert('Error', 'Please enter a remark before submitting.');
      return;
    }

    if (!lead || (!lead.id && !lead.leadId)) {
      console.error('AddRemarkModal: Invalid lead object:', lead);
      Alert.alert('Error', 'Invalid lead information. Please try again.');
      return;
    }

    if (typeof onAddRemark !== 'function') {
      console.error('AddRemarkModal: onAddRemark is not a function:', onAddRemark);
      Alert.alert('Error', 'Invalid remark submission function. Please contact support.');
      return;
    }

    console.log('AddRemarkModal: Starting submission process...');
    console.log('AddRemarkModal: Lead object:', lead);
    console.log('AddRemarkModal: Lead ID:', lead.id || lead.leadId);
    console.log('AddRemarkModal: Remark text:', remark.trim());
    console.log('AddRemarkModal: onAddRemark function:', typeof onAddRemark);
    
    setIsSubmitting(true);

    try {
      // Send only the remark data, the service will handle the leadId (same as web version)
      const remarkData = { remark: remark.trim() };
      console.log('AddRemarkModal: Submitting remark data:', remarkData);
      console.log('AddRemarkModal: Lead ID that will be used:', lead.id || lead.leadId);
      
      const result = await onAddRemark(remarkData);
      console.log('AddRemarkModal: onAddRemark result:', result);

      if (result && result.success) {
        console.log('AddRemarkModal: Remark submitted successfully');
        // Show success message before closing
        Alert.alert(
          '✅ Success!',
          'Remark added successfully!',
          [{ text: 'OK', onPress: () => {
            // Reset form and close modal on success
            setRemark('');
            onClose();
          }}]
        );
      } else {
        const errorMessage = result?.error || 'Failed to add remark';
        console.error('AddRemarkModal: Remark submission failed:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('AddRemarkModal: Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRemark('');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header now displays the lead's name */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Add Remark for: <Text style={styles.leadName}>{lead.name}</Text>
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              aria-label="Close modal"
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Remark *</Text>
              <TextInput
                style={styles.textArea}
                value={remark}
                onChangeText={setRemark}
                placeholder="Enter your remark here..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={[
                  styles.cancelButtonText,
                  isSubmitting && styles.buttonTextDisabled
                ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.addButton,
                  (isSubmitting || !remark.trim()) && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || !remark.trim()}
              >
                {isSubmitting ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.addButtonText, styles.buttonTextDisabled]}>
                      Adding...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.addButtonText}>
                    Add Remark
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  leadName: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default AddRemarkModal;
