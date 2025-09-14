import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

/**
 * Request file download permissions
 * @returns {Promise<boolean>} True if permissions granted
 */
export const requestFilePermissions = async () => {
  try {
    console.log('🔐 Requesting file permissions...');
    
    if (Platform.OS === 'android') {
      // Check current permission status first
      const { status: currentStatus } = await MediaLibrary.getPermissionsAsync();
      console.log('📋 Current permission status:', currentStatus);
      
      if (currentStatus === 'granted') {
        console.log('✅ Storage permission already granted');
        return true;
      }
      
      // Show permission request dialog like notifications
      console.log('📱 Showing permission dialog...');
      return new Promise((resolve) => {
        Alert.alert(
          '📁 Storage Permission Required',
          'LeadsTracker needs storage permission to save exported files directly to your Downloads folder.\n\nThis allows you to:\n• Export leads data to Excel\n• Save files automatically\n• Access files in Downloads folder',
          [
            { 
              text: 'Not Now', 
              style: 'cancel',
              onPress: () => {
                console.log('❌ User denied storage permission');
                resolve(false);
              }
            },
            { 
              text: 'Allow', 
              onPress: async () => {
                try {
                  console.log('🔄 Requesting storage permission...');
                  const { status } = await MediaLibrary.requestPermissionsAsync();
                  console.log('📋 Permission request result:', status);
                  
                  if (status === 'granted') {
                    console.log('✅ Storage permission granted');
                    resolve(true);
                  } else {
                    console.log('❌ Storage permission denied');
                    Alert.alert(
                      'Permission Required',
                      'Storage permission is required for file downloads. Please enable it in Settings:\n\n1. Go to Settings\n2. Apps > LeadsTracker\n3. Permissions > Storage\n4. Allow Storage permission\n\nThen try export again.',
                      [
                        { text: 'OK', onPress: () => resolve(false) }
                      ]
                    );
                  }
                } catch (error) {
                  console.error('❌ Permission request error:', error);
                  Alert.alert('Error', 'Failed to request storage permission');
                  resolve(false);
                }
              }
            }
          ]
        );
      });
    }
    
    // For iOS, check if sharing is available
    console.log('🍎 iOS platform detected');
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.log('❌ Sharing not available on iOS');
    } else {
      console.log('✅ Sharing available on iOS');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Permission request error:', error);
    Alert.alert('Error', 'Failed to request permissions');
    return false;
  }
};

/**
 * Check if file download is supported
 * @returns {Promise<boolean>} True if download is supported
 */
export const isDownloadSupported = async () => {
  try {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return status === 'granted';
    }
    
    // For iOS, sharing is usually available
    return await Sharing.isAvailableAsync();
  } catch (error) {
    console.error('Download support check error:', error);
    return false;
  }
};

/**
 * Get the best available download path
 * @param {string} filename - Name of the file
 * @returns {Promise<string>} File path for download
 */
export const getDownloadPath = async (filename) => {
  try {
    if (Platform.OS === 'android') {
      // For Android 10+ (API 29+), use MediaStore or external storage
      try {
        // Try to get external storage directory
        const externalDir = FileSystem.StorageAccessFramework.getUriForDirectoryInRoot('Download');
        if (externalDir) {
          return `${externalDir}/${filename}`;
        }
      } catch (error) {
        console.log('External storage not accessible');
      }
      
      // Try different Android download paths
      const possiblePaths = [
        `${FileSystem.documentDirectory}../Downloads/${filename}`,
        `${FileSystem.cacheDirectory}../Downloads/${filename}`,
        `${FileSystem.documentDirectory}../Download/${filename}`,
        `${FileSystem.cacheDirectory}../Download/${filename}`,
        `${FileSystem.documentDirectory}${filename}` // Fallback
      ];
      
      for (const path of possiblePaths) {
        try {
          const dirPath = path.substring(0, path.lastIndexOf('/'));
          const dirInfo = await FileSystem.getInfoAsync(dirPath);
          if (dirInfo.exists) {
            console.log(`Using download path: ${path}`);
            return path;
          }
        } catch (error) {
          console.log(`Path not accessible: ${path}`);
        }
      }
    }
    
    // Fallback to documents directory
    return `${FileSystem.documentDirectory}${filename}`;
  } catch (error) {
    console.error('Get download path error:', error);
    return `${FileSystem.documentDirectory}${filename}`;
  }
};

/**
 * Show download success message with file location
 * @param {string} filename - Name of the downloaded file
 * @param {string} filePath - Path where file was saved
 * @param {string} method - Method used for download
 */
export const showDownloadSuccess = (filename, filePath, method = 'unknown') => {
  const methodInfo = method === 'MediaLibrary' 
    ? '✅ File automatically saved to Downloads folder'
    : method === 'Share Dialog'
    ? '✅ Use share dialog to save to Downloads folder'
    : '✅ File saved to app directory';
    
  const message = Platform.OS === 'android' 
    ? `🎉 Export & Download Complete!\n\n📁 File: ${filename}\n📂 Location: Downloads folder\n${methodInfo}\n\n✅ File is now available in:\n• Downloads folder\n• Gallery app\n• File Manager\n\n💡 If you can't find it:\n1. Open File Manager\n2. Go to Downloads folder\n3. Look for the file\n\nOr check Gallery app for the file.`
    : `🎉 Export & Download Complete!\n\n📁 File: ${filename}\n📂 Location: Files app\n${methodInfo}\n\n✅ File is now available in the Files app.`;
    
  Alert.alert('Download Complete', message, [
    { text: 'Great! 👍' }
  ]);
};

/**
 * Show download error message with helpful information
 * @param {string} error - Error message
 * @param {string} filename - Name of the file that failed to download
 */
export const showDownloadError = (error, filename = '') => {
  const filenameInfo = filename ? `\n\n📁 File: ${filename}` : '';
  
  const message = `Failed to download file: ${error}${filenameInfo}\n\n💡 Troubleshooting tips:\n• Check device storage space\n• Ensure storage permissions are granted\n• Try again in a moment\n• Restart the app if issues persist`;
  
  Alert.alert(
    'Download Failed', 
    message,
    [
      { text: 'Try Again', style: 'default' },
      { text: 'OK', style: 'cancel' }
    ]
  );
};
