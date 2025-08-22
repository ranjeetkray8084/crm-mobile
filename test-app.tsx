import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEADS TRACKER</Text>
      <Text style={styles.subtitle}>Test App Running</Text>
      <Text style={styles.message}>If you can see this, the app is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4785FF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
});
