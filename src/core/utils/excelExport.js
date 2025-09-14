/**
 * Common Excel Export Utility for React Native
 * Provides functionality to export table data to XLSX format
 */

import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { requestFilePermissions, getDownloadPath, showDownloadSuccess, showDownloadError } from './filePermissions';

/**
 * Format value for export
 * @param {*} value - Value to format
 * @param {string} key - Column key for special formatting
 * @returns {string} Formatted value
 */
const formatValue = (value, key) => {
  if (value === null || value === undefined) {
    return '';
  }

  // Format dates
  if (key === 'createdAt' && value) {
    try {
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return String(value);
    }
  }

  // Format currency values
  if ((key === 'budget' || key === 'price') && value) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value);
    } catch (e) {
      return String(value);
    }
  }

  // Format status values
  if (key === 'status' && value) {
    const statusMap = {
      'NEW': 'New',
      'CONTACTED': 'Contacted',
      'CLOSED': 'Closed',
      'DROPED': 'Dropped',
      'AVAILABLE_FOR_SALE': 'For Sale',
      'AVAILABLE_FOR_RENT': 'For Rent',
      'SOLD_OUT': 'Sold Out',
      'RENT_OUT': 'Rented Out'
    };
    return statusMap[value] || value;
  }

  return String(value);
};

/**
 * Convert data to Excel format with enhanced debugging
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with key and header
 * @returns {Object} Excel workbook object
 */
const convertToExcel = (data, columns) => {
  console.log('📊 convertToExcel called with:', {
    dataLength: data?.length,
    columnsLength: columns?.length,
    sampleData: data?.[0],
    columnKeys: columns?.map(c => c.key)
  });
  
  if (!data || data.length === 0) {
    console.log('❌ No data provided to convertToExcel');
    return null;
  }
  
  if (!columns || columns.length === 0) {
    console.log('❌ No columns provided to convertToExcel');
    return null;
  }
  
  // Create worksheet data
  const worksheetData = [];
  
  // Add header row
  const headers = columns.map(col => col.header);
  worksheetData.push(headers);
  console.log('📋 Headers created:', headers);
  
  // Add data rows
  data.forEach((item, index) => {
    const row = columns.map(col => {
      let value = item[col.key];
      
      // Handle nested properties (e.g., 'user.name')
      if (col.key.includes('.')) {
        const keys = col.key.split('.');
        value = keys.reduce((obj, key) => {
          if (obj && typeof obj === 'object') {
            return obj[key];
          }
          return null;
        }, item);
      }
      
      // Debug missing values
      if (value === undefined || value === null) {
        console.log(`⚠️ Missing value for key '${col.key}' in item ${index}:`, item);
      }
      
      // Format the value
      const formattedValue = formatValue(value, col.key);
      return formattedValue;
    });
    
    worksheetData.push(row);
    
    // Debug first few rows
    if (index < 3) {
      console.log(`📄 Row ${index + 1}:`, row);
    }
  });
  
  console.log('📊 Worksheet data created:', {
    totalRows: worksheetData.length,
    headers: worksheetData[0],
    firstDataRow: worksheetData[1],
    sampleDataRows: worksheetData.slice(0, 3)
  });
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = columns.map(col => ({ wch: Math.max(col.header.length, 15) }));
  worksheet['!cols'] = columnWidths;
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  console.log('✅ Excel workbook created successfully');
  return workbook;
};

/**
 * Save Excel file and share it with improved download handling
 * @param {Object} workbook - Excel workbook object
 * @param {string} filename - Name of the file to save
 */
const saveAndShareExcel = async (workbook, filename) => {
  try {
    console.log('🚀 Starting save and share process...');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    // Create file path in app's documents directory
    const fileUri = `${FileSystem.documentDirectory}${finalFilename}`;
    
    // Convert workbook to buffer
    console.log('📊 Converting workbook to Excel format...');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Convert buffer to base64
    const base64Data = btoa(String.fromCharCode.apply(null, excelBuffer));
    
    // Write Excel file
    console.log('💾 Writing Excel file...');
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    console.log('✅ File saved successfully to:', fileUri);
    
    // Try to save to Downloads folder first (Android)
    if (Platform.OS === 'android') {
      try {
        const { requestFilePermissions } = await import('./filePermissions');
        const hasPermission = await requestFilePermissions();
        
        if (hasPermission) {
          console.log('📱 Attempting to save to Downloads folder...');
          
          // Try to copy to Downloads folder using MediaLibrary
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('Downloads', asset, false);
          
          console.log('✅ File saved to Downloads folder via MediaLibrary');
          
          // Show success message
          Alert.alert(
            '🎉 Download Complete!',
            `File saved successfully to Downloads folder!\n\n📁 File: ${finalFilename}\n📂 Location: Downloads folder\n\n✅ You can find it in:\n• File Manager > Downloads\n• Gallery app\n• Downloads folder`,
            [{ text: 'Great! 👍' }]
          );
          
          return { 
            success: true, 
            message: `File downloaded to Downloads folder: ${finalFilename}`,
            filePath: fileUri
          };
        }
      } catch (downloadError) {
        console.log('⚠️ Could not save to Downloads folder, falling back to share dialog:', downloadError.message);
      }
    }
    
    // Fallback to sharing dialog
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      console.log('📤 Opening share dialog...');
      // Share the file with download option
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: `Save ${filename} to Downloads`,
        UTI: 'org.openxmlformats.spreadsheetml.sheet'
      });
      
      // Show detailed instructions
      setTimeout(() => {
        Alert.alert(
          '💡 Save to Downloads',
          'To save to Downloads folder:\n\n1. Tap "Save to Files" or "Save to Downloads"\n2. Choose Downloads folder\n3. Tap Save\n\n✅ File will be available in Downloads folder',
          [{ text: 'Got it! 👍' }]
        );
      }, 1000);
      
      return { success: true, message: `File ready for download: ${finalFilename}` };
    } else {
      // If sharing is not available, just save the file
      console.log(`File saved to: ${fileUri}`);
      Alert.alert(
        '✅ Export Complete',
        `File exported successfully!\n\n📁 File: ${finalFilename}\n📂 Location: App Documents\n\nNote: Sharing not available. File saved to app directory.`,
        [{ text: 'OK' }]
      );
      return { success: true, message: `File saved to device: ${finalFilename}` };
    }
    
  } catch (error) {
    console.error('Error saving/sharing Excel:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};

/**
 * Save Excel file directly to Downloads folder with improved handling
 * @param {Object} workbook - Excel workbook object
 * @param {string} filename - Name of the file to save
 */
const saveToDownloads = async (workbook, filename) => {
  try {
    console.log('🚀 Starting enhanced export process...');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    // Step 1: Convert and save file first
    console.log('📊 Converting workbook to Excel format...');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const base64Data = btoa(String.fromCharCode.apply(null, excelBuffer));
    
    // Step 2: Save to app's documents directory first
    console.log('💾 Saving file temporarily...');
    const tempPath = `${FileSystem.documentDirectory}${finalFilename}`;
    await FileSystem.writeAsStringAsync(tempPath, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    console.log('✅ File created successfully! Starting download process...');
    
    // Step 3: Try multiple download methods
    if (Platform.OS === 'android') {
      try {
        // Method 1: Try MediaLibrary for direct Downloads folder access
        console.log('📱 Trying MediaLibrary method...');
        const { requestFilePermissions } = await import('./filePermissions');
        const hasPermission = await requestFilePermissions();
        
        if (hasPermission) {
          try {
            // Create asset and save to Downloads album
            const asset = await MediaLibrary.createAssetAsync(tempPath);
            const album = await MediaLibrary.getAlbumAsync('Downloads');
            
            if (album) {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              console.log('✅ File saved to Downloads folder via MediaLibrary');
              
              Alert.alert(
                '🎉 Download Complete!',
                `File saved successfully to Downloads folder!\n\n📁 File: ${finalFilename}\n📂 Location: Downloads folder\n\n✅ You can find it in:\n• File Manager > Downloads\n• Gallery app\n• Downloads folder`,
                [{ text: 'Great! 👍' }]
              );
              
              return { 
                success: true, 
                message: `File downloaded to Downloads folder: ${finalFilename}`,
                filePath: tempPath,
                method: 'MediaLibrary'
              };
            } else {
              // Create Downloads album if it doesn't exist
              await MediaLibrary.createAlbumAsync('Downloads', asset, false);
              console.log('✅ File saved to new Downloads album');
              
              Alert.alert(
                '🎉 Download Complete!',
                `File saved successfully to Downloads folder!\n\n📁 File: ${finalFilename}\n📂 Location: Downloads folder\n\n✅ You can find it in:\n• File Manager > Downloads\n• Gallery app`,
                [{ text: 'Great! 👍' }]
              );
              
              return { 
                success: true, 
                message: `File downloaded to Downloads folder: ${finalFilename}`,
                filePath: tempPath,
                method: 'MediaLibrary (new album)'
              };
            }
          } catch (mediaError) {
            console.log('⚠️ MediaLibrary method failed, trying share dialog:', mediaError.message);
          }
        }
      } catch (permissionError) {
        console.log('⚠️ Permission issue, falling back to share dialog:', permissionError.message);
      }
    }
    
    // Method 2: Use Sharing API as fallback
    console.log('📤 Using share dialog for download...');
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      console.log('📤 Opening share dialog...');
      await Sharing.shareAsync(tempPath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: `Save ${filename} to Downloads`,
        UTI: 'org.openxmlformats.spreadsheetml.sheet'
      });
      
      // Show detailed instructions for manual save
      setTimeout(() => {
        Alert.alert(
          '💡 Save to Downloads',
          'To save to Downloads folder:\n\n1. Tap "Save to Files" or "Save to Downloads"\n2. Choose Downloads folder\n3. Tap Save\n\n✅ File will be available in Downloads folder',
          [{ text: 'Got it! 👍' }]
        );
      }, 1000);
      
      return { 
        success: true, 
        message: `Export completed! Use share dialog to save to Downloads: ${finalFilename}`,
        filePath: tempPath,
        method: 'Share Dialog'
      };
    } else {
      console.log('❌ Sharing not available, file saved to app directory');
      Alert.alert(
        '✅ Export Complete',
        `File exported successfully!\n\n📁 File: ${finalFilename}\n📂 Location: App Documents\n\nNote: Sharing not available. File saved to app directory.`,
        [{ text: 'OK' }]
      );
      return { 
        success: true, 
        message: `File exported successfully: ${finalFilename}\n\nSaved to app directory: ${tempPath}`,
        filePath: tempPath,
        method: 'App Directory'
      };
    }
    
  } catch (error) {
    console.error('Error saving to Downloads:', error);
    Alert.alert(
      'Export Failed',
      `Failed to export file: ${error.message}\n\nPlease try again or check your device storage.`,
      [{ text: 'OK' }]
    );
    return { success: false, message: `Download failed: ${error.message}` };
  }
};

/**
 * Export table data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions
 * @param {string} filename - Name of the exported file
 */
export const exportToExcel = async (data, columns, filename) => {
  try {
    // Validate inputs
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('Columns must be a non-empty array');
    }
    
    if (!filename || typeof filename !== 'string') {
      throw new Error('Filename must be a non-empty string');
    }
    
    const workbook = convertToExcel(data, columns);
    if (!workbook) {
      throw new Error('Failed to create Excel workbook');
    }
    
    const result = await saveAndShareExcel(workbook, filename);
    
    if (result.success) {
      return { success: true, message: `Exported ${data.length} records to ${filename}.xlsx` };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};

/**
 * Export table data to Excel format with direct download
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions
 * @param {string} filename - Name of the exported file
 */
export const exportToExcelWithDownload = async (data, columns, filename) => {
  try {
    // Validate inputs
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('Columns must be a non-empty array');
    }
    
    if (!filename || typeof filename !== 'string') {
      throw new Error('Filename must be a non-empty string');
    }
    
    const workbook = convertToExcel(data, columns);
    if (!workbook) {
      throw new Error('Failed to create Excel workbook');
    }
    
    const result = await saveToDownloads(workbook, filename);
    
    if (result.success) {
      return { success: true, message: `Downloaded ${data.length} records to ${filename}.xlsx` };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: `Download failed: ${error.message}` };
  }
};

/**
 * Predefined column configurations for common tables
 */
export const COLUMN_CONFIGS = {
  leads: [
    { key: 'name', header: 'Lead Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'status', header: 'Status' },
    { key: 'budget', header: 'Budget' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'location', header: 'Location' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'assignedToSummary.name', header: 'Assigned To' }
  ],
  
  properties: [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'status', header: 'Status' },
    { key: 'type', header: 'Type' },
    { key: 'price', header: 'Price' },
    { key: 'location', header: 'Location' },
    { key: 'sector', header: 'Sector' },
    { key: 'bhk', header: 'BHK' },
    { key: 'unitDetails', header: 'Unit Details' },
    { key: 'floor', header: 'Floor' },
    { key: 'ownerContact', header: 'Owner Contact' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' }
  ]
};

/**
 * Role-based column configurations for properties
 * Different roles see different levels of detail
 */
export const ROLE_BASED_PROPERTY_COLUMNS = {
  DIRECTOR: [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'status', header: 'Status' },
    { key: 'type', header: 'Type' },
    { key: 'price', header: 'Price' },
    { key: 'location', header: 'Location' },
    { key: 'sector', header: 'Sector' },
    { key: 'bhk', header: 'BHK' },
    { key: 'unitDetails', header: 'Unit Details' },
    { key: 'floor', header: 'Floor' },
    { key: 'ownerName', header: 'Owner Name' },
    { key: 'ownerContact', header: 'Owner Contact' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'createdBy.name', header: 'Created By' },
    { key: 'size', header: 'Size' },
    { key: 'address', header: 'Address' }
  ],
  
  ADMIN: [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'status', header: 'Status' },
    { key: 'type', header: 'Type' },
    { key: 'price', header: 'Price' },
    { key: 'location', header: 'Location' },
    { key: 'sector', header: 'Sector' },
    { key: 'bhk', header: 'BHK' },
    { key: 'unitDetails', header: 'Unit Details' },
    { key: 'floor', header: 'Floor' },
    { key: 'ownerContact', header: 'Owner Contact' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'createdBy.name', header: 'Created By' },
    { key: 'size', header: 'Size' }
  ],
  
  USER: [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'status', header: 'Status' },
    { key: 'type', header: 'Type' },
    { key: 'price', header: 'Price' },
    { key: 'location', header: 'Location' },
    { key: 'sector', header: 'Sector' },
    { key: 'bhk', header: 'BHK' },
    { key: 'unitDetails', header: 'Unit Details' },
    { key: 'floor', header: 'Floor' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'size', header: 'Size' }
  ]
};

/**
 * Role-based column configurations for leads
 * Different roles see different levels of detail
 */
export const ROLE_BASED_LEAD_COLUMNS = {
  DIRECTOR: [
    { key: 'name', header: 'Lead Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'budget', header: 'Budget' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'location', header: 'Location' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'assignedToSummary.name', header: 'Assigned To' },
    { key: 'createdBy.name', header: 'Created By' },
    { key: 'notes', header: 'Notes' },
    { key: 'followUpDate', header: 'Follow Up Date' },
    { key: 'priority', header: 'Priority' }
  ],
  
  ADMIN: [
    { key: 'name', header: 'Lead Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'budget', header: 'Budget' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'location', header: 'Location' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'assignedToSummary.name', header: 'Assigned To' },
    { key: 'createdBy.name', header: 'Created By' },
    { key: 'notes', header: 'Notes' },
    { key: 'followUpDate', header: 'Follow Up Date' }
  ],
  
  USER: [
    { key: 'name', header: 'Lead Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'budget', header: 'Budget' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'location', header: 'Location' },
    { key: 'source', header: 'Source' },
    { key: 'createdAt', header: 'Created Date' },
    { key: 'assignedToSummary.name', header: 'Assigned To' },
    { key: 'notes', header: 'Notes' },
    { key: 'followUpDate', header: 'Follow Up Date' }
  ]
};

/**
 * Helper function to export leads data
 * @param {Array} leads - Array of lead objects
 */
export const exportLeads = async (leads) => {
  return await exportToExcel(leads, COLUMN_CONFIGS.leads, 'leads_export');
};

/**
 * Helper function to export leads data with direct download
 * @param {Array} leads - Array of lead objects
 */
export const exportLeadsWithDownload = async (leads) => {
  return await exportToExcelWithDownload(leads, COLUMN_CONFIGS.leads, 'leads_export');
};

/**
 * Helper function to export leads data with role-based columns
 * @param {Array} leads - Array of lead objects
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {string} filename - Optional custom filename
 */
export const exportLeadsWithRole = async (leads, userRole = 'USER', filename = 'leads_export') => {
  const roleColumns = ROLE_BASED_LEAD_COLUMNS[userRole] || ROLE_BASED_LEAD_COLUMNS.USER;
  const roleFilename = `${filename}_${userRole.toLowerCase()}`;
  return await exportToExcel(leads, roleColumns, roleFilename);
};

/**
 * Debug function to analyze data structure
 * @param {Array} data - Array of objects to analyze
 * @param {string} dataType - Type of data for logging
 */
export const debugDataStructure = (data, dataType = 'data') => {
  console.log(`🔍 Debugging ${dataType} structure:`);
  
  if (!data || data.length === 0) {
    console.log('❌ No data provided');
    return;
  }
  
  console.log(`📊 Total items: ${data.length}`);
  console.log('📋 Sample item structure:', data[0]);
  console.log('🔑 Available keys:', Object.keys(data[0]));
  
  // Check for nested properties
  const sampleItem = data[0];
  Object.keys(sampleItem).forEach(key => {
    const value = sampleItem[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log(`📁 Nested object found in '${key}':`, value);
      console.log(`🔑 Nested keys in '${key}':`, Object.keys(value));
    }
  });
  
  return {
    totalItems: data.length,
    sampleItem: data[0],
    availableKeys: Object.keys(data[0]),
    nestedObjects: Object.keys(sampleItem).filter(key => 
      sampleItem[key] && typeof sampleItem[key] === 'object' && !Array.isArray(sampleItem[key])
    )
  };
};

/**
 * Helper function to export leads data with role-based columns and direct download
 * @param {Array} leads - Array of lead objects
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {string} filename - Optional custom filename
 */
export const exportLeadsWithRoleAndDownload = async (leads, userRole = 'USER', filename = 'leads_export') => {
  console.log('🚀 exportLeadsWithRoleAndDownload called with:', { 
    leadsLength: leads?.length, 
    userRole, 
    filename 
  });
  
  // Debug the data structure first
  const debugInfo = debugDataStructure(leads, 'leads');
  
  const roleColumns = ROLE_BASED_LEAD_COLUMNS[userRole] || ROLE_BASED_LEAD_COLUMNS.USER;
  console.log('📋 Using role columns for', userRole, ':', roleColumns.map(c => c.key));
  
  // Check if column keys match available data keys
  const availableKeys = debugInfo?.availableKeys || [];
  const missingKeys = roleColumns.filter(col => !availableKeys.includes(col.key.split('.')[0]));
  if (missingKeys.length > 0) {
    console.log('⚠️ Missing column keys in data:', missingKeys.map(c => c.key));
    console.log('💡 Available keys:', availableKeys);
  }
  
  const roleFilename = `${filename}_${userRole.toLowerCase()}`;
  
  // Use smart export with fallback
  return await smartExportWithFallback(leads, roleColumns, userRole, roleFilename, 'leads');
};

/**
 * Get role-based columns for leads
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @returns {Array} Array of column definitions
 */
export const getRoleBasedLeadColumns = (userRole) => {
  return ROLE_BASED_LEAD_COLUMNS[userRole] || ROLE_BASED_LEAD_COLUMNS.USER;
};

/**
 * Helper function to export properties data
 * @param {Array} properties - Array of property objects
 */
export const exportProperties = async (properties) => {
  return await exportToExcel(properties, COLUMN_CONFIGS.properties, 'properties_export');
};

/**
 * Helper function to export properties data with direct download
 * @param {Array} properties - Array of property objects
 */
export const exportPropertiesWithDownload = async (properties) => {
  return await exportToExcelWithDownload(properties, COLUMN_CONFIGS.properties, 'properties_export');
};

/**
 * Helper function to export properties data with role-based columns
 * @param {Array} properties - Array of property objects
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {string} filename - Optional custom filename
 */
export const exportPropertiesWithRole = async (properties, userRole = 'USER', filename = 'properties_export') => {
  const roleColumns = ROLE_BASED_PROPERTY_COLUMNS[userRole] || ROLE_BASED_PROPERTY_COLUMNS.USER;
  const roleFilename = `${filename}_${userRole.toLowerCase()}`;
  return await exportToExcel(properties, roleColumns, roleFilename);
};

/**
 * Helper function to export properties data with role-based columns and direct download
 * @param {Array} properties - Array of property objects
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {string} filename - Optional custom filename
 */
export const exportPropertiesWithRoleAndDownload = async (properties, userRole = 'USER', filename = 'properties_export') => {
  console.log('🚀 exportPropertiesWithRoleAndDownload called with:', { 
    propertiesLength: properties?.length, 
    userRole, 
    filename 
  });
  
  // Debug the data structure first
  const debugInfo = debugDataStructure(properties, 'properties');
  
  const roleColumns = ROLE_BASED_PROPERTY_COLUMNS[userRole] || ROLE_BASED_PROPERTY_COLUMNS.USER;
  console.log('📋 Using role columns for', userRole, ':', roleColumns.map(c => c.key));
  
  // Check if column keys match available data keys
  const availableKeys = debugInfo?.availableKeys || [];
  const missingKeys = roleColumns.filter(col => !availableKeys.includes(col.key.split('.')[0]));
  if (missingKeys.length > 0) {
    console.log('⚠️ Missing column keys in data:', missingKeys.map(c => c.key));
    console.log('💡 Available keys:', availableKeys);
  }
  
  const roleFilename = `${filename}_${userRole.toLowerCase()}`;
  
  // Use smart export with fallback
  return await smartExportWithFallback(properties, roleColumns, userRole, roleFilename, 'properties');
};

/**
 * Get role-based columns for properties
 * @param {string} userRole - User role (DIRECTOR, ADMIN, USER)
 * @returns {Array} Array of column definitions
 */
export const getRoleBasedPropertyColumns = (userRole) => {
  return ROLE_BASED_PROPERTY_COLUMNS[userRole] || ROLE_BASED_PROPERTY_COLUMNS.USER;
};

/**
 * Create dynamic columns from actual data structure
 * This function analyzes the data and creates columns automatically
 * @param {Array} data - Array of objects to analyze
 * @param {string} dataType - Type of data (leads, properties, notes)
 * @returns {Array} Array of column definitions
 */
export const createDynamicColumns = (data, dataType = 'data') => {
  if (!data || data.length === 0) {
    console.log('❌ No data provided to createDynamicColumns');
    return [];
  }
  
  const sampleItem = data[0];
  const allKeys = Object.keys(sampleItem);
  
  console.log('🔍 Analyzing data structure for', dataType, ':', {
    totalItems: data.length,
    allKeys: allKeys,
    sampleItem: sampleItem
  });
  
  const columns = allKeys.map(key => {
    // Get sample value to understand the data type
    const sampleValue = sampleItem[key];
    let header = key;
    
    // Create user-friendly headers
    switch (key) {
      case 'name': header = 'Name'; break;
      case 'phone': header = 'Phone'; break;
      case 'email': header = 'Email'; break;
      case 'status': header = 'Status'; break;
      case 'budget': header = 'Budget'; break;
      case 'requirement': header = 'Requirement'; break;
      case 'location': header = 'Location'; break;
      case 'source': header = 'Source'; break;
      case 'createdAt': header = 'Created Date'; break;
      case 'updatedAt': header = 'Updated Date'; break;
      case 'propertyName': header = 'Property Name'; break;
      case 'type': header = 'Type'; break;
      case 'price': header = 'Price'; break;
      case 'sector': header = 'Sector'; break;
      case 'bhk': header = 'BHK'; break;
      case 'unitDetails': header = 'Unit Details'; break;
      case 'floor': header = 'Floor'; break;
      case 'ownerContact': header = 'Owner Contact'; break;
      case 'ownerName': header = 'Owner Name'; break;
      case 'content': header = 'Content'; break;
      case 'typeStr': header = 'Type'; break;
      case 'priority': header = 'Priority'; break;
      case 'visibility': header = 'Visibility'; break;
      case 'id': header = 'ID'; break;
      default: 
        // Convert camelCase to Title Case
        header = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    return {
      key: key,
      header: header
    };
  });
  
  console.log('📋 Created dynamic columns:', columns);
  return columns;
};

/**
 * Export data with dynamic column detection
 * This function automatically detects data structure and exports everything
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the exported file
 * @param {string} dataType - Type of data for logging
 */
export const exportDataWithDynamicColumns = async (data, filename, dataType = 'data') => {
  try {
    console.log('🚀 Starting dynamic export for', dataType);
    
    if (!data || data.length === 0) {
      return { success: false, message: 'No data to export' };
    }
    
    const dynamicColumns = createDynamicColumns(data, dataType);
    
    if (dynamicColumns.length === 0) {
      return { success: false, message: 'Could not create columns from data' };
    }
    
    console.log('📊 Exporting with', dynamicColumns.length, 'columns');
    
    return await exportToExcelWithDownload(data, dynamicColumns, filename);
  } catch (error) {
    console.error('Dynamic export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};

/**
 * Smart export function that tries role-based columns first, then falls back to dynamic columns
 * @param {Array} data - Array of objects to export
 * @param {Array} roleColumns - Role-based column configuration
 * @param {string} userRole - User role
 * @param {string} filename - Name of the exported file
 * @param {string} dataType - Type of data for logging
 */
export const smartExportWithFallback = async (data, roleColumns, userRole, filename, dataType = 'data') => {
  try {
    console.log('🧠 Starting smart export with fallback for', dataType);
    
    if (!data || data.length === 0) {
      return { success: false, message: 'No data to export' };
    }
    
    // First, try role-based columns
    console.log('🎯 Attempting role-based export...');
    try {
      const result = await exportToExcelWithDownload(data, roleColumns, filename);
      if (result.success) {
        console.log('✅ Role-based export successful');
        return result;
      } else {
        console.log('⚠️ Role-based export failed, trying dynamic export...');
      }
    } catch (error) {
      console.log('⚠️ Role-based export error, trying dynamic export:', error.message);
    }
    
    // Fallback to dynamic columns
    console.log('🔄 Falling back to dynamic export...');
    const dynamicColumns = createDynamicColumns(data, dataType);
    
    if (dynamicColumns.length === 0) {
      return { success: false, message: 'Could not create columns from data' };
    }
    
    const dynamicFilename = `${filename}_dynamic`;
    const result = await exportToExcelWithDownload(data, dynamicColumns, dynamicFilename);
    
    if (result.success) {
      result.message = `${result.message} (Used dynamic columns due to data structure mismatch)`;
    }
    
    return result;
  } catch (error) {
    console.error('Smart export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};
