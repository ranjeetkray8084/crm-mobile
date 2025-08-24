import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddLeadFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId?: string;
  userId?: string;
  userRole?: string;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: string;
  referenceName: string;
  status: string;
  budget: string;
  location: string;
  propertyType: string;
  transactionType: string[];
  additionalRequirements: string;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({
  isVisible,
  onClose,
  onSuccess,
  companyId,
  userId,
  userRole
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    source: 'INSTAGRAM',
    referenceName: '',
    status: 'NEW',
    budget: '',
    location: '',
    propertyType: '',
    transactionType: [],
    additionalRequirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [showReferenceField, setShowReferenceField] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const sourceOptions = [
    'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'REFERENCE', 
    'NINETY_NINE_ACRES', 'MAGIC_BRICKS', 'OTHER'
  ];

  const propertyTypes = ['COMMERCIAL', 'RESIDENTIAL'];
  const transactionTypes = ['PURCHASE', 'LEASE', 'RENT'];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.source === 'REFERENCE' && !formData.referenceName?.trim()) {
      newErrors.referenceName = 'Reference name is required when source is Reference';
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'source') {
      setShowReferenceField(value === 'REFERENCE');
    }
    
    if (field === 'propertyType') {
      setFormData(prev => ({ ...prev, transactionType: [] }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTransactionTypeChange = (value: string) => {
    setFormData(prev => {
      const alreadyChecked = prev.transactionType.includes(value);
      const updated = alreadyChecked
        ? prev.transactionType.filter(v => v !== value)
        : [...prev.transactionType, value];
      return { ...prev, transactionType: updated };
    });
  };

  const getFinalRequirement = () => {
    const final = [];
    
    if (formData.propertyType) {
      final.push(formData.propertyType);
    }
    if (formData.transactionType.length > 0) {
      final.push(...formData.transactionType);
    }
    if (formData.additionalRequirements) {
      final.push(formData.additionalRequirements);
    }
    
    return final.join(', ');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
        source: formData.source,
        referenceName: formData.source === 'REFERENCE' ? formData.referenceName.trim() : null,
        status: 'NEW',
        budget: formData.budget.trim() || null,
        location: formData.location.trim() || null,
        requirement: getFinalRequirement(),
        createdBy: { userId },
        companyId
      };

      // TODO: Replace with actual API call when createLead is available
      console.log('Creating lead:', leadData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Lead created successfully!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: 'INSTAGRAM',
      referenceName: '',
      status: 'NEW',
      budget: '',
      location: '',
      propertyType: '',
      transactionType: [],
      additionalRequirements: ''
    });
    setErrors({});
    setShowReferenceField(false);
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
          <View style={styles.header}>
            <Text style={styles.title}>Add New Lead</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
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
                onChangeText={(value) => handleInputChange('phone', value)}
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
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
                      {source?.replace(/_/g, ' ') || 'Unknown'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {showReferenceField && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Reference Name *</Text>
                <TextInput
                  style={[styles.input, errors.referenceName && styles.inputError]}
                  value={formData.referenceName}
                  onChangeText={(value) => handleInputChange('referenceName', value)}
                  placeholder="Enter reference name"
                  placeholderTextColor="#9ca3af"
                />
                {errors.referenceName && <Text style={styles.errorText}>{errors.referenceName}</Text>}
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.pickerContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.sourceOption,
                      formData.propertyType === type && styles.sourceOptionSelected
                    ]}
                    onPress={() => handleInputChange('propertyType', type)}
                  >
                    <Text style={[
                      styles.sourceOptionText,
                      formData.propertyType === type && styles.sourceOptionTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Transaction Type</Text>
              <View style={styles.pickerContainer}>
                {transactionTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.sourceOption,
                      formData.transactionType.includes(type) && styles.sourceOptionSelected
                    ]}
                    onPress={() => handleTransactionTypeChange(type)}
                  >
                    <Text style={[
                      styles.sourceOptionText,
                      formData.transactionType.includes(type) && styles.sourceOptionTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget</Text>
              <TextInput
                style={[styles.input, errors.budget && styles.inputError]}
                value={formData.budget}
                onChangeText={(value) => handleInputChange('budget', value)}
                placeholder="Enter budget amount"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter location"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Requirements</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.additionalRequirements}
                onChangeText={(value) => handleInputChange('additionalRequirements', value)}
                placeholder="Enter additional requirements..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Creating...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Create Lead</Text>
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
    maxHeight: 500,
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
  submitButton: {
    backgroundColor: '#10b981',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default AddLeadForm;
