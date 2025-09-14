import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../shared/contexts/AuthContext';
import { UserService } from '../../core/services';

interface Director {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: boolean | string;
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

const DirectorsSection: React.FC = () => {
  const { user } = useAuth();
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const role = user?.role;
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;

  // Load directors based on current user's role
  const loadDirectorsData = async () => {
    if (!role || !userId) {
      return;
    }

    // For DIRECTOR role, we need companyId to see directors in the same company
    if (role === 'DIRECTOR' && !companyId) {
      return;
    }

    setLoading(true);
    try {
      let result: any;
      
      if (role === 'DEVELOPER') {
        // Developer can see all DIRECTOR role users across all companies
        result = await UserService.getUsersByRole('DIRECTOR');
      } else if (role === 'DIRECTOR') {
        // Director can see other DIRECTOR role users in the same company
        result = await UserService.getUsersByRoleAndCompany(companyId, 'DIRECTOR');
      }

      if (result?.success) {
        setDirectors(result.data || []);
      } else {
        Alert.alert('Error', 'Failed to load directors');
        setDirectors([]);
      }
    } catch (error) {
      console.error('Error loading directors:', error);
      Alert.alert('Error', 'Failed to load directors');
      setDirectors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDirectorsData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDirectorsData();
  }, [companyId, role, userId]);

  // Check if user has permission to view directors
  if (role !== 'DEVELOPER' && role !== 'DIRECTOR') {
    return (
      <View style={styles.container}>
        <View style={styles.noPermissionContainer}>
          <Ionicons name="shield-outline" size={48} color="#9ca3af" />
          <Text style={styles.noPermissionText}>
            You don't have permission to view directors.
          </Text>
        </View>
      </View>
    );
  }

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(3)].map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonBadge} />
          </View>
          <View style={styles.skeletonDetails}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonText} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderDirectorsList = () => {
    if (directors.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No directors found</Text>
          <Text style={styles.emptySubtext}>
            {role === 'DEVELOPER' 
              ? 'No directors are registered in the system yet.'
              : 'No other directors found in your company.'
            }
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.directorsList}>
        {directors.map((director) => (
          <View key={director.userId} style={styles.directorCard}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{director.name}</Text>
                <View style={styles.roleContainer}>
                  <Ionicons name="person-circle" size={16} color="#f59e0b" />
                  <Text style={styles.roleText}>DIRECTOR</Text>
                </View>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: director.status === 'ACTIVE' || director.status === true || director.status === 'active' ? '#dcfce7' : '#fee2e2' }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: director.status === 'ACTIVE' || director.status === true || director.status === 'active' ? '#166534' : '#991b1b' }
                  ]}>
                    {director.status === 'ACTIVE' || director.status === true || director.status === 'active' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>

            {/* User Details */}
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="mail" size={16} color="#6b7280" />
                <Text style={styles.detailText} numberOfLines={1}>{director.email}</Text>
              </View>
              
              {director.phone && (
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{director.phone}</Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {director.company?.name || director.companyName || 'No Company'}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.metaInfo}>
                <Text style={styles.dateText}>
                  ID: {director.userId}
                </Text>
                {director.createdAt && (
                  <Text style={styles.dateText}>
                    Created {new Date(director.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="people" size={24} color="#1f2937" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Directors</Text>
            <Text style={styles.subtitle}>
              {directors.length} director{directors.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1c69ff']}
            tintColor="#1c69ff"
          />
        }
      >
        {loading ? renderSkeleton() : renderDirectorsList()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  directorsList: {
    paddingBottom: 20,
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noPermissionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  skeletonContainer: {
    paddingBottom: 20,
  },
  skeletonCard: {
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
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonBadge: {
    width: 60,
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  skeletonDetails: {
    marginBottom: 12,
  },
  directorCard: {
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
  cardHeader: {
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
    color: '#f59e0b',
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
});

export default DirectorsSection;
