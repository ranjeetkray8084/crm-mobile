import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: number;
  content: string;
  typeStr?: string;
  status?: string;
  priority?: string;
  userId: number;
  [key: string]: any;
}

interface AddRemarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddRemark: (remarkData: any) => Promise<void>;
  note: Note;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  isVisible,
  onClose,
  onAddRemark,
  note,
}) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The modal now depends on the `note` object instead of just the ID.
  if (!isVisible || !note) {
    return null;
  }

  const handleSubmit = async () => {
    if (!remark.trim()) {
      Alert.alert('Error', 'Please enter a remark before submitting.');
      return;
    }

    if (!note || !note.id) {
      console.error('AddRemarkModal: Invalid note object:', note);
      Alert.alert('Error', 'Invalid note information. Please try again.');
      return;
    }

    if (typeof onAddRemark !== 'function') {
      console.error('AddRemarkModal: onAddRemark is not a function:', onAddRemark);
      Alert.alert('Error', 'Invalid remark submission function. Please contact support.');
      return;
    }

    console.log('AddRemarkModal: Starting submission process...');
    console.log('AddRemarkModal: Note object:', note);
    console.log('AddRemarkModal: Note ID:', note.id);
    console.log('AddRemarkModal: Remark text:', remark.trim());
    console.log('AddRemarkModal: onAddRemark function:', typeof onAddRemark);
    
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
          {/* Header now displays the note's content */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Add Remark for: <Text style={styles.noteContent}>
                {note.content ? (note.content.length > 30 ? note.content.substring(0, 30) + '...' : note.content) : 'Note'}
              </Text>
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

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#1c69ff" />
              <Text style={styles.infoText}>
                Remarks are additional comments or updates that can be added to notes.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding...' : 'Add Remark'}
              </Text>
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
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 10,
  },
  noteContent: {
    color: '#1c69ff',
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c69ff',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1c69ff',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1c69ff',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default AddRemarkModal;
