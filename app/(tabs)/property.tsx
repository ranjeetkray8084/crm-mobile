// app/(tabs)/property.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropertiesSection from "../../src/components/property/PropertiesSection";
import TabScreenWrapper from "../../src/components/common/TabScreenWrapper";

export default function PropertyScreen() {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userRole: '',
    companyId: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('crm_user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserInfo({
            userId: user.userId?.toString() || user.id?.toString() || '',
            userRole: user.role || '',
            companyId: user.companyId?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c69ff" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  if (!userInfo.companyId) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorTitle}>Authentication Required</Text>
        <Text style={styles.errorMessage}>
          Please log in to access property management.
        </Text>
      </View>
    );
  }

  return (
    <TabScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Property Management</Text>
        <Text style={styles.headerSubtitle}>Manage and track your properties</Text>
      </View>
      <PropertiesSection
        userRole={userInfo.userRole}
        userId={userInfo.userId}
        companyId={userInfo.companyId}
      />
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
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
    color: '#991b1b',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
});
