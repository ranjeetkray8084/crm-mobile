import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import PropertyCard from './PropertyCard';

interface Property {
  id?: number;
  propertyId?: number;
  propertyName?: string;
  name?: string;
  status?: string;
  type?: string;
  bhk?: string;
  price?: number;
  location?: string;
  sector?: string;
  source?: string;
  size?: string;
  unit?: string;
  unitDetails?: string;
  floor?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerNumber?: string;
  referenceName?: string;
  createdBy?: {
    name: string;
  };
  createdByName?: string;
  createdAt?: string;
  remarks?: any[];
}

interface PropertiesListProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onStatusChange?: (propertyId: number, newStatus: string) => void;
  onDelete?: (propertyId: number) => void;
  onUpdate?: (property: Property) => void;
  onAddRemark?: (property: Property) => void;
  onViewRemarks?: (property: Property) => void;
  onOutOfBox?: (property: Property) => void;
  companyId?: number;
}

const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  loading,
  error,
  onRefresh,
  onStatusChange,
  onDelete,
  onUpdate,
  onAddRemark,
  onViewRemarks,
  onOutOfBox,
  companyId
}) => {
  const renderPropertyCard = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onAddRemark={onAddRemark}
      onViewRemarks={onViewRemarks}
      onOutOfBox={onOutOfBox}
      companyId={companyId}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Properties Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {error || 'There are no properties to display. Try adjusting your search or filters.'}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateTitle}>Error Loading Properties</Text>
      <Text style={styles.errorStateSubtitle}>{error}</Text>
    </View>
  );

  if (error && !loading) {
    return renderErrorState();
  }

  if (properties.length === 0 && !loading) {
    return renderEmptyState();
  }

  return (
    <FlatList
      data={properties}
      renderItem={renderPropertyCard}
      keyExtractor={(item) => (item.id || item.propertyId)?.toString() || Math.random().toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#3b82f6']}
          tintColor="#3b82f6"
        />
      }
     
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorStateSubtitle: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    lineHeight: 20,
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  listFooterText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default PropertiesList;
