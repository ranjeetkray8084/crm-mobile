import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/shared/contexts/AuthContext';

export default function CRMScreen() {
  const { user } = useAuth();

  const mockLeads = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', status: 'New', priority: 'High' },
    { id: 2, name: 'Sarah Johnson', company: 'Design Studio', status: 'Contacted', priority: 'Medium' },
    { id: 3, name: 'Mike Wilson', company: 'Startup Inc', status: 'Qualified', priority: 'High' },
    { id: 4, name: 'Emily Davis', company: 'Consulting Co', status: 'Proposal', priority: 'Medium' },
  ];

  const mockTasks = [
    { id: 1, title: 'Follow up with John Smith', dueDate: 'Today', priority: 'High' },
    { id: 2, title: 'Prepare proposal for Tech Corp', dueDate: 'Tomorrow', priority: 'Medium' },
    { id: 3, title: 'Schedule meeting with Sarah', dueDate: 'This week', priority: 'Low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return '#1c69ff';
      case 'Contacted': return '#f59e0b';
      case 'Qualified': return '#10b981';
      case 'Proposal': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRM Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your leads and tasks</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color="#1c69ff" />
          <Text style={styles.statNumber}>{mockLeads.length}</Text>
          <Text style={styles.statLabel}>Total Leads</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Active Tasks</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trending-up-outline" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>75%</Text>
          <Text style={styles.statLabel}>Conversion</Text>
        </View>
      </View>

      {/* Recent Leads */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Leads</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Lead</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.leadsList}>
          {mockLeads.map((lead) => (
            <View key={lead.id} style={styles.leadCard}>
              <View style={styles.leadInfo}>
                <Text style={styles.leadName}>{lead.name}</Text>
                <Text style={styles.leadCompany}>{lead.company}</Text>
              </View>
              <View style={styles.leadStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                    {lead.status}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(lead.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(lead.priority) }]}>
                    {lead.priority}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Active Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Tasks</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tasksList}>
          {mockTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDueDate}>Due: {task.dueDate}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={24} color="#1c69ff" />
            <Text style={styles.actionButtonText}>Send Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={24} color="#10b981" />
            <Text style={styles.actionButtonText}>Make Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-outline" size={24} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1c69ff',
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#c7d2fe',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#1c69ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  leadsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  leadCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  leadStatus: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tasksList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  taskDueDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});
