import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserSection from './UserSection';

const UserSectionDemo: React.FC = () => {
  return (
    <View style={styles.container}>
      <UserSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default UserSectionDemo;
