import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLeads } from '../../core/hooks/useLeads';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddLeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'INSTAGRAM',
    referenceName: '',
    budget: '',
    location: '',
    propertyType: '',
    transactionType: [] as string[],
    additionalRequirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [showReferenceField, setShowReferenceField] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  // Use the useLeads hook with proper user information
  const { createLead } = useLeads(companyId, userId, userRole);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setCompanyId(user.companyId?.toString() || '');
          setUserId(user.userId?.toString() || user.id?.toString() || '');
          setUserRole(user.role || '');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'source') {
      setShowReferenceField(value === 'REFERENCE');
    }
    
    if (name === 'propertyType') {
      setFormData(prev => ({ ...prev, transactionType: [] }));
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
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert('Error', 'Name and Phone are required fields');
      return;
    }

    if (!formData.propertyType) {
      Alert.alert('Error', 'Please select a property type');
      return;
    }

    if (formData.transactionType.length === 0) {
      Alert.alert('Error', 'Please select at least one transaction type');
      return;
    }

    if (formData.source === 'REFERENCE' && !formData.referenceName.trim()) {
      Alert.alert('Error', 'Please enter the reference name');
      return;
    }

    // Check if we have the required user information
    if (!companyId) {
      Alert.alert('Error', 'Company ID not found. Please login again.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      // Use the exact structure from the working CRM frontend
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
        createdBy: { userId: parseInt(userId, 10) }, // Ensure userId is a number
      };

      console.log('🔍 Creating lead with data:', leadData);
      console.log('🔍 User info:', { companyId, userId, userRole });

      const result = await createLead(leadData);

      if (result && typeof result === 'object' && 'success' in result && result.success) {
        Alert.alert('Success', 'Lead created successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          source: 'INSTAGRAM',
          referenceName: '',
          budget: '',
          location: '',
          propertyType: '',
          transactionType: [],
          additionalRequirements: '',
        });
        onSuccess();
      } else {
        const errorMessage = result && typeof result === 'object' && 'error' in result ? String(result.error) : 'Failed to create lead';
        Alert.alert('Error', errorMessage);
      }
    } catch (err: any) {
      console.error('❌ Error creating lead:', err);
      Alert.alert('Error', 'Error saving lead: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={24} color="white" />
        <Text style={styles.headerText}>Add New Lead</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.grid}>
          {/* Full Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter full name"
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Budget */}
          <View style={styles.field}>
            <Text style={styles.label}>Budget (₹)</Text>
            <TextInput
              style={styles.input}
              value={formData.budget}
              onChangeText={(value) => handleInputChange('budget', value)}
              placeholder="Enter budget"
              keyboardType="numeric"
            />
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Enter location"
            />
          </View>

          {/* Lead Source */}
          <View style={styles.field}>
            <Text style={styles.label}>Lead Source *</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'INSTAGRAM' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'INSTAGRAM')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'INSTAGRAM' && styles.pickerOptionTextSelected]}>
                  Instagram
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'FACEBOOK' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'FACEBOOK')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'FACEBOOK' && styles.pickerOptionTextSelected]}>
                  Facebook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'YOUTUBE' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'YOUTUBE')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'YOUTUBE' && styles.pickerOptionTextSelected]}>
                  YouTube
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'REFERENCE' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'REFERENCE')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'REFERENCE' && styles.pickerOptionTextSelected]}>
                  Reference
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'NINETY_NINE_ACRES' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'NINETY_NINE_ACRES')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'NINETY_NINE_ACRES' && styles.pickerOptionTextSelected]}>
                  99acres
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pickerOption, formData.source === 'MAGIC_BRICKS' && styles.pickerOptionSelected]}
                onPress={() => handleInputChange('source', 'MAGIC_BRICKS')}
              >
                <Text style={[styles.pickerOptionText, formData.source === 'MAGIC_BRICKS' && styles.pickerOptionTextSelected]}>
                  MagicBricks
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reference Name */}
          {showReferenceField && (
            <View style={styles.field}>
              <Text style={styles.label}>Reference Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.referenceName}
                onChangeText={(value) => handleInputChange('referenceName', value)}
                placeholder="Enter reference name"
              />
            </View>
          )}
        </View>

        {/* Property Type Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Property Type *</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, formData.propertyType === 'Commercial' && styles.pickerOptionSelected]}
              onPress={() => handleInputChange('propertyType', 'Commercial')}
            >
              <Text style={[styles.pickerOptionText, formData.propertyType === 'Commercial' && styles.pickerOptionTextSelected]}>
                Commercial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, formData.propertyType === 'Residential' && styles.pickerOptionSelected]}
              onPress={() => handleInputChange('propertyType', 'Residential')}
            >
              <Text style={[styles.pickerOptionText, formData.propertyType === 'Residential' && styles.pickerOptionTextSelected]}>
                Residential
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction Type Selection */}
        {formData.propertyType && (
          <View style={styles.field}>
            <Text style={styles.label}>Type *</Text>
            <View style={styles.pickerContainer}>
              {formData.propertyType === 'Commercial' ? (
                <>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Purchase') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Purchase')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Purchase') && styles.pickerOptionTextSelected]}>
                      Purchase
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Lease') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Lease')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Lease') && styles.pickerOptionTextSelected]}>
                      Lease
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Plot') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Plot')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Plot') && styles.pickerOptionTextSelected]}>
                      Plot
                    </Text>
                  </TouchableOpacity>
                </>
              ) : formData.propertyType === 'Residential' ? (
                <>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Rent') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Rent')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Rent') && styles.pickerOptionTextSelected]}>
                      Rent
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Purchase') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Purchase')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Purchase') && styles.pickerOptionTextSelected]}>
                      Purchase
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, formData.transactionType.includes('Plot') && styles.pickerOptionSelected]}
                    onPress={() => handleTransactionTypeChange('Plot')}
                  >
                    <Text style={[styles.pickerOptionText, formData.transactionType.includes('Plot') && styles.pickerOptionTextSelected]}>
                      Plot
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        )}

        {/* Additional Requirements */}
        <View style={styles.field}>
          <Text style={styles.label}>Additional Requirements</Text>
          <TextInput
            style={styles.input}
            placeholder="Type any additional requirements..."
            value={formData.additionalRequirements || ''}
            onChangeText={(value) => setFormData(prev => ({ ...prev, additionalRequirements: value }))}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="arrow-back" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="person-add" size={18} color="white" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : 'Save Lead'}
            </Text>
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
    backgroundColor: '#16a34a',
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
  grid: {
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  pickerOptionSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  pickerOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: 'white',
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
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddLeadForm;
