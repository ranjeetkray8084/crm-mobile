import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for different device sizes
const breakpoints = {
  small: 375,    // Small phones
  medium: 414,   // Medium phones
  large: 768,    // Tablets
  xlarge: 1024,  // Large tablets
};

// Get current device size category
const getDeviceSize = () => {
  if (screenWidth <= breakpoints.small) return 'small';
  if (screenWidth <= breakpoints.medium) return 'medium';
  if (screenWidth <= breakpoints.large) return 'large';
  return 'xlarge';
};

// Responsive spacing values
export const responsiveSpacing = {
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
export const getResponsiveValue = (property) => {
  const deviceSize = getDeviceSize();
  return responsiveSpacing[property][deviceSize];
};

// Get responsive header styles
export const getResponsiveHeaderStyles = () => {
  const deviceSize = getDeviceSize();
  const spacing = responsiveSpacing.headerPadding[deviceSize];
  
  return {
    backgroundColor: "#fff",
    ...spacing,
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
export const getResponsiveContentStyles = () => {
  const deviceSize = getDeviceSize();
  const spacing = responsiveSpacing.contentPadding[deviceSize];
  
  return {
    ...spacing,
    gap: responsiveSpacing.gaps[deviceSize],
  };
};

// Get responsive button styles
export const getResponsiveButtonStyles = () => {
  const deviceSize = getDeviceSize();
  
  return {
    padding: deviceSize === 'small' ? 10 : deviceSize === 'medium' ? 11 : 12,
    borderRadius: responsiveSpacing.borderRadius[deviceSize],
    backgroundColor: "#f8fafc",
  };
};

// Get responsive icon sizes
export const getResponsiveIconSize = () => {
  const deviceSize = getDeviceSize();
  
  switch (deviceSize) {
    case 'small': return 20;
    case 'medium': return 22;
    case 'large': return 24;
    case 'xlarge': return 26;
    default: return 24;
  }
};

// Get responsive font sizes
export const getResponsiveFontSize = (baseSize) => {
  const deviceSize = getDeviceSize();
  
  switch (deviceSize) {
    case 'small': return baseSize - 2;
    case 'medium': return baseSize - 1;
    case 'large': return baseSize;
    case 'xlarge': return baseSize + 1;
    default: return baseSize;
  }
};

export default {
  getDeviceSize,
  getResponsiveValue,
  getResponsiveHeaderStyles,
  getResponsiveContentStyles,
  getResponsiveButtonStyles,
  getResponsiveIconSize,
  getResponsiveFontSize,
};
