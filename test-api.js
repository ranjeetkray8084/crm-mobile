// Test script to verify API endpoints
const axios = require('axios');

const API_BASE_URL = 'https://backend.leadstracker.in';

// Test data
const testCompanyId = 1; // Replace with actual company ID
const testLeadId = 1; // Replace with actual lead ID
const testUserId = 1; // Replace with actual user ID

// Test adding remark
async function testAddRemark() {
  try {
    console.log('Testing add remark...');
    const response = await axios.post(`${API_BASE_URL}/api/companies/${testCompanyId}/leads/${testLeadId}/remarks`, {
      remark: 'Test remark from mobile app',
      userId: testUserId
    });
    console.log('✅ Remark added successfully:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to add remark:', error.response?.data || error.message);
    return false;
  }
}

// Test adding follow-up
async function testAddFollowUp() {
  try {
    console.log('Testing add follow-up...');
    const response = await axios.post(`${API_BASE_URL}/api/${testCompanyId}/followups`, {
      note: 'Test follow-up from mobile app',
      followUpDate: new Date().toISOString(),
      leadId: testLeadId,
      userId: testUserId
    });
    console.log('✅ Follow-up added successfully:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to add follow-up:', error.response?.data || error.message);
    return false;
  }
}

// Test getting remarks
async function testGetRemarks() {
  try {
    console.log('Testing get remarks...');
    const response = await axios.get(`${API_BASE_URL}/api/companies/${testCompanyId}/leads/${testLeadId}/remarks`);
    console.log('✅ Remarks retrieved successfully:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to get remarks:', error.response?.data || error.message);
    return false;
  }
}

// Test getting follow-ups
async function testGetFollowUps() {
  try {
    console.log('Testing get follow-ups...');
    const response = await axios.get(`${API_BASE_URL}/api/${testCompanyId}/followups/lead/${testLeadId}`);
    console.log('✅ Follow-ups retrieved successfully:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Failed to get follow-ups:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  const results = {
    addRemark: await testAddRemark(),
    addFollowUp: await testAddFollowUp(),
    getRemarks: await testGetRemarks(),
    getFollowUps: await testGetFollowUps()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Add Remark:', results.addRemark ? '✅ PASS' : '❌ FAIL');
  console.log('Add Follow-up:', results.addFollowUp ? '✅ PASS' : '❌ FAIL');
  console.log('Get Remarks:', results.getRemarks ? '✅ PASS' : '❌ FAIL');
  console.log('Get Follow-ups:', results.getFollowUps ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed!'}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAddRemark, testAddFollowUp, testGetRemarks, testGetFollowUps };
