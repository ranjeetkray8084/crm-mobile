import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showDownloadSuccess, showDownloadError } from './filePermissions';

const API_BASE_URL = 'https://backend.leadstracker.in'; // Update with your backend URL

/**
 * Convert string to base64 (React Native compatible)
 */
function stringToBase64(str) {
  try {
    // Use Buffer if available (Node.js environment)
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'binary').toString('base64');
    }
    // Fallback for React Native
    return str;
  } catch (error) {
    console.warn('Base64 conversion failed, using original string:', error);
    return str;
  }
}

/**
 * Export leads using backend endpoint
 * @param {Object} params - Export parameters
 * @param {number} params.companyId - Company ID
 * @param {string} params.userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {number} params.userId - User ID
 * @param {Array} params.keywords - Search keywords
 * @param {string} params.status - Lead status filter
 * @param {number} params.minBudget - Minimum budget filter
 * @param {number} params.maxBudget - Maximum budget filter
 * @param {number} params.createdBy - Created by user filter
 * @param {string} params.source - Source filter
 * @param {string} params.action - Action filter
 */
export const exportLeadsFromBackend = async (params) => {
  try {
    console.log('🚀 Starting export for leads with params:', params);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params.keywords && params.keywords.length > 0) {
      params.keywords.forEach(keyword => queryParams.append('keywords', keyword));
    }
    if (params.status) queryParams.append('status', params.status);
    if (params.minBudget) queryParams.append('minBudget', params.minBudget.toString());
    if (params.maxBudget) queryParams.append('maxBudget', params.maxBudget.toString());
    if (params.createdBy) queryParams.append('createdBy', params.createdBy.toString());
    if (params.source) queryParams.append('source', params.source);
    if (params.action) queryParams.append('action', params.action);
    if (params.userRole) queryParams.append('userRole', params.userRole);
    if (params.userId) queryParams.append('userId', params.userId.toString());
    
    const url = `${API_BASE_URL}/api/companies/${params.companyId}/leads/export?${queryParams.toString()}`;
    
    console.log('📡 Calling export endpoint:', url);
    
    // Get authentication token
    const token = await AsyncStorage.getItem('token');
    console.log('🔐 Token found for export:', !!token);
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Authorization header added');
    } else {
      console.log('⚠️ No authentication token found');
    }
    
    // Make the API call
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the Excel file as array buffer (React Native compatible)
    let arrayBuffer;
    try {
      arrayBuffer = await response.arrayBuffer();
    } catch (error) {
      console.log('⚠️ arrayBuffer() not supported, trying alternative method');
      // Fallback: read as text and convert to base64
      const text = await response.text();
      // Convert text to base64 directly (React Native compatible)
      const base64 = stringToBase64(text);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads_export_${timestamp}.xlsx`;
      const result = await saveAndShareExcel(base64, filename);
      console.log('✅ Export completed (fallback):', result);
      return result;
    }
    
    // Convert to base64 for React Native
    const base64 = arrayBufferToBase64(arrayBuffer);
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leads_export_${timestamp}.xlsx`;
    
    // Save and share the file
    const result = await saveAndShareExcel(base64, filename);
    
    console.log('✅ Export completed:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    showDownloadError(`Export failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

/**
 * Export properties using backend endpoint
 * @param {Object} params - Export parameters
 * @param {number} params.companyId - Company ID
 * @param {string} params.userRole - User role (DIRECTOR, ADMIN, USER)
 * @param {number} params.userId - User ID
 * @param {Array} params.keywords - Search keywords
 * @param {string} params.status - Property status filter
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {number} params.createdBy - Created by user filter
 */
export const exportPropertiesFromBackend = async (params) => {
  try {
    console.log('🚀 Starting export for properties with params:', params);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params.keywords && params.keywords.length > 0) {
      params.keywords.forEach(keyword => queryParams.append('keywords', keyword));
    }
    if (params.status) queryParams.append('status', params.status);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.createdBy) queryParams.append('createdBy', params.createdBy.toString());
    if (params.userRole) queryParams.append('userRole', params.userRole);
    if (params.userId) queryParams.append('userId', params.userId.toString());
    
    const url = `${API_BASE_URL}/api/companies/${params.companyId}/properties/export?${queryParams.toString()}`;
    
    console.log('📡 Calling backend endpoint:', url);
    
    // Get authentication token
    const token = await AsyncStorage.getItem('token');
    console.log('🔐 Token found for properties export:', !!token);
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Authorization header added to properties export');
    } else {
      console.log('⚠️ No authentication token found for properties export');
    }
    
    // Make the API call
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the Excel file as array buffer (React Native compatible)
    let arrayBuffer;
    try {
      arrayBuffer = await response.arrayBuffer();
    } catch (error) {
      console.log('⚠️ arrayBuffer() not supported, trying alternative method');
      // Fallback: read as text and convert to base64
      const text = await response.text();
      // Convert text to base64 directly (React Native compatible)
      const base64 = stringToBase64(text);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `properties_export_${timestamp}.xlsx`;
      const result = await saveAndShareExcel(base64, filename);
      console.log('✅ Export completed (fallback):', result);
      return result;
    }
    
    // Convert to base64 for React Native
    const base64 = arrayBufferToBase64(arrayBuffer);
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `properties_export_${timestamp}.xlsx`;
    
    // Save and share the file
    const result = await saveAndShareExcel(base64, filename);
    
    console.log('✅ Export completed:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    showDownloadError(`Export failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Save Excel file and share it
 */
async function saveAndShareExcel(base64Data, filename) {
  try {
    console.log('💾 Saving Excel file:', filename);
    
    // Create file path
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    // Write file
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    console.log('✅ File saved to:', fileUri);
    
    // Try to save to Downloads folder on Android
    if (Platform.OS === 'android') {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          
          // Try to save to Downloads folder
          const album = await MediaLibrary.getAlbumAsync('Download');
          if (album) {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            console.log('✅ File saved to Downloads folder');
            showDownloadSuccess('File saved to Downloads folder!', 'MediaLibrary');
            return { success: true, message: 'File saved to Downloads folder!' };
          }
        }
      } catch (mediaError) {
        console.log('⚠️ MediaLibrary save failed, falling back to sharing:', mediaError.message);
      }
    }
    
    // Fallback to sharing dialog
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share Excel File',
      });
      
      console.log('✅ File shared via dialog');
      showDownloadSuccess('File shared successfully!', 'Share Dialog');
      return { success: true, message: 'File shared successfully!' };
    } else {
      throw new Error('Sharing is not available on this device');
    }
    
  } catch (error) {
    console.error('❌ Save and share failed:', error);
    showDownloadError(`Failed to save file: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Test function to verify export
 */
export const testBackendExport = async () => {
  console.log('🧪 Testing export...');
  
  const testParams = {
    companyId: 1, // Replace with actual company ID
    userRole: 'USER',
    userId: 1, // Replace with actual user ID
  };
  
  try {
    const result = await exportLeadsFromBackend(testParams);
    console.log('🧪 Test result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Test failed:', error);
    return { success: false, message: error.message };
  }
};
