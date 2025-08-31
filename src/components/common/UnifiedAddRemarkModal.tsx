import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Entity {
  id?: string | number;
  name?: string;
  propertyName?: string;
  leadId?: string;
  propertyId?: number;
}

interface UnifiedAddRemarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  entity: Entity | null;
  entityType: 'lead' | 'property' | 'note';
  onAddRemark: (data: { remark: string; type?: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const UnifiedAddRemarkModal: React.FC<UnifiedAddRemarkModalProps> = ({
  isVisible,
  onClose,
  entity,
  entityType,
  onAddRemark
}) => {
  const [remark, setRemark] = useState('');
  const [remarkType, setRemarkType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible || !entity) {
    return null;
  }

  const getEntityName = () => {
    switch (entityType) {
      case 'lead':
        return entity?.name;
      case 'property':
        return entity?.propertyName || entity?.name;
      case 'note':
        return entity?.name || 'Note';
      default:
        return entity?.name;
    }
  };

  const getEntityTypeIcon = () => {
    switch (entityType) {
      case 'lead':
        return 'person';
      case 'property':
        return 'home';
      case 'note':
        return 'document-text';
      default:
        return 'information-circle';
    }
  };

  const getEntityTypeColor = () => {
    switch (entityType) {
      case 'lead':
        return '#3b82f6'; // Blue
      case 'property':
        return '#10b981'; // Green
      case 'note':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  const handleSubmit = async () => {
    if (!remark.trim()) {
      Alert.alert('Error', 'Please enter a remark before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const remarkData = { 
        remark: remark.trim(),
        type: remarkType
      };
      
      const result = await onAddRemark(remarkData);

      if (result && result.success) {
        Alert.alert(
          '✅ Success!',
          'Remark added successfully!',
          [{ text: 'OK', onPress: () => {
            resetForm();
            onClose();
          }}]
        );
      } else {
        const errorMessage = result?.error || 'Failed to add remark';
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('UnifiedAddRemarkModal: Error adding remark:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRemark('');
    setRemarkType('general');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const remarkTypes = [
    { value: 'general', label: 'General', icon: 'chatbubble' },
    { value: 'followup', label: 'Follow Up', icon: 'time' },
    { value: 'important', label: 'Important', icon: 'alert-circle' },
    { value: 'note', label: 'Note', icon: 'document-text' },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.entityIcon, { backgroundColor: getEntityTypeColor() }]}>
                <Ionicons name={getEntityTypeIcon() as any} size={20} color="white" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Add Remark</Text>
                <Text style={styles.entityName} numberOfLines={1}>
                  {getEntityName() || 'Unknown'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Remark Type Selection */}
            <View style={styles.field}>
              <Text style={styles.label}>Remark Type</Text>
              <View style={styles.typeContainer}>
                {remarkTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeOption,
                      remarkType === type.value && styles.typeOptionSelected
                    ]}
                    onPress={() => setRemarkType(type.value)}
                    disabled={isSubmitting}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={16} 
                      color={remarkType === type.value ? 'white' : '#6b7280'} 
                    />
                    <Text style={[
                      styles.typeOptionText,
                      remarkType === type.value && styles.typeOptionTextSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Remark Text Input */}
            <View style={styles.field}>
              <Text style={styles.label}>Remark Content</Text>
              <TextInput
                style={styles.textArea}
                value={remark}
                onChangeText={setRemark}
                placeholder="Enter your remark here..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: getEntityTypeColor() }]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="add" size={18} color="white" />
                  <Text style={styles.submitButtonText}>Add Remark</Text>
                </>
              )}
            </TouchableOpacity>
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
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  entityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  entityName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    gap: 6,
  },
  typeOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeOptionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UnifiedAddRemarkModal;
