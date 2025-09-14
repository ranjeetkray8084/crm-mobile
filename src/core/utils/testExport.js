/**
 * Test Export Function
 * This file contains test functions to verify Excel export functionality
 */

import { exportToExcelWithDownload, COLUMN_CONFIGS } from './excelExport';

/**
 * Test function to export sample leads data
 */
export const testExportLeads = async () => {
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
      }
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
      }
    }
  ];

  console.log('🧪 Testing leads export with sample data...');
  console.log('📊 Sample data:', sampleLeads);
  
  try {
    const result = await exportToExcelWithDownload(
      sampleLeads, 
      COLUMN_CONFIGS.leads, 
      'test_leads_export'
    );
    
    console.log('🧪 Test export result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Test export error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test function to export sample properties data
 */
export const testExportProperties = async () => {
  const sampleProperties = [
    {
      id: 1,
      propertyName: 'Luxury Apartment A',
      status: 'AVAILABLE_FOR_SALE',
      type: 'APARTMENT',
      price: 7500000,
      location: 'Mumbai',
      sector: 'South Mumbai',
      bhk: '3 BHK',
      unitDetails: 'Unit 501',
      floor: '5th Floor',
      ownerContact: '9876543210',
      source: 'Direct',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      propertyName: 'Modern Villa B',
      status: 'AVAILABLE_FOR_RENT',
      type: 'VILLA',
      price: 80000,
      location: 'Bangalore',
      sector: 'Whitefield',
      bhk: '4 BHK',
      unitDetails: 'Villa 123',
      floor: 'Ground Floor',
      ownerContact: '9876543211',
      source: 'Agent',
      createdAt: '2024-01-16T11:00:00Z'
    }
  ];

  console.log('🧪 Testing properties export with sample data...');
  console.log('📊 Sample data:', sampleProperties);
  
  try {
    const result = await exportToExcelWithDownload(
      sampleProperties, 
      COLUMN_CONFIGS.properties, 
      'test_properties_export'
    );
    
    console.log('🧪 Test export result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Test export error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test all export functions
 */
export const runAllExportTests = async () => {
  console.log('🧪 Running all export tests...');
  
  const leadsResult = await testExportLeads();
  const propertiesResult = await testExportProperties();
  
  console.log('🧪 All tests completed:', {
    leads: leadsResult,
    properties: propertiesResult
  });
  
  return {
    leads: leadsResult,
    properties: propertiesResult
  };
};

/**
 * Test export with real data structure
 * This function takes actual data and exports it to see what happens
 */
export const testExportWithRealData = async (realData, dataType = 'real_data') => {
  console.log('🧪 Testing export with real data structure...');
  console.log('📊 Real data sample:', realData[0]);
  console.log('📊 Real data keys:', realData[0] ? Object.keys(realData[0]) : 'No data');
  
  try {
    const { exportDataWithDynamicColumns } = await import('./excelExport');
    const result = await exportDataWithDynamicColumns(realData, `test_${dataType}_export`, dataType);
    
    console.log('🧪 Real data export result:', result);
    return result;
  } catch (error) {
    console.error('🧪 Real data export error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Test all export methods with different scenarios
 * This function tests various export scenarios to ensure everything works
 */
export const testAllExportScenarios = async () => {
  console.log('🧪 Running comprehensive export tests...');
  
  const testResults = {
    leads: null,
    properties: null,
    dynamic: null,
    errorHandling: null
  };
  
  try {
    // Test 1: Basic leads export
    console.log('🧪 Test 1: Basic leads export...');
    testResults.leads = await testExportLeads();
    
    // Test 2: Properties export
    console.log('🧪 Test 2: Properties export...');
    testResults.properties = await testExportProperties();
    
    // Test 3: Dynamic export with sample data
    console.log('🧪 Test 3: Dynamic export...');
    const sampleData = [
      {
        id: 1,
        name: 'Test Item 1',
        value: 100,
        date: '2024-01-15',
        status: 'ACTIVE',
        nested: { property: 'nested value' }
      },
      {
        id: 2,
        name: 'Test Item 2',
        value: 200,
        date: '2024-01-16',
        status: 'INACTIVE',
        nested: { property: 'another nested value' }
      }
    ];
    
    const { exportDataWithDynamicColumns } = await import('./excelExport');
    testResults.dynamic = await exportDataWithDynamicColumns(sampleData, 'test_dynamic_export', 'dynamic_test');
    
    // Test 4: Error handling
    console.log('🧪 Test 4: Error handling...');
    try {
      const { exportToExcelWithDownload } = await import('./excelExport');
      const errorResult = await exportToExcelWithDownload(null, [], 'error_test');
      testResults.errorHandling = errorResult;
    } catch (error) {
      testResults.errorHandling = { success: false, message: error.message };
    }
    
    console.log('🧪 All tests completed:', testResults);
    return testResults;
    
  } catch (error) {
    console.error('🧪 Test suite error:', error);
    return { 
      error: error.message,
      partialResults: testResults
    };
  }
};

/**
 * Test role-based exports
 * This function tests exports with different user roles
 */
export const testRoleBasedExports = async () => {
  console.log('🧪 Testing role-based exports...');
  
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
      assignedToSummary: { name: 'Agent Smith' },
      createdBy: { name: 'Admin User' },
      notes: 'Interested in luxury properties',
      followUpDate: '2024-01-20',
      priority: 'HIGH'
    }
  ];
  
  const sampleProperties = [
    {
      id: 1,
      propertyName: 'Luxury Apartment A',
      status: 'AVAILABLE_FOR_SALE',
      type: 'APARTMENT',
      price: 7500000,
      location: 'Mumbai',
      sector: 'South Mumbai',
      bhk: '3 BHK',
      unitDetails: 'Unit 501',
      floor: '5th Floor',
      ownerName: 'John Owner',
      ownerContact: '9876543210',
      source: 'Direct',
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: { name: 'Admin User' },
      size: '1200 sq ft',
      address: '123 Luxury Street, Mumbai'
    }
  ];
  
  const roles = ['DIRECTOR', 'ADMIN', 'USER'];
  const results = {};
  
  try {
    const { 
      exportLeadsWithRoleAndDownload, 
      exportPropertiesWithRoleAndDownload 
    } = await import('./excelExport');
    
    for (const role of roles) {
      console.log(`🧪 Testing ${role} role exports...`);
      
      const leadsResult = await exportLeadsWithRoleAndDownload(sampleLeads, role, `test_leads_${role.toLowerCase()}`);
      const propertiesResult = await exportPropertiesWithRoleAndDownload(sampleProperties, role, `test_properties_${role.toLowerCase()}`);
      
      results[role] = {
        leads: leadsResult,
        properties: propertiesResult
      };
    }
    
    console.log('🧪 Role-based tests completed:', results);
    return results;
    
  } catch (error) {
    console.error('🧪 Role-based test error:', error);
    return { error: error.message };
  }
};
