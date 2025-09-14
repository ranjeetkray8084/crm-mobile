/**
 * Export Test Button Component
 * A simple button to test Excel export functionality
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { testSimpleExport } from '../../core/utils/simpleExcelExport';

interface ExportTestButtonProps {
  title?: string;
  style?: any;
}

const ExportTestButton: React.FC<ExportTestButtonProps> = ({ 
  title = 'Test Export', 
  style 
}) => {
  const handleTestExport = async () => {
    try {
      console.log('🧪 Testing export functionality...');
      Alert.alert('Test Export', 'Testing export with sample data...', [], { cancelable: false });
      
      const testResult = await testSimpleExport();
      
      if (testResult.success) {
        Alert.alert('Test Success', 'Export functionality is working! Check Downloads folder for test file.');
      } else {
        Alert.alert('Test Failed', `Export test failed: ${testResult.message}`);
      }
    } catch (error: any) {
      console.error('Test export error:', error);
      Alert.alert('Test Failed', `Test export failed: ${error.message}`);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleTestExport}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExportTestButton;
