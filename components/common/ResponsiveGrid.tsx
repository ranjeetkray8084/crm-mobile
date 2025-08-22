import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  style?: ViewStyle;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  style,
}) => {
  const getGapStyle = (): ViewStyle => {
    const gapMap = {
      1: { gap: 4 },
      2: { gap: 8 },
      3: { gap: 12 },
      4: { gap: 16 },
      5: { gap: 20 },
      6: { gap: 24 },
      8: { gap: 32 },
    };
    
    return gapMap[gap as keyof typeof gapMap] || gapMap[4];
  };

  const getColumnStyle = (): ViewStyle => {
    // For mobile, we'll use a single column by default
    // You can extend this with responsive breakpoints if needed
    const defaultCols = cols.sm || 1;
    
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    };
  };

  const getChildStyle = (): ViewStyle => {
    const defaultCols = cols.sm || 1;
    const childWidth = (100 / defaultCols) - 2; // Account for gap
    
    return {
      width: `${childWidth}%`,
      marginBottom: gap,
    };
  };

  return (
    <View style={[styles.container, getGapStyle(), getColumnStyle(), style]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={getChildStyle()}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default ResponsiveGrid;
