#!/bin/bash

echo "🍎 Mac iOS Development Setup Script"
echo "=================================="
echo

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is for macOS only!"
    exit 1
fi

echo "📋 Installing essential software for iOS development..."
echo

# 1. Install Homebrew (if not installed)
if ! command -v brew &> /dev/null; then
    echo "🍺 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew already installed"
fi

# 2. Install Command Line Tools
echo "🔧 Installing Xcode Command Line Tools..."
xcode-select --install

# 3. Install Node.js
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    brew install node
else
    echo "✅ Node.js already installed"
fi

# 4. Install EAS CLI
echo "🚀 Installing EAS CLI..."
if ! command -v eas &> /dev/null; then
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI already installed"
fi

# 5. Install Git (if not installed)
echo "📝 Installing Git..."
if ! command -v git &> /dev/null; then
    brew install git
else
    echo "✅ Git already installed"
fi

echo
echo "🎉 Setup completed!"
echo
echo "📋 Next steps:"
echo "1. Install Xcode from Mac App Store (15-20 GB)"
echo "2. Open Xcode and accept license agreements"
echo "3. Run: eas login"
echo "4. Run: ./build-ios.sh"
echo
echo "💡 Note: Xcode installation may take 1-2 hours depending on internet speed"
