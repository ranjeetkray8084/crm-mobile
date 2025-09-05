export default {
  expo: {
    name: "LeadsTracker",
    slug: "crmnativeexpo",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "leadstracker",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ranjeet1620.crmnativeexpo",
      buildNumber: "2",
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            "backend.leadstracker.in": {
              NSExceptionAllowsInsecureHTTPLoads: false,
              NSExceptionMinimumTLSVersion: "1.2",
              NSExceptionRequiresForwardSecrecy: true,
              NSIncludesSubdomains: true
            },
            "backend.leadstracker.in": {
              NSExceptionAllowsInsecureHTTPLoads: false,
              NSExceptionMinimumTLSVersion: "1.2",
              NSExceptionRequiresForwardSecrecy: true,
              NSIncludesSubdomains: true
            }
          }
        },
        UIBackgroundModes: ["background-fetch"],
        NSUserNotificationAlertStyle: "alert",
        NSUserNotificationUsageDescription: "This app uses notifications to keep you updated about leads, tasks, and important announcements.",
        CFBundleURLTypes: [
          {
            CFBundleURLName: "leadstracker",
            CFBundleURLSchemes: ["leadstracker"]
          }
        ],
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.ranjeet1620.crmnativeexpo",
      versionCode: 2,
      googleServicesFile: "./android/app/google-services.json",
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.RECEIVE_NOTIFICATIONS",
        "android.permission.SCHEDULE_EXACT_ALARM"
      ],
      useNextNotificationsApi: true,
      allowBackup: true,
      allowClearUserData: true,

      compileSdkVersion: 34,
      targetSdkVersion: 34,
      minSdkVersion: 24,
      buildToolsVersion: "34.0.0"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://backend.leadstracker.in',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development',
      eas: {
        projectId: "e54487e4-0b6f-4429-8b02-f1c84f6b0bba"
      },

    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ffffff",
          "mode": "production",
          "androidMode": "default",
          "androidCollapsedTitle": "New Notification",
          "androidChannelId": "default",
          "androidChannelName": "Default",
          "androidChannelDescription": "Default notification channel for leads, tasks, and announcements",
          "androidChannelImportance": "max",
          "androidShowBadge": true,
          "androidVibrate": true,
          "androidSound": true,
          "androidColor": "#FF231F7C",
          "androidSticky": false,
          "androidPriority": "max",
          "iosDisplayInForeground": true,
          "iosSound": "default",
          "iosBadge": true,
          "iosCritical": false
        }
      ]
    ]
  }
};
