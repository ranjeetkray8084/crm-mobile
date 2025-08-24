import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LeadActions from './LeadActions';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  budget?: string;
  requirement?: string;
  location?: string;
  source: string;
  createdAt: string;
  assignedToSummary?: {
    name: string;
  };
  assignedTo?: {
    name: string;
  };
  assignToName?: string;
  createdBy?: {
    name: string;
  };
  createdByName?: string;
}

interface LeadDetailsProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, status: string) => void;
  onDelete: (leadId: string) => void;
  onAssign: (leadId: string) => void;
  onUnassign: (leadId: string) => void;
  onUpdate: (lead: Lead) => void;
  onAddRemark: (lead: Lead) => void;
  onViewRemarks: (lead: Lead) => void;
  onAddFollowUp: (lead: Lead) => void;
  onViewFollowUps: (lead: Lead) => void;
  userRole?: string;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  onStatusUpdate,
  onDelete,
  onAssign,
  onUnassign,
  onUpdate,
  onAddRemark,
  onViewRemarks,
  onAddFollowUp,
  onViewFollowUps,
  userRole
}) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    basic: true,
    details: true,
    actions: true
  });

  const leadId = lead?.leadId ?? lead?.id;
  if (!leadId) return null;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatBudget = (budget: string) => {
    if (!budget || budget.trim() === '') return 'N/A';
    try {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
      }).format(Number(budget));
    } catch (error) {
      return 'N/A';
    }
  };

  const formatSource = (source: string) => {
    if (!source || source.trim() === '') return 'N/A';
    const sourceMap: { [key: string]: string } = {
      "INSTAGRAM": "Instagram",
      "FACEBOOK": "Facebook",
      "YOUTUBE": "YouTube", 
      "REFERENCE": "Reference",
      "NINETY_NINE_ACRES": "99acres",
      "MAGIC_BRICKS": "MagicBricks"
    };
    return sourceMap[source] || source;
  };

  const getStatusColor = (status: string) => {
    if (!status || status.trim() === '') {
      return { bg: '#f3f4f6', text: '#374151' };
    }
    switch (status) {
      case 'NEW':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'CONTACTED':
        return { bg: '#cffafe', text: '#0e7490' };
      case 'CLOSED':
        return { bg: '#dcfce7', text: '#166534' };
      case 'DROPED':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status || status.trim() === '') {
      return 'N/A';
    }
    switch (status) {
      case 'NEW':
        return 'New';
      case 'CONTACTED':
        return 'Contacted';
      case 'CLOSED':
        return 'Closed';
      case 'DROPED':
        return 'Dropped';
      default:
        return status || 'N/A';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email?: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      Alert.alert('No Email', 'This lead does not have an email address.');
    }
  };

  const handleWhatsApp = (phone: string) => {
    const whatsappUrl = `whatsapp://send?phone=${phone.replace(/\D/g, '')}`;
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp Not Available', 'WhatsApp is not installed on this device.');
      }
    });
  };

  const statusStyle = getStatusColor(lead.status?.trim() || 'NEW');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>
            {lead.name?.trim() || 'Unnamed Lead'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {getStatusLabel(lead.status?.trim() || 'NEW')}
            </Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => handleCall(lead.phone)}
          >
            <Ionicons name="call" size={20} color="#10b981" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => handleEmail(lead.email)}
          >
            <Ionicons name="mail" size={20} color="#3b82f6" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => handleWhatsApp(lead.phone)}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25d366" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Information Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('basic')}
        >
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Ionicons 
            name={expandedSections.basic ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {expandedSections.basic && (
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{lead.phone?.trim() || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{lead.email?.trim() || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>₹{formatBudget(lead.budget?.trim() || '0')}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{lead.location?.trim() || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Source</Text>
              <Text style={styles.infoValue}>{formatSource(lead.source?.trim() || '')}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Additional Details Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('details')}
        >
          <Text style={styles.sectionTitle}>Additional Details</Text>
          <Ionicons 
            name={expandedSections.details ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {expandedSections.details && (
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Requirement</Text>
              <Text style={styles.infoValue}>
                {lead.requirement?.trim() || 'No specific requirements mentioned'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Assigned To</Text>
                <Text style={styles.infoValue}>
                  {lead.assignedToSummary?.name?.trim() || lead.assignToName?.trim() || 'Unassigned'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Created By</Text>
                <Text style={styles.infoValue}>
                  {lead.createdBy?.name?.trim() || lead.createdByName?.trim() || 'Unknown'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Created On</Text>
              <Text style={styles.infoValue}>
                {formatDate(lead.createdAt?.trim() || '')}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('actions')}
        >
          <Text style={styles.sectionTitle}>Actions & Management</Text>
          <Ionicons 
            name={expandedSections.actions ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {expandedSections.actions && (
          <View style={styles.sectionContent}>
            <LeadActions
              lead={lead}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
              onAssign={onAssign}
              onUnassign={onUnassign}
              onUpdate={onUpdate}
              onAddRemark={onAddRemark}
              onViewRemarks={onViewRemarks}
              onAddFollowUp={onAddFollowUp}
              onViewFollowUps={onViewFollowUps}
              onCall={handleCall}
              onEmail={handleEmail}
              onWhatsApp={handleWhatsApp}
              userRole={userRole}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
});

export default LeadDetails;
