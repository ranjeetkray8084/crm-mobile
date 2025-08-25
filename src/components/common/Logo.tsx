import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', style }) => {
  const { width: screenWidth } = Dimensions.get('window');
  
  const getSize = () => {
    // Responsive sizing based on screen width
    const isSmallScreen = screenWidth <= 375;
    const isMediumScreen = screenWidth <= 414;
    const isLargeScreen = screenWidth <= 768;
    
    switch (size) {
      case 'small':
        return { 
          width: isSmallScreen ? 60 : isMediumScreen ? 70 : isLargeScreen ? 80 : 80, 
          height: isSmallScreen ? 30 : isMediumScreen ? 35 : isLargeScreen ? 40 : 40 
        };
      case 'large':
        return { 
          width: isSmallScreen ? 120 : isMediumScreen ? 140 : isLargeScreen ? 160 : 160, 
          height: isSmallScreen ? 60 : isMediumScreen ? 70 : isLargeScreen ? 80 : 80 
        };
      default:
        return { 
          width: isSmallScreen ? 90 : isMediumScreen ? 105 : isLargeScreen ? 120 : 120, 
          height: isSmallScreen ? 45 : isMediumScreen ? 52 : isLargeScreen ? 60 : 60 
        };
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../../assets/images/crm-logo.png')} 
        style={[styles.logo, getSize()]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Size will be set dynamically
  },
});

export default Logo;
