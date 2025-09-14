/**
 * Simple Excel Export Utility
 * A simplified approach to Excel export that handles any data structure
 */

import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

/**
 * Simple export function that works with any data structure
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 * @param {string} sheetName - Name of the Excel sheet
 */
export const simpleExportToExcel = async (data, filename = 'export', sheetName = 'Data') => {
  try {
    console.log('🚀 Simple export started with:', {
      dataLength: data?.length,
      filename,
      sheetName
    });

    if (!data || data.length === 0) {
      Alert.alert('Export Failed', 'No data to export');
      return { success: false, message: 'No data to export' };
    }

    // Step 1: Analyze the data structure
    console.log('📊 Analyzing data structure...');
    const sampleItem = data[0];
    const allKeys = Object.keys(sampleItem);
    
    console.log('🔑 Available keys:', allKeys);
    console.log('📋 Sample item:', sampleItem);

    // Step 2: Create headers from actual data keys
    const headers = allKeys.map(key => {
      // Convert camelCase to readable format
      return key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
    });

    console.log('📋 Generated headers:', headers);

    // Step 3: Create worksheet data
    const worksheetData = [];
    
    // Add header row
    worksheetData.push(headers);
    
    // Add data rows
    data.forEach((item, index) => {
      const row = allKeys.map(key => {
        let value = item[key];
        
        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        }
        
        // Handle objects (convert to string)
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Try to extract meaningful data from objects
          if (value.name) return value.name;
          if (value.id) return value.id;
          if (value.title) return value.title;
          return JSON.stringify(value);
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        
        // Handle dates
        if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
          try {
            const date = new Date(value);
            return date.toLocaleDateString('en-IN');
          } catch (e) {
            return String(value);
          }
        }
        
        // Handle numbers (format currency if it looks like price/budget)
        if (typeof value === 'number') {
          if (key.toLowerCase().includes('price') || key.toLowerCase().includes('budget')) {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(value);
          }
          return String(value);
        }
        
        return String(value);
      });
      
      worksheetData.push(row);
      
      // Log first few rows for debugging
      if (index < 3) {
        console.log(`📄 Row ${index + 1}:`, row);
      }
    });

    console.log('📊 Worksheet data prepared:', {
      totalRows: worksheetData.length,
      headers: worksheetData[0],
      firstDataRow: worksheetData[1]
    });

    // Step 4: Create Excel workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    const columnWidths = headers.map(header => ({ 
      wch: Math.max(header.length, 12) 
    }));
    worksheet['!cols'] = columnWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Step 5: Save and share the file
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    console.log('💾 Saving file...');
    const fileUri = `${FileSystem.documentDirectory}${finalFilename}`;
    
    // Convert workbook to buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const base64Data = btoa(String.fromCharCode.apply(null, excelBuffer));
    
    // Write file
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });

    console.log('✅ File saved successfully');

    // Step 6: Share the file
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
          `File exported successfully!\n\n📁 File: ${finalFilename}\n📊 Records: ${data.length}\n\n💡 To save to Downloads:\n1. Tap "Save to Files"\n2. Choose Downloads folder\n3. Tap Save`,
          [{ text: 'Great! 👍' }]
        );
      }, 1000);
      
      return { 
        success: true, 
        message: `Exported ${data.length} records successfully`,
        filename: finalFilename
      };
    } else {
      Alert.alert(
        '✅ Export Complete!',
        `File exported successfully!\n\n📁 File: ${finalFilename}\n📊 Records: ${data.length}\n📂 Location: App Documents`,
        [{ text: 'OK' }]
      );
      
      return { 
        success: true, 
        message: `File saved to app directory: ${finalFilename}`,
        filename: finalFilename
      };
    }

  } catch (error) {
    console.error('❌ Simple export error:', error);
    Alert.alert(
      'Export Failed',
      `Failed to export: ${error.message}\n\nPlease try again.`,
      [{ text: 'OK' }]
    );
    return { success: false, message: error.message };
  }
};

/**
 * Export leads with simple method
 * @param {Array} leads - Array of lead objects
 */
export const exportLeadsSimple = async (leads) => {
  console.log('🚀 Simple leads export started...');
  
  if (!leads || leads.length === 0) {
    Alert.alert('Export Failed', 'No leads to export');
    return { success: false, message: 'No leads to export' };
  }

  // Log the data structure for debugging
  console.log('📊 Leads data structure:', {
    totalLeads: leads.length,
    sampleLead: leads[0],
    allKeys: leads[0] ? Object.keys(leads[0]) : []
  });

  return await simpleExportToExcel(leads, 'leads_export', 'Leads');
};

/**
 * Export properties with simple method
 * @param {Array} properties - Array of property objects
 */
export const exportPropertiesSimple = async (properties) => {
  console.log('🚀 Simple properties export started...');
  
  if (!properties || properties.length === 0) {
    Alert.alert('Export Failed', 'No properties to export');
    return { success: false, message: 'No properties to export' };
  }

  // Log the data structure for debugging
  console.log('📊 Properties data structure:', {
    totalProperties: properties.length,
    sampleProperty: properties[0],
    allKeys: properties[0] ? Object.keys(properties[0]) : []
  });

  return await simpleExportToExcel(properties, 'properties_export', 'Properties');
};

/**
 * Test function to verify simple export works
 */
export const testSimpleExport = async () => {
  console.log('🧪 Testing simple export...');
  
  const testData = [
    {
      id: 1,
      name: 'Test Lead 1',
      phone: '9876543210',
      email: 'test1@example.com',
      status: 'NEW',
      budget: 5000000,
      location: 'Mumbai',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Test Lead 2',
      phone: '9876543211',
      email: 'test2@example.com',
      status: 'CONTACTED',
      budget: 3000000,
      location: 'Delhi',
      createdAt: '2024-01-16T11:00:00Z'
    }
  ];

  try {
    const result = await simpleExportToExcel(testData, 'test_export', 'Test Data');
    console.log('🧪 Test export result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Test export error:', error);
    return { success: false, message: error.message };
  }
};
