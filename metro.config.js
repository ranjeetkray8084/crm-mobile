const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom asset extensions
config.resolver.assetExts.push('bin', 'txt', 'db', 'sqlite');

// Disable package exports to avoid resolution issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
