// app/(tabs)/add.tsx - Central Add Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/shared/contexts/AuthContext';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';
import AddLeadForm from '../../src/components/forms/AddLeadForm';
import AddPropertyForm from '../../src/components/forms/AddPropertyForm';
import AddNoteForm from '../../src/components/forms/AddNoteForm';
import AddTaskForm from '../../src/components/forms/AddTaskForm';
import AddUserForm from '../../src/components/forms/AddUserForm';

interface AddOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

export default function AddScreen() {
  const router = useRouter();
  const { action } = useLocalSearchParams();
  const { user } = useAuth();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    if (action && typeof action === 'string') {
      setSelectedAction(action);
    }
  }, [action]);

  const getAddOptions = (): AddOption[] => {
    const userRole = user?.role?.toUpperCase() || 'USER';
    
    switch (userRole) {
      case 'ADMIN':
        return [
          { 
            id: 'User', 
            label: 'User', 
            icon: 'person-add', 
            color: '#1c69ff',
            description: 'Create new user accounts and manage permissions'
          },
          { 
            id: 'Lead', 
            label: 'Lead', 
            icon: 'people', 
            color: '#10b981',
            description: 'Add new leads and potential customers'
          },
          { 
            id: 'Properties', 
            label: 'Properties', 
            icon: 'business', 
            color: '#f59e0b',
            description: 'Create new property listings'
          },
          { 
            id: 'Notes', 
            label: 'Notes/Event', 
            icon: 'document-text', 
            color: '#8b5cf6',
            description: 'Add notes, events, and important information'
          },
          { 
            id: 'Task', 
            label: 'Calling Data', 
            icon: 'call', 
            color: '#ef4444',
            description: 'Create new tasks and calling records'
          },
        ];
      case 'USER':
        return [
          { 
            id: 'Lead', 
            label: 'Lead', 
            icon: 'people', 
            color: '#10b981',
            description: 'Add new leads and potential customers'
          },
          { 
            id: 'Properties', 
            label: 'Properties', 
            icon: 'business', 
            color: '#f59e0b',
            description: 'Create new property listings'
          },
          { 
            id: 'Notes', 
            label: 'Notes/Event', 
            icon: 'document-text', 
            color: '#8b5cf6',
            description: 'Add notes, events, and important information'
          },
        ];
      case 'DIRECTOR':
        return [
          { 
            id: 'User', 
            label: 'User/Admin', 
            icon: 'person-add', 
            color: '#1c69ff',
            description: 'Create new user accounts and manage permissions'
          },
          { 
            id: 'Lead', 
            label: 'Lead', 
            icon: 'people', 
            color: '#10b981',
            description: 'Add new leads and potential customers'
          },
          { 
            id: 'Properties', 
            label: 'Properties', 
            icon: 'business', 
            color: '#f59e0b',
            description: 'Create new property listings'
          },
          { 
            id: 'Notes', 
            label: 'Notes/Event', 
            icon: 'document-text', 
            color: '#8b5cf6',
            description: 'Add notes, events, and important information'
          },
          { 
            id: 'Task', 
            label: 'Calling Data', 
            icon: 'call', 
            color: '#ef4444',
            description: 'Create new tasks and calling records'
          },
        ];
      default:
        return [
          { 
            id: 'Lead', 
            label: 'Lead', 
            icon: 'people', 
            color: '#10b981',
            description: 'Add new leads and potential customers'
          },
          { 
            id: 'Properties', 
            label: 'Properties', 
            icon: 'business', 
            color: '#f59e0b',
            description: 'Create new property listings'
          },
          { 
            id: 'Notes', 
            label: 'Notes/Event', 
            icon: 'document-text', 
            color: '#8b5cf6',
            description: 'Add notes, events, and important information'
          },
        ];
    }
  };

  const handleActionPress = (actionId: string) => {
    setSelectedAction(actionId);
  };

  const handleFormSuccess = () => {
    Alert.alert('Success', 'Item created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleFormCancel = () => {
    setSelectedAction(null);
  };

  const renderForm = () => {
    switch (selectedAction) {
      case 'User':
        return <AddUserForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
      case 'Lead':
        return <AddLeadForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
      case 'Properties':
        return <AddPropertyForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
      case 'Notes':
        return <AddNoteForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
      case 'Task':
        return <AddTaskForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
      default:
        return null;
    }
  };

  const addOptions = getAddOptions();

  // If a specific action is selected, show the form
  if (selectedAction) {
    return (
      <TabScreenWrapper>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleFormCancel}
            >
              <Ionicons name="arrow-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.formTitle}>
              Add {addOptions.find(opt => opt.id === selectedAction)?.label}
            </Text>
          </View>
          {renderForm()}
        </View>
      </TabScreenWrapper>
    );
  }

  // Show the options grid
  return (
    <TabScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Add</Text>
          <Text style={styles.subtitle}>Choose what you'd like to add</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsGrid}>
            {addOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleActionPress(option.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});
