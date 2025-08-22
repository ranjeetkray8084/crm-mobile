import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: string;
  createdAt: string;
}

export default function LeadsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - replace with actual API calls
  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      status: 'new',
      source: 'Website',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      status: 'contacted',
      source: 'Referral',
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 (555) 456-7890',
      status: 'qualified',
      source: 'Social Media',
      createdAt: '2024-01-13',
    },
  ];

  const statusOptions = [
    { key: 'all', label: 'All', color: '#666' },
    { key: 'new', label: 'New', color: '#007AFF' },
    { key: 'contacted', label: 'Contacted', color: '#FF9500' },
    { key: 'qualified', label: 'Qualified', color: '#34C759' },
    { key: 'lost', label: 'Lost', color: '#FF3B30' },
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.key === status);
    return option?.color || '#666';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderLead = ({ item }: { item: Lead }) => (
    <TouchableOpacity style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <Text style={styles.leadName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.leadEmail}>{item.email}</Text>
      <Text style={styles.leadPhone}>{item.phone}</Text>
      <View style={styles.leadFooter}>
        <Text style={styles.leadSource}>Source: {item.source}</Text>
        <Text style={styles.leadDate}>{item.createdAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Lead</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search leads..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status.key}
            style={[
              styles.filterChip,
              selectedStatus === status.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedStatus(status.key)}
          >
            <Text style={[
              styles.filterText,
              selectedStatus === status.key && styles.filterTextActive
            ]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Leads List */}
      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        style={styles.leadsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.leadsListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  leadsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  leadsListContent: {
    paddingBottom: 100,
  },
  leadCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leadName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  leadEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  leadPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadSource: {
    fontSize: 12,
    color: '#888',
  },
  leadDate: {
    fontSize: 12,
    color: '#888',
  },
});
