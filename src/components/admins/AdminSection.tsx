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
import { useAdmins } from '../../core/hooks/useAdmins';
import { useAuth } from '../../shared/contexts/AuthContext';
import { customAlert } from '../../core/utils/alertUtils';
import ThreeDotMenu from '../common/ThreeDotMenu';
import UpdateUserModal from '../modals/UpdateUserModal';

interface Admin {
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: string | boolean | number;
  company?: {
    name: string;
  };
  companyName?: string;
}

const AdminSection: React.FC = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const role = user?.role;
  const userId = user?.userId || user?.id;

  const {
    admins,
    loading,
    error,
    loadAdmins,
    activateAdmin,
    revokeAdmin,
    getAdminsByRoleAndCompany,
    getAllAdmins,
  } = useAdmins(role === 'DEVELOPER' ? null : companyId, role, userId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Load admins based on current user's role
  const loadAdminsData = async () => {
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
        await getAllAdmins();
      } else if (role === 'DIRECTOR') {
        await getAdminsByRoleAndCompany();
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  useEffect(() => {
    loadAdminsData();
  }, [companyId, role, userId]);

  // Handle admin operations
  const handleActivateAdmin = async (adminId: string) => {
    try {
      const result = await activateAdmin(adminId);
      if (result.success) {
        customAlert('✅ Admin activated successfully');
        loadAdminsData();
      }
    } catch (error) {
      customAlert('❌ Failed to activate admin');
    }
  };

  const handleRevokeAdmin = async (adminId: string) => {
    try {
      const result = await revokeAdmin(adminId);
      if (result.success) {
        customAlert('✅ Admin revoked successfully');
        loadAdminsData();
      }
    } catch (error) {
      customAlert('❌ Failed to revoke admin');
    }
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) => {
    const search = searchQuery.toLowerCase();
    const companyName = admin.company?.name || admin.companyName || '';
    return (
      admin.name?.toLowerCase().includes(search) ||
      admin.email?.toLowerCase().includes(search) ||
      admin.phone?.toLowerCase().includes(search) ||
      companyName.toLowerCase().includes(search)
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

  const renderAdminCard = (admin: Admin) => {
    const isActive = admin.status === 'active' || admin.status === true || admin.status === 1;

    return (
      <View key={admin.userId} style={styles.adminCard}>
        <View style={styles.adminCardHeader}>
          <Text style={styles.adminName}>{admin.name}</Text>
          <ThreeDotMenu
            item={admin}
            actions={[
              {
                label: 'Update Admin',
                icon: <Ionicons name="create-outline" size={14} color="#3B82F6" />,
                onClick: () => setSelectedAdmin(admin)
              },
              isActive
                ? {
                  label: 'Deactivate',
                  icon: <Ionicons name="shield-checkmark-outline" size={14} color="#EF4444" />,
                  onClick: () => handleRevokeAdmin(admin.userId),
                  danger: true
                }
                : {
                  label: 'Activate',
                  icon: <Ionicons name="shield-outline" size={14} color="#10B981" />,
                  onClick: () => handleActivateAdmin(admin.userId)
                }
            ]}
          />
        </View>
        
        <View style={styles.adminDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{admin.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{admin.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role:</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>ADMIN</Text>
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
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="shield-outline" size={28} color="#6B7280" />
          <Text style={styles.title}>Admins Management</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search admins..."
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
      ) : filteredAdmins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No admins found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try adjusting your search terms' : 'Admins will appear here once added'}
          </Text>
        </View>
      ) : (
        <View style={styles.adminsContainer}>
          {filteredAdmins.map(renderAdminCard)}
        </View>
      )}

      {/* Update User Modal */}
      {selectedAdmin && (
        <UpdateUserModal
          user={selectedAdmin}
          isVisible={!!selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onUpdated={loadAdminsData}
        />
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
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  adminsContainer: {
    padding: 24,
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  adminName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    flex: 1,
  },

  adminDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  inactiveStatus: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#065F46',
  },
  inactiveStatusText: {
    color: '#991B1B',
  },
});

export default AdminSection;
