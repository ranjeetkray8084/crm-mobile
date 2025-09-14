/**
 * Simple Export Test Component
 * Add this anywhere to test export functionality
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { basicExportToExcel, testBasicExport } from '../../core/utils/basicExcelExport';

const SimpleExportTest = () => {
  const handleTest = async () => {
    try {
      console.log('🧪 Starting export test...');
      Alert.alert('Test Export', 'Testing with sample data...', [], { cancelable: false });
      
      // Test with hardcoded data
      const testData = [
        {
          id: 1,
          name: 'John Doe',
          phone: '9876543210',
          email: 'john@example.com',
          status: 'NEW',
          budget: 5000000,
          location: 'Mumbai'
        },
        {
          id: 2,
          name: 'Jane Smith', 
          phone: '9876543211',
          email: 'jane@example.com',
          status: 'CONTACTED',
          budget: 3000000,
          location: 'Delhi'
        }
      ];

      console.log('📊 Test data:', testData);
      
      const result = await basicExportToExcel(testData, 'test_export');
      
      if (result.success) {
        Alert.alert(
          '✅ SUCCESS!', 
          `Export worked!\n\n📁 File: ${result.filename}\n📊 Records: 2\n📋 Columns: ${result.columns?.length}\n\nCheck Downloads folder!`
        );
      } else {
        Alert.alert('❌ FAILED', `Export failed: ${result.message}`);
      }
    } catch (error: any) {
      console.error('❌ Test error:', error);
      Alert.alert('❌ ERROR', `Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>🧪 Test Excel Export</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleExportTest;
