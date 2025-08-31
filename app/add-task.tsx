import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AddTaskForm from '../src/components/forms/AddTaskForm';

export default function AddTaskScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to the previous screen
    router.back();
  };

  const handleCancel = () => {
    // Navigate back to the previous screen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Add Calling Data',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ef4444',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <View style={styles.content}>
        <AddTaskForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
