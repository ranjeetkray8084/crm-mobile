import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from './ThreeDotMenu';

interface User {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: boolean | string;
  company?: {
    name: string;
  };
  companyName?: string;
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  lastLogin?: string;
}

interface UserCardProps {
  user: User;
  onStatusChange?: (userId: string, newStatus: boolean) => void;
  onDelete?: (userId: string) => void;
  onUpdate?: (user: User) => void;
  onAssign?: (userId: string) => void;
  onUnassign?: (userId: string) => void;
  role?: string;
  companyId?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onStatusChange,
  onDelete,
  onUpdate,
  onAssign,
  onUnassign,
  role,
  companyId
}) => {
  const userId = user.userId || user.id;
  const isActive = user.status === true || user.status === 'active' || user.status === 'ACTIVE';
  const companyName = user.company?.name || user.companyName || 'No Company';

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#8b5cf6';
      case 'DIRECTOR':
        return '#f59e0b';
      case 'USER':
        return '#3b82f6';
      case 'DEVELOPER':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'shield';
      case 'DIRECTOR':
        return 'person-circle';
      case 'USER':
        return 'person';
      case 'DEVELOPER':
        return 'code-slash';
      default:
        return 'person';
    }
  };

  const handleStatusChange = () => {
    if (!onStatusChange || !userId) return;
    
    Alert.alert(
      'Change Status',
      `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isActive ? 'Deactivate' : 'Activate', 
          style: isActive ? 'destructive' : 'default',
          onPress: () => onStatusChange(userId, !isActive)
        }
      ]
    );
  };

  const handleDelete = () => {
    if (!onDelete || !userId) return;
    
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(userId) }
      ]
    );
  };

  const handleAssign = () => {
    if (!onAssign || !userId) return;
    onAssign(userId);
  };

  const handleUnassign = () => {
    if (!onUnassign || !userId) return;
    onUnassign(userId);
  };

  const statusStyle = getStatusColor(user.status);
  const roleColor = getRoleColor(user.role);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.roleContainer}>
            <Ionicons name={getRoleIcon(user.role) as any} size={16} color={roleColor} />
            <Text style={[styles.roleText, { color: roleColor }]}>
              {user.role}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {getStatusLabel(user.status)}
            </Text>
          </View>
          <ThreeDotMenu
            item={user}
            actions={[
              ...(onUpdate ? [{
                label: 'Edit User',
                icon: <Ionicons name="create" size={14} color="#3B82F6" />,
                onClick: () => onUpdate(user)
              }] : []),
              ...(onStatusChange ? [{
                label: isActive ? 'Deactivate' : 'Activate',
                icon: <Ionicons name="refresh" size={14} color="#10B981" />,
                onClick: () => handleStatusChange()
              }] : []),
              ...(onAssign && !user.company ? [{
                label: 'Assign',
                icon: <Ionicons name="person-add" size={14} color="#10B981" />,
                onClick: () => handleAssign()
              }] : []),
              ...(onUnassign && user.company ? [{
                label: 'Unassign',
                icon: <Ionicons name="person-remove" size={14} color="#F59E0B" />,
                onClick: () => handleUnassign()
              }] : []),
              ...(onDelete ? [{
                label: 'Delete User',
                icon: <Ionicons name="trash" size={14} color="#EF4444" />,
                onClick: () => handleDelete(),
                danger: true
              }] : [])
            ]}
          />
        </View>
      </View>

      {/* User Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color="#6b7280" />
          <Text style={styles.detailText} numberOfLines={1}>{user.email}</Text>
        </View>
        
        {user.phone && (
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{user.phone}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Ionicons name="business" size={16} color="#6b7280" />
          <Text style={styles.detailText} numberOfLines={1}>{companyName}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Text style={styles.dateText}>Created {formatDate(user.createdAt)}</Text>
          {user.createdBy && (
            <Text style={styles.createdByText}>by {user.createdBy.name}</Text>
          )}
          {user.lastLogin && (
            <Text style={styles.lastLoginText}>Last login: {formatDate(user.lastLogin)}</Text>
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusContainer: {
    alignItems: 'flex-end',
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
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
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
    marginBottom: 2,
  },
  lastLoginText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },

});

export default UserCard;
