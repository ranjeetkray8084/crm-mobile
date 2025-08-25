import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for different device sizes
const breakpoints = {
  small: 375,    // Small phones
  medium: 414,   // Medium phones
  large: 768,    // Tablets
  xlarge: 1024,  // Large tablets
};

export type DeviceSize = 'small' | 'medium' | 'large' | 'xlarge';

export const useResponsive = () => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('large');

  useEffect(() => {
    const getDeviceSize = (): DeviceSize => {
      if (screenWidth <= breakpoints.small) return 'small';
      if (screenWidth <= breakpoints.medium) return 'medium';
      if (screenWidth <= breakpoints.large) return 'large';
      return 'xlarge';
    };

    setDeviceSize(getDeviceSize());

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newSize = getDeviceSize();
      setDeviceSize(newSize);
    });

    return () => subscription?.remove();
  }, []);

  // Responsive spacing values
  const spacing = {
    // Header padding
    headerPadding: {
      small: { paddingTop: 16, paddingBottom: 12, paddingHorizontal: 16 },
      medium: { paddingTop: 18, paddingBottom: 14, paddingHorizontal: 18 },
      large: { paddingTop: 20, paddingBottom: 16, paddingHorizontal: 20 },
      xlarge: { paddingTop: 24, paddingBottom: 18, paddingHorizontal: 24 },
    },
    
    // Content padding
    contentPadding: {
      small: { padding: 16 },
      medium: { padding: 18 },
      large: { padding: 20 },
      xlarge: { padding: 24 },
    },
    
    // Margin values
    margins: {
      small: { marginHorizontal: 12, marginVertical: 8 },
      medium: { marginHorizontal: 16, marginVertical: 10 },
      large: { marginHorizontal: 20, marginVertical: 12 },
      xlarge: { marginHorizontal: 24, marginVertical: 16 },
    },
    
    // Gap values
    gaps: {
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 20,
    },
    
    // Border radius
    borderRadius: {
      small: 6,
      medium: 8,
      large: 10,
      xlarge: 12,
    },
  };

  // Get responsive values for current device
  const getResponsiveValue = (property: keyof typeof spacing) => {
    return spacing[property][deviceSize];
  };

  // Get responsive header styles
  const getResponsiveHeaderStyles = () => {
    const headerSpacing = spacing.headerPadding[deviceSize];
    
    return {
      backgroundColor: "#fff",
      ...headerSpacing,
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      zIndex: 10,
    };
  };

  // Get responsive content styles
  const getResponsiveContentStyles = () => {
    const contentSpacing = spacing.contentPadding[deviceSize];
    
    return {
      ...contentSpacing,
      gap: spacing.gaps[deviceSize],
    };
  };

  // Get responsive button styles
  const getResponsiveButtonStyles = () => {
    return {
      padding: deviceSize === 'small' ? 10 : deviceSize === 'medium' ? 11 : 12,
      borderRadius: spacing.borderRadius[deviceSize],
      backgroundColor: "#f8fafc",
    };
  };

  // Get responsive icon sizes
  const getResponsiveIconSize = () => {
    switch (deviceSize) {
      case 'small': return 20;
      case 'medium': return 22;
      case 'large': return 24;
      case 'xlarge': return 26;
      default: return 24;
    }
  };

  // Get responsive font sizes
  const getResponsiveFontSize = (baseSize: number) => {
    switch (deviceSize) {
      case 'small': return baseSize - 2;
      case 'medium': return baseSize - 1;
      case 'large': return baseSize;
      case 'xlarge': return baseSize + 1;
      default: return baseSize;
    }
  };

  // Check if device is small
  const isSmallDevice = deviceSize === 'small';
  
  // Check if device is tablet or larger
  const isTablet = deviceSize === 'large' || deviceSize === 'xlarge';
  
  // Check if device is phone
  const isPhone = deviceSize === 'small' || deviceSize === 'medium';

  return {
    deviceSize,
    screenWidth,
    screenHeight,
    spacing,
    getResponsiveValue,
    getResponsiveHeaderStyles,
    getResponsiveContentStyles,
    getResponsiveButtonStyles,
    getResponsiveIconSize,
    getResponsiveFontSize,
    isSmallDevice,
    isTablet,
    isPhone,
  };
};

export default useResponsive;
