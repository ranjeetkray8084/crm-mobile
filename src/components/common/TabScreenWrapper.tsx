import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface TabScreenWrapperProps {
  children: React.ReactNode;
}

export default function TabScreenWrapper({ children }: TabScreenWrapperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {children || <Text>No content to display</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    // Remove justifyContent: 'center' as it might be centering the form and making it invisible
    alignItems: 'stretch',
  },
});
