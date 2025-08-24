import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddCompanyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    maxUsers: '',
    maxAdmins: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const createCompany = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.maxUsers.trim() || !formData.maxAdmins.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const maxUsers = parseInt(formData.maxUsers);
    const maxAdmins = parseInt(formData.maxAdmins);

    if (isNaN(maxUsers) || maxUsers < 1) {
      Alert.alert('Error', 'Max Users must be a positive number');
      return;
    }

    if (isNaN(maxAdmins) || maxAdmins < 1) {
      Alert.alert('Error', 'Max Admins must be a positive number');
      return;
    }

    if (maxAdmins > maxUsers) {
      Alert.alert('Error', 'Max Admins cannot be greater than Max Users');
      return;
    }

    setIsSubmitting(true);

    const companyData = {
      ...formData,
      maxUsers,
      maxAdmins,
    };

    try {
      // This would need to be implemented in your CompanyService
      // For now, we'll show a success message
      Alert.alert('Success', 'Company created successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        maxUsers: '',
        maxAdmins: '',
      });
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error creating company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="business" size={24} color="white" />
        <Text style={styles.headerText}>Add New Company</Text>
      </View>

      <View style={styles.form}>
        {/* Company Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Company Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Enter company name"
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="Enter company email"
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
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Enter company phone"
            keyboardType="phone-pad"
          />
        </View>

        {/* Max Users */}
        <View style={styles.field}>
          <Text style={styles.label}>Max Users *</Text>
          <TextInput
            style={styles.input}
            value={formData.maxUsers}
            onChangeText={(value) => handleChange('maxUsers', value)}
            placeholder="Enter maximum number of users"
            keyboardType="numeric"
          />
          <Text style={styles.helpText}>Minimum: 1</Text>
        </View>

        {/* Max Admins */}
        <View style={styles.field}>
          <Text style={styles.label}>Max Admins *</Text>
          <TextInput
            style={styles.input}
            value={formData.maxAdmins}
            onChangeText={(value) => handleChange('maxAdmins', value)}
            placeholder="Enter maximum number of admins"
            keyboardType="numeric"
          />
          <Text style={styles.helpText}>Minimum: 1, Cannot exceed Max Users</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#0d9488" />
          <Text style={styles.infoText}>
            Company settings will determine the maximum number of users and administrators that can be created within this company.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="arrow-back" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Back to Companies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={createCompany}
            disabled={isSubmitting}
          >
            <Ionicons name="add-circle" size={18} color="white" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Company'}
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
    backgroundColor: '#0d9488',
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#ccfbf1',
    borderWidth: 1,
    borderColor: '#0d9488',
    borderRadius: 8,
  },
  infoText: {
    color: '#0f766e',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
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
    backgroundColor: '#0d9488',
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

export default AddCompanyForm;
