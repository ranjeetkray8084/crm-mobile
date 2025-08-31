#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Production APK Build Process...\n');

async function buildProduction() {
  try {
    // Step 1: Check prerequisites
    console.log('📋 Step 1: Checking prerequisites...');
    
    // Check if EAS CLI is installed
    try {
      execSync('eas --version', { stdio: 'pipe' });
      console.log('✅ EAS CLI is installed');
    } catch (error) {
      console.log('❌ EAS CLI not found. Installing...');
      execSync('npm install -g @expo/eas-cli', { stdio: 'inherit' });
    }

    // Check if logged in
    try {
      execSync('eas whoami', { stdio: 'pipe' });
      console.log('✅ Logged into Expo');
    } catch (error) {
      console.log('❌ Not logged in. Please login first:');
      console.log('   eas login');
      return;
    }

    // Step 2: Prepare app
    console.log('\n📱 Step 2: Preparing app...');
    
    // Clear cache
    console.log('🧹 Clearing cache...');
    execSync('npm run clear-cache', { stdio: 'inherit' });
    
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Step 3: Start production build
    console.log('\n🏗️ Step 3: Starting production build...');
    console.log('📱 Building production APK...');
    console.log('⏱️ This may take 10-20 minutes...\n');
    
    execSync('npm run build:android', { stdio: 'inherit' });
    
    console.log('\n🎉 Production build completed successfully!');
    console.log('📱 Your APK is ready for distribution');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Ensure you have EAS credits');
    console.log('3. Try: npm run clear-cache');
    console.log('4. Check EAS status: https://status.expo.dev/');
    console.log('5. Contact EAS support if persistent');
  }
}

// Run the build process
buildProduction();
