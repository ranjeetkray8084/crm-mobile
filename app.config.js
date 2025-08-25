export default {
  expo: {
    name: "LeadsTracker",
    slug: "crmnativeexpo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
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
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.ranjeet1620.crmnativeexpo",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://192.168.1.26:8082',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development',
      eas: {
        projectId: "e54487e4-0b6f-4429-8b02-f1c84f6b0bba"
      }
    }
  }
};
