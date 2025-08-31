#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to avoid TypeScript loading issues
process.env.NODE_OPTIONS = '--loader ts-node/esm --experimental-specifier-resolution=node';

// Start Expo with the correct options
const expoProcess = spawn('npx', ['expo', 'start', '--clear'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--loader ts-node/esm --experimental-specifier-resolution=node'
  }
});

expoProcess.on('error', (error) => {
  console.error('Failed to start Expo:', error);
  process.exit(1);
});

expoProcess.on('exit', (code) => {
  process.exit(code);
});
