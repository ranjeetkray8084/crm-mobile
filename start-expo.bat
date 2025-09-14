@echo off
set PATH=%PATH%;D:\nodejs\node-v20.19.4-win-x64
echo Starting Expo with cleared cache...
npx expo start --clear --reset-cache
pause