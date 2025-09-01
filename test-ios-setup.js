#!/usr/bin/env node

/**
 * iOS Setup Test Script
 * This script verifies that iOS configuration is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing iOS Setup Configuration...\n');

// Check if ios folder exists
const iosFolderPath = path.join(__dirname, 'ios');
if (fs.existsSync(iosFolderPath)) {
  console.log('✅ iOS folder exists');
} else {
  console.log('❌ iOS folder missing');
  console.log('   Creating ios folder...');
  fs.mkdirSync(iosFolderPath);
  console.log('✅ iOS folder created');
}

// Check app.config.js
const appConfigPath = path.join(__dirname, 'app.config.js');
if (fs.existsSync(appConfigPath)) {
  const appConfig = fs.readFileSync(appConfigPath, 'utf8');
  
  // Check iOS configuration
  if (appConfig.includes('ios: {')) {
    console.log('✅ iOS configuration found in app.config.js');
  } else {
    console.log('❌ iOS configuration missing in app.config.js');
  }
  
  // Check bundle identifier
  if (appConfig.includes('bundleIdentifier: "com.ranjeet1620.crmnativeexpo"')) {
    console.log('✅ Bundle identifier configured');
  } else {
    console.log('❌ Bundle identifier not found');
  }
  
  // Check build number
  if (appConfig.includes('buildNumber: "2"')) {
    console.log('✅ Build number configured');
  } else {
    console.log('❌ Build number not found');
  }
} else {
  console.log('❌ app.config.js not found');
}

// Check eas.json
const easConfigPath = path.join(__dirname, 'eas.json');
if (fs.existsSync(easConfigPath)) {
  const easConfig = fs.readFileSync(easConfigPath, 'utf8');
  
  // Check iOS build profiles
  if (easConfig.includes('"ios":')) {
    console.log('✅ iOS build profiles configured in eas.json');
  } else {
    console.log('❌ iOS build profiles missing in eas.json');
  }
  
  // Check specific profiles
  const profiles = ['ios-preview', 'ios-production'];
  profiles.forEach(profile => {
    if (easConfig.includes(`"${profile}"`)) {
      console.log(`✅ ${profile} profile found`);
    } else {
      console.log(`❌ ${profile} profile missing`);
    }
  });
} else {
  console.log('❌ eas.json not found');
}

// Check package.json scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts) {
    const iosScripts = ['ios', 'build:ios', 'build:ios-preview'];
    iosScripts.forEach(script => {
      if (packageJson.scripts[script]) {
        console.log(`✅ ${script} script found`);
      } else {
        console.log(`❌ ${script} script missing`);
      }
    });
  }
} else {
  console.log('❌ package.json not found');
}

// Check assets
const assetsPath = path.join(__dirname, 'assets');
if (fs.existsSync(assetsPath)) {
  const requiredAssets = ['icon.png', 'splash-icon.png', 'adaptive-icon.png'];
  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsPath, asset);
    if (fs.existsSync(assetPath)) {
      console.log(`✅ ${asset} found`);
    } else {
      console.log(`❌ ${asset} missing`);
    }
  });
} else {
  console.log('❌ assets folder not found');
}

console.log('\n📋 iOS Setup Summary:');
console.log('=====================');
console.log('Bundle ID: com.ranjeet1620.crmnativeexpo');
console.log('App Name: LeadsTracker');
console.log('Version: 1.0.1');
console.log('Build Number: 2');
console.log('\n🚀 Ready to build iOS app!');
console.log('\nCommands:');
console.log('  npm run ios                    # Start iOS simulator');
console.log('  npm run build:ios-preview      # Build for testing');
console.log('  npm run build:ios              # Build for production');
console.log('  eas build --platform ios       # EAS cloud build');
