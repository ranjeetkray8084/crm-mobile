import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskListHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.headerText}>Task</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <View style={styles.assignedColumn}>
          <Text style={styles.headerText}>Assigned</Text>
        </View>
        <View style={styles.actionsColumn}>
          <Text style={styles.headerText}>Actions</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleColumn: {
    flex: 2,
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  assignedColumn: {
    flex: 1,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default TaskListHeader;

