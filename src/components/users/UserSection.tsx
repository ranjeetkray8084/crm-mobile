import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../../core/hooks/useUsers';
import { useAuth } from '../../shared/contexts/AuthContext';
import { customAlert } from '../../core/utils/alertUtils';

interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string | boolean | number;
  adminName?: string;
}

const UserSection: React.FC = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const role = user?.role;
  const userId = user?.userId || user?.id;

  const {
    users,
    loading,
    error,
    loadUsers,
    activateUser,
    deactivateUser,
    unassignAdmin,
    getUsersByRoleAndCompany,
    getUsersByAdmin,
    getUsersWithUserRole,
  } = useUsers(role === 'DEVELOPER' ? null : companyId, role, userId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users based on current user's role
  const loadUserRoleUsers = async () => {
    if (role === 'DEVELOPER') {
      if (!role || !userId) {
        return;
      }
    } else {
      if (!companyId || !role || !userId) {
        return;
      }
    }

    try {
      if (role === 'DEVELOPER') {
        await getUsersWithUserRole();
      } else if (role === 'DIRECTOR') {
        await getUsersByRoleAndCompany('USER');
      } else if (role === 'ADMIN') {
        await getUsersByAdmin(userId);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadUserRoleUsers();
  }, [companyId, role, userId]);

  // Handle user operations
  const handleActivateUser = async (userId: string) => {
    try {
      const result = await activateUser(userId);
      if (result.success) {
        customAlert('✅ User activated successfully');
        loadUserRoleUsers();
      }
    } catch (error) {
      customAlert('❌ Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const result = await deactivateUser(userId);
      if (result.success) {
        customAlert('✅ User deactivated successfully');
        loadUserRoleUsers();
      }
    } catch (error) {
      customAlert('❌ Failed to deactivate user');
    }
  };

  const handleUnassignAdmin = async (userId: string) => {
    try {
      const result = await unassignAdmin(userId);
      if (result.success) {
        customAlert('✅ Admin unassigned successfully');
        loadUserRoleUsers();
      }
    } catch (error) {
      customAlert('❌ Failed to unassign admin');
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const search = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(3)].map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );

  const renderUserCard = (user: User) => {
    const isActive = user.status === 'active' || user.status === true || user.status === 1;
    const isDirector = role === 'DIRECTOR';
    const hasAdmin = user.adminName && user.adminName !== 'No Admin';

    return (
      <View key={user.userId} style={styles.userCard}>
        <View style={styles.userCardHeader}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.actionButtons}>
            {(role === 'DIRECTOR' || role === 'ADMIN' || role === 'DEVELOPER') && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setSelectedUser(user)}
              >
                <Ionicons name="create-outline" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
            {isActive ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => handleDeactivateUser(user.userId)}
              >
                <Ionicons name="person-remove-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.successButton]}
                onPress={() => handleActivateUser(user.userId)}
              >
                <Ionicons name="person-check-outline" size={16} color="#10B981" />
              </TouchableOpacity>
            )}
            {isDirector && (
              hasAdmin ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.dangerButton]}
                  onPress={() => handleUnassignAdmin(user.userId)}
                >
                  <Ionicons name="person-remove-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.successButton]}
                  onPress={() => {/* TODO: Implement assign admin */}}
                >
                  <Ionicons name="person-add-outline" size={16} color="#10B981" />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
        
        <View style={styles.userDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{user.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{user.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role:</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              isActive ? styles.activeStatus : styles.inactiveStatus
            ]}>
              <Text style={[
                styles.statusText,
                isActive ? styles.activeStatusText : styles.inactiveStatusText
              ]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Admin:</Text>
            <Text style={styles.detailValue}>{user.adminName || 'No Admin'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="people-outline" size={28} color="#6B7280" />
          <Text style={styles.title}>Users Management</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {loading ? (
        renderSkeleton()
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No users found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try adjusting your search terms' : 'Users will appear here once added'}
          </Text>
        </View>
      ) : (
        <View style={styles.usersContainer}>
          {filteredUsers.map(renderUserCard)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  skeletonContainer: {
    padding: 20,
  },
  skeletonCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
    width: '60%',
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  usersContainer: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
  },
  successButton: {
    backgroundColor: '#F0FDF4',
  },
  userDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  roleBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7C3AED',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  inactiveStatus: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeStatusText: {
    color: '#065F46',
  },
  inactiveStatusText: {
    color: '#991B1B',
  },
});

export default UserSection;
