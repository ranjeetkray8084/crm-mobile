import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
  status: string;
  assignedToSummary?: {
    name: string;
  };
  assignToName?: string;
}

interface LeadActionsProps {
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
  onCall: (phone: string) => void;
  onEmail: (email?: string) => void;
  onWhatsApp: (phone: string) => void;
  userRole?: string;
}

const LeadActions: React.FC<LeadActionsProps> = ({
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
  onCall,
  onEmail,
  onWhatsApp,
  userRole
}) => {
  const leadId = lead?.leadId ?? lead?.id;
  if (!leadId) return null;

  const isAssigned = Boolean(lead.assignedToSummary?.name?.trim() || lead.assignToName?.trim() === 'Assigned');
  const canDelete = userRole === 'DIRECTOR' || userRole === 'ADMIN';
  const canAssign = userRole === 'DIRECTOR' || userRole === 'ADMIN';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return '#f59e0b';
      case 'CONTACTED':
        return '#3b82f6';
      case 'CLOSED':
        return '#10b981';
      case 'DROPED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'star';
      case 'CONTACTED':
        return 'call';
      case 'CLOSED':
        return 'checkmark-circle';
      case 'DROPED':
        return 'close-circle';
      default:
        return 'ellipsis-horizontal';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(leadId, newStatus);
  };

  const handleCall = () => {
    if (lead.phone) {
      onCall(lead.phone);
    }
  };

  const handleEmail = () => {
    onEmail(lead.email);
  };

  const handleWhatsApp = () => {
    if (lead.phone) {
      onWhatsApp(lead.phone);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusButtons}>
          {['NEW', 'CONTACTED', 'CLOSED', 'DROPED'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                lead.status === status && styles.statusButtonActive,
                { borderColor: getStatusColor(status) }
              ]}
              onPress={() => handleStatusChange(status)}
            >
              <Ionicons 
                name={getStatusIcon(status) as any} 
                size={16} 
                color={lead.status === status ? '#fff' : getStatusColor(status)} 
              />
              <Text style={[
                styles.statusButtonText,
                lead.status === status && styles.statusButtonTextActive,
                { color: lead.status === status ? '#fff' : getStatusColor(status) }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Communication Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Communication</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#10b981" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <Ionicons name="mail" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#25d366" />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lead Management Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Lead Management</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onUpdate(lead)}>
            <Ionicons name="create" size={20} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onAddRemark(lead)}>
            <Ionicons name="chatbubble" size={20} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>Remark</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onViewRemarks(lead)}>
            <Ionicons name="eye" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>View Remarks</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Follow-up Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Follow-ups</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAddFollowUp(lead)}>
            <Ionicons name="calendar" size={20} color="#ef4444" />
            <Text style={styles.actionButtonText}>Add Follow-up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onViewFollowUps(lead)}>
            <Ionicons name="time" size={20} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>View Follow-ups</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignment Actions */}
      {canAssign && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Assignment</Text>
          <View style={styles.actionButtons}>
            {isAssigned ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.dangerButton]} 
                onPress={() => onUnassign(leadId)}
              >
                <Ionicons name="person-remove" size={20} color="#ef4444" />
                <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Unassign</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.successButton]} 
                onPress={() => onAssign(leadId)}
              >
                <Ionicons name="person-add" size={20} color="#10b981" />
                <Text style={[styles.actionButtonText, styles.successButtonText]}>Assign</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Danger Actions */}
      {canDelete && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={() => onDelete(leadId)}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Delete Lead</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusSection: {
    marginBottom: 20,
  },
  actionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    gap: 6,
  },
  statusButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  successButton: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  successButtonText: {
    color: '#10b981',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  dangerButtonText: {
    color: '#ef4444',
  },
});

export default LeadActions;
