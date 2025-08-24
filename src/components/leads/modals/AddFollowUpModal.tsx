import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Animated } from 'react-native';
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
  onAddFollowUp: (data: any) => void;
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
      // Set default follow-up date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
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
      // Get companyId and userId from AsyncStorage
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      const companyId = user.companyId;

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Format data exactly as required: {"followUpDate": "2025-08-08T00:00:00", "note": "Initial contact made. Follow-up in 3 days.", "leadId": 35, "userId": 24}
      const followUpData = {
        followUpDate: followupDate.toISOString(),
        note: note.trim(),
        leadId: parseInt(lead?.leadId || lead?.id || '0'),
        userId: parseInt(user.userId || user.id || '1')
      };

      const result = await FollowUpService.createFollowUp(companyId, followUpData);
      
      if (result.success) {
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
          `Follow-up created successfully for ${leadName}!\n📅 Scheduled for: ${formattedDate} at ${formattedTime}\n🔔 Notification will be sent on the scheduled date.`,
          [{ text: 'OK', onPress: () => {
            // Call the parent's onAddFollowUp callback if provided
            if (onAddFollowUp) {
              onAddFollowUp(followUpData);
            }
            onClose();
          }}]
        );
      } else {
        setError(result.error);
        Alert.alert('❌ Error', 'Failed to create follow-up: ' + result.error);
      }
    } catch (error) {
      const errorMessage = 'Failed to add follow-up. Please try again.';
      setError(errorMessage);
      Alert.alert('❌ Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFollowupDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              <TouchableOpacity 
                onPress={() => setError(null)}
                style={styles.dismissButton}
              >
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
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
                {' '}Follow-up Date & Time *
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
          mode="datetime"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
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
