import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { exportLeadsFromBackend, exportPropertiesFromBackend } from '../../core/utils/backendExcelExport';

const BackendExportTest: React.FC = () => {
  const handleTestLeadsExport = async () => {
    Alert.alert('Test Export', 'Testing backend leads export...', [], { cancelable: false });
    try {
      const result = await exportLeadsFromBackend({
        companyId: 1, // Replace with actual company ID
        userRole: 'USER',
        userId: 1, // Replace with actual user ID
      });
      
      if (result.success) {
        Alert.alert('Test Success', result.message);
      } else {
        Alert.alert('Test Failed', result.message);
      }
    } catch (error: any) {
      console.error('Backend Leads Export Test Error:', error);
      Alert.alert('Test Failed', `An unexpected error occurred: ${error.message}`);
    }
  };

  const handleTestPropertiesExport = async () => {
    Alert.alert('Test Export', 'Testing backend properties export...', [], { cancelable: false });
    try {
      const result = await exportPropertiesFromBackend({
        companyId: 1, // Replace with actual company ID
        userRole: 'USER',
        userId: 1, // Replace with actual user ID
      });
      
      if (result.success) {
        Alert.alert('Test Success', result.message);
      } else {
        Alert.alert('Test Failed', result.message);
      }
    } catch (error: any) {
      console.error('Backend Properties Export Test Error:', error);
      Alert.alert('Test Failed', `An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Backend Export Tests</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={handleTestLeadsExport}>
          <Text style={styles.buttonText}>📊 Test Leads Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTestPropertiesExport}>
          <Text style={styles.buttonText}>🏠 Test Properties Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1bee7',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#7b1fa2',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#9c27b0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default BackendExportTest;
