import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useDashboardEvents } from '../../core/hooks/useDashboardEvents';

const DashboardEvents = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role;

  const { todayEvents, loading, error } = useDashboardEvents(companyId, userId, role);

  // Hide for DEVELOPER role
  if (role === 'DEVELOPER') {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="calendar-outline" size={20} color="#64748b" />
          <Text style={styles.title}>Your Events for Today</Text>
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
          <Ionicons name="calendar-outline" size={20} color="#64748b" />
          <Text style={styles.title}>Your Events for Today</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={20} color="#64748b" />
        <Text style={styles.title}>Your Events for Today</Text>
      </View>

      <View style={styles.eventsContainer}>
        {!todayEvents || todayEvents.length === 0 ? (
          <EmptyEventMessage />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {todayEvents.map((event, index) => (
              <EventRow key={event?.id || index} event={event} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const EventRow = ({ event }: { event: any }) => {
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
    <View style={styles.eventRow}>
      <View style={styles.eventContent}>
        <Text style={styles.eventText} numberOfLines={2}>
          {event?.content || 'No content'}
        </Text>
        <Text style={styles.eventTime}>{formatTime(event?.dateTime)}</Text>
      </View>
      <View style={styles.eventCreator}>
        <Text style={styles.creatorText} numberOfLines={1}>
          {event?.username || 'Unknown'}
        </Text>
      </View>
    </View>
  );
};

const EmptyEventMessage = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
    <Text style={styles.emptyTitle}>No events scheduled for today</Text>
    <Text style={styles.emptyText}>Your schedule is clear. Great time to catch up on other tasks!</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  eventsContainer: {
    minHeight: 120,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  eventContent: {
    flex: 1,
    marginRight: 12,
  },
  eventText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
    fontWeight: '500',
  },
  eventTime: {
    fontSize: 12,
    color: '#64748b',
  },
  eventCreator: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  creatorText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
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

export default DashboardEvents;
