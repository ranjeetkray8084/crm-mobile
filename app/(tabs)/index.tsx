// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/shared/contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getRoleDisplay = (role: string | undefined) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'USER':
        return 'User';
      case 'DIRECTOR':
        return 'Director';
      case 'DEVELOPER':
        return 'Developer';
      default:
        return role;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={60} color="#1c69ff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userRole}>{getRoleDisplay(user?.role)}</Text>
            {user?.companyName && (
              <Text style={styles.companyName}>{user.companyName}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle-outline" size={32} color="#1c69ff" />
            </View>
            <Text style={styles.actionText}>Add Lead</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="calendar-outline" size={32} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Schedule Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="analytics-outline" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="people-outline" size={32} color="#8b5cf6" />
            </View>
            <Text style={styles.actionText}>Manage Team</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Lead follow-up completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="add-circle" size={20} color="#1c69ff" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New lead added</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="calendar" size={20} color="#f59e0b" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Task scheduled</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Total Leads</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1c69ff',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    color: '#e0e7ff',
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    color: '#c7d2fe',
    fontSize: 14,
    marginBottom: 2,
  },
  companyName: {
    color: '#c7d2fe',
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c69ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
