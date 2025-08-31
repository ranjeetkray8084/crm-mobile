import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUsers } from '../../core/hooks/useUsers';
import VisibilitySelector from '../notes/modals/VisibilitySelector';
import { useAuth } from '../../shared/contexts/AuthContext';
import { NoteService } from '../../core/services/note.service';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddNoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface User {
  userId: string;
  id?: number;
  name: string;
  role: string;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ onSuccess, onCancel }) => {
  const { user: authUser } = useAuth();
  const [noteType, setNoteType] = useState('NOTE');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [visibility, setVisibility] = useState('ONLY_ME');
  const [priority, setPriority] = useState('PRIORITY_C');
  const [content, setContent] = useState('');
  const [specificUsers, setSpecificUsers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('USER'); // Will be updated from AsyncStorage/AuthContext
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the useUsers hook - pass the correct parameters
  const { 
    users: allUsers, 
    loading: usersLoading, 
    getUsersByRoleAndCompany, 
    getAdminsByCompany 
  } = useUsers(companyId, userRole, userId) as {
    users: any[];
    loading: boolean;
    getUsersByRoleAndCompany: (role: string) => Promise<any>;
    getAdminsByCompany: () => Promise<any>;
  };

  // Local state for managing users based on visibility
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Try multiple possible AsyncStorage keys
        const possibleKeys = ['crm_user', 'user', 'userData', 'auth_user', 'user_info'];
        let userData = null;
        let usedKey = '';
        
        for (const key of possibleKeys) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed && (parsed.companyId || parsed.company_id || parsed.company || parsed.role)) {
                userData = parsed;
                usedKey = key;
                break;
              }
            } catch (e) {
              console.log(`Failed to parse data from ${key}:`, e);
            }
          }
        }
        
        if (userData) {
          console.log(`AddNoteForm: Loaded user data from key '${usedKey}':`, userData);
          console.log('AddNoteForm: User role:', userData.role);
          
          // Try multiple possible companyId field names
          const companyIdValue = userData.companyId || userData.company_id || userData.company || userData.companyIdRaw;
          console.log('AddNoteForm: CompanyId from storage:', companyIdValue);
          
          // Try multiple possible userId field names
          const userIdValue = userData.userId || userData.id || userData.user_id;
          console.log('AddNoteForm: UserId from storage:', userIdValue);
          
          setCompanyId(companyIdValue?.toString() || '');
          setUserId(userIdValue?.toString() || '');
          
          // Ensure we get the correct role - check multiple possible fields
          const detectedRole = userData.role || userData.userRole || userData.user_role || 'USER';
          console.log('AddNoteForm: Detected role from AsyncStorage:', detectedRole);
          setUserRole(detectedRole);
        } else {
          console.log('AddNoteForm: No user data found in any AsyncStorage keys');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  // Also check AuthContext for role and companyId if AsyncStorage doesn't have it
  useEffect(() => {
    if (authUser) {
      console.log('AddNoteForm: AuthContext user:', authUser);
      
      // Update role if needed
      if (!userRole || userRole === 'USER') {
        const authRole = authUser.role;
        console.log('AddNoteForm: AuthContext role:', authRole);
        if (authRole && authRole !== 'USER') {
          console.log('AddNoteForm: Updating role from AuthContext:', authRole);
          setUserRole(authRole);
        }
      }
      
      // Update companyId if missing
      if (!companyId) {
        const authCompanyId = authUser.companyId || authUser.company_id || authUser.company;
        console.log('AddNoteForm: AuthContext companyId:', authCompanyId);
        if (authCompanyId) {
          console.log('AddNoteForm: Updating companyId from AuthContext:', authCompanyId);
          setCompanyId(authCompanyId.toString());
        }
      }
      
      // Update userId if missing
      if (!userId) {
        const authUserId = authUser.userId || authUser.id || authUser.user_id;
        console.log('AddNoteForm: AuthContext userId:', authUserId);
        if (authUserId) {
          console.log('AddNoteForm: Updating userId from AuthContext:', authUserId);
          setUserId(authUserId.toString());
        }
      }
    }
  }, [authUser, userRole, companyId, userId]);

  // Load users when visibility changes
  useEffect(() => {
    console.log('AddNoteForm: Visibility changed to:', visibility);
    console.log('AddNoteForm: CompanyId:', companyId);
    
    if (visibility === 'SPECIFIC_USERS' && companyId) {
      console.log('AddNoteForm: Loading specific users...');
      setLocalLoading(true);
      const fetchSpecificUsers = async () => {
        try {
          const result = await getUsersByRoleAndCompany('USER');
          console.log('AddNoteForm: Specific users result:', result);
          if (result && result.success) {
            setLocalUsers(result.data || []);
          } else {
            setLocalUsers([]);
          }
        } catch (error) {
          console.error('AddNoteForm: Error loading specific users:', error);
          setLocalUsers([]);
        } finally {
          setLocalLoading(false);
        }
      };
      fetchSpecificUsers();
    } else if (visibility === 'SPECIFIC_ADMIN' && companyId) {
      console.log('AddNoteForm: Loading admins...');
      setLocalLoading(true);
      const fetchAdmins = async () => {
        try {
          const result = await getAdminsByCompany();
          console.log('AddNoteForm: Admins result:', result);
          if (result && result.success) {
            setLocalUsers(result.data || []);
          } else {
            setLocalUsers([]);
          }
        } catch (error) {
          console.error('AddNoteForm: Error loading admins:', error);
          setLocalUsers([]);
        } finally {
          setLocalLoading(false);
        }
      };
      fetchAdmins();
    } else {
      console.log('AddNoteForm: Clearing users for visibility:', visibility);
      setLocalUsers([]);
      setAvailableUsers([]);
      setSpecificUsers([]);
    }
  }, [visibility, companyId, getUsersByRoleAndCompany, getAdminsByCompany]);

  // Update available users when localUsers changes
  useEffect(() => {
    console.log('AddNoteForm: localUsers changed, length:', localUsers.length);
    console.log('AddNoteForm: localUsers data:', localUsers);
    
    if (localUsers.length > 0) {
      // Map users to include both userId and id fields for compatibility
      const mappedUsers = localUsers.map(user => ({
        ...user,
        id: user.id || parseInt(user.userId, 10)
      }));
      console.log('AddNoteForm: Mapped users:', mappedUsers);
      setAvailableUsers(mappedUsers);
    } else {
      console.log('AddNoteForm: No users available, clearing availableUsers');
      setAvailableUsers([]);
    }
  }, [localUsers]);

  const handleUserSelection = (userId: number) => {
    setSpecificUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log('Date selected:', formattedDate);
      setEventDate(formattedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && event.type !== 'dismissed') {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      console.log('Time selected:', formattedTime);
      setEventTime(formattedTime);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return 'Select Time';
    return timeString;
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

    if (!companyId) {
      Alert.alert('Error', 'Company ID not found. Please try again.');
      return;
    }

    const noteData = {
      userId: parseInt(userId, 10),
      type: noteType,
      content,
      dateTime: noteType === 'EVENT' ? `${eventDate}T${eventTime}:00` : null,
      visibility,
      visibleUserIds: specificUsers,
      priority,
      status: 'NEW',
    };

    setIsSubmitting(true);
    try {
      console.log('AddNoteForm: Creating note with data:', noteData);
      console.log('AddNoteForm: CompanyId:', companyId);
      
      const result: any = await NoteService.createNote(parseInt(companyId, 10), noteData);
      
      if (result.success) {
        const successMessage = noteType === 'NOTE' 
          ? '📝 Note created successfully!' 
          : '📅 Event scheduled successfully!';
        
        Alert.alert('Success', successMessage);
        resetForm();
        onSuccess();
      } else {
        Alert.alert('Error', result.error || 'Failed to create note');
      }
    } catch (error: any) {
      console.error('AddNoteForm: Error creating note:', error);
      Alert.alert('Error', error.message || 'Error creating note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setEventDate('');
    setEventTime('');
    setSpecificUsers([]);
    setAvailableUsers([]);
    setVisibility('ONLY_ME');
    setPriority('PRIORITY_C');
    setNoteType('NOTE');
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
        <Text style={styles.headerText}>
          {noteType === 'NOTE' ? '📝 Create Note' : '📅 Schedule Event'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Note Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, noteType === 'NOTE' && styles.pickerOptionSelected]}
              onPress={() => setNoteType('NOTE')}
              disabled={isSubmitting}
            >
              <Text style={[styles.pickerOptionText, noteType === 'NOTE' && styles.pickerOptionTextSelected]}>
                📝 Note
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, noteType === 'EVENT' && styles.pickerOptionSelected]}
              onPress={() => setNoteType('EVENT')}
              disabled={isSubmitting}
            >
              <Text style={[styles.pickerOptionText, noteType === 'EVENT' && styles.pickerOptionTextSelected]}>
                📅 Event
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Date and Time - Show only for Events */}
        {noteType === 'EVENT' && (
          <View style={styles.field}>
            <Text style={styles.label}>Event Date and Time *</Text>
            <View style={styles.dateTimeContainer}>
                             <TouchableOpacity
                 style={styles.dateTimeButton}
                 onPress={() => {
                   console.log('Opening date picker, current date:', eventDate);
                   setShowDatePicker(true);
                 }}
                 disabled={isSubmitting}
               >
                <Ionicons name="calendar" size={20} color="#2563eb" />
                <Text style={styles.dateTimeButtonText}>
                  {formatDisplayDate(eventDate)}
                </Text>
              </TouchableOpacity>
                             <TouchableOpacity
                 style={styles.dateTimeButton}
                 onPress={() => {
                   console.log('Opening time picker, current time:', eventTime);
                   setShowTimePicker(true);
                 }}
                 disabled={isSubmitting}
               >
                <Ionicons name="time" size={20} color="#2563eb" />
                <Text style={styles.dateTimeButtonText}>
                  {formatDisplayTime(eventTime)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Visibility */}
        <View style={styles.field}>
          <Text style={styles.label}>Visibility</Text>
          <VisibilitySelector
            visibility={visibility}
            onVisibilityChange={setVisibility}
            selectedUsers={specificUsers}
            onUserSelection={handleUserSelection}
            availableUsers={availableUsers}
            userRole={userRole}
            loading={localLoading}
          />
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_A' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_A')}
              disabled={isSubmitting}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_A') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_A' && styles.pickerOptionTextSelected]}>
                Priority A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_B' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_B')}
              disabled={isSubmitting}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_B') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_B' && styles.pickerOptionTextSelected]}>
                Priority B
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, priority === 'PRIORITY_C' && styles.pickerOptionSelected]}
              onPress={() => setPriority('PRIORITY_C')}
              disabled={isSubmitting}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor('PRIORITY_C') }]} />
              <Text style={[styles.pickerOptionText, priority === 'PRIORITY_C' && styles.pickerOptionTextSelected]}>
                Priority C
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content - Dynamic label based on type */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {noteType === 'NOTE' ? 'Note Content' : 'Event Description'}
          </Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder={noteType === 'NOTE' ? 'Write your note content...' : 'Describe the event details...'}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isSubmitting}>
            <Ionicons name="close" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.submitButtonText}>
              {isSubmitting 
                ? (noteType === 'NOTE' ? 'Creating...' : 'Scheduling...') 
                : (noteType === 'NOTE' ? 'Create Note' : 'Schedule Event')
              }
            </Text>
          </TouchableOpacity>
                 </View>
       </View>

       {/* Date and Time Pickers */}
       {showDatePicker && (
         <DateTimePicker
           value={eventDate ? new Date(eventDate) : new Date()}
           mode="date"
           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
           onChange={handleDateChange}
           minimumDate={new Date()}
           testID="datePicker"
         />
       )}
       
       {showTimePicker && (
         <DateTimePicker
           value={eventTime ? new Date(`2000-01-01T${eventTime}:00`) : new Date()}
           mode="time"
           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
           onChange={handleTimeChange}
           is24Hour={false}
           testID="timePicker"
         />
       )}
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
