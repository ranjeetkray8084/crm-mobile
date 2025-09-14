/**
 * Debug Export Button - Shows exactly what data is being exported
 */

import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  View,
  Modal 
} from 'react-native';
import { basicExportToExcel, testBasicExport, debugExport } from '../../core/utils/basicExcelExport';

interface DebugExportButtonProps {
  data?: any[];
  title?: string;
  style?: any;
}

const DebugExportButton: React.FC<DebugExportButtonProps> = ({ 
  data,
  title = 'Debug Export', 
  style 
}) => {
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const analyzeData = (dataToAnalyze: any) => {
    let info = '📊 DATA ANALYSIS:\n\n';
    
    if (!dataToAnalyze) {
      info += '❌ No data provided\n';
      return info;
    }
    
    info += `📊 Data type: ${typeof dataToAnalyze}\n`;
    info += `📊 Is array: ${Array.isArray(dataToAnalyze)}\n`;
    info += `📊 Length: ${dataToAnalyze.length || 'N/A'}\n\n`;
    
    if (Array.isArray(dataToAnalyze) && dataToAnalyze.length > 0) {
      const sampleItem = dataToAnalyze[0];
      info += `📋 Sample item:\n`;
      info += JSON.stringify(sampleItem, null, 2);
      info += `\n\n🔑 Available keys:\n`;
      info += Object.keys(sampleItem).join(', ');
      info += `\n\n📊 Total items: ${dataToAnalyze.length}`;
    }
    
    return info;
  };

  const handleTestExport = async () => {
    try {
      console.log('🧪 Testing basic export...');
      Alert.alert('Test Export', 'Testing with sample data...', [], { cancelable: false });
      
      const result = await testBasicExport();
      
      if (result.success) {
        Alert.alert(
          'Test Success!', 
          `Export is working!\n\n📁 File: ${result.filename}\n📊 Records: 3\n📋 Columns: ${result.columns?.length || 'Unknown'}\n\nCheck Downloads folder for test file.`
        );
      } else {
        Alert.alert('Test Failed', `Test failed: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Test error:', error);
      Alert.alert('Test Failed', `Error: ${error.message}`);
    }
  };

  const handleDebugExport = async () => {
    if (!data) {
      Alert.alert('No Data', 'No data provided for debug export');
      return;
    }

    try {
      console.log('🔍 Debug export started...');
      const result = await debugExport(data, 'debug_export');
      
      if (result.success) {
        Alert.alert(
          'Debug Export Complete!', 
          `File exported successfully!\n\n📁 File: ${result.filename}\n📊 Records: ${data.length}\n📋 Columns: ${result.columns?.length || 'Unknown'}\n\nCheck Downloads folder.`
        );
      } else {
        Alert.alert('Debug Export Failed', `Failed: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Debug export error:', error);
      Alert.alert('Debug Export Failed', `Error: ${error.message}`);
    }
  };

  const handleShowDebugInfo = () => {
    if (!data) {
      Alert.alert('No Data', 'No data provided for analysis');
      return;
    }
    
    const info = analyzeData(data);
    setDebugInfo(info);
    setShowDebugModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, styles.testButton, style]} onPress={handleTestExport}>
          <Text style={styles.buttonText}>🧪 Test Export</Text>
        </TouchableOpacity>
        
        {data && (
          <>
            <TouchableOpacity style={[styles.button, styles.debugButton, style]} onPress={handleDebugExport}>
              <Text style={styles.buttonText}>🔍 Debug Export</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.analyzeButton, style]} onPress={handleShowDebugInfo}>
              <Text style={styles.buttonText}>📊 Analyze Data</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal
        visible={showDebugModal}
        animationType="slide"
        onRequestClose={() => setShowDebugModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Data Analysis</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowDebugModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.debugText}>{debugInfo}</Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  testButton: {
    backgroundColor: '#28a745',
  },
  debugButton: {
    backgroundColor: '#007AFF',
  },
  analyzeButton: {
    backgroundColor: '#6f42c1',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  debugText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

export default DebugExportButton;
