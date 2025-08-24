import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminSection from './AdminSection';

const AdminSectionDemo: React.FC = () => {
  return (
    <View style={styles.container}>
      <AdminSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default AdminSectionDemo;
