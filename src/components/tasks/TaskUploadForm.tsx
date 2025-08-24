import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface TaskData {
  title: string;
  file: any;
}

interface TaskUploadFormProps {
  onUpload: (taskData: TaskData) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

const TaskUploadForm: React.FC<TaskUploadFormProps> = ({ onUpload, loading = false }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState('');

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

    const taskData = {
      title: title.trim(),
      file
    };

    try {
      const result = await onUpload(taskData);
      
      if (result?.success) {
        setTitle('');
        setFile(null);
        setError('');
        Alert.alert('Success', 'Task uploaded successfully!');
      } else {
        const errorMsg = result?.error || '❌ Upload failed';
        setError(errorMsg);
      }
    } catch (error: any) {
      console.error('TaskUploadForm: Upload exception:', error);
      setError('❌ Upload error: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* Title Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#9ca3af"
            editable={!loading}
          />
        </View>

        {/* File Selection Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Excel File</Text>
          
          {!file ? (
            <TouchableOpacity
              style={styles.filePicker}
              onPress={pickDocument}
              disabled={loading}
            >
              <Ionicons name="cloud-upload-outline" size={32} color="#6b7280" />
              <Text style={styles.filePickerText}>
                Tap to select Excel file
              </Text>
              <Text style={styles.filePickerSubtext}>
                Supports .xlsx and .xls files (max 10MB)
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileInfo}>
              <View style={styles.fileDetails}>
                <Ionicons name="document-text-outline" size={24} color="#10b981" />
                <View style={styles.fileText}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeFile}
                disabled={loading}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Error Display */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !title.trim() || !file}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="hourglass-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Uploading...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Upload Task</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  filePicker: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  filePickerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  fileText: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskUploadForm;
