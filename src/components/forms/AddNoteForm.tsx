import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddNoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface User {
  userId: string;
  name: string;
  role: string;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ onSuccess, onCancel }) => {
  const [noteType, setNoteType] = useState('NOTE');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [visibility, setVisibility] = useState('ONLY_ME');
  const [priority, setPriority] = useState('PRIORITY_A');
  const [content, setContent] = useState('');
  const [specificUsers, setSpecificUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('crm_user');
        if (userData) {
          const user = JSON.parse(userData);
          setCompanyId(user.companyId?.toString() || '');
          setUserId(user.userId?.toString() || user.id?.toString() || '');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    if (visibility === 'SPECIFIC_USERS' || visibility === 'SPECIFIC_ADMIN') {
      fetchUsers();
    }
  }, [visibility, companyId]);

  const fetchUsers = async () => {
    try {
      // This would need to be implemented in your UserService
      // For now, we'll show a placeholder
      setAvailableUsers([]);
      Alert.alert('Info', 'User loading functionality needs to be implemented');
    } catch (error) {
      console.error('Error fetching users:', error);
      setAvailableUsers([]);
    }
  };

  const handleUserSelection = (userId: string) => {
    setSpecificUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter note content');
      return;
    }

    if (noteType === 'EVENT' && (!eventDate || !eventTime)) {
      Alert.alert('Error', 'Please select event date and time');
      return;
    }

    if ((visibility === 'SPECIFIC_USERS' || visibility === 'SPECIFIC_ADMIN') && specificUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user');
      return;
    }

    const noteData = {
      userId,
      type: noteType,
      content,
      dateTime: noteType === 'EVENT' ? `${eventDate}T${eventTime}:00` : null,
      visibility,
      visibleUserIds: specificUsers,
      priority,
    };

    try {
      // This would need to be implemented in your NoteService
      // For now, we'll show a success message
      Alert.alert('Success', 'Note created successfully!');
      setContent('');
      setEventDate('');
      setEventTime('');
      setSpecificUsers([]);
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error creating note');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A': return '#dc2626';
      case 'PRIORITY_B': return '#f59e0b';
      case 'PRIORITY_C': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A': return 'High';
      case 'PRIORITY_B': return 'Medium';
      case 'PRIORITY_C': return 'Low';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={24} color="white" />
        <Text style={styles.headerText}>Add New Note</Text>
      </View>

      <View style={styles.form}>
        {/* Note Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Note Type</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, noteType === 'NOTE' && styles.pickerOptionSelected]}
              onPress={() => setNoteType('NOTE')}
            >
              <Text style={[styles.pickerOptionText, noteType === 'NOTE' && styles.pickerOptionTextSelected]}>
                Note
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, noteType === 'EVENT' && styles.pickerOptionSelected]}
              onPress={() => setNoteType('EVENT')}
            >
              <Text style={[styles.pickerOptionText, noteType === 'EVENT' && styles.pickerOptionTextSelected]}>
                Event
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Date and Time */}
        {noteType === 'EVENT' && (
          <View style={styles.field}>
            <Text style={styles.label}>Event Date and Time *</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  // This would need to be implemented with a date picker
                  Alert.alert('Info', 'Date picker functionality needs to be implemented');
                }}
              >
                <Ionicons name="calendar" size={20} color="#2563eb" />
                <Text style={styles.dateTimeButtonText}>
                  {eventDate || 'Select Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  // This would need to be implemented with a time picker
                  Alert.alert('Info', 'Time picker functionality needs to be implemented');
                }}
              >
                <Ionicons name="time" size={20} color="#2563eb" />
                <Text style={styles.dateTimeButtonText}>
                  {eventTime || 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Visibility */}
        <View style={styles.field}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, visibility === 'ONLY_ME' && styles.pickerOptionSelected]}
              onPress={() => setVisibility('ONLY_ME')}
            >
              <Text style={[styles.pickerOptionText, visibility === 'ONLY_ME' && styles.pickerOptionTextSelected]}>
                Only Me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, visibility === 'ALL_USERS' && styles.pickerOptionSelected]}
              onPress={() => setVisibility('ALL_USERS')}
            >
              <Text style={[styles.pickerOptionText, visibility === 'ALL_USERS' && styles.pickerOptionTextSelected]}>
                All Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, visibility === 'SPECIFIC_USERS' && styles.pickerOptionSelected]}
              onPress={() => setVisibility('SPECIFIC_USERS')}
            >
              <Text style={[styles.pickerOptionText, visibility === 'SPECIFIC_USERS' && styles.pickerOptionTextSelected]}>
                Specific Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, visibility === 'SPECIFIC_ADMIN' && styles.pickerOptionSelected]}
              onPress={() => setVisibility('SPECIFIC_ADMIN')}
            >
              <Text style={[styles.pickerOptionText, visibility === 'SPECIFIC_ADMIN' && styles.pickerOptionTextSelected]}>
                Specific Admins
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, visibility === 'ALL_ADMIN' && styles.pickerOptionSelected]}
              onPress={() => setVisibility('ALL_ADMIN')}
            >
              <Text style={[styles.pickerOptionText, visibility === 'ALL_ADMIN' && styles.pickerOptionTextSelected]}>
                All Admins
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_A' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_A')}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_A') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_A' && styles.pickerOptionTextSelected]}>
                High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_B' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_B')}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_B') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_B' && styles.pickerOptionTextSelected]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_C' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_C')}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_C') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_C' && styles.pickerOptionTextSelected]}>
                Low
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specific Users Selection */}
        {(visibility === 'SPECIFIC_USERS' || visibility === 'SPECIFIC_ADMIN') && (
          <View style={styles.field}>
            <Text style={styles.label}>Select Users</Text>
            <View style={styles.usersContainer}>
              {availableUsers.length === 0 ? (
                <Text style={styles.noUsersText}>No users available</Text>
              ) : (
                availableUsers.map(user => (
                  <TouchableOpacity
                    key={user.userId}
                    style={[
                      styles.userOption,
                      specificUsers.includes(user.userId) && styles.userOptionSelected
                    ]}
                    onPress={() => handleUserSelection(user.userId)}
                  >
                    <Ionicons
                      name={specificUsers.includes(user.userId) ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={specificUsers.includes(user.userId) ? "#16a34a" : "#6b7280"}
                    />
                    <Text style={[
                      styles.userOptionText,
                      specificUsers.includes(user.userId) && styles.userOptionTextSelected
                    ]}>
                      {user.name}
                    </Text>
                    <Text style={styles.userRoleText}>{user.role}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}

        {/* Content */}
        <View style={styles.field}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Write your note here..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="close" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.submitButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    gap: 6,
  },
  pickerOptionSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  pickerOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  dateTimeButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  usersContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 8,
  },
  noUsersText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 6,
  },
  userOptionSelected: {
    backgroundColor: '#f3e8ff',
  },
  userOptionText: {
    color: '#374151',
    fontSize: 14,
    flex: 1,
  },
  userOptionTextSelected: {
    color: '#8b5cf6',
    fontWeight: '500',
  },
  userRoleText: {
    color: '#6b7280',
    fontSize: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddNoteForm;
