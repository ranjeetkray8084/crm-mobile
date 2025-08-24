import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import LeadCard from './LeadCard';
import { Lead } from '../../types/lead';

interface LeadsListProps {
  leads: Lead[];
  searchTerm: string;
  onStatusUpdate: (leadId: string, status: string) => void;
  onDelete: (leadId: string) => void;
  onAssign: (leadId: string) => void;
  onUnassign: (leadId: string) => void;
  onUpdate: (lead: Lead) => void;
  onAddRemark: (lead: Lead) => void;
  onViewRemarks: (lead: Lead) => void;
  onAddFollowUp: (lead: Lead) => void;
  onViewFollowUps: (lead: Lead) => void;
  companyId?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({
  leads,
  searchTerm,
  refreshing = false,
  onRefresh,
  ...actionHandlers
}) => {
  const getValidLeadId = (lead: Lead) => lead?.leadId ?? lead?.id;

  const filteredLeads = leads.filter((lead) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.phone?.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.location?.toLowerCase().includes(searchLower) ||
      lead.requirement?.toLowerCase().includes(searchLower) ||
      lead.source?.toLowerCase().includes(searchLower)
    );
  });

  const renderLeadCard = ({ item }: { item: Lead }) => (
    <LeadCard
      lead={item}
      {...actionHandlers}
    />
  );

  const keyExtractor = (item: Lead) => getValidLeadId(item) || item.name;

  if (filteredLeads.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchTerm.trim() ? 'No leads found matching your search.' : 'No leads available.'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredLeads}
      renderItem={renderLeadCard}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
        }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LeadsList;
