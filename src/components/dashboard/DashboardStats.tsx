import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useDashboardStats } from '../../core/hooks/useDashboardStats';
import { useDashboardEvents } from '../../core/hooks/useDashboardEvents';
import { useTodayFollowUps } from '../../core/hooks/useTodayFollowUps';

const DashboardStats = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role;

  const { stats, loading, error } = useDashboardStats(companyId, userId, role);
  const { todayEvents, loading: eventsLoading, error: eventsError } = useDashboardEvents(companyId, userId, role);
  const { todayFollowUps, loading: followUpsLoading, error: followUpsError } = useTodayFollowUps(companyId);

  // Debug logging for leads data
  console.log('🔍 DashboardStats Debug:', {
    companyId,
    userId,
    role,
    stats: {
      totalLeads: stats?.totalLeads,
      newLeads: stats?.newLeads,
      contactedLeads: stats?.contactedLeads,
    },
    loading,
    error
  });

  // Debug logging for follow-ups data
  console.log('📞 FollowUps Debug:', {
    todayFollowUps,
    followUpsLoading,
    followUpsError
  });

  // Function to handle phone number clicks
  const handlePhoneNumberClick = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === 'No phone') {
      Alert.alert('No Phone Number', 'This lead does not have a phone number.');
      return;
    }

    Alert.alert(
      'Call Lead',
      `Do you want to call ${phoneNumber}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

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
                   <EventsCard events={todayEvents} loading={eventsLoading} error={eventsError} />
          <FollowUpsCard 
            followUps={todayFollowUps} 
            loading={followUpsLoading} 
            error={followUpsError}
            onPhoneNumberClick={handlePhoneNumberClick}
          />
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
      <View style={[styles.statCard, { backgroundColor: '#00b445' }]}>
        <View style={styles.statContent}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>Property Overview</Text>
            <Ionicons name="business-outline" size={24} color="#d1fae5" />
          </View>
          <Text style={styles.propertyLoadingText}>Loading property data...</Text>
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
    <View style={[styles.statCard, { backgroundColor: '#00b445' }]}>
      <View style={styles.statContent}>
        {/* Header with title and building icon */}
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle}>Property Overview</Text>
          <Ionicons name="business-outline" size={24} color="#d1fae5" />
        </View>

        {/* Total Properties section with border */}
        <View style={styles.totalPropertiesSection}>
          <View style={styles.totalPropertiesRow}>
            <View style={styles.totalPropertiesLeft}>
              <Ionicons name="business-outline" size={18} color="#d1fae5" />
              <Text style={styles.totalPropertiesLabel}>Total</Text>
            </View>
            <Text style={styles.totalPropertiesCount}>{totalProperties}</Text>
          </View>
        </View>

        {/* Two Column Layout for Sales and Rental */}
        <View style={styles.propertyGrid}>
          {/* Left Side - Available Properties */}
          <View style={styles.propertyColumn}>
            <View style={styles.propertyStat}>
              <View style={styles.propertyStatHeader}>
                <Ionicons name="home-outline" size={14} color="#d1fae5" />
                <Text style={styles.propertyStatLabel}>Available for Sale</Text>
              </View>
              <Text style={styles.propertyStatCount}>{availableForSale}</Text>
            </View>

            <View style={styles.propertyStat}>
              <View style={styles.propertyStatHeader}>
                <Ionicons name="key-outline" size={14} color="#d1fae5" />
                <Text style={styles.propertyStatLabel}>Available for Rent</Text>
              </View>
              <Text style={styles.propertyStatCount}>{availableForRent}</Text>
            </View>
          </View>

          {/* Right Side - Completed Properties */}
          <View style={styles.propertyColumn}>
            <View style={styles.propertyStat}>
              <View style={styles.propertyStatHeader}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#d1fae5" />
                <Text style={styles.propertyStatLabel}>Sold Out</Text>
              </View>
              <Text style={styles.propertyStatCount}>{soldOut}</Text>
            </View>

            <View style={styles.propertyStat}>
              <View style={styles.propertyStatHeader}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#d1fae5" />
                <Text style={styles.propertyStatLabel}>Rent Out</Text>
              </View>
              <Text style={styles.propertyStatCount}>{rentOut}</Text>
            </View>
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
      <View style={[styles.statCard, { backgroundColor: '#863bff' }]}>
        <View style={styles.statContent}>
          <View style={styles.dealsHeader}>
            <Text style={styles.dealsTitle}>Deals Overview</Text>
            <Ionicons name="trending-up-outline" size={24} color="#e9d5ff" />
          </View>
          <Text style={styles.dealsLoadingText}>Loading deals data...</Text>
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
    <View style={[styles.statCard, { backgroundColor: '#863bff' }]}>
      <View style={styles.statContent}>
        {/* Header with title and trend icon */}
        <View style={styles.dealsHeader}>
          <Text style={styles.dealsTitle}>Deals Overview</Text>
          <Ionicons name="trending-up-outline" size={24} color="#e9d5ff" />
        </View>

        {/* Total Deals section with border */}
        <View style={styles.totalDealsSection}>
          <View style={styles.totalDealsRow}>
            <View style={styles.totalDealsLeft}>
              <Ionicons name="trending-up-outline" size={18} color="#e9d5ff" />
              <Text style={styles.totalDealsLabel}>Total Deals</Text>
            </View>
            <Text style={styles.totalDealsCount}>{totalClose}</Text>
          </View>
        </View>

        {/* Two Column Layout for Closed and Dropped */}
        <View style={styles.dealsGrid}>
          {/* Left Side - Closed Deals */}
          <View style={styles.dealsColumn}>
            <View style={styles.dealsStat}>
              <View style={styles.dealsStatHeader}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#e9d5ff" />
                <Text style={styles.dealsStatLabel}>Closed</Text>
              </View>
              <Text style={styles.dealsStatCount}>{closed}</Text>
            </View>
          </View>

          {/* Right Side - Dropped Deals */}
          <View style={styles.dealsColumn}>
            <View style={styles.dealsStat}>
              <View style={styles.dealsStatHeader}>
                <Ionicons name="close-circle-outline" size={14} color="#e9d5ff" />
                <Text style={styles.dealsStatLabel}>Dropped</Text>
              </View>
              <Text style={styles.dealsStatCount}>{dropped}</Text>
            </View>
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
      <View style={[styles.statCard, { backgroundColor: '#A12FFF' }]}>
        <View style={styles.statContent}>
          <View style={styles.usersHeader}>
            <Text style={styles.usersTitle}>Users & Admins</Text>
            <Ionicons name="people-outline" size={24} color="#e9d5ff" />
          </View>
          <Text style={styles.usersLoadingText}>Loading users data...</Text>
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
    <View style={[styles.statCard, { backgroundColor: '#A12FFF' }]}>
      <View style={styles.statContent}>
        {/* Header with title and people icon */}
        <View style={styles.usersHeader}>
          <Text style={styles.usersTitle}>Users & Admins</Text>
          <Ionicons name="people-outline" size={24} color="#e9d5ff" />
        </View>

        {/* Total Users section with border */}
        <View style={styles.totalUsersSection}>
          <View style={styles.totalUsersRow}>
            <View style={styles.totalUsersLeft}>
              <Ionicons name="people-outline" size={18} color="#e9d5ff" />
              <Text style={styles.totalUsersLabel}>Total Users</Text>
            </View>
            <Text style={styles.totalUsersCount}>{totalUsers}</Text>
          </View>
        </View>

        {/* Two Column Layout for Users and Admins */}
        <View style={styles.usersGrid}>
          {/* Left Side - Users */}
          <View style={styles.usersColumn}>
            <View style={styles.usersStat}>
              <View style={styles.usersStatHeader}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#e9d5ff" />
                <Text style={styles.usersStatLabel}>Active Users</Text>
              </View>
              <Text style={styles.usersStatCount}>{activeNormalUsers}</Text>
            </View>

            <View style={styles.usersStat}>
              <View style={styles.usersStatHeader}>
                <Ionicons name="people-outline" size={14} color="#e9d5ff" />
                <Text style={styles.usersStatLabel}>Normal Users</Text>
              </View>
              <Text style={styles.usersStatCount}>{activeNormalUsers}</Text>
            </View>
          </View>

          {/* Right Side - Admins */}
          <View style={styles.usersColumn}>
            <View style={styles.usersStat}>
              <View style={styles.usersStatHeader}>
                <Ionicons name="shield-outline" size={14} color="#e9d5ff" />
                <Text style={styles.usersStatLabel}>Active Admins</Text>
              </View>
              <Text style={styles.usersStatCount}>{activeAdmins}</Text>
            </View>

            <View style={styles.usersStat}>
              <View style={styles.usersStatHeader}>
                <Ionicons name="shield-outline" size={14} color="#e9d5ff" />
                <Text style={styles.usersStatLabel}>Total Admins</Text>
              </View>
              <Text style={styles.usersStatCount}>{activeAdmins}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
     );
 };
 
 const EventsCard = ({ events, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <View style={styles.eventsTitleRow}>
            <Ionicons name="calendar-outline" size={20} color="#1e40af" />
            <Text style={styles.eventsTitle}>Your Events for Today</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <View style={styles.eventsTitleRow}>
            <Ionicons name="calendar-outline" size={20} color="#1e40af" />
            <Text style={styles.eventsTitle}>Your Events for Today</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events</Text>
        </View>
      </View>
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <View style={styles.eventsTitleRow}>
            <Ionicons name="calendar-outline" size={20} color="#1e40af" />
            <Text style={styles.eventsTitle}>Your Events for Today</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events for today</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.eventsCard}>
      <View style={styles.eventsHeader}>
        <View style={styles.eventsTitleRow}>
          <Ionicons name="calendar-outline" size={20} color="#1e40af" />
          <Text style={styles.eventsTitle}>Your Events for Today</Text>
        </View>
      </View>
      
      <View style={styles.eventsList}>
        {events.map((event, index) => (
          <View key={index} style={styles.eventItem}>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.content}</Text>
              <Text style={styles.eventTime}>
                {new Date(event.dateTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </Text>
            </View>
            <View style={styles.eventCreator}>
              <Ionicons name="person-outline" size={16} color="#6b7280" />
              <Text style={styles.eventCreatorText}>{event.username}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
 
 const FollowUpsCard = ({ followUps, loading, error, onPhoneNumberClick }) => {
  if (loading) {
    return (
      <View style={styles.followUpsCard}>
        <View style={styles.followUpsHeader}>
          <View style={styles.followUpsTitleRow}>
            <Ionicons name="time-outline" size={20} color="#059669" />
            <Text style={styles.followUpsTitle}>Today's Follow-ups</Text>
          </View>
   
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading follow-ups...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.followUpsCard}>
        <View style={styles.followUpsHeader}>
          <View style={styles.followUpsTitleRow}>
            <Ionicons name="time-outline" size={20} color="#059669" />
            <Text style={styles.followUpsTitle}>Today's Follow-ups</Text>
          </View>
  
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load follow-ups</Text>
        </View>
      </View>
    );
  }

  if (!followUps || followUps.length === 0) {
    return (
      <View style={styles.followUpsCard}>
        <View style={styles.followUpsHeader}>
          <View style={styles.followUpsTitleRow}>
            <Ionicons name="time-outline" size={20} color="#059669" />
            <Text style={styles.followUpsTitle}>Today's Follow-ups</Text>
          </View>
          
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No follow-ups for today</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.followUpsCard}>
      <View style={styles.followUpsHeader}>
        <View style={styles.followUpsTitleRow}>
          <Ionicons name="time-outline" size={20} color="#059669" />
          <Text style={styles.followUpsTitle}>Today's Follow-ups</Text>
        </View>
        
      </View>
      
             <View style={styles.followUpsList}>
         {followUps.map((followUp, index) => {
           // Debug logging for individual follow-up
           console.log(`📞 FollowUp ${index}:`, followUp);
           
           return (
             <View key={index} style={styles.followUpItem}>
                         <View style={styles.followUpLead}>
               <Text style={styles.followUpLeadName}>{followUp.lead?.name || followUp.leadName || 'Unknown Lead'}</Text>
               <TouchableOpacity onPress={() => onPhoneNumberClick(followUp.lead?.phone || followUp.leadPhone)}>
                 <Text style={[styles.followUpLeadPhone, styles.clickablePhone]}>
                   {followUp.lead?.phone || followUp.leadPhone || 'No phone'}
                 </Text>
               </TouchableOpacity>
             </View>
            <View style={styles.followUpNote}>
              <Text style={styles.followUpNoteText}>{followUp.note || 'No note'}</Text>
            </View>
                         <View style={styles.followUpTime}>
               <Ionicons name="time-outline" size={16} color="#059669" />
               <Text style={styles.followUpTimeText}>
                 {new Date(followUp.followupDate).toLocaleTimeString('en-US', { 
                   hour: '2-digit', 
                   minute: '2-digit',
                   hour12: false 
                 })}
               </Text>
             </View>
           </View>
         );
       })}
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
  // Enhanced PropertyOverviewCard styles
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  propertyTitle: {
    color: '#d1fae5',
    fontSize: 18,
    fontWeight: '600',
  },
  propertyLoadingText: {
    color: '#d1fae5',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  totalPropertiesSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#00994a',
    paddingBottom: 16,
    marginBottom: 16,
  },
  totalPropertiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPropertiesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalPropertiesLabel: {
    color: '#d1fae5',
    fontSize: 16,
    fontWeight: '500',
  },
  totalPropertiesCount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  propertyGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  propertyColumn: {
    flex: 1,
    gap: 12,
  },
  propertyStat: {
    alignItems: 'center',
  },
  propertyStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  propertyStatLabel: {
    color: '#d1fae5',
    fontSize: 16,
    fontWeight: '500',
  },
  propertyStatCount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Enhanced DealsClosedCard styles
  dealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dealsTitle: {
    color: '#e9d5ff',
    fontSize: 18,
    fontWeight: '600',
  },
  dealsLoadingText: {
    color: '#e9d5ff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  totalDealsSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#c084fc',
    paddingBottom: 16,
    marginBottom: 16,
  },
  totalDealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalDealsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalDealsLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalDealsCount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  dealsGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  dealsColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dealsStat: {
    alignItems: 'center',
  },
  dealsStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  dealsStatLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: '500',
  },
  dealsStatCount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Enhanced UsersAdminsOverviewCard styles
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  usersTitle: {
    color: '#e9d5ff',
    fontSize: 18,
    fontWeight: '600',
  },
  usersLoadingText: {
    color: '#e9d5ff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  totalUsersSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#c084fc',
    paddingBottom: 16,
    marginBottom: 16,
  },
  totalUsersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalUsersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalUsersLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalUsersCount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  usersGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  usersColumn: {
    flex: 1,
    gap: 12,
  },
  usersStat: {
    alignItems: 'center',
  },
  usersStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  usersStatLabel: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: '500',
  },
     usersStatCount: {
     color: '#ffffff',
     fontSize: 20,
     fontWeight: 'bold',
   },
       // Events and Follow-ups Cards styles
    eventsCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    eventsHeader: {
      marginBottom: 16,
    },
    eventsTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    eventsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1f2937',
    },
    eventsList: {
      gap: 12,
    },
    eventItem: {
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#1e40af',
    },
    eventContent: {
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 4,
    },
    eventTime: {
      fontSize: 14,
      color: '#6b7280',
    },
    eventCreator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    eventCreatorText: {
      fontSize: 14,
      color: '#6b7280',
    },
    followUpsCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    followUpsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    followUpsTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    followUpsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1f2937',
    },
    autoNotificationsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#fef3c7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#f59e0b',
    },
    autoNotificationsText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#92400e',
    },
    followUpsList: {
      gap: 12,
    },
    followUpItem: {
      backgroundColor: '#f0fdf4',
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#059669',
    },
    followUpLead: {
      marginBottom: 8,
    },
    followUpLeadName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 2,
    },
    followUpLeadPhone: {
      fontSize: 14,
      color: '#6b7280',
    },
    followUpNote: {
      marginBottom: 8,
    },
    followUpNoteText: {
      fontSize: 14,
      color: '#374151',
      fontStyle: 'italic',
    },
    followUpTime: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
         followUpTimeText: {
       fontSize: 14,
       color: '#059669',
       fontWeight: '500',
     },
     // Loading, Error, and Empty state styles
     loadingContainer: {
       alignItems: 'center',
       paddingVertical: 20,
     },
     loadingText: {
       fontSize: 14,
       color: '#6b7280',
       fontStyle: 'italic',
     },
     errorContainer: {
       alignItems: 'center',
       paddingVertical: 20,
     },
     errorText: {
       fontSize: 14,
       color: '#ef4444',
       fontStyle: 'italic',
     },
     emptyContainer: {
       alignItems: 'center',
       paddingVertical: 20,
     },
     emptyText: {
       fontSize: 14,
       color: '#6b7280',
       fontStyle: 'italic',
     },
     clickablePhone: {
       textDecorationLine: 'underline',
       color: '#059669',
     },
 });

export default DashboardStats;
