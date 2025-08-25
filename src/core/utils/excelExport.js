/**
 * Common Excel Export Utility for React Native
 * Provides functionality to export table data to CSV format
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
 * Convert data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with key and header
 * @returns {string} CSV string
 */
const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';
  
  // Create header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Handle nested properties (e.g., 'user.name')
      if (col.key.includes('.')) {
        value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
      }
      
      // Format the value
      const formattedValue = formatValue(value, col.key);
      
      // Escape quotes
      const stringValue = formattedValue.replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

/**
 * Save CSV file and share it
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to save
 */
const saveAndShareCSV = async (csvContent, filename) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.csv`;
    
    // Create file path in app's documents directory
    const fileUri = `${FileSystem.documentDirectory}${finalFilename}`;
    
    // Write CSV content to file
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8
    });
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Export ${filename}`,
        UTI: 'public.comma-separated-values-text'
      });
    } else {
      // If sharing is not available, just save the file
      console.log(`File saved to: ${fileUri}`);
      return { success: true, message: `File saved to device: ${finalFilename}` };
    }
    
    return { success: true, message: `Exported ${filename} successfully` };
  } catch (error) {
    console.error('Error saving/sharing CSV:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};

/**
 * Export table data to CSV format
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
    
    const csvContent = convertToCSV(data, columns);
    const result = await saveAndShareCSV(csvContent, filename);
    
    if (result.success) {
      return { success: true, message: `Exported ${data.length} records to ${filename}` };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
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
 * Helper function to export leads data
 * @param {Array} leads - Array of lead objects
 */
export const exportLeads = async (leads) => {
  return await exportToExcel(leads, COLUMN_CONFIGS.leads, 'leads_export');
};

/**
 * Helper function to export properties data
 * @param {Array} properties - Array of property objects
 */
export const exportProperties = async (properties) => {
  return await exportToExcel(properties, COLUMN_CONFIGS.properties, 'properties_export');
};
