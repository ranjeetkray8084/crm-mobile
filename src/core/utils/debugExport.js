/**
 * Debug Export Functions
 * This file contains functions to help debug Excel export issues
 */

import { debugDataStructure, exportDataWithDynamicColumns } from './excelExport';

/**
 * Test export with sample data to verify the export process works
 */
export const testExportWithSampleData = async () => {
  console.log('🧪 Testing export with sample data...');
  
  const sampleLeads = [
    {
      id: 1,
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      status: 'NEW',
      budget: 5000000,
      requirement: '3 BHK Apartment',
      location: 'Mumbai',
      source: 'Website',
      createdAt: '2024-01-15T10:30:00Z',
      assignedToSummary: {
        name: 'Agent Smith'
      },
      createdBy: {
        name: 'Admin User'
      },
      notes: 'Interested in luxury properties',
      followUpDate: '2024-01-20',
      priority: 'HIGH'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '9876543211',
      email: 'jane@example.com',
      status: 'CONTACTED',
      budget: 3000000,
      requirement: '2 BHK Apartment',
      location: 'Delhi',
      source: 'Referral',
      createdAt: '2024-01-16T11:00:00Z',
      assignedToSummary: {
        name: 'Agent Johnson'
      },
      createdBy: {
        name: 'Admin User'
      },
      notes: 'Looking for budget-friendly options',
      followUpDate: '2024-01-22',
      priority: 'MEDIUM'
    }
  ];

  try {
    // Debug the sample data structure
    const debugInfo = debugDataStructure(sampleLeads, 'sample_leads');
    
    // Export with dynamic columns
    const result = await exportDataWithDynamicColumns(sampleLeads, 'test_sample_leads', 'sample_leads');
    
    console.log('🧪 Sample data export result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Sample data export error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Debug real data structure from API
 * @param {Array} realData - Real data from API
 * @param {string} dataType - Type of data (leads, properties, etc.)
 */
export const debugRealDataStructure = (realData, dataType = 'real_data') => {
  console.log(`🔍 Debugging real ${dataType} structure:`);
  
  if (!realData || realData.length === 0) {
    console.log('❌ No real data provided');
    return null;
  }
  
  const debugInfo = debugDataStructure(realData, dataType);
  
  // Additional analysis for real data
  const sampleItem = realData[0];
  console.log('📊 Real data analysis:', {
    totalItems: realData.length,
    sampleItem: sampleItem,
    allKeys: Object.keys(sampleItem),
    dataTypes: Object.keys(sampleItem).map(key => ({
      key,
      type: typeof sampleItem[key],
      value: sampleItem[key],
      isNull: sampleItem[key] === null,
      isUndefined: sampleItem[key] === undefined
    }))
  });
  
  return debugInfo;
};

/**
 * Test export with real data and provide detailed feedback
 * @param {Array} realData - Real data from API
 * @param {string} dataType - Type of data (leads, properties, etc.)
 * @param {string} filename - Filename for export
 */
export const testExportWithRealData = async (realData, dataType = 'real_data', filename = 'test_real_export') => {
  console.log(`🧪 Testing export with real ${dataType} data...`);
  
  if (!realData || realData.length === 0) {
    console.log('❌ No real data to test');
    return { success: false, message: 'No data provided for testing' };
  }
  
  try {
    // Debug the real data structure
    const debugInfo = debugRealDataStructure(realData, dataType);
    
    // Export with dynamic columns
    const result = await exportDataWithDynamicColumns(realData, filename, dataType);
    
    console.log(`🧪 Real ${dataType} export result:`, result);
    return result;
  } catch (error) {
    console.error(`🧪 Real ${dataType} export error:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Compare expected vs actual data structure
 * @param {Array} expectedColumns - Expected column configuration
 * @param {Array} actualData - Actual data from API
 * @param {string} dataType - Type of data
 */
export const compareDataStructures = (expectedColumns, actualData, dataType = 'data') => {
  console.log(`🔍 Comparing expected vs actual ${dataType} structure:`);
  
  if (!expectedColumns || !actualData || actualData.length === 0) {
    console.log('❌ Missing expected columns or actual data');
    return null;
  }
  
  const actualKeys = Object.keys(actualData[0]);
  const expectedKeys = expectedColumns.map(col => col.key.split('.')[0]);
  
  const matchingKeys = expectedKeys.filter(key => actualKeys.includes(key));
  const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));
  const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key));
  
  console.log('📊 Structure comparison:', {
    expectedKeys: expectedKeys,
    actualKeys: actualKeys,
    matchingKeys: matchingKeys,
    missingKeys: missingKeys,
    extraKeys: extraKeys,
    matchPercentage: (matchingKeys.length / expectedKeys.length * 100).toFixed(1) + '%'
  });
  
  return {
    expectedKeys,
    actualKeys,
    matchingKeys,
    missingKeys,
    extraKeys,
    matchPercentage: (matchingKeys.length / expectedKeys.length * 100).toFixed(1) + '%'
  };
};

/**
 * Quick debug function to test if export is working
 */
export const quickDebugExport = async () => {
  console.log('🚀 Quick debug export test...');
  
  try {
    // Test with sample data first
    const sampleResult = await testExportWithSampleData();
    
    if (sampleResult.success) {
      console.log('✅ Sample data export works - export functionality is working');
      return { 
        success: true, 
        message: 'Export functionality is working. Issue might be with real data structure.',
        sampleTest: sampleResult
      };
    } else {
      console.log('❌ Sample data export failed - export functionality has issues');
      return { 
        success: false, 
        message: 'Export functionality has issues. Check export process.',
        sampleTest: sampleResult
      };
    }
  } catch (error) {
    console.error('❌ Quick debug export error:', error);
    return { success: false, message: error.message };
  }
};
