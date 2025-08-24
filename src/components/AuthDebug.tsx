import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../shared/contexts/AuthContext';
import { AuthService } from '../core/services/auth.service';

export default function AuthDebug() {
  const { user, isAuthenticated, loading } = useAuth();

  const checkStorage = async () => {
    try {
      const token = await AuthService.getToken();
      const storedUser = await AuthService.getCurrentUser();
      
      console.log('=== AUTH DEBUG ===');
      console.log('useAuth state:');
      console.log('- user:', user);
      console.log('- isAuthenticated:', isAuthenticated);
      console.log('- loading:', loading);
      console.log('Storage state:');
      console.log('- token:', token);
      console.log('- storedUser:', storedUser);
      console.log('==================');
    } catch (error) {
      console.error('Auth debug error:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AuthService.clearSession();
      console.log('Storage cleared');
    } catch (error) {
      console.error('Clear storage error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Debug</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Loading:</Text>
        <Text style={styles.value}>{loading ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Authenticated:</Text>
        <Text style={styles.value}>{isAuthenticated ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{user ? JSON.stringify(user, null, 2) : 'None'}</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={checkStorage}>
        <Text style={styles.buttonText}>Check Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={clearStorage}>
        <Text style={styles.buttonText}>Clear Storage</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1c69ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
