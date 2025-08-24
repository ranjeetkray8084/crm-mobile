import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../core/hooks/useTasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

interface AddTaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface TaskData {
  title: string;
  file: any;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  const { uploadExcelFile } = useTasks(companyId, userId, userRole);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('crm_user');
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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedFile = result.assets[0];
        
        // Validate file type
        if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
          setError('❌ Please select an Excel file (.xlsx or .xls)');
          return;
        }

        // Validate file size (max 10MB)
        if (selectedFile.size && selectedFile.size > 10 * 1024 * 1024) {
          setError('❌ File size must be less than 10MB');
          return;
        }

        setFile(selectedFile);
        setError('');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setError('❌ Failed to pick file');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('❌ Task title is required');
      return;
    }

    if (!file) {
      setError('❌ Please select an Excel file');
      return;
    }

    if (!companyId) {
      setError('❌ Company ID is required. Please log in again.');
      return;
    }

    if (!userId) {
      setError('❌ User ID is required. Please log in again.');
      return;
    }

    const taskData = {
      title: title.trim(),
      file
    };

    setUploadLoading(true);
    try {
      const result = await uploadExcelFile(taskData);
      
      if (result?.success) {
        setTitle('');
        setFile(null);
        setError('');
        Alert.alert('Success', 'Task uploaded successfully!');
        onSuccess();
      } else {
        const errorMsg = result?.error || '❌ Upload failed';
        setError(errorMsg);
      }
    } catch (error: any) {
      console.error('TaskUploadForm: Upload exception:', error);
      setError('❌ Upload error: ' + error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  if (!companyId) {
    return (
      <View style={styles.container}>
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color="#dc2626" />
          <Text style={styles.warningText}>Company information is missing. Please log in again.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.headerText}>Add New Task</Text>
      </View>

      <View style={styles.form}>
        {/* Title Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
          />
        </View>

        {/* File Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Excel File *</Text>
          {!file ? (
            <TouchableOpacity style={styles.filePickerButton} onPress={pickDocument}>
              <Ionicons name="document" size={20} color="#2563eb" />
              <Text style={styles.filePickerButtonText}>Select Excel File</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileInfo}>
              <View style={styles.fileDetails}>
                <Ionicons name="document" size={20} color="#16a34a" />
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileSize}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </View>
              <TouchableOpacity style={styles.removeFileButton} onPress={removeFile}>
                <Ionicons name="close-circle" size={24} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Error Display */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* File Requirements */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#2563eb" />
          <Text style={styles.infoText}>
            Supported formats: .xlsx, .xls{'\n'}
            Maximum file size: 10MB{'\n'}
            File should contain task data in Excel format
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="close" size={18} color="white" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, uploadLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={uploadLoading}
          >
            {uploadLoading ? (
              <>
                <Ionicons name="hourglass" size={18} color="white" />
                <Text style={styles.submitButtonText}>Uploading...</Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={18} color="white" />
                <Text style={styles.submitButtonText}>Upload Task</Text>
              </>
            )}
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
    backgroundColor: '#7c3aed',
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
  filePickerButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    gap: 8,
  },
  filePickerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeFileButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
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
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
    margin: 16,
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
    flex: 1,
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
    backgroundColor: '#7c3aed',
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

export default AddTaskForm;
