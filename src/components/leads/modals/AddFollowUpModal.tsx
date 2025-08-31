import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FollowUpService } from '../../../core/services/followup.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
}

interface AddFollowUpModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddFollowUp: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  lead: Lead | null;
}

const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({
  isVisible,
  onClose,
  onAddFollowUp,
  lead
}) => {
  const [note, setNote] = useState('');
  const [followupDate, setFollowupDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Animation for spinner
  useEffect(() => {
    if (loading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (isVisible) {
      // Set default follow-up date to tomorrow at 9:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // Set to 9:00 AM
      setFollowupDate(tomorrow);
      setNote('');
      setError(null);
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (!note.trim() || !followupDate) {
      Alert.alert('⚠️ Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
            // Get companyId and userId from AsyncStorage - use same keys as web version
      let userStr = await AsyncStorage.getItem('user');
      let tokenStr = await AsyncStorage.getItem('token');
      
      // If not found, try to migrate from old keys
      if (!userStr || !tokenStr) {
        console.log('🔍 Trying to migrate from old storage keys...');
        const oldUserStr = await AsyncStorage.getItem('crm_user');
        const oldTokenStr = await AsyncStorage.getItem('crm_token');
        
        if (oldUserStr && oldTokenStr) {
          console.log('🔍 Found old storage data, migrating...');
          // Migrate to new keys
          await AsyncStorage.setItem('user', oldUserStr);
          await AsyncStorage.setItem('token', oldTokenStr);
          // Clear old keys
          await AsyncStorage.removeItem('crm_user');
          await AsyncStorage.removeItem('crm_token');
          
          userStr = oldUserStr;
          tokenStr = oldTokenStr;
          console.log('🔍 Migration completed');
        }
      }
      
      const user = userStr ? JSON.parse(userStr) : {};
      const companyId = user.companyId;
      
      console.log('🔍 AddFollowUpModal - Storage keys checked:');
      console.log('🔍 user key:', userStr ? 'found' : 'not found');
      console.log('🔍 token key:', tokenStr ? 'found' : 'not found');
      
      console.log('🔍 User data from storage:', user);
      console.log('🔍 Company ID found:', companyId);
      console.log('🔍 User ID found:', user.userId || user.id);
      
      if (!userStr || !tokenStr) {
        throw new Error('You are not logged in. Please log in to continue.');
      }
      
      if (!companyId) {
        throw new Error('Company ID not found. Please log out and log in again to refresh your session.');
      }

      // Format data exactly as required: {"followUpDate": "2025-08-08T00:00:00", "note": "Initial contact made. Follow-up in 3 days.", "leadId": 35, "userId": 24}
      const followUpData = {
        followUpDate: followupDate.toISOString(),
        note: note.trim(),
        leadId: parseInt(lead?.leadId || lead?.id || '0'),
        userId: parseInt(user.userId || user.id || '1')
      };

      console.log('📤 Sending follow-up data:', followUpData);
      console.log('📤 Company ID:', companyId);
      console.log('📤 Lead ID:', lead?.leadId || lead?.id);
      console.log('📤 User ID:', user.userId || user.id);

      // Call the parent's onAddFollowUp callback instead of calling the service directly
      if (onAddFollowUp) {
        const result = await onAddFollowUp(followUpData);
        
        if (result && result.success) {
          // Show success alert with lead name and notification info
          const leadName = lead?.name || 'Lead';
          const followUpDate = new Date(followUpData.followUpDate);
          const formattedDate = followUpDate.toLocaleDateString('en-IN');
          const formattedTime = followUpDate.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          Alert.alert(
            '✅ Success!',
            `Follow-up created successfully for ${leadName}!\n📅 Date: ${formattedDate}\n🕐 Time: ${formattedTime}\n🔔 Notification will be sent on the scheduled date.`,
            [{ text: 'OK', onPress: () => onClose() }]
          );
        } else {
          const errorMsg = result?.error || 'Failed to create follow-up';
          console.error('❌ Follow-up creation failed:', result);
          setError(errorMsg);
          Alert.alert('❌ Error', errorMsg);
        }
      } else {
        throw new Error('onAddFollowUp callback is required');
      }
    } catch (error: any) {
      console.error('❌ Unexpected error in follow-up creation:', error);
      
      let errorMessage = 'Failed to add follow-up. Please try again.';
      
      // Provide more specific error messages
      if (error?.message?.includes('not logged in')) {
        errorMessage = 'You are not logged in. Please log in to continue.';
      } else if (error?.message?.includes('Company ID not found')) {
        errorMessage = 'Session expired. Please log out and log in again.';
      } else if (error?.message?.includes('Authentication failed')) {
        errorMessage = 'Authentication failed. Please log in again.';
      }
      
      setError(errorMessage);
      Alert.alert('❌ Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Handle Android date picker dismissal properly
    if (Platform.OS === 'android') {
      // On Android, always close the picker after selection
      setShowDatePicker(false);
      
      // Only update date if user actually selected one (not cancelled)
      if (selectedDate) {
        // Keep the current time, only update the date part
        const currentTime = followupDate;
        const newDate = new Date(selectedDate);
        newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
        setFollowupDate(newDate);
      }
    } else {
      // For iOS, handle the event type
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
      } else if (selectedDate) {
        // Keep the current time, only update the date part
        const currentTime = followupDate;
        const newDate = new Date(selectedDate);
        newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
        setFollowupDate(newDate);
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    // Handle Android time picker dismissal properly
    if (Platform.OS === 'android') {
      // On Android, always close the picker after selection
      setShowTimePicker(false);
      
      // Only update time if user actually selected one (not cancelled)
      if (selectedTime) {
        // Keep the current date, only update the time part
        const newDateTime = new Date(followupDate);
        newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        setFollowupDate(newDateTime);
      }
    } else {
      // For iOS, handle the event type
      if (event.type === 'dismissed') {
        setShowTimePicker(false);
      } else if (selectedTime) {
        // Keep the current date, only update the time part
        const newDateTime = new Date(followupDate);
        newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        setFollowupDate(newDateTime);
      }
    }
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (!lead) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="calendar" size={20} color="#3b82f6" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Add Follow-Up</Text>
                <Text style={styles.subtitle}>
                  {lead?.name ? `for ${lead.name}` : 'for this lead'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <View style={styles.errorActions}>
                <TouchableOpacity 
                  onPress={() => setError(null)}
                  style={styles.dismissButton}
                >
                  <Text style={styles.dismissButtonText}>Dismiss</Text>
                </TouchableOpacity>
                {error.includes('log in') && (
                  <TouchableOpacity 
                    onPress={() => {
                      setError(null);
                      onClose();
                      // The user should navigate to login screen
                    }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>Go to Login</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Form */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Note */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="chatbubble" size={16} color="#6b7280" />
                {' '}Follow-up Note *
              </Text>
              <TextInput
                style={styles.textArea}
                value={note}
                onChangeText={setNote}
                placeholder="Enter your follow-up notes..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
                autoFocus
              />
            </View>

            {/* Follow-up Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="calendar" size={16} color="#6b7280" />
                {' '}Follow-up Date *
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Ionicons name="calendar" size={20} color="#6b7280" />
                <Text style={styles.dateButtonText}>{formatDate(followupDate)}</Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Follow-up Time */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="time" size={16} color="#6b7280" />
                {' '}Follow-up Time *
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
                disabled={loading}
              >
                <Ionicons name="time" size={20} color="#6b7280" />
                <Text style={styles.dateButtonText}>{formatTime(followupDate)}</Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.addButton,
                (loading || !note.trim()) && styles.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={loading || !note.trim()}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
                  <Text style={styles.addButtonText}>Adding...</Text>
                </View>
              ) : (
                <Text style={styles.addButtonText}>Add Follow-Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={followupDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          onTouchCancel={handleDatePickerCancel}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={followupDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          onTouchCancel={handleTimePickerCancel}
        />
      )}
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
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  dismissButton: {
    marginTop: 8,
  },
  dismissButtonText: {
    fontSize: 12,
    color: '#dc2626',
    textDecorationLine: 'underline',
  },
  errorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  loginButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffffff',
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
    borderRadius: 8,
    marginRight: 8,
  },
});

export default AddFollowUpModal;
