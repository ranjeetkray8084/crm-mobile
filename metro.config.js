const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for more file extensions
config.resolver.assetExts.push('db', 'sqlite');

// Ensure proper module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable experimental features
config.resolver.unstable_enableRequireContext = true;

// Add path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

module.exports = config;
