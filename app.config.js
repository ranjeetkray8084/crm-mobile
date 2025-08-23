export default {
  expo: {
    name: "CRMNativeExpo",
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
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://192.168.1.26:8082',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development'
    }
  }
};
