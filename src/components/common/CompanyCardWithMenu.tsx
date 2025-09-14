import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from './ThreeDotMenu';

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
  maxUsers?: number;
  maxAdmins?: number;
}

interface CompanyCardWithMenuProps {
  company: Company;
  onStatusChange?: (companyId: number, newStatus: boolean) => void;
  onDelete?: (companyId: number) => void;
  onUpdate?: (company: Company) => void;
  onRevoke?: (companyId: number) => void;
  onUnrevoke?: (companyId: number) => void;
  onView?: (company: Company) => void;
  role?: string;
  companyId?: number;
}

const CompanyCardWithMenu: React.FC<CompanyCardWithMenuProps> = ({
  company,
  onStatusChange,
  onDelete,
  onUpdate,
  onRevoke,
  onUnrevoke,
  onView,
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
      'Revoke Company',
      'Are you sure you want to revoke this company\'s access?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Revoke', style: 'destructive', onPress: () => onRevoke(companyIdValue) }
      ]
    );
  };

  const handleUnrevoke = () => {
    if (!onUnrevoke || !companyIdValue) return;
    
    Alert.alert(
      'Restore Company',
      'Are you sure you want to restore this company\'s access?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', style: 'default', onPress: () => onUnrevoke(companyIdValue) }
      ]
    );
  };

  const statusStyle = getStatusColor(company.status);

  // Define actions for the three-dot menu
  const actions = [
    ...(onView ? [{
      label: 'View Details',
      icon: <Ionicons name="eye" size={16} color="#3b82f6" />,
      onClick: () => onView(company)
    }] : []),
    ...(onUpdate ? [{
      label: 'Edit Company',
      icon: <Ionicons name="create" size={16} color="#f59e0b" />,
      onClick: () => onUpdate(company)
    }] : []),
    ...(onStatusChange ? [{
      label: isActive ? 'Deactivate' : 'Activate',
      icon: <Ionicons name="refresh" size={16} color="#10b981" />,
      onClick: handleStatusChange
    }] : []),
    ...(onRevoke && isActive ? [{
      label: 'Revoke Access',
      icon: <Ionicons name="close-circle" size={16} color="#f59e0b" />,
      onClick: handleRevoke,
      danger: true
    }] : []),
    ...(onUnrevoke && !isActive ? [{
      label: 'Restore Access',
      icon: <Ionicons name="checkmark-circle" size={16} color="#10b981" />,
      onClick: handleUnrevoke
    }] : []),
    ...(onDelete ? [{
      label: 'Delete Company',
      icon: <Ionicons name="trash" size={16} color="#ef4444" />,
      onClick: handleDelete,
      danger: true
    }] : [])
  ];

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
        
        {/* Three Dot Menu */}
        <ThreeDotMenu
          item={company}
          actions={actions}
          style={styles.menuButton}
        />
      </View>

      {/* Company Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{company.email || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{company.phone || 'N/A'}</Text>
        </View>

        {(company.maxUsers || company.maxAdmins) && (
          <View style={styles.statsRow}>
            {company.maxUsers && (
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color="#6b7280" />
                <Text style={styles.statText}>{company.maxUsers} Max Users</Text>
              </View>
            )}
            {company.maxAdmins && (
              <View style={styles.statItem}>
                <Ionicons name="shield" size={16} color="#6b7280" />
                <Text style={styles.statText}>{company.maxAdmins} Max Admins</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Text style={styles.dateText}>Created {formatDate(company.createdAt)}</Text>
          {company.createdBy && (
            <Text style={styles.createdByText}>by {company.createdBy.name}</Text>
          )}
        </View>
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
  menuButton: {
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
});

export default CompanyCardWithMenu;
