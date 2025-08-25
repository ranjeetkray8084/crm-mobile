import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditNoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (noteId: number, noteData: any) => Promise<void>;
  note: any;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isVisible,
  onClose,
  onUpdate,
  note,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    date: '',
    time: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        content: note.content || '',
        date: note.dateTime ? new Date(note.dateTime).toISOString().split('T')[0] : '',
        time: note.dateTime ? new Date(note.dateTime).toTimeString().slice(0, 5) : '',
      });
    }
  }, [note]);

  const handleSubmit = async () => {
    if (!note?.id) {
      Alert.alert('Error', 'Note ID not found');
      return;
    }

    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter note content');
      return;
    }

    setIsSubmitting(true);
    try {
      const noteData = {
        content: formData.content,
        dateTime: formData.date && formData.time ? `${formData.date}T${formData.time}:00` : null,
      };

      await onUpdate(note.id, noteData);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (note) {
      setFormData({
        content: note.content || '',
        date: note.dateTime ? new Date(note.dateTime).toISOString().split('T')[0] : '',
        time: note.dateTime ? new Date(note.dateTime).toTimeString().slice(0, 5) : '',
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!note) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Note</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note Content *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your note content..."
              value={formData.content}
              onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Date and Time */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Time (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={formData.time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
              />
            </View>
          </View>

          {/* Note Info */}
          <View style={styles.noteInfo}>
            <Text style={styles.noteInfoTitle}>Note Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{note.status || 'NEW'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Priority:</Text>
              <Text style={styles.infoValue}>{note.priority || 'PRIORITY_C'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{note.typeStr || 'Note'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Updating...' : 'Update Note'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
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
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  noteInfo: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noteInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff',
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

export default EditNoteModal;
