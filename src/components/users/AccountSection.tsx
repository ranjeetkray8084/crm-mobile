import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../shared/contexts/AuthContext';
import { UserService } from '../../core/services';
import { customAlert } from '../../core/utils/alertUtils';

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  data: any;
  error?: string;
}

interface UserApiResponse {
  success: boolean;
  data: any;
  error?: string;
}

const AccountSection: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const loadAccountInfo = async () => {
    if (!user?.userId) {
      customAlert('User not found.');
      return;
    }

    try {
      const result = await UserService.getUserById(user.userId) as UserApiResponse;
      if (result.success) {
        const userData = result.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || '',
        });
        await fetchAvatar(user.userId);
      } else {
        const errorMessage = result.error || 'Failed to load user';
        customAlert('❌ Error loading user info: ' + errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Connection error';
      customAlert('❌ Error loading user info: ' + errorMessage);
    }
  };

  const fetchAvatar = async (userId: string) => {
    try {
      console.log('🔧 Fetching avatar for user:', userId);
      
      const result = await UserService.getAvatar(Number(userId)) as ApiResponse;
      console.log('🔧 Avatar API result:', result);
      
      if (result.success && result.data) {
        console.log('🔧 Found avatar from API:', result.data);
        setAvatarUrl(result.data);
      } else {
        console.log('🔧 No avatar found from API, using default');
        setAvatarUrl('');
      }
    } catch (error) {
      console.error('🔧 Error fetching avatar:', error);
      setAvatarUrl('');
    }
  };

  useEffect(() => {
    if (user) {
      console.log('🔧 User data received:', user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
      });
      
      // Load profile picture immediately when user is available
      if (user.userId) {
        console.log('🔧 Loading avatar for userId:', user.userId);
        fetchAvatar(user.userId);
      } else {
        console.log('🔧 No userId found in user object');
      }
    }
    loadAccountInfo();
  }, [user]);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      customAlert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      if (!user?.userId) {
        customAlert('User not found.');
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };

      const result = await UserService.updateProfile(user.userId, updateData) as ApiResponse;

      if (result.success) {
        customAlert('✅ Account updated successfully!');
        setIsEditing(false);

        // Get the updated user data from backend response
        const updatedUserData = result.data.user || result.data;

        // Update form data with the new values
        setFormData({
          name: updatedUserData.name || updateData.name,
          email: updatedUserData.email || updateData.email,
          phone: updatedUserData.phone || updateData.phone,
          role: updatedUserData.role || updateData.role,
        });

        // If token was updated (email changed), show additional message
        if (result.data.tokenUpdated) {
          customAlert('✅ Account and authentication updated successfully!');
        }

        // Try to reload account info, but don't fail if it doesn't work
        try {
          await loadAccountInfo();
        } catch (reloadError) {
          // Silent fail
        }
      } else {
        const errorMessage = result.error || 'Failed to update user';
        customAlert('❌ Error updating account: ' + errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'An error occurred while saving.';
      customAlert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!user?.userId) {
      customAlert('Please log in to upload your avatar.');
      return;
    }

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        customAlert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // Show preview immediately
        setAvatarUrl(asset.uri);

        try {
          // Show preview immediately
          setAvatarUrl(asset.uri);

          try {
            // For React Native, we'll use the asset URI directly
            // The backend should handle the file upload from the URI
            const uploadResult = await UserService.uploadAvatar(user.userId, asset.uri, 'avatar.jpg') as ApiResponse;
            
            if (uploadResult.success) {
              customAlert('✅ Avatar uploaded successfully!');
              await fetchAvatar(user.userId);
              
              // Update user data in AsyncStorage
              const userResult = await UserService.getUserById(user.userId) as UserApiResponse;
              if (userResult.success) {
                await AsyncStorage.setItem('user', JSON.stringify(userResult.data));
              }
            } else {
              customAlert('❌ Error uploading avatar: ' + uploadResult.error);
              setAvatarUrl('');
            }
          } catch (error: any) {
            customAlert('❌ Error uploading avatar: ' + error.message);
            setAvatarUrl('');
          }
        } catch (error: any) {
          customAlert('❌ Error uploading avatar: ' + error.message);
          setAvatarUrl('');
        }
      }
    } catch (error: any) {
      customAlert('❌ Error selecting image: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="person" size={24} color="white" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Account Settings</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Profile Picture */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image
                  source={{ 
                    uri: avatarUrl,
                    headers: {
                      'Authorization': `Bearer ${user?.token || ''}`
                    }
                  }}
                  style={styles.avatar}
                  contentFit="cover"
                  onError={(error) => {
                    console.log('🔧 Image loading error:', error);
                    // Try without auth headers if it fails
                    setAvatarUrl(avatarUrl.split('?')[0]); // Remove any query parameters
                  }}
                  onLoad={() => {
                    console.log('🔧 Image loaded successfully:', avatarUrl);
                  }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color="#9CA3AF" />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleAvatarUpload}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{formData.name || 'User Name'}</Text>
            <Text style={styles.userRole}>{formData.role || 'User'}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputReadOnly,
                ]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={isEditing}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputReadOnly,
                ]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                editable={isEditing}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputReadOnly,
                ]}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                editable={isEditing}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            {!isEditing && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Role</Text>
                <TextInput
                  style={[styles.input, styles.inputReadOnly]}
                  value={formData.role}
                  editable={false}
                />
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonSection}>
              {!isEditing ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create" size={18} color="white" style={styles.buttonIcon} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={18} color="white" style={styles.buttonIcon} />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark" size={18} color="white" style={styles.buttonIcon} />
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Loading Spinner Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'white',
  },
  inputReadOnly: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    color: '#6B7280',
  },
  buttonSection: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export default AccountSection;
