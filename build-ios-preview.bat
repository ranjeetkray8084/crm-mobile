@echo off
echo Building iOS App for Preview/Testing...
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

REM Build iOS app for preview
echo.
echo Starting iOS preview build...
echo This will create an .ipa file for internal testing
echo.

eas build --platform ios --profile preview --non-interactive

echo.
echo Preview build completed! Check the EAS dashboard for download link.
echo The .ipa file can be installed on iOS devices for testing.
pause
