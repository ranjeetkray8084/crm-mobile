@echo off
echo Building iOS App for Production...
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

REM Build iOS app
echo.
echo Starting iOS build...
echo This will create an .ipa file that can be installed on iOS devices
echo.

eas build --platform ios --profile production --non-interactive

echo.
echo Build completed! Check the EAS dashboard for download link.
echo The .ipa file can be installed on iOS devices via TestFlight or direct installation.
pause
