import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useDashboardStats } from '../../core/hooks/useDashboardStats';

const DashboardStats = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role;

  const { stats, loading, error } = useDashboardStats(companyId, userId, role);

  if (!user || !userId || !role) {
    return (
      <View style={styles.container}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Authentication Required</Text>
          <Text style={styles.warningText}>Please log in to view dashboard statistics.</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.loadingCard} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Error Loading Dashboard</Text>
          <Text style={styles.errorText}>Something went wrong while loading dashboard statistics.</Text>
        </View>
      </View>
    );
  }

  // Render different stats based on user role
  if (role === 'DEVELOPER') {
    return (
      <View style={styles.container}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Companies"
            count={stats?.totalCompanies || 0}
            icon="business-outline"
            color="#1c69ff"
          />
          <StatCard
            title="Total Users"
            count={stats?.totalUsers || 0}
            icon="people-outline"
            color="#10b981"
          />
          <StatCard
            title="Total Admins"
            count={stats?.totalAdmins || 0}
            icon="shield-outline"
            color="#8b5cf6"
          />
          <StatCard
            title="Total Directors"
            count={stats?.totalDirectors || 0}
            icon="person-circle-outline"
            color="#f59e0b"
          />
        </View>
      </View>
    );
  }

  // For other roles, show business stats
  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <LeadsCard
          totalLeads={stats?.totalLeads}
          newLeads={stats?.newLeads}
          contactedLeads={stats?.contactedLeads}
        />
        <PropertyOverviewCard propertyOverview={stats?.propertyOverview} />
        <DealsClosedCard dealsOverview={stats?.dealsOverview} />
        {role !== 'USER' && (
          <UsersAdminsOverviewCard usersOverview={stats?.usersOverview} />
        )}
      </View>
    </View>
  );
};

const StatCard = ({ title, count, icon, color }: {
  title: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <View style={styles.statContent}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statCount}>{count}</Text>
    </View>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={32} color="#fff" />
    </View>
  </View>
);

const LeadsCard = ({ totalLeads, newLeads, contactedLeads }: {
  totalLeads?: number;
  newLeads?: number;
  contactedLeads?: number;
}) => {
  const safeNewLeads = newLeads || 0;
  const safeContactedLeads = contactedLeads || 0;
  const calculatedTotal = safeNewLeads + safeContactedLeads;

  return (
    <View style={[styles.statCard, { backgroundColor: '#1c69ff' }]}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>Leads Overview</Text>
        <View style={styles.leadsDetails}>
          <View style={styles.leadsRow}>
            <Ionicons name="bar-chart-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.leadsLabel}>Total</Text>
            <Text style={styles.leadsCount}>{calculatedTotal}</Text>
          </View>
          <View style={styles.leadsRow}>
            <Ionicons name="people-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.leadsLabel}>New</Text>
            <Text style={styles.leadsCount}>{safeNewLeads}</Text>
          </View>
          <View style={styles.leadsRow}>
            <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.leadsLabel}>Contacted</Text>
            <Text style={styles.leadsCount}>{safeContactedLeads}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const PropertyOverviewCard = ({ propertyOverview }: {
  propertyOverview?: any;
}) => {
  if (!propertyOverview) {
    return (
      <View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>Property Overview</Text>
          <Text style={styles.statCount}>Loading...</Text>
        </View>
      </View>
    );
  }

  const {
    totalProperties = 0,
    'available for sale': availableForSale = 0,
    'available for rent': availableForRent = 0,
    'sold out': soldOut = 0,
    'rent out': rentOut = 0
  } = propertyOverview;

  return (
    <View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>Property Overview</Text>
        <Text style={styles.statCount}>{totalProperties}</Text>
        <View style={styles.propertyDetails}>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>For Sale: {availableForSale}</Text>
            <Text style={styles.propertyLabel}>For Rent: {availableForRent}</Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Sold: {soldOut}</Text>
            <Text style={styles.propertyLabel}>Rented: {rentOut}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const DealsClosedCard = ({ dealsOverview }: {
  dealsOverview?: any;
}) => {
  if (!dealsOverview) {
    return (
      <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>Deals Overview</Text>
          <Text style={styles.statCount}>Loading...</Text>
        </View>
      </View>
    );
  }

  const {
    'total close': totalClose = 0,
    closed = 0,
    dropped = 0
  } = dealsOverview;

  return (
    <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>Deals Overview</Text>
        <Text style={styles.statCount}>{totalClose}</Text>
        <View style={styles.dealsDetails}>
          <View style={styles.dealsRow}>
            <Text style={styles.dealsLabel}>Closed: {closed}</Text>
            <Text style={styles.dealsLabel}>Dropped: {dropped}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UsersAdminsOverviewCard = ({ usersOverview }: {
  usersOverview?: any;
}) => {
  if (!usersOverview) {
    return (
      <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>Users & Admins</Text>
          <Text style={styles.statCount}>Loading...</Text>
        </View>
      </View>
    );
  }

  const {
    totalUsers = 0,
    activeNormalUsers = 0,
    activeAdmins = 0
  } = usersOverview;

  return (
    <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>Users & Admins</Text>
        <Text style={styles.statCount}>{totalUsers}</Text>
        <View style={styles.usersDetails}>
          <View style={styles.usersRow}>
            <Text style={styles.usersLabel}>Active Users: {activeNormalUsers}</Text>
            <Text style={styles.usersLabel}>Active Admins: {activeAdmins}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 24,
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statCount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leadsDetails: {
    marginTop: 8,
  },
  leadsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  leadsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  leadsCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  propertyDetails: {
    marginTop: 8,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  propertyLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  dealsDetails: {
    marginTop: 8,
  },
  dealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dealsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  usersDetails: {
    marginTop: 8,
  },
  usersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usersLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 12,
    padding: 16,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  warningText: {
    color: '#92400e',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 8,
  },
  errorText: {
    color: '#991b1b',
  },
  loadingContainer: {
    gap: 16,
  },
  loadingCard: {
    height: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
  },
});

export default DashboardStats;
