import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';
import NotesSection from '../../src/components/notes/NotesSection';

export default function NotesScreen() {
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
});
