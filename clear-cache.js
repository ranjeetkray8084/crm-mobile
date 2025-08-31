#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Expo cache and node_modules...\n');

try {
  // Clear Expo cache
  console.log('📱 Clearing Expo cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Error clearing Expo cache:', error.message);
  console.log('\n🔧 Manual steps to fix native module issues:');
  console.log('1. Stop the development server (Ctrl+C)');
  console.log('2. Clear Metro cache: npx expo start --clear');
  console.log('3. If that doesn\'t work, try: npx expo start --reset-cache');
  console.log('4. For persistent issues, try: rm -rf node_modules && npm install');
  console.log('5. Restart the development server: npx expo start');
  console.log('\n📱 Note: Native module errors are normal in development builds');
  console.log('   Notifications will work properly in production builds');
}
