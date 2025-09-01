import React from 'react';
import { View, StyleSheet } from 'react-native';
import PushNotificationTest from '../src/components/common/PushNotificationTest';

export default function PushTestPage() {
  return (
    <View style={styles.container}>
      <PushNotificationTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
