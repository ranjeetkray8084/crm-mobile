@echo off
echo Building iOS App with FREE Apple Developer Account...
echo.
echo Note: This will create a development build that expires in 7 days
echo.

REM Check if EAS CLI is installed
where eas >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo EAS CLI not found. Installing...
    npm install -g @expo/eas-cli
)

REM Login to EAS (if not already logged in)
echo Checking EAS authentication...
eas whoami >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Please login to EAS:
    eas login
)

REM Build iOS app with development profile
echo.
echo Starting iOS development build...
echo This will create an .ipa file for testing (expires in 7 days)
echo.

eas build --platform ios --profile development --non-interactive

echo.
echo Build completed! Check the EAS dashboard for download link.
echo.
echo IMPORTANT NOTES:
echo - This .ipa file will expire in 7 days
echo - You can reinstall it after expiration
echo - For permanent installation, you need paid Apple Developer Account
echo - For App Store distribution, you need paid Apple Developer Account
pause
