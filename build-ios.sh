#!/bin/bash

echo "Building iOS App for Production..."
echo

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Login to EAS (if not already logged in)
echo "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please login to EAS:"
    eas login
fi

# Build iOS app
echo
echo "Starting iOS build..."
echo "This will create an .ipa file that can be installed on iOS devices"
echo

eas build --platform ios --profile production --non-interactive

echo
echo "Build completed! Check the EAS dashboard for download link."
echo "The .ipa file can be installed on iOS devices via TestFlight or direct installation."
