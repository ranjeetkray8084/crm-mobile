import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';
import StatusUpdateModal from '../common/StatusUpdateModal';
import { Lead } from '../../types/lead';

interface LeadCardProps {
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
  companyId?: string;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onStatusUpdate,
  onDelete,
  onAssign,
  onUnassign,
  onUpdate,
  onAddRemark,
  onViewRemarks,
  onAddFollowUp,
  onViewFollowUps
}) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const leadId = lead?.leadId ?? lead?.id;
  if (!leadId) return null;

  const isAssigned = Boolean(
    (lead.assignedToSummary?.name && typeof lead.assignedToSummary.name === 'string' && lead.assignedToSummary.name.trim()) || 
    (lead.assignToName && typeof lead.assignToName === 'string' && lead.assignToName.trim() === 'Assigned')
  );

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatBudget = (budget: any) => {
    // Handle different budget formats
    if (!budget) return '0';
    
    // If budget is a string, try to parse it
    if (typeof budget === 'string') {
      const trimmed = budget.trim();
      if (trimmed === '') return '0';
      try {
        const numValue = Number(trimmed);
        if (isNaN(numValue) || numValue <= 0) return '0';
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 0
        }).format(numValue);
      } catch (error) {
        return '0';
      }
    }
    
    // If budget is a number
    if (typeof budget === 'number') {
      if (isNaN(budget) || budget <= 0) return '0';
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
      }).format(budget);
    }
    
    // If budget is an object (e.g., { min: 1000, max: 5000 })
    if (typeof budget === 'object' && budget !== null) {
      if (budget.min && budget.max) {
        return `${new Intl.NumberFormat('en-IN').format(budget.min)} - ${new Intl.NumberFormat('en-IN').format(budget.max)}`;
      } else if (budget.amount) {
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 0
        }).format(budget.amount);
      } else if (budget.value) {
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 0
        }).format(budget.value);
      }
    }
    
    return '0';
  };

  const formatSource = (source: string | undefined | null) => {
    if (!source || typeof source !== 'string' || source.trim() === '') return 'N/A';
    
    // Special handling for REFERENCE source to show reference name
    if (source === 'REFERENCE' && lead.referenceName && typeof lead.referenceName === 'string' && lead.referenceName.trim()) {
      return `Reference: ${lead.referenceName.trim()}`;
    }
    
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

  const getStatusColor = (status: string | undefined | null) => {
    if (!status || typeof status !== 'string' || status.trim() === '') {
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

  const getStatusLabel = (status: string | undefined | null) => {
    if (!status || typeof status !== 'string' || status.trim() === '') {
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

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(leadId, newStatus);
  };

  const actions = [
    {
      label: 'Update Lead',
      icon: <Ionicons name="create" size={14} color="#6b7280" />,
      onClick: () => onUpdate(lead)
    },
    {
      label: 'Add Remark',
      icon: <Ionicons name="chatbubble" size={14} color="#6b7280" />,
      onClick: () => onAddRemark(lead)
    },
    {
      label: 'View Remarks',
      icon: <Ionicons name="eye" size={14} color="#6b7280" />,
      onClick: () => onViewRemarks(lead)
    },
    {
      label: 'Add Follow-Up',
      icon: <Ionicons name="calendar" size={14} color="#6b7280" />,
      onClick: () => onAddFollowUp(lead)
    },
    {
      label: 'View Follow-ups',
      icon: <Ionicons name="time" size={14} color="#6b7280" />,
      onClick: () => onViewFollowUps(lead)
    },
    ...(isAssigned ? [{
      label: 'Unassign',
      icon: <Ionicons name="person-remove" size={14} color="#6b7280" />,
      onClick: () => onUnassign(leadId)
    }] : [{
      label: 'Assign',
      icon: <Ionicons name="person-add" size={14} color="#6b7280" />,
      onClick: () => onAssign(leadId)
    }]),
    {
      label: 'Delete Lead',
      icon: <Ionicons name="trash" size={14} color="#6b7280" />,
      onClick: () => onDelete(leadId),
      danger: true
    }
  ];

  const statusStyle = getStatusColor(lead.status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>
            {(lead.name && typeof lead.name === 'string' && lead.name.trim()) || 'Unnamed Lead'}
          </Text>
          <Text style={styles.assignedText}>
            {(lead.assignedToSummary?.name && typeof lead.assignedToSummary.name === 'string' && lead.assignedToSummary.name.trim()) || 'Unassigned'}
          </Text>
        </View>
        
        {/* Three Dot Menu */}
        <ThreeDotMenu
          item={lead}
          actions={actions}
          position="right-0"
        />
      </View>

      {/* Lead Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{(lead.phone && typeof lead.phone === 'string' && lead.phone.trim()) || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={styles.detailValue}>
              {(() => {
                if (lead.budget && (typeof lead.budget === 'string' || typeof lead.budget === 'number' || typeof lead.budget === 'object')) {
                  const formatted = formatBudget(lead.budget);
                  return formatted !== '0' ? `₹${formatted}` : 'N/A';
                }
                return 'N/A';
              })()}
            </Text>
          </View>
        </View>
        
        {lead.requirement && typeof lead.requirement === 'string' && lead.requirement.trim() !== '' && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Requirement</Text>
            <Text style={styles.detailValue}>{lead.requirement}</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Source</Text>
                      <Text style={styles.detailValue}>{formatSource(lead.source)}</Text>
        </View>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {getStatusLabel(lead.status)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>Created {formatDate(lead.createdAt)}</Text>
        <Text style={styles.createdByText}>
          by {(lead.createdBy?.name && typeof lead.createdBy.name === 'string' && lead.createdBy.name.trim()) || 
              (lead.createdByName && typeof lead.createdByName === 'string' && lead.createdByName.trim()) || 'Unknown'}
        </Text>
      </View>

      {/* Status Update Modal */}
      <StatusUpdateModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        onStatusUpdate={handleStatusChange}
        title="Update Status"
        subtitle="Select new status"
        statusOptions={['NEW', 'CONTACTED', 'CLOSED', 'DROPED']}
        currentStatus={lead.status}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  assignedText: {
    fontSize: 14,
    color: '#6b7280',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  createdByText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default LeadCard;
