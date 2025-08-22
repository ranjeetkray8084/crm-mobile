import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { Sidebar, Topbar, ResponsiveContainer } from './common';

const { width: screenWidth } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  icon: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, onPress }) => (
  <TouchableOpacity 
    style={[styles.statCard, { backgroundColor: color }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  </TouchableOpacity>
);

export default function Dashboard() {
  const { user, userName, userRole, companyName, logout, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('ViewDashboard');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Watch for authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Dashboard: User no longer authenticated, navigating to login');
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    console.log('Logout triggered from Dashboard');
    try {
      await logout();
      console.log('Logout successful, authentication state should change');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    console.log('Section change requested:', section);
    if (section === 'logout') {
      console.log('Logout section detected, calling handleLogout');
      handleLogout();
      return;
    }
    setActiveSection(section);
  };

  const handleAddAction = (action: string) => {
    // Handle add actions based on role
    console.log('Add action:', action);
    // You can implement navigation to forms here
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'ViewDashboard':
        return (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Stats Cards Container */}
            <View style={styles.statsContainer}>
              {dashboardStats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  color={stat.color}
                  icon={stat.icon}
                />
              ))}
            </View>

            {/* Your Events Section */}
            <View style={styles.eventsSection}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>📅</Text>
                <Text style={styles.eventTitle}>Your Events for Today</Text>
              </View>
              
              <View style={styles.eventsContainer}>
                <View style={styles.noEventsContainer}>
                  <Text style={styles.noEventsIcon}>📅</Text>
                  <Text style={styles.noEventsText}>No events for today</Text>
                </View>
              </View>
            </View>

            {/* Extra padding for tab bar */}
            <View style={{ height: 100 }} />
          </ScrollView>
        );
      
      case 'ViewLead':
        return (
          <ResponsiveContainer title="Leads Management" icon="document-text-outline">
            <Text style={styles.sectionText}>Leads section content will go here</Text>
          </ResponsiveContainer>
        );
      
      case 'ViewProperty':
        return (
          <ResponsiveContainer title="Property Management" icon="business-outline">
            <Text style={styles.sectionText}>Property section content will go here</Text>
          </ResponsiveContainer>
        );
      
      case 'ViewUsers':
        return (
          <ResponsiveContainer title="Users Management" icon="people-outline">
            <Text style={styles.sectionText}>Users section content will go here</Text>
          </ResponsiveContainer>
        );
      
      case 'ViewNotes':
        return (
          <ResponsiveContainer title="Notes & Events" icon="calendar-outline">
            <Text style={styles.sectionText}>Notes section content will go here</Text>
          </ResponsiveContainer>
        );
      
      case 'ViewTask':
        return (
          <ResponsiveContainer title="Calling Data" icon="call-outline">
            <Text style={styles.sectionText}>Tasks section content will go here</Text>
          </ResponsiveContainer>
        );
      
      case 'ViewAccount':
        return (
          <ResponsiveContainer title="Account Settings" icon="person-outline">
            <Text style={styles.sectionText}>Account section content will go here</Text>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer title="Dashboard" icon="home-outline">
            <Text style={styles.sectionText}>Select a section from the sidebar</Text>
          </ResponsiveContainer>
        );
    }
  };

  // Dashboard stats
  const dashboardStats = [
    {
      title: 'Companies',
      value: 12,
      color: '#4785FF',
      icon: '🏢',
    },
    {
      title: 'Total Users',
      value: 25,
      color: '#34C759',
      icon: '👥',
    },
    {
      title: 'Admins',
      value: 8,
      color: '#AF52DE',
      icon: '🛡',
    },
    {
      title: 'Directors',
      value: 3,
      color: '#FF9500',
      icon: '⭐',
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={48} color="#3b82f6" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Topbar */}
      <Topbar
        userName={userName}
        userRole={userRole}
        companyName={companyName}
        onAddAction={handleAddAction}
        onSectionChange={setActiveSection}
        onSidebarToggle={() => setShowSidebar(true)}
      />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Mobile Sidebar Modal */}
      <Modal
        visible={showSidebar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSidebar(false)}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              userRole={userRole}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              companyName={companyName}
              userName={userName}
              userRoleDisplay={userRole}
              onClose={() => setShowSidebar(false)}
            />
          </View>
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            onPress={() => setShowSidebar(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // Stats Cards Styles
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  cardIcon: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.6)',
  },
  cardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 56,
  },
  // Events Section Styles
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  eventsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEventsIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.3,
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  // Section Content Styles
  sectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 40,
  },
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  // Sidebar Modal Styles
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
  },
  sidebarBackdrop: {
    flex: 1,
  },
});
