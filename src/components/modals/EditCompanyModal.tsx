import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompanyService } from '../../core/services';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  maxUsers: number;
  maxAdmins: number;
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  totalUsers?: number;
  totalAdmins?: number;
}

interface EditCompanyModalProps {
  isVisible: boolean;
  onClose: () => void;
  company: Company | null;
  onUpdate: () => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isVisible,
  onClose,
  company,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    maxUsers: '',
    maxAdmins: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        maxUsers: company.maxUsers?.toString() || '',
        maxAdmins: company.maxAdmins?.toString() || '',
      });
    }
  }, [company]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!company) return;

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
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      maxUsers,
      maxAdmins,
    };

    try {
      const result = await CompanyService.updateCompany(company.id, companyData);
      
      if (result.success) {
        Alert.alert('Success', 'Company updated successfully!');
        onUpdate();
        onClose();
      } else {
        Alert.alert('Error', result.error || 'Failed to update company');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error updating company');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!company) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="business" size={24} color="white" />
            <Text style={styles.headerTitle}>Edit Company</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={18} color="white" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Updating...' : 'Update Company'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
    marginTop: 4,
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
    marginBottom: 24,
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
    backgroundColor: '#3b82f6',
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

export default EditCompanyModal;
