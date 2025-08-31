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
import { useUsers } from '../../../core/hooks/useUsers';
import VisibilitySelector from './VisibilitySelector';

interface AddNoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateNote: (noteData: any) => Promise<void>;
  companyId: number;
  userId: number;
  userRole: string;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isVisible,
  onClose,
  onCreateNote,
  companyId,
  userId,
  userRole,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    date: '',
    time: '',
    priority: 'PRIORITY_C',
    status: 'NEW',
    type: 'NOTE',
    visibility: 'ONLY_ME',
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { users: allUsers, loading: usersLoading, loadUsers } = useUsers(companyId, userRole, userId);

  useEffect(() => {
    if (isVisible && companyId) {
      loadUsers();
    }
  }, [isVisible, companyId]);

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter note content');
      return;
    }

    // Validate event requirements
    if (formData.type === 'EVENT' && (!formData.date || !formData.time)) {
      Alert.alert('Error', 'Please select both date and time for the event');
      return;
    }

    // Validate visibility requirements
    if ((formData.visibility === 'SPECIFIC_USERS' || formData.visibility === 'SPECIFIC_ADMIN') && selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user/admin');
      return;
    }

    setIsSubmitting(true);
    try {
      const noteData = {
        ...formData,
        dateTime: formData.type === 'EVENT' ? `${formData.date}T${formData.time}:00` : null,
        visibleUserIds: selectedUsers,
      };

      await onCreateNote(noteData);
      
      // Reset form
      setFormData({
        content: '',
        date: '',
        time: '',
        priority: 'PRIORITY_C',
        status: 'NEW',
        type: 'NOTE',
        visibility: 'ONLY_ME',
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVisibilityChange = (visibility: string) => {
    setFormData(prev => ({ ...prev, visibility }));
    if (visibility !== 'SPECIFIC_USERS' && visibility !== 'SPECIFIC_ADMIN') {
      setSelectedUsers([]);
    }
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const resetForm = () => {
    setFormData({
      content: '',
      date: '',
      time: '',
      priority: 'PRIORITY_C',
      status: 'NEW',
      type: 'NOTE',
      visibility: 'ONLY_ME',
    });
    setSelectedUsers([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      // Reset date/time when switching to NOTE type
      date: type === 'NOTE' ? '' : prev.date,
      time: type === 'NOTE' ? '' : prev.time,
    }));
  };

  // Get current date in YYYY-MM-DD format for min date
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
          <Text style={styles.title}>
            {formData.type === 'NOTE' ? '📝 Create Note' : '📅 Schedule Event'}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  formData.type === 'NOTE' && styles.typeOptionSelected
                ]}
                onPress={() => handleTypeChange('NOTE')}
              >
                <Ionicons 
                  name="document-text" 
                  size={20} 
                  color={formData.type === 'NOTE' ? '#fff' : '#6b7280'} 
                />
                <Text style={[
                  styles.typeOptionText,
                  formData.type === 'NOTE' && styles.typeOptionTextSelected
                ]}>
                  📝 Note
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  formData.type === 'EVENT' && styles.typeOptionSelected
                ]}
                onPress={() => handleTypeChange('EVENT')}
              >
                <Ionicons 
                  name="calendar" 
                  size={20} 
                  color={formData.type === 'EVENT' ? '#fff' : '#6b7280'} 
                />
                <Text style={[
                  styles.typeOptionText,
                  formData.type === 'EVENT' && styles.typeOptionTextSelected
                ]}>
                  📅 Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date & Time - Show only for Events */}
          {formData.type === 'EVENT' && (
            <View style={styles.eventDateTimeContainer}>
              <Text style={styles.eventDateTimeTitle}>Event Date & Time</Text>
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Event Date *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.date}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Event Time *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={formData.time}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={styles.helperText}>
                * Required for events. Use format: YYYY-MM-DD and HH:MM
              </Text>
            </View>
          )}

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {formData.type === 'NOTE' ? 'Note Content *' : 'Event Description *'}
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder={formData.type === 'NOTE' ? 'Enter your note content...' : 'Describe the event details...'}
              value={formData.content}
              onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Priority and Status */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.pickerContainer}>
                {['PRIORITY_A', 'PRIORITY_B', 'PRIORITY_C'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerOption,
                      formData.priority === priority && styles.pickerOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, priority }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.priority === priority && styles.pickerOptionTextSelected
                    ]}>
                      {priority.replace('PRIORITY_', 'Priority ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                {['NEW', 'PROCESSING', 'COMPLETED'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      formData.status === status && styles.pickerOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, status }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.status === status && styles.pickerOptionTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Visibility */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visibility</Text>
            <VisibilitySelector
              visibility={formData.visibility}
              onVisibilityChange={handleVisibilityChange}
              selectedUsers={selectedUsers}
              onUserSelection={handleUserSelection}
              availableUsers={allUsers || []}
              userRole={userRole}
              loading={usersLoading}
            />
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
              {isSubmitting 
                ? (formData.type === 'NOTE' ? 'Creating...' : 'Scheduling...') 
                : (formData.type === 'NOTE' ? 'Create Note' : 'Schedule Event')
              }
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
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: '#1c69ff',
    borderColor: '#1c69ff',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
  // New styles for type selector
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    gap: 8,
  },
  typeOptionSelected: {
    backgroundColor: '#1c69ff',
    borderColor: '#1c69ff',
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  typeOptionTextSelected: {
    color: '#fff',
  },
  // New styles for event date/time
  eventDateTimeContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  eventDateTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
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

export default AddNoteModal;
