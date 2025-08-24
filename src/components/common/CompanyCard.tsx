import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Company {
  id?: number;
  companyId?: number;
  name: string;
  status?: boolean | string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  totalUsers?: number;
  totalAdmins?: number;
}

interface CompanyCardProps {
  company: Company;
  onStatusChange?: (companyId: number, newStatus: boolean) => void;
  onDelete?: (companyId: number) => void;
  onUpdate?: (company: Company) => void;
  onRevoke?: (companyId: number) => void;
  onUnrevoke?: (companyId: number) => void;
  role?: string;
  companyId?: number;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onStatusChange,
  onDelete,
  onUpdate,
  onRevoke,
  onUnrevoke,
  role,
  companyId
}) => {
  const companyIdValue = company.id || company.companyId;
  const isActive = company.status === true || company.status === 'active' || company.status === 'ACTIVE';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: boolean | string) => {
    if (status === true || status === 'active' || status === 'ACTIVE') {
      return { bg: '#dcfce7', text: '#166534' };
    }
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  const getStatusLabel = (status: boolean | string) => {
    if (status === true || status === 'active' || status === 'ACTIVE') {
      return 'Active';
    }
    return 'Inactive';
  };

  const handleStatusChange = () => {
    if (!onStatusChange || !companyIdValue) return;
    
    Alert.alert(
      'Change Status',
      `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this company?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isActive ? 'Deactivate' : 'Activate', 
          style: isActive ? 'destructive' : 'default',
          onPress: () => onStatusChange(companyIdValue, !isActive)
        }
      ]
    );
  };

  const handleDelete = () => {
    if (!onDelete || !companyIdValue) return;
    
    Alert.alert(
      'Delete Company',
      'Are you sure you want to delete this company? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(companyIdValue) }
      ]
    );
  };

  const handleRevoke = () => {
    if (!onRevoke || !companyIdValue) return;
    
    Alert.alert(
      'Revoke Access',
      'Are you sure you want to revoke access for this company?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Revoke', style: 'destructive', onPress: () => onRevoke(companyIdValue) }
      ]
    );
  };

  const handleUnrevoke = () => {
    if (!onUnrevoke || !companyIdValue) return;
    
    Alert.alert(
      'Restore Access',
      'Are you sure you want to restore access for this company?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', style: 'default', onPress: () => onUnrevoke(companyIdValue) }
      ]
    );
  };

  const statusStyle = getStatusColor(company.status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {getStatusLabel(company.status)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => onUpdate?.(company)}
          >
            <Ionicons name="create" size={18} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Company Details */}
      <View style={styles.details}>
        {company.address && (
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={2}>
              {company.address}
              {company.city && `, ${company.city}`}
              {company.state && `, ${company.state}`}
              {company.country && `, ${company.country}`}
            </Text>
          </View>
        )}
        
        {company.phone && (
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{company.phone}</Text>
          </View>
        )}
        
        {company.email && (
          <View style={styles.detailRow}>
            <Ionicons name="mail" size={16} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>{company.email}</Text>
          </View>
        )}
        
        {company.website && (
          <View style={styles.detailRow}>
            <Ionicons name="globe" size={16} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>{company.website}</Text>
          </View>
        )}
      </View>

      {/* Stats Row */}
      {(company.totalUsers !== undefined || company.totalAdmins !== undefined) && (
        <View style={styles.statsRow}>
          {company.totalUsers !== undefined && (
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#6b7280" />
              <Text style={styles.statText}>{company.totalUsers} Users</Text>
            </View>
          )}
          {company.totalAdmins !== undefined && (
            <View style={styles.statItem}>
              <Ionicons name="shield" size={16} color="#6b7280" />
              <Text style={styles.statText}>{company.totalAdmins} Admins</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Text style={styles.dateText}>Created {formatDate(company.createdAt)}</Text>
          {company.createdBy && (
            <Text style={styles.createdByText}>by {company.createdBy.name}</Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {onStatusChange && (
          <TouchableOpacity style={styles.actionButton} onPress={handleStatusChange}>
            <Ionicons name="refresh" size={16} color="#10b981" />
            <Text style={styles.actionButtonText}>Status</Text>
          </TouchableOpacity>
        )}
        
        {onRevoke && !isActive && (
          <TouchableOpacity style={styles.actionButton} onPress={handleUnrevoke}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.actionButtonText}>Restore</Text>
          </TouchableOpacity>
        )}
        
        {onRevoke && isActive && (
          <TouchableOpacity style={styles.actionButton} onPress={handleRevoke}>
            <Ionicons name="close-circle" size={16} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Revoke</Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color="#ef4444" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: 12,
  },
  metaInfo: {
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  createdByText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});

export default CompanyCard;
