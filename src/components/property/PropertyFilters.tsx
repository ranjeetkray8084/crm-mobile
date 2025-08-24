import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PropertyFiltersProps {
  filters: {
    budgetRange: string;
    status: string;
    type: string;
    bhk: string;
    source: string;
    createdBy: string;
  };
  onUpdateFilter: (filterName: string, value: string) => void;
  onClearFilters: () => void;
  availableUsers: any[];
  currentUserId?: number;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onUpdateFilter,
  onClearFilters,
  availableUsers,
  currentUserId
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  const statusOptions = [
    { value: 'AVAILABLE_FOR_SALE', label: 'For Sale' },
    { value: 'AVAILABLE_FOR_RENT', label: 'For Rent' },
    { value: 'RENT_OUT', label: 'Rented Out' },
    { value: 'SOLD_OUT', label: 'Sold Out' }
  ];

  const typeOptions = [
    'Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Office', 'Shop', 'Land'
  ];

  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

  const sourceOptions = [
    'Direct', 'Website', 'Social Media', 'Referral', 'Advertisement', 'Other'
  ];

  const budgetRanges = [
    '0-500000',
    '500000-1000000',
    '1000000-2000000',
    '2000000-5000000',
    '5000000-10000000',
    '10000000+'
  ];

  const formatBudgetRange = (range: string) => {
    const [min, max] = range.split('-');
    if (max === '+') {
      return `₹${(parseInt(min) / 10000000).toFixed(1)} Cr+`;
    }
    if (parseInt(max) >= 10000000) {
      return `₹${(parseInt(min) / 10000000).toFixed(1)} Cr - ₹${(parseInt(max) / 10000000).toFixed(1)} Cr`;
    }
    if (parseInt(max) >= 100000) {
      return `₹${(parseInt(min) / 100000).toFixed(1)} Lakh - ₹${(parseInt(max) / 100000).toFixed(1)} Lakh`;
    }
    return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(max).toLocaleString()}`;
  };

  const FilterSection: React.FC<{
    title: string;
    section: string;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <View style={styles.filterSection}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection(section)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={isSectionExpanded(section) ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>
      
      {isSectionExpanded(section) && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );

  const FilterChip: React.FC<{
    label: string;
    value: string;
    isSelected: boolean;
    onPress: () => void;
  }> = ({ label, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
        {/* Status Filter */}
        <FilterSection title="Status" section="status">
          <View style={styles.chipContainer}>
            {statusOptions.map(option => (
              <FilterChip
                key={option.value}
                label={option.label}
                value={option.value}
                isSelected={filters.status === option.value}
                onPress={() => onUpdateFilter('status', filters.status === option.value ? '' : option.value)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Type Filter */}
        <FilterSection title="Property Type" section="type">
          <View style={styles.chipContainer}>
            {typeOptions.map(type => (
              <FilterChip
                key={type}
                label={type}
                value={type}
                isSelected={filters.type === type}
                onPress={() => onUpdateFilter('type', filters.type === type ? '' : type)}
              />
            ))}
          </View>
        </FilterSection>

        {/* BHK Filter */}
        <FilterSection title="BHK" section="bhk">
          <View style={styles.chipContainer}>
            {bhkOptions.map(bhk => (
              <FilterChip
                key={bhk}
                label={bhk}
                value={bhk}
                isSelected={filters.bhk === bhk}
                onPress={() => onUpdateFilter('bhk', filters.bhk === bhk ? '' : bhk)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Budget Range Filter */}
        <FilterSection title="Budget Range" section="budget">
          <View style={styles.chipContainer}>
            {budgetRanges.map(range => (
              <FilterChip
                key={range}
                label={formatBudgetRange(range)}
                value={range}
                isSelected={filters.budgetRange === range}
                onPress={() => onUpdateFilter('budgetRange', filters.budgetRange === range ? '' : range)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Source Filter */}
        <FilterSection title="Source" section="source">
          <View style={styles.chipContainer}>
            {sourceOptions.map(source => (
              <FilterChip
                key={source}
                label={source}
                value={source}
                isSelected={filters.source === source}
                onPress={() => onUpdateFilter('source', filters.source === source ? '' : source)}
              />
            ))}
          </View>
        </FilterSection>

        {/* Created By Filter */}
        <FilterSection title="Created By" section="createdBy">
          <View style={styles.chipContainer}>
            <FilterChip
              label="Me"
              value={currentUserId?.toString() || ''}
              isSelected={filters.createdBy === currentUserId?.toString()}
              onPress={() => onUpdateFilter('createdBy', filters.createdBy === currentUserId?.toString() ? '' : (currentUserId?.toString() || ''))}
            />
            {availableUsers.map(user => (
              <FilterChip
                key={user.id || user.userId}
                label={user.name || user.username || `User ${user.id || user.userId}`}
                value={(user.id || user.userId)?.toString() || ''}
                isSelected={filters.createdBy === (user.id || user.userId)?.toString()}
                onPress={() => onUpdateFilter('createdBy', filters.createdBy === (user.id || user.userId)?.toString() ? '' : (user.id || user.userId)?.toString())}
              />
            ))}
          </View>
        </FilterSection>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filtersContainer: {
    maxHeight: 400,
  },
  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#ffffff',
  },
});

export default PropertyFilters;
