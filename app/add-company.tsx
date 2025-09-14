import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddCompanyForm from '../src/components/forms/AddCompanyForm';
import { useAuth } from '../src/shared/contexts/AuthContext';

export default function AddCompanyScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Check if user is DEVELOPER role
  if (!user || user.role !== 'DEVELOPER') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedText}>Only Developer can access this screen.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSuccess = () => {
    // Navigate back to dashboard or companies list
    router.back();
  };

  const handleCancel = () => {
    // Navigate back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddCompanyForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
