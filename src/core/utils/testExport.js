/**
 * Test file for Excel Export functionality
 * This file can be used to test the export functions with sample data
 */

import { exportLeads, exportProperties, exportToExcel } from './excelExport';

// Sample leads data for testing
export const sampleLeads = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+91-9876543210',
    status: 'NEW',
    budget: 5000000,
    requirement: '2 BHK Apartment',
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
    phone: '+91-9876543211',
    status: 'CONTACTED',
    budget: 8000000,
    requirement: '3 BHK Villa',
    location: 'Delhi',
    source: 'Referral',
    createdAt: '2024-01-14T15:45:00Z',
    assignedToSummary: {
      name: 'Agent Johnson'
    }
  }
];

// Sample properties data for testing
export const sampleProperties = [
  {
    id: 1,
    propertyName: 'Sunset Apartments',
    status: 'AVAILABLE_FOR_SALE',
    type: 'Apartment',
    price: 7500000,
    location: 'Mumbai',
    sector: 'Andheri West',
    bhk: '2 BHK',
    unitDetails: 'Unit 15A',
    floor: '15th Floor',
    ownerContact: '+91-9876543210',
    source: 'Direct',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 2,
    propertyName: 'Green Valley Villa',
    status: 'AVAILABLE_FOR_RENT',
    type: 'Villa',
    price: 45000,
    location: 'Pune',
    sector: 'Koregaon Park',
    bhk: '3 BHK',
    unitDetails: 'Villa 7',
    floor: 'Ground + 1',
    ownerContact: '+91-9876543211',
    source: 'Broker',
    createdAt: '2024-01-08T14:20:00Z'
  }
];

// Test function for leads export
export const testLeadsExport = async () => {
  console.log('Testing leads export...');
  try {
    const result = await exportLeads(sampleLeads);
    console.log('Leads export result:', result);
    return result;
  } catch (error) {
    console.error('Leads export error:', error);
    return { success: false, message: error.message };
  }
};

// Test function for properties export
export const testPropertiesExport = async () => {
  console.log('Testing properties export...');
  try {
    const result = await exportProperties(sampleProperties);
    console.log('Properties export result:', result);
    return result;
  } catch (error) {
    console.error('Properties export error:', error);
    return { success: false, message: error.message };
  }
};

// Test function for custom export
export const testCustomExport = async () => {
  console.log('Testing custom export...');
  
  const customColumns = [
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email Address' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'createdAt', header: 'Registration Date' }
  ];
  
  const customData = [
    {
      name: 'Test User 1',
      email: 'user1@test.com',
      phone: '+91-1111111111',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      name: 'Test User 2',
      email: 'user2@test.com',
      phone: '+91-2222222222',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];
  
  try {
    const result = await exportToExcel(customData, customColumns, 'custom_test');
    console.log('Custom export result:', result);
    return result;
  } catch (error) {
    console.error('Custom export error:', error);
    return { success: false, message: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('=== Starting Export Tests ===');
  
  const results = {
    leads: await testLeadsExport(),
    properties: await testPropertiesExport(),
    custom: await testCustomExport()
  };
  
  console.log('=== Test Results ===');
  console.log('Leads:', results.leads.success ? '✅ PASS' : '❌ FAIL');
  console.log('Properties:', results.properties.success ? '✅ PASS' : '❌ FAIL');
  console.log('Custom:', results.custom.success ? '✅ PASS' : '❌ FAIL');
  
  return results;
};

// Export test functions for use in components
export default {
  testLeadsExport,
  testPropertiesExport,
  testCustomExport,
  runAllTests,
  sampleLeads,
  sampleProperties
};
