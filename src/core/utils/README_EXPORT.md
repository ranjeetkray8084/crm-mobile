# Excel Export Utility for React Native

This utility provides a common method for exporting table data to CSV format for both Lead and Property tables in React Native.

## Features

- ✅ Exports all columns except the Actions column
- ✅ Properly formats dates, currency, and status values
- ✅ Handles nested object properties
- ✅ Includes timestamp in filename
- ✅ Error handling and validation
- ✅ User-friendly success/error messages
- ✅ Uses expo-file-system and expo-sharing for native file handling
- ✅ Automatically shares files via native sharing dialog

## Prerequisites

Make sure you have the following packages installed:

```bash
npm install expo-file-system expo-sharing
```

## Usage

### For Leads Table

```javascript
import { exportLeads } from '../../core/utils/excelExport';

const handleExport = async () => {
  if (!leads || leads.length === 0) {
    Alert.alert('Export', 'No leads to export');
    return;
  }
  
  try {
    Alert.alert('Export', 'Exporting leads...', [], { cancelable: false });
    
    const result = await exportLeads(leads);
    
    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Export Failed', result.message);
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Export Failed', `Failed to export leads: ${error.message}`);
  }
};
```

### For Properties Table

```javascript
import { exportProperties } from '../../core/utils/excelExport';

const handleExport = async () => {
  if (!properties || properties.length === 0) {
    Alert.alert('Export', 'No properties to export');
    return;
  }
  
  try {
    Alert.alert('Export', 'Exporting properties...', [], { cancelable: false });
    
    const result = await exportProperties(properties);
    
    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Export Failed', result.message);
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Export Failed', `Failed to export properties: ${error.message}`);
  }
};
```

### Custom Export

For custom tables, you can use the generic `exportToExcel` function:

```javascript
import { exportToExcel } from '../../core/utils/excelExport';

const customColumns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'user.role', header: 'Role' } // Nested property
];

const result = await exportToExcel(data, customColumns, 'custom_export');
```

## How It Works

1. **Data Processing**: The utility processes your data array and formats values appropriately
2. **CSV Generation**: Converts the data to CSV format with proper escaping
3. **File Saving**: Saves the CSV file to the device's documents directory
4. **File Sharing**: Automatically opens the native sharing dialog to share the file
5. **User Feedback**: Provides success/error messages to the user

## Exported Columns

### Leads Export
- Lead Name
- Phone
- Status
- Budget
- Requirement
- Location
- Source
- Created Date
- Assigned To

### Properties Export
- Property Name
- Status
- Type
- Price
- Location
- Sector
- BHK
- Unit Details
- Floor
- Owner Contact
- Source
- Created Date

## File Format

- **Format**: CSV (Comma Separated Values)
- **Encoding**: UTF-8
- **Filename**: `{type}_export_{date}.csv`
- **Example**: `leads_export_2024-01-15.csv`

## Error Handling

The utility handles various error scenarios:
- Empty data arrays
- Invalid column configurations
- File system errors
- Sharing availability issues

## Platform Support

- ✅ iOS (uses native sharing)
- ✅ Android (uses native sharing)
- ✅ Web (falls back to file download)

## Troubleshooting

### Common Issues

1. **"No sharing available"**: The file will be saved to the device's documents directory
2. **Permission errors**: Ensure the app has file system permissions
3. **Empty exports**: Check that your data array contains the expected properties

### Debug Mode

Enable console logging to debug export issues:

```javascript
// The utility automatically logs errors to console
console.log('Export result:', result);
```

## Example Implementation

Here's a complete example of how to implement export in a component:

```javascript
import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exportLeads } from '../../core/utils/excelExport';

const ExportButton = ({ leads }) => {
  const handleExport = async () => {
    if (!leads || leads.length === 0) {
      Alert.alert('Export', 'No leads to export');
      return;
    }
    
    try {
      Alert.alert('Export', 'Exporting leads...', [], { cancelable: false });
      
      const result = await exportLeads(leads);
      
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Export Failed', result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', `Failed to export leads: ${error.message}`);
    }
  };

  return (
    <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
      <Ionicons name="download-outline" size={20} color="#6b7280" />
      <Text style={styles.exportText}>Export</Text>
    </TouchableOpacity>
  );
};
```

## Notes

- The export function is asynchronous, so use `async/await` or `.then()`
- Files are automatically cleaned up by the system
- Large datasets may take a moment to process
- The sharing dialog allows users to save, email, or share via other apps
