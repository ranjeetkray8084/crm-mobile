import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Property {
  id?: number;
  propertyId?: number;
  propertyName?: string;
  name?: string;
}

interface AddRemarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddRemark: (data: { remark: string }) => void;
  property: Property | null;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  isVisible,
  onClose,
  onAddRemark,
  property
}) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The modal now depends on the `property` object instead of just the ID.
  if (!isVisible || !property) {
    return null;
  }

  const handleSubmit = async () => {
    if (!remark.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // The parent now handles getting the ID, so we just pass the remark data.
      await onAddRemark({ remark: remark.trim() });

      // Reset form and close modal on success
      setRemark('');
      onClose();
    } catch (error) {
      // Error handling is done by the parent
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
          {/* Header now displays the property's name */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Add Remark for: <Text style={styles.propertyNameHighlight}>{property.propertyName || property.name}</Text>
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.content}>
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
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.addButton,
                  (!remark.trim() || isSubmitting) && styles.buttonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={isSubmitting || !remark.trim()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Add Remark</Text>
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
    marginRight: 10,
  },
  propertyNameHighlight: {
    color: '#3b82f6',
  },
  closeButton: {
    padding: 4,
  },
  content: {
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
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    opacity: 0.5,
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
});

export default AddRemarkModal;
