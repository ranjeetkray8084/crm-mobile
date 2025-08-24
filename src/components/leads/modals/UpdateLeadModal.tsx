import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  budget?: string;
  requirement?: string;
  location?: string;
  source: string;
}

interface UpdateLeadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  lead: Lead | null;
}

const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({
  isVisible,
  onClose,
  onUpdate,
  lead
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: (lead.name && typeof lead.name === 'string') ? lead.name : '',
        phone: (lead.phone && typeof lead.phone === 'string') ? lead.phone : '',
        email: (lead.email && typeof lead.email === 'string') ? lead.email : '',
        budget: (lead.budget && typeof lead.budget === 'string') ? lead.budget : '',
        requirement: (lead.requirement && typeof lead.requirement === 'string') ? lead.requirement : '',
        location: (lead.location && typeof lead.location === 'string') ? lead.location : '',
        source: (lead.source && typeof lead.source === 'string') ? lead.source : ''
      });
      setErrors({});
    }
  }, [lead]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone || typeof formData.phone !== 'string' || !formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email && typeof formData.email === 'string' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.budget && typeof formData.budget === 'string' && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Ensure all string fields are properly trimmed
      const cleanedData = {
        ...formData,
        name: (formData.name && typeof formData.name === 'string') ? formData.name.trim() : '',
        phone: (formData.phone && typeof formData.phone === 'string') ? formData.phone.trim() : '',
        email: (formData.email && typeof formData.email === 'string') ? formData.email.trim() : '',
        budget: (formData.budget && typeof formData.budget === 'string') ? formData.budget.trim() : '',
        requirement: (formData.requirement && typeof formData.requirement === 'string') ? formData.requirement.trim() : '',
        location: (formData.location && typeof formData.location === 'string') ? formData.location.trim() : '',
        source: (formData.source && typeof formData.source === 'string') ? formData.source.trim() : ''
      };
      onUpdate(cleanedData);
    }
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    setFormData(prev => ({ ...prev, [field]: (value && typeof value === 'string') ? value : '' }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const sourceOptions = [
    'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'REFERENCE', 
    'NINETY_NINE_ACRES', 'MAGIC_BRICKS', 'OTHER'
  ];

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
          <View style={styles.header}>
            <Text style={styles.title}>Update Lead</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                                 onChangeText={(value) => handleInputChange('name', value || '')}
                placeholder="Enter lead name"
                placeholderTextColor="#9ca3af"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                                 onChangeText={(value) => handleInputChange('phone', value || '')}
                placeholder="Enter phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                                 onChangeText={(value) => handleInputChange('email', value || '')}
                placeholder="Enter email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget</Text>
              <TextInput
                style={[styles.input, errors.budget && styles.inputError]}
                value={formData.budget}
                                 onChangeText={(value) => handleInputChange('budget', value || '')}
                placeholder="Enter budget amount"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Requirement</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.requirement}
                                 onChangeText={(value) => handleInputChange('requirement', value || '')}
                placeholder="Enter requirement details"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                                 onChangeText={(value) => handleInputChange('location', value || '')}
                placeholder="Enter location"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Source</Text>
              <View style={styles.pickerContainer}>
                {sourceOptions.map((source) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.sourceOption,
                      formData.source === source && styles.sourceOptionSelected
                    ]}
                    onPress={() => handleInputChange('source', source)}
                  >
                                                               <Text style={[
                        styles.sourceOptionText,
                        formData.source === source && styles.sourceOptionTextSelected
                      ]}>
                        {(source && typeof source === 'string') ? source.replace(/_/g, ' ') : 'Unknown'}
                      </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleSubmit}>
              <Text style={styles.updateButtonText}>Update Lead</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  sourceOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sourceOptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sourceOptionTextSelected: {
    color: '#fff',
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
  updateButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default UpdateLeadModal;
