import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  style?: ViewStyle;
  animate?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  title,
  subtitle,
  icon,
  style,
  animate = true,
  maxWidth = 'full',
}) => {
  const getMaxWidthStyle = (): ViewStyle => {
    const maxWidthMap = {
      sm: { maxWidth: 384 },
      md: { maxWidth: 448 },
      lg: { maxWidth: 512 },
      xl: { maxWidth: 576 },
      '2xl': { maxWidth: 672 },
      '3xl': { maxWidth: 768 },
      '4xl': { maxWidth: 896 },
      '5xl': { maxWidth: 1024 },
      '6xl': { maxWidth: 1152 },
      '7xl': { maxWidth: 1280 },
      full: { maxWidth: '100%' },
    };
    
    return maxWidthMap[maxWidth] || maxWidthMap.full;
  };

  return (
    <View style={[styles.container, getMaxWidthStyle(), style]}>
      {/* Header */}
      {(title || subtitle || icon) && (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {icon && (
              <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={24} color="#6b7280" />
              </View>
            )}
            <View style={styles.headerText}>
              {title && (
                <Text style={styles.title}>{title}</Text>
              )}
              {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  content: {
    padding: 16,
  },
});

export default ResponsiveContainer;
