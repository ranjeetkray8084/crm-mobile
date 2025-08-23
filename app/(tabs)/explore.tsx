import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/shared/contexts/AuthContext';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const mockSearchResults = [
    { id: 1, type: 'Lead', name: 'John Smith', company: 'Tech Corp', relevance: 'High' },
    { id: 2, type: 'Task', name: 'Follow up call', dueDate: 'Today', relevance: 'Medium' },
    { id: 3, type: 'Company', name: 'Design Studio', industry: 'Creative', relevance: 'High' },
    { id: 4, type: 'Property', name: 'Downtown Office', location: 'City Center', relevance: 'Medium' },
  ];

  const filteredResults = mockSearchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Lead': return 'person-outline';
      case 'Task': return 'checkmark-circle-outline';
      case 'Company': return 'business-outline';
      case 'Property': return 'home-outline';
      default: return 'document-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lead': return '#1c69ff';
      case 'Task': return '#10b981';
      case 'Company': return '#f59e0b';
      case 'Property': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
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
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Search and discover your CRM data</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads, tasks, companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {searchQuery ? `Search Results (${filteredResults.length})` : 'Recent Items'}
        </Text>
        
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <TouchableOpacity key={item.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                  <Ionicons name={getTypeIcon(item.type)} size={20} color={getTypeColor(item.type)} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultType}>{item.type}</Text>
                  {item.company && <Text style={styles.resultDetail}>{item.company}</Text>}
                  {item.dueDate && <Text style={styles.resultDetail}>Due: {item.dueDate}</Text>}
                  {item.industry && <Text style={styles.resultDetail}>{item.industry}</Text>}
                  {item.location && <Text style={styles.resultDetail}>{item.location}</Text>}
                </View>
                <View style={[styles.relevanceBadge, { backgroundColor: getRelevanceColor(item.relevance) + '20' }]}>
                  <Text style={[styles.relevanceText, { color: getRelevanceColor(item.relevance) }]}>
                    {item.relevance}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : searchQuery ? (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsSubtitle}>Try adjusting your search terms</Text>
          </View>
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text style={styles.noResultsTitle}>Start searching</Text>
            <Text style={styles.noResultsSubtitle}>Search for leads, tasks, and more</Text>
          </View>
        )}
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Quick Filters</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="people-outline" size={20} color="#1c69ff" />
            <Text style={styles.filterButtonText}>Leads</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={styles.filterButtonText}>Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="business-outline" size={20} color="#f59e0b" />
            <Text style={styles.filterButtonText}>Companies</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="home-outline" size={20} color="#8b5cf6" />
            <Text style={styles.filterButtonText}>Properties</Text>
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
  searchContainer: {
    padding: 20,
    marginTop: -20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  resultType: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  resultDetail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  relevanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  relevanceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 4,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  filtersContainer: {
    padding: 20,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});
