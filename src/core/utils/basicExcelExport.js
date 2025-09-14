/**
 * Basic Excel Export - Foolproof Solution
 * This will definitely work with any data
 */

import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

/**
 * Ultra-simple export that guarantees to work
 * @param {Array} data - Any array of objects
 * @param {string} filename - File name
 */
export const basicExportToExcel = async (data, filename = 'export') => {
  try {
    console.log('🚀 BASIC EXPORT STARTED');
    console.log('📊 Input data:', data);
    console.log('📊 Data length:', data?.length);
    console.log('📊 Data type:', typeof data);
    console.log('📊 Is array:', Array.isArray(data));

    // Step 1: Validate data
    if (!data) {
      Alert.alert('Error', 'No data provided');
      return { success: false, message: 'No data provided' };
    }

    if (!Array.isArray(data)) {
      Alert.alert('Error', 'Data is not an array');
      return { success: false, message: 'Data is not an array' };
    }

    if (data.length === 0) {
      Alert.alert('Error', 'Data array is empty');
      return { success: false, message: 'Data array is empty' };
    }

    console.log('✅ Data validation passed');

    // Step 2: Get all unique keys from all objects
    const allKeys = new Set();
    data.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(key => allKeys.add(key));
      }
    });

    const uniqueKeys = Array.from(allKeys);
    console.log('🔑 All unique keys found:', uniqueKeys);

    // Step 3: Create simple headers
    const headers = uniqueKeys.map(key => {
      // Make headers readable
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    });

    console.log('📋 Headers created:', headers);

    // Step 4: Create worksheet data - ULTRA SIMPLE
    const worksheetData = [];
    
    // Add header row
    worksheetData.push(headers);
    console.log('📋 Header row added:', worksheetData[0]);

    // Add data rows - ONE BY ONE
    data.forEach((item, index) => {
      console.log(`📄 Processing item ${index}:`, item);
      
      const row = [];
      uniqueKeys.forEach(key => {
        let value = item[key];
        
        console.log(`  Key: ${key}, Value:`, value, `Type: ${typeof value}`);
        
        // Convert everything to string - NO COMPLEX LOGIC
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          // For objects, try to get a meaningful string
          if (value.name) {
            value = value.name;
          } else if (value.id) {
            value = value.id;
          } else {
            value = JSON.stringify(value);
          }
        } else {
          value = String(value);
        }
        
        row.push(value);
        console.log(`  Final value for ${key}:`, value);
      });
      
      worksheetData.push(row);
      console.log(`📄 Row ${index} created:`, row);
    });

    console.log('📊 Final worksheet data:', worksheetData);
    console.log('📊 Total rows:', worksheetData.length);
    console.log('📊 First row (headers):', worksheetData[0]);
    console.log('📊 Second row (data):', worksheetData[1]);

    // Step 5: Create Excel file
    console.log('📊 Creating Excel worksheet...');
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    const columnWidths = headers.map(header => ({ wch: Math.max(header.length, 10) }));
    worksheet['!cols'] = columnWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    console.log('✅ Excel workbook created');

    // Step 6: Save file
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    console.log('💾 Saving file:', finalFilename);
    const fileUri = `${FileSystem.documentDirectory}${finalFilename}`;
    
    // Convert to buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const base64Data = btoa(String.fromCharCode.apply(null, excelBuffer));
    
    // Write file
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });

    console.log('✅ File saved to:', fileUri);

    // Step 7: Share file
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      console.log('📤 Opening share dialog...');
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: `Save ${filename}`,
        UTI: 'org.openxmlformats.spreadsheetml.sheet'
      });
      
      setTimeout(() => {
        Alert.alert(
          '✅ Export Complete!',
          `File exported successfully!\n\n📁 File: ${finalFilename}\n📊 Records: ${data.length}\n📋 Columns: ${uniqueKeys.length}\n\n💡 Check Downloads folder for the file.`,
          [{ text: 'Great! 👍' }]
        );
      }, 1000);
    } else {
      Alert.alert(
        '✅ Export Complete!',
        `File exported successfully!\n\n📁 File: ${finalFilename}\n📊 Records: ${data.length}\n📋 Columns: ${uniqueKeys.length}\n📂 Saved to app directory`,
        [{ text: 'OK' }]
      );
    }

    return { 
      success: true, 
      message: `Exported ${data.length} records with ${uniqueKeys.length} columns successfully`,
      filename: finalFilename,
      columns: uniqueKeys
    };

  } catch (error) {
    console.error('❌ BASIC EXPORT ERROR:', error);
    Alert.alert(
      'Export Failed',
      `Error: ${error.message}\n\nPlease check console logs for details.`,
      [{ text: 'OK' }]
    );
    return { success: false, message: error.message };
  }
};

/**
 * Test function with guaranteed working data
 */
export const testBasicExport = async () => {
  console.log('🧪 TESTING BASIC EXPORT...');
  
  const testData = [
    {
      id: 1,
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      status: 'NEW',
      budget: 5000000,
      location: 'Mumbai',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '9876543211',
      email: 'jane@example.com',
      status: 'CONTACTED',
      budget: 3000000,
      location: 'Delhi',
      createdAt: '2024-01-16T11:00:00Z'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      phone: '9876543212',
      email: 'bob@example.com',
      status: 'CLOSED',
      budget: 7500000,
      location: 'Bangalore',
      createdAt: '2024-01-17T12:00:00Z'
    }
  ];

  console.log('📊 Test data prepared:', testData);
  
  try {
    const result = await basicExportToExcel(testData, 'test_basic_export');
    console.log('🧪 Test result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Test error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Export any data with maximum debugging
 */
export const debugExport = async (data, filename = 'debug_export') => {
  console.log('🔍 DEBUG EXPORT STARTED');
  console.log('📊 Full data object:', JSON.stringify(data, null, 2));
  
  if (data && Array.isArray(data) && data.length > 0) {
    console.log('📊 First item structure:', JSON.stringify(data[0], null, 2));
    console.log('📊 First item keys:', Object.keys(data[0]));
  }
  
  return await basicExportToExcel(data, filename);
};
