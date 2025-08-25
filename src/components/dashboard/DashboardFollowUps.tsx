import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useTodayFollowUps } from '../../core/hooks/useTodayFollowUps';

const DashboardFollowUps = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;

  const { todayFollowUps, loading, error } = useTodayFollowUps(companyId);

  // Filter follow-ups for current user
  const filteredFollowUps = (todayFollowUps || []).filter(fu => fu.userId === userId);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="time-outline" size={20} color="#64748b" />
          <Text style={styles.title}>Today's Follow-ups</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>🔔 Auto</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="time-outline" size={20} color="#64748b" />
          <Text style={styles.title}>Today's Follow-ups</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>🔔 Auto</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load follow-ups</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={20} color="#64748b" />
          <Text style={styles.title}>Today's Follow-ups</Text>
        </View>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>🔔 Auto</Text>
        </View>
      </View>

      <View style={styles.followUpsContainer}>
        {!filteredFollowUps || filteredFollowUps.length === 0 ? (
          <EmptyFollowUpMessage />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredFollowUps.map((followUp, index) => (
              <FollowUpRow key={followUp?.id || index} followUp={followUp} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const FollowUpRow = ({ followUp }: { followUp: any }) => {
  const formatTime = (dateTime: string) => {
    if (!dateTime) return 'No time';
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return 'No time';
    }
  };

  return (
    <View style={styles.followUpRow}>
      <View style={styles.leadInfo}>
        <Text style={styles.leadName} numberOfLines={1}>
          {followUp?.lead?.name || 'Unknown Lead'}
        </Text>
        <Text style={styles.leadPhone} numberOfLines={1}>
          {followUp?.lead?.phone || 'No phone'}
        </Text>
      </View>
      <View style={styles.noteInfo}>
        <Text style={styles.noteText} numberOfLines={2}>
          {followUp?.note || 'No note'}
        </Text>
      </View>
      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>{formatTime(followUp?.followupDate)}</Text>
      </View>
    </View>
  );
};

const EmptyFollowUpMessage = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="time-outline" size={48} color="#cbd5e1" />
    <Text style={styles.emptyTitle}>No follow-ups scheduled for today</Text>
    <Text style={styles.emptyText}>All your follow-ups are up to date. Great job staying organized!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  notificationBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '500',
  },
  followUpsContainer: {
    minHeight: 120,
  },
  followUpRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  leadInfo: {
    marginBottom: 8,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  leadPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  noteInfo: {
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    minHeight: 120,
  },
  loadingCard: {
    height: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  errorContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
});

export default DashboardFollowUps;
