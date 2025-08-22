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

interface Property {
  id: string;
  title: string;
  address: string;
  price: string;
  type: 'residential' | 'commercial' | 'land';
  status: 'available' | 'sold' | 'pending';
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  createdAt: string;
}

export default function PropertiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data - replace with actual API calls
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      address: '123 Main St, Downtown',
      price: '$350,000',
      type: 'residential',
      status: 'available',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sq ft',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Office Space Downtown',
      address: '456 Business Ave, Downtown',
      price: '$2,500/month',
      type: 'commercial',
      status: 'available',
      area: '2,500 sq ft',
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      title: 'Suburban Family Home',
      address: '789 Oak Street, Suburbs',
      price: '$450,000',
      type: 'residential',
      status: 'pending',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,800 sq ft',
      createdAt: '2024-01-13',
    },
  ];

  const typeOptions = [
    { key: 'all', label: 'All Types' },
    { key: 'residential', label: 'Residential' },
    { key: 'commercial', label: 'Commercial' },
    { key: 'land', label: 'Land' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#34C759';
      case 'pending': return '#FF9500';
      case 'sold': return '#FF3B30';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return '🏠';
      case 'commercial': return '🏢';
      case 'land': return '🌱';
      default: return '🏘️';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || property.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderProperty = ({ item }: { item: Property }) => (
    <TouchableOpacity style={styles.propertyCard}>
      <View style={styles.propertyHeader}>
        <View style={styles.propertyTitleContainer}>
          <Text style={styles.propertyIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.propertyTitle}>{item.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.propertyAddress}>{item.address}</Text>
      <Text style={styles.propertyPrice}>{item.price}</Text>
      
      <View style={styles.propertyDetails}>
        {item.bedrooms && (
          <Text style={styles.detailItem}>🛏️ {item.bedrooms} bed</Text>
        )}
        {item.bathrooms && (
          <Text style={styles.detailItem}>🛁 {item.bathrooms} bath</Text>
        )}
        <Text style={styles.detailItem}>📐 {item.area}</Text>
      </View>
      
      <View style={styles.propertyFooter}>
        <Text style={styles.propertyType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
        <Text style={styles.propertyDate}>{item.createdAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Type Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {typeOptions.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.filterChip,
              selectedType === type.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedType(type.key)}
          >
            <Text style={[
              styles.filterText,
              selectedType === type.key && styles.filterTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Properties List */}
      <FlatList
        data={filteredProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        style={styles.propertiesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesListContent}
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
  propertiesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  propertiesListContent: {
    paddingBottom: 100,
  },
  propertyCard: {
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
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  propertyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  propertyTitle: {
    fontSize: 16,
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
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  propertyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
    marginBottom: 4,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyType: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  propertyDate: {
    fontSize: 12,
    color: '#888',
  },
});
