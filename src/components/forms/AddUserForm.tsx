import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../../core/hooks/useUsers';
import { UserService, CompanyService } from '../../core/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface User {
  userId: string;
  name: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  adminId: string;
  companyId: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    adminId: '',
    companyId: '',
  });

  const [admins, setAdmins] = useState<User[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  // Use the useUsers hook for non-developers, direct service for developers
  const { createUser: createUserHook, loading: hookLoading } = useUsers(companyId, userRole, userId);
  const [directLoading, setDirectLoading] = useState(false);
  
  // Use hook loading for non-developers, direct loading for developers
  const loading = userRole === 'DEVELOPER' ? directLoading : hookLoading;

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log('AddUserForm: Loading user data from AsyncStorage:', userData);
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('AddUserForm: Parsed user data:', user);
          console.log('AddUserForm: User companyId:', user.companyId);
          console.log('AddUserForm: User role:', user.role);
          
          setCompanyId(user.companyId?.toString() || '');
          setUserId(user.userId?.toString() || user.id?.toString() || '');
          setUserRole(user.role || '');
          
          console.log('AddUserForm: Set companyId to:', user.companyId?.toString() || '');
          console.log('AddUserForm: Set userRole to:', user.role || '');
          
          // Set default role based on current user's role
          if (user.role === 'DEVELOPER') {
            setFormData(prev => ({ ...prev, role: 'DIRECTOR' }));
          } else if (user.role === 'DIRECTOR') {
            setFormData(prev => ({ ...prev, role: 'USER' }));
          } else if (user.role === 'ADMIN') {
            setFormData(prev => ({ ...prev, role: 'USER' }));
          }
        } else {
          console.log('AddUserForm: No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  // Get available roles based on current user's role
  const getAvailableRoles = useCallback(() => {
    const roles: { value: string; label: string }[] = [];

    if (userRole === 'DEVELOPER') {
      // Developer can only create DIRECTOR
      roles.push({ value: 'DIRECTOR', label: 'Director' });
    } else if (userRole === 'DIRECTOR') {
      // Director can create ADMIN and USER
      roles.push(
        { value: 'ADMIN', label: 'Admin' },
        { value: 'USER', label: 'User' }
      );
    } else if (userRole === 'ADMIN') {
      // Admin can only create USER (hardcoded)
      roles.push({ value: 'USER', label: 'User' });
    }

    return roles;
  }, [userRole]);

  const availableRoles = getAvailableRoles();

  // Load companies for DEVELOPER users
  const loadCompanies = useCallback(async () => {
    if (userRole !== 'DEVELOPER') return;

    setLoadingCompanies(true);
    try {
      const result = await CompanyService.getAllCompanies();
      if (result.success) {
        setCompanies(result.data || []);
      } else {
        setCompanies([]);
        Alert.alert('Error', 'Failed to load companies: ' + result.error);
      }
    } catch (error: any) {
      setCompanies([]);
      Alert.alert('Error', 'Error loading companies: ' + error.message);
    } finally {
      setLoadingCompanies(false);
    }
  }, [userRole]);

  // Load companies on component mount for DEVELOPER users
  useEffect(() => {
    if (userRole === 'DEVELOPER') {
      loadCompanies();
    }
  }, [userRole, loadCompanies]);

  // Load admins for DIRECTOR users only
  const loadAdmins = useCallback(async () => {
    if (!companyId || userRole !== 'DIRECTOR') return;

    setLoadingAdmins(true);
    try {
      // Try the specific company admins endpoint first
      const result = await UserService.getAdminRoleByCompany(companyId);

      if (result.success && result.data && result.data.length > 0) {
        setAdmins(result.data || []);
      } else {
        // Fallback: try to get all users and filter for admins
        const allUsersResult = await UserService.getAllUsersByCompany(companyId);
        if (allUsersResult.success) {
          const adminUsers = allUsersResult.data.filter((user: any) => user.role === 'ADMIN');
          setAdmins(adminUsers);
        } else {
          setAdmins([]);
        }
      }
    } catch (error) {
      setAdmins([]);
    } finally {
      setLoadingAdmins(false);
    }
  }, [companyId, userRole]);

  // Load admins when role changes to USER (for DIRECTOR only)
  useEffect(() => {
    if (formData.role === 'USER' && userRole === 'DIRECTOR') {
      loadAdmins();
    }
  }, [formData.role, userRole, loadAdmins]);

  // Load admins on component mount for DIRECTOR users (so they can see all admins)
  useEffect(() => {
    if (userRole === 'DIRECTOR') {
      loadAdmins();
    }
  }, [userRole, loadAdmins]);

  // Form validation
  const isFormValid = useCallback(() => {
    // For developers, use selected company ID, for others use their company ID
    const selectedCompanyId = userRole === 'DEVELOPER' ? formData.companyId : companyId;
    
    const baseValid = (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.role &&
      selectedCompanyId &&
      availableRoles.length > 0
    );

    // For DIRECTOR creating USER, admin selection is optional
    if (userRole === 'DIRECTOR' && formData.role === 'USER') {
      return baseValid; // Admin assignment is now optional
    }

    // For ADMIN creating USER, no admin selection needed (auto-assigned to themselves)
    if (userRole === 'ADMIN' && formData.role === 'USER') {
      return baseValid;
    }

    // For DIRECTOR creating ADMIN, no admin assignment needed
    if (userRole === 'DIRECTOR' && formData.role === 'ADMIN') {
      return baseValid; // No admin assignment for ADMIN role
    }

    // For DEVELOPER, no additional validation needed (only creates DIRECTOR)
    return baseValid;
  }, [formData, companyId, availableRoles, userRole]);

  const handleSubmit = async () => {
    // For developers, use selected company ID, for others use their company ID
    const selectedCompanyId = userRole === 'DEVELOPER' ? formData.companyId : companyId;

    if (!selectedCompanyId) {
      Alert.alert('Error', userRole === 'DEVELOPER' ? 'Please select a company.' : 'Company ID not found. Please login again.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      // Use the exact structure from your working JavaScript code
      const role = userRole === 'ADMIN' ? 'USER' :
        userRole === 'DEVELOPER' ? 'DIRECTOR' :
          formData.role;
      const adminId = userRole === 'ADMIN' ? userId : formData.adminId;

      const user = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: role,
        company: { id: parseInt(selectedCompanyId, 10) },
        admin: role === "USER" && adminId ? { userId: parseInt(adminId, 10) } : null
      };

      // Remove confirmPassword before sending (backend validation)
      delete user.confirmPassword;

      let result;
      if (userRole === 'DEVELOPER') {
        // For developers, use direct API call
        setDirectLoading(true);
        try {
          result = await UserService.createUser(user);
        } finally {
          setDirectLoading(false);
        }
      } else {
        // For other roles, use the hook
        result = await createUserHook(user);
      }

      if (result.success) {
        // Show success message
        const roleText = role === 'DIRECTOR' ? 'Director' : role === 'ADMIN' ? 'Admin' : 'User';
        Alert.alert('Success', `${roleText} created successfully!`);
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: userRole === 'DEVELOPER' ? 'DIRECTOR' : 'USER',
          adminId: '',
          companyId: userRole === 'DEVELOPER' ? '' : companyId
        });
        onSuccess();
      } else {
        // Show error message if result is not successful
        Alert.alert('Error', result.error || 'Failed to create user');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error adding user');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Load admins when role changes to USER (for DIRECTOR only)
    if (name === 'role' && value === 'USER' && userRole === 'DIRECTOR') {
      loadAdmins();
    }

    // Clear adminId when role changes to ADMIN (to avoid invalid assignments)
    if (name === 'role' && value === 'ADMIN') {
      setFormData(prev => ({
        ...prev,
        adminId: ''
      }));
    }
  };

  if (userRole === 'USER') {
    return (
      <View style={styles.container}>
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={styles.warningText}>You don't have permission to create users.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={24} color="white" />
        <Text style={styles.headerText}>Add New User</Text>
      </View>

      <View style={styles.form}>
        {!companyId && userRole !== 'DEVELOPER' && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={20} color="#dc2626" />
            <Text style={styles.warningText}>Company ID not found. Please login again.</Text>
          </View>
        )}

        {userRole === 'DEVELOPER' && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#2563eb" />
            <Text style={styles.infoText}>As a Developer, you can create Directors for any company. Please select the company first.</Text>
          </View>
        )}

        {/* Company selection - only for DEVELOPER */}
        {userRole === 'DEVELOPER' && (
          <View style={styles.field}>
            <Text style={styles.label}>Select Company *</Text>
            <View style={styles.pickerContainer}>
              {companies.map(company => (
                <TouchableOpacity
                  key={company.id}
                  style={[
                    styles.pickerOption,
                    formData.companyId === company.id && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('companyId', company.id)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.companyId === company.id && styles.pickerOptionTextSelected
                  ]}>
                    {company.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {companies.length === 0 && !loadingCompanies && (
              <Text style={styles.errorText}>No companies available. Please create a company first.</Text>
            )}
            {companies.length > 0 && !loadingCompanies && (
              <Text style={styles.successText}>{companies.length} company(ies) available</Text>
            )}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadCompanies}
              disabled={loadingCompanies}
            >
              <Text style={styles.refreshButtonText}>
                {loadingCompanies ? 'Loading...' : 'Refresh Companies'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
          <Text style={styles.label}>Email Address *</Text>
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
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Enter password"
            secureTextEntry
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Confirm password"
            secureTextEntry
          />
        </View>

        {/* Role selection - for DEVELOPER and DIRECTOR */}
        {(userRole === 'DEVELOPER' || userRole === 'DIRECTOR') && (
          <View style={styles.field}>
            <Text style={styles.label}>Role *</Text>
            <View style={styles.pickerContainer}>
              {availableRoles.map(role => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.pickerOption,
                    formData.role === role.value && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('role', role.value)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.role === role.value && styles.pickerOptionTextSelected
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Admin selection - only for DIRECTOR when creating USER role */}
        {formData.role === 'USER' && userRole === 'DIRECTOR' && (
          <View style={styles.field}>
            <Text style={styles.label}>Select Admin (Optional)</Text>
            <View style={styles.pickerContainer}>
              {admins.map(admin => (
                <TouchableOpacity
                  key={admin.userId}
                  style={[
                    styles.pickerOption,
                    formData.adminId === admin.userId && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('adminId', admin.userId)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.adminId === admin.userId && styles.pickerOptionTextSelected
                  ]}>
                    {admin.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {admins.length === 0 && !loadingAdmins && (
              <Text style={styles.errorText}>No admins available. Please create an admin first.</Text>
            )}
            {admins.length > 0 && !loadingAdmins && (
              <Text style={styles.successText}>{admins.length} admin(s) available for assignment</Text>
            )}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadAdmins}
              disabled={loadingAdmins}
            >
              <Text style={styles.refreshButtonText}>
                {loadingAdmins ? 'Loading...' : 'Refresh Admins'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info for ADMIN role */}
        {userRole === 'ADMIN' && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#2563eb" />
            <Text style={styles.infoText}>As an Admin, you can only create Users. The user will be automatically assigned to you.</Text>
          </View>
        )}

        {/* Info for DEVELOPER role */}
        {userRole === 'DEVELOPER' && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#16a34a" />
            <Text style={styles.infoText}>As a Developer, you can create Directors for any company. Directors will manage their company operations and can create admins and users.</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="arrow-back" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid() || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
          >
            <Ionicons name="person-add" size={18} color="white" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add User'}
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
    backgroundColor: '#2563eb',
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
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pickerOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  refreshButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  refreshButtonText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '500',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
  },
  infoText: {
    color: '#1e40af',
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    color: '#16a34a',
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: '#2563eb',
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

export default AddUserForm;
