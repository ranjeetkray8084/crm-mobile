import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PropertiesFeedbackProps {
  loading: boolean;
  error: string | null;
  propertiesCount: number;
  isSearchActive: boolean;
}

const PropertiesFeedback: React.FC<PropertiesFeedbackProps> = ({
  loading,
  error,
  propertiesCount,
  isSearchActive
}) => {
  if (loading) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="refresh" size={20} color="#6b7280" />
        <Text style={styles.feedbackText}>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="alert-circle" size={20} color="#ef4444" />
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (propertiesCount === 0) {
    return (
      <View style={styles.feedbackContainer}>
        <Ionicons name="information-circle" size={20} color="#6b7280" />
        <Text style={styles.feedbackText}>
          {isSearchActive ? 'No properties found matching your search criteria' : 'No properties available'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.feedbackContainer}>
      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
      <Text style={styles.feedbackText}>
        {isSearchActive 
          ? `Found ${propertiesCount} property${propertiesCount === 1 ? '' : 'ies'} matching your search`
          : `Showing ${propertiesCount} propert${propertiesCount === 1 ? 'y' : 'ies'}`
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
});

export default PropertiesFeedback;
