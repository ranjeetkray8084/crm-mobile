@echo off
echo 🚀 CRM Native Expo App Runner
echo.

echo 📱 Available Commands:
echo 1. Install dependencies and setup
echo 2. Run on Android device
echo 3. Run on iOS device  
echo 4. Start development server
echo 5. Test multi-device setup
echo 6. Install device info dependency
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed
    echo.
    echo 🔧 Installing device info for multi-device support...
    npm run install-device-info
    echo ✅ Setup complete!
    pause
) else if "%choice%"=="2" (
    echo 📱 Running on Android device...
    echo Make sure your Android device is connected and USB debugging is enabled
    npx expo run:android --device
) else if "%choice%"=="3" (
    echo 🍎 Running on iOS device...
    echo Make sure your iOS device is connected and trusted
    npx expo run:ios --device
) else if "%choice%"=="4" (
    echo 🌐 Starting development server...
    npx expo start --clear
) else if "%choice%"=="5" (
    echo 🧪 Testing multi-device setup...
    npm run test-setup
    pause
) else if "%choice%"=="6" (
    echo 🔧 Installing device info dependency...
    npm run install-device-info
    pause
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
)

echo.
echo 📖 For more help, check BACKEND_INTEGRATION_UPDATE.md
pause