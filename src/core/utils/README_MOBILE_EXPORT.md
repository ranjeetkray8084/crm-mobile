# Mobile App Excel Export Documentation

This document explains the enhanced Excel export functionality for the CRM mobile app (React Native/Expo).

## Features

### ✅ Enhanced Download Functionality
- **Automatic Downloads Folder Save**: Files are automatically saved to the Downloads folder on Android
- **Multiple Download Methods**: Falls back gracefully from MediaLibrary to Share Dialog
- **Cross-Platform Support**: Works on both Android and iOS
- **Permission Handling**: Automatically requests and manages storage permissions
- **User-Friendly Messages**: Clear instructions and success/error messages

### ✅ Role-Based Export
- **DIRECTOR Role**: Full access to all fields including sensitive information
- **ADMIN Role**: Moderate access with most fields visible
- **USER Role**: Basic access with essential fields only

### ✅ Data Formatting
- **Date Formatting**: DD MMM YYYY format (e.g., "15 Jan 2024")
- **Currency Formatting**: Indian Rupee format (e.g., "₹1,00,000")
- **Status Formatting**: Human-readable format (e.g., "For Sale" instead of "AVAILABLE_FOR_SALE")
- **Nested Properties**: Handles complex object properties (e.g., 'user.name')

### ✅ Error Handling
- **Comprehensive Validation**: Input validation and error checking
- **Graceful Fallbacks**: Multiple fallback methods for downloads
- **User-Friendly Messages**: Clear error messages with troubleshooting tips
- **Logging**: Detailed console logging for debugging

## Usage

### Basic Export

```javascript
import { exportToExcelWithDownload } from '../../core/utils/excelExport';

const handleExport = async () => {
  const result = await exportToExcelWithDownload(data, columns, 'filename');
  if (result.success) {
    Alert.alert('Success', result.message);
  } else {
    Alert.alert('Error', result.message);
  }
};
```

### Role-Based Export

```javascript
import { exportLeadsWithRoleAndDownload } from '../../core/utils/excelExport';

const handleExportLeads = async (leads, userRole) => {
  const result = await exportLeadsWithRoleAndDownload(leads, userRole, 'leads_export');
  if (result.success) {
    Alert.alert('Success', result.message);
  } else {
    Alert.alert('Error', result.message);
  }
};
```

### Dynamic Export

```javascript
import { exportDataWithDynamicColumns } from '../../core/utils/excelExport';

const handleDynamicExport = async (data, filename) => {
  const result = await exportDataWithDynamicColumns(data, filename, 'data_type');
  if (result.success) {
    Alert.alert('Success', result.message);
  } else {
    Alert.alert('Error', result.message);
  }
};
```

## Available Export Functions

### Lead Exports
- `exportLeads(leads)` - Basic leads export
- `exportLeadsWithDownload(leads)` - Leads export with direct download
- `exportLeadsWithRole(leads, userRole, filename)` - Role-based leads export
- `exportLeadsWithRoleAndDownload(leads, userRole, filename)` - Role-based leads export with direct download

### Property Exports
- `exportProperties(properties)` - Basic properties export
- `exportPropertiesWithDownload(properties)` - Properties export with direct download
- `exportPropertiesWithRole(properties, userRole, filename)` - Role-based properties export
- `exportPropertiesWithRoleAndDownload(properties, userRole, filename)` - Role-based properties export with direct download

### Generic Exports
- `exportToExcel(data, columns, filename)` - Generic export function
- `exportToExcelWithDownload(data, columns, filename)` - Generic export with direct download
- `exportDataWithDynamicColumns(data, filename, dataType)` - Dynamic column detection export

## Download Methods

### Method 1: MediaLibrary (Android)
- **Primary Method**: Automatically saves to Downloads folder
- **Requires**: Storage permissions
- **Benefits**: Direct access to Downloads folder
- **Fallback**: If permissions denied, falls back to Share Dialog

### Method 2: Share Dialog
- **Fallback Method**: Opens system share dialog
- **Benefits**: Works on all devices
- **User Action**: User manually selects "Save to Downloads"
- **Instructions**: Clear instructions provided to user

### Method 3: App Directory
- **Last Resort**: Saves to app's documents directory
- **When Used**: When sharing is not available
- **Limitation**: File only accessible within app

## File Naming Convention

Files are automatically named with timestamp:
- Pattern: `{filename}_{YYYY-MM-DD}.xlsx`
- Examples:
  - `leads_export_user_2024-01-15.xlsx`
  - `properties_export_director_2024-01-15.xlsx`

## Column Configurations

### Role-Based Lead Columns

**DIRECTOR** (13 columns):
- Lead Name, Phone, Email, Status, Budget, Requirement, Location, Source
- Created Date, Assigned To, Created By, Notes, Follow Up Date, Priority

**ADMIN** (12 columns):
- Lead Name, Phone, Email, Status, Budget, Requirement, Location, Source
- Created Date, Assigned To, Created By, Notes, Follow Up Date

**USER** (11 columns):
- Lead Name, Phone, Email, Status, Budget, Requirement, Location, Source
- Created Date, Assigned To, Notes, Follow Up Date

### Role-Based Property Columns

**DIRECTOR** (16 columns):
- Property Name, Status, Type, Price, Location, Sector, BHK, Unit Details, Floor
- Owner Name, Owner Contact, Source, Created Date, Created By, Size, Address

**ADMIN** (14 columns):
- Property Name, Status, Type, Price, Location, Sector, BHK, Unit Details, Floor
- Owner Contact, Source, Created Date, Created By, Size

**USER** (11 columns):
- Property Name, Status, Type, Price, Location, Sector, BHK, Unit Details, Floor
- Source, Created Date, Size

## Testing

### Test Functions Available

```javascript
import { 
  testExportLeads, 
  testExportProperties, 
  testAllExportScenarios,
  testRoleBasedExports,
  testExportWithRealData
} from '../../core/utils/testExport';

// Test basic exports
await testExportLeads();
await testExportProperties();

// Test comprehensive scenarios
await testAllExportScenarios();

// Test role-based exports
await testRoleBasedExports();

// Test with real data
await testExportWithRealData(realData, 'data_type');
```

## Error Handling

### Common Error Scenarios
1. **No Data**: "No data to export"
2. **Invalid Input**: "Data must be an array"
3. **Permission Denied**: Falls back to Share Dialog
4. **Storage Full**: Clear error message with troubleshooting tips
5. **Network Issues**: Retry mechanism with user feedback

### Error Messages
- **Success**: Clear success message with file location
- **Permission Issues**: Instructions for enabling permissions
- **Storage Issues**: Troubleshooting tips for storage problems
- **General Errors**: User-friendly error messages with retry options

## Permissions Required

### Android
- `WRITE_EXTERNAL_STORAGE` - For saving to Downloads folder
- `READ_EXTERNAL_STORAGE` - For accessing files
- `MANAGE_EXTERNAL_STORAGE` - For Android 11+ (if needed)

### iOS
- No special permissions required (uses app sandbox)

## Troubleshooting

### Common Issues

1. **File Not Found in Downloads**
   - Check File Manager > Downloads folder
   - Look in Gallery app
   - Verify storage permissions

2. **Export Fails**
   - Check device storage space
   - Restart the app
   - Try again in a moment

3. **Permission Denied**
   - Go to Settings > Apps > LeadsTracker > Permissions
   - Enable Storage permission
   - Try export again

4. **Share Dialog Doesn't Work**
   - Ensure sharing is available on device
   - Try saving to Files app instead
   - Check if file was saved to app directory

## Best Practices

1. **Always Check Results**: Verify export success before showing success message
2. **Provide Feedback**: Show loading states during export process
3. **Handle Errors Gracefully**: Provide clear error messages with solutions
4. **Test on Different Devices**: Verify functionality across Android/iOS versions
5. **Monitor Storage**: Check available storage before large exports

## Integration Examples

### LeadsSection Integration
```javascript
const handleExport = async () => {
  try {
    Alert.alert('Export', 'Fetching all leads for export...', [], { cancelable: false });
    
    // Fetch data
    const result = await searchProperties(companyId, 0, 10000, { role: userRole, userId });
    
    if (result.success && result.data.content.length > 0) {
      // Export with role-based columns
      const exportResult = await exportLeadsWithRoleAndDownload(
        result.data.content, 
        userRole, 
        'leads_export'
      );
      
      if (exportResult.success) {
        Alert.alert('Success', exportResult.message);
      } else {
        Alert.alert('Export Failed', exportResult.message);
      }
    } else {
      Alert.alert('Export', 'No leads to export');
    }
  } catch (error) {
    Alert.alert('Export Failed', `Failed to export leads: ${error.message}`);
  }
};
```

### PropertiesSection Integration
```javascript
const handleExport = async () => {
  try {
    // Similar to LeadsSection but with properties data
    const exportResult = await exportPropertiesWithRoleAndDownload(
      result.data.content, 
      userRole, 
      'properties_export'
    );
    
    // Handle result...
  } catch (error) {
    // Handle error...
  }
};
```

This enhanced Excel export functionality provides a robust, user-friendly solution for exporting data from the mobile CRM app with proper local storage and download capabilities.
