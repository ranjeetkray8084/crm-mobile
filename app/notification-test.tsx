import React from 'react';
import { View, StyleSheet } from 'react-native';
import NotificationTest from '../src/components/common/NotificationTest';

export default function NotificationTestPage() {
  return (
    <View style={styles.container}>
      <NotificationTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
