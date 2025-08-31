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
    'Office', 'Retail', 'Residential', 'Plot'
  ];

  const bhkOptions = ['1', '2', '3', '4'];

  const sourceOptions = [
    'Social Media', 'Cold Call', 'Project Call', 'Reference', 'Broker'
  ];

  // Exact same budget ranges as crm-frontend
  const budgetRanges = [
    '0-500000',
    '500000-1000000',
    '1000000-1500000',
    '1500000-2000000',
    '2000000-2500000',
    '2500000-3000000',
    '3000000-3500000',
    '3500000-4000000',
    '4000000-4500000',
    '4500000-5000000',
    '5000000-10000000',
    '10000000-20000000',
    '20000000-30000000',
    '30000000-40000000',
    '40000000-50000000',
    '50000000-100000000',
    '100000000-200000000',
    '200000000-300000000',
    '300000000-400000000',
    '400000000-500000000',
    '500000000-600000000',
    '600000000-700000000',
    '700000000-800000000',
    '800000000-900000000',
    '900000000-1000000000'
  ];

  const formatBudgetRange = (range: string) => {
    const [min, max] = range.split('-');
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    
    if (maxNum >= 10000000) {
      return `₹${(minNum / 10000000).toFixed(1)} Cr - ₹${(maxNum / 10000000).toFixed(1)} Cr`;
    }
    if (maxNum >= 100000) {
      return `₹${(minNum / 100000).toFixed(1)} Lakh - ₹${(maxNum / 100000).toFixed(1)} Lakh`;
    }
    return `₹${minNum.toLocaleString()} - ₹${maxNum.toLocaleString()}`;
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
        {/* Budget Filter - First as in crm-frontend */}
        <FilterSection title="Budget" section="budget">
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
        <FilterSection title="Type" section="type">
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
                label={`${bhk} BHK`}
                value={bhk}
                isSelected={filters.bhk === bhk}
                onPress={() => onUpdateFilter('bhk', filters.bhk === bhk ? '' : bhk)}
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
            {availableUsers.map(user => {
              const userIdValue = user.id || user.userId;
              const isCurrentUser = currentUserId && (userIdValue?.toString() === currentUserId?.toString());
              const displayName = isCurrentUser ? 'Me' : (user.name || user.username || `User ${userIdValue}`);
              
              return (
                <FilterChip
                  key={userIdValue}
                  label={displayName}
                  value={userIdValue?.toString() || ''}
                  isSelected={filters.createdBy === userIdValue?.toString()}
                  onPress={() => onUpdateFilter('createdBy', filters.createdBy === userIdValue?.toString() ? '' : (userIdValue?.toString() || ''))}
                />
              );
            })}
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
