import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function IndexScreen() {
  const goToLogin = () => {
    router.push('/auth/login-simple');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>📊</Text>
        <Text style={styles.title}>LEADS TRACKER</Text>
        <Text style={styles.subtitle}>Track Leads, Close Faster</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Leads Tracker</Text>
        <Text style={styles.descriptionText}>
          Your complete solution for managing leads and closing deals faster
        </Text>

        <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
          <Text style={styles.loginButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1c69ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
