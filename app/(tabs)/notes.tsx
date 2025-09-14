import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';
import NotesSection from '../../src/components/notes/NotesSection';
import { useAuth } from '../../src/shared/contexts/AuthContext';

export default function NotesScreen() {
  const { user } = useAuth();
  const role = user?.role || 'USER';

  // Role-based access control - DEVELOPER users should not see regular tabs
  if (role === 'DEVELOPER') {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="shield-outline" size={48} color="#8b5cf6" />
        <Text style={styles.errorTitle}>Developer Access</Text>
        <Text style={styles.errorMessage}>
          As a developer, you have access to company and user management through the sidebar menu.
        </Text>
      </View>
    );
  }

  return (
    <TabScreenWrapper>
      <View style={styles.container}>
        <NotesSection />
      </View>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b5cf6',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
