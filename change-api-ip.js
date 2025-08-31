#!/usr/bin/env node

/**
 * Utility script to change API IP address in CRMNativeExpo
 * Usage: node change-api-ip.js [new-ip-address]
 */

const fs = require('fs');
const path = require('path');

// Function to update IP in app.config.js
function updateAppConfigIp(newIp) {
  const configPath = path.join(__dirname, 'app.config.js');
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Update the IP address in app.config.js
    const regex = /(apiBaseUrl:\s*process\.env\.API_BASE_URL\s*\|\|\s*'http:\/\/)([^']+)(:8082')/;
    
    if (regex.test(content)) {
      content = content.replace(regex, `$1${newIp}$3`);
      fs.writeFileSync(configPath, content, 'utf8');
      console.log(`✅ Updated app.config.js with IP: ${newIp}`);
      return true;
    } else {
      console.log('⚠️ Could not find apiBaseUrl in app.config.js');
      return false;
    }
  } catch (error) {
    console.error('❌ Error updating app.config.js:', error.message);
    return false;
  }
}

// Function to update IP in api.config.js
function updateApiConfigIp(newIp) {
  const configPath = path.join(__dirname, 'src', 'core', 'config', 'api.config.js');
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Update the IP address in api.config.js
    const regex = /(baseURL:\s*'http:\/\/)([^']+)(:8082')/;
    
    if (regex.test(content)) {
      content = content.replace(regex, `$1${newIp}$3`);
      fs.writeFileSync(configPath, content, 'utf8');
      console.log(`✅ Updated api.config.js with IP: ${newIp}`);
      return true;
    } else {
      console.log('⚠️ Could not find baseURL in api.config.js');
      return false;
    }
  } catch (error) {
    console.error('❌ Error updating api.config.js:', error.message);
    return false;
  }
}

// Function to get current IP from config
function getCurrentIp() {
  const configPath = path.join(__dirname, 'app.config.js');
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const regex = /(apiBaseUrl:\s*process\.env\.API_BASE_URL\s*\|\|\s*'http:\/\/)([^']+)(:8082')/;
    const match = content.match(regex);
    
    if (match) {
      return match[2];
    }
  } catch (error) {
    console.error('❌ Error reading current IP:', error.message);
  }
  
  return null;
}

// Function to validate IP format
function validateIp(ip) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    return false;
  }
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

// Function to find your computer's IP address
function findLocalIp() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`🌐 Found local IP: ${net.address}`);
        return net.address;
      }
    }
  }
  
  return null;
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔧 CRMNativeExpo API IP Changer');
    console.log('');
    console.log('Current IP:', getCurrentIp() || 'Not set');
    console.log('');
    console.log('Usage:');
    console.log('  node change-api-ip.js [new-ip-address]');
    console.log('  node change-api-ip.js auto    # Auto-detect local IP');
    console.log('');
    console.log('Examples:');
    console.log('  node change-api-ip.js backend.leadstracker.in');
    console.log('  node change-api-ip.js 10.0.0.50');
    console.log('  node change-api-ip.js auto');
    console.log('');
    return;
  }
  
  let newIp = args[0];
  
  if (newIp === 'auto') {
    newIp = findLocalIp();
    if (!newIp) {
      console.log('❌ Could not auto-detect local IP address');
      console.log('Please provide IP address manually');
      return;
    }
  }
  
  if (!validateIp(newIp)) {
    console.log('❌ Invalid IP address format. Please use format: backend.leadstracker.in');
    return;
  }
  
  console.log(`🔄 Updating API IP to: ${newIp}`);
  
  const appConfigUpdated = updateAppConfigIp(newIp);
  const apiConfigUpdated = updateApiConfigIp(newIp);
  
  if (appConfigUpdated || apiConfigUpdated) {
    console.log('');
    console.log('✅ API IP updated successfully!');
    console.log(`🌐 New API URL: http://${newIp}:8082`);
    console.log('');
    console.log('💡 Remember to:');
    console.log('  1. Restart your Expo development server');
    console.log('  2. Make sure your backend is running on port 8082');
    console.log('  3. Check that your phone and computer are on the same network');
  } else {
    console.log('❌ Failed to update API IP');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  updateAppConfigIp,
  updateApiConfigIp,
  getCurrentIp,
  validateIp,
  findLocalIp
};
