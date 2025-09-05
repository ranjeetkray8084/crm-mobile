# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Expo
-keep class expo.modules.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# WebView
-keep class com.reactnativecommunity.webview.** { *; }

# SVG
-keep class com.horcrux.svg.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Screens
-keep class com.swmansion.rnscreens.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Image Picker
-keep class expo.modules.imagepicker.** { *; }

# File System
-keep class expo.modules.filesystem.** { *; }

# Notifications
-keep class expo.modules.notifications.** { *; }

# Haptics
-keep class expo.modules.haptics.** { *; }

# Blur
-keep class expo.modules.blur.** { *; }

# Document Picker
-keep class expo.modules.documentpicker.** { *; }

# Sharing
-keep class expo.modules.sharing.** { *; }

# Web Browser
-keep class expo.modules.webbrowser.** { *; }

# System UI
-keep class expo.modules.systemui.** { *; }

# Constants
-keep class expo.modules.constants.** { *; }

# Device
-keep class expo.modules.device.** { *; }

# Font
-keep class expo.modules.font.** { *; }

# Image
-keep class expo.modules.image.** { *; }

# Linking
-keep class expo.modules.linking.** { *; }

# Network
-keep class expo.modules.network.** { *; }

# Splash Screen
-keep class expo.modules.splashscreen.** { *; }

# Status Bar
-keep class expo.modules.statusbar.** { *; }

# Symbols
-keep class expo.modules.symbols.** { *; }

# Add any project specific keep options here:
