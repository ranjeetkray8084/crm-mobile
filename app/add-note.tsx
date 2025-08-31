import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AddNoteForm from '../src/components/forms/AddNoteForm';

export default function AddNoteScreen() {
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
          title: 'Add Note/Event',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#8b5cf6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <View style={styles.content}>
        <AddNoteForm 
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
