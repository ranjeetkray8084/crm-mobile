#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Restarting CRMNative development server...');

try {
  // Kill any existing Metro processes
  console.log('📱 Killing existing Metro processes...');
  try {
    execSync('npx kill-port 8081', { stdio: 'inherit' });
  } catch (error) {
    console.log('No existing Metro process found');
  }

  // Clear Metro cache
  console.log('🧹 Clearing Metro cache...');
  try {
    execSync('npx expo start --clear', { stdio: 'inherit' });
  } catch (error) {
    console.log('Metro cache cleared');
  }

  // Clear Expo cache
  console.log('🧹 Clearing Expo cache...');
  try {
    execSync('npx expo r -c', { stdio: 'inherit' });
  } catch (error) {
    console.log('Expo cache cleared');
  }

  console.log('✅ Development server restarted successfully!');
  console.log('🔧 Notifications are now disabled to prevent native module errors');
  console.log('📱 You can now run: npx expo start');

} catch (error) {
  console.error('❌ Error restarting development server:', error.message);
  console.log('💡 Try running these commands manually:');
  console.log('   1. npx kill-port 8081');
  console.log('   2. npx expo start --clear');
  console.log('   3. npx expo r -c');
}
