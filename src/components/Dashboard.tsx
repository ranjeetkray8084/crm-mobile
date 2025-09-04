// src/components/Dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../core/config/firebase.direct'; // Initialize Firebase
import { useResponsive } from '../core/hooks/useResponsive';
import { useAuth } from '../shared/contexts/AuthContext';
import AdminSection from './admins/AdminSection';
import Logo from "./common/Logo";
import NotificationDropdown from './common/NotificationDropdown';
import Sidebar from './common/Sidebar';
import DashboardStats from './dashboard/DashboardStats';
import NotificationsSection from './notifications/NotificationsSection';
import AccountSection from './users/AccountSection';
import UserSection from './users/UserSection';




interface DashboardProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onLogoutPress?: () => void;
}

export default function Dashboard({
  onMenuPress,
  onNotificationPress,
  onLogoutPress,
}: DashboardProps) {
  const responsive = useResponsive();
  const router = useRouter();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simplified functions to avoid Hermes issues
  const handleSidebarToggle = () => {
    setShowSidebar(prev => !prev);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setShowSidebar(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };






  // Handle case when user is not available
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'users':
        return 'Users Management';
      case 'viewUsers':
        return 'Users Management';
      case 'viewAdmins':
        return 'Admins Management';
      case 'notifications':
        return 'Notifications';
      case 'addCompany':
        return 'Add Company';
      case 'viewCompany':
        return 'View Company';
      case 'addAdmin':
        return 'Add Admin / Users';
      case 'account':
        return 'Account Settings';
      default:
        return 'LeadsTracker';
    }
  };

  const getSectionSubtitle = () => {
    switch (activeSection) {
      case 'users':
      case 'viewUsers':
        return 'Manage system users';
      case 'viewAdmins':
        return 'Manage admin users';
      case 'notifications':
        return 'View and manage notifications';
      case 'addCompany':
        return 'Create new company';
      case 'viewCompany':
        return 'View company details';
      case 'addAdmin':
        return 'Add new admin or user';
      case 'account':
        return 'Manage account settings';
      default:
        return '';
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'notifications':
        return (
          <View style={styles.dashboardSections}>
            <NotificationsSection onSectionChange={handleSectionChange} />
          </View>
        );
      case 'users':
      case 'viewUsers':
        return <UserSection />;
      case 'viewAdmins':
        return <AdminSection />;
      case 'addCompany':
        return (
          <View style={styles.dashboardSections}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Add Company</Text>
              <Text style={styles.sectionDescription}>
                This section will contain the form to add a new company.
              </Text>
            </View>
          </View>
        );
      case 'viewCompany':
        return (
          <View style={styles.dashboardSections}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>View Company</Text>
              <Text style={styles.sectionDescription}>
                This section will display company information and details.
              </Text>
            </View>
          </View>
        );
      case 'addAdmin':
        return (
          <View style={styles.dashboardSections}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Add Admin / Users</Text>
              <Text style={styles.sectionDescription}>
                This section will contain the form to add new admin users or regular users.
              </Text>
            </View>
          </View>
        );
      case 'account':
        return <AccountSection />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      {/* StatusBar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Fixed Header */}
      <View style={[styles.header, responsive.getResponsiveHeaderStyles()]}>
        <View style={styles.headerTop}>
          {activeSection !== 'dashboard' ? (
            <TouchableOpacity
              style={[styles.menuButton, responsive.getResponsiveButtonStyles()]}
              onPress={() => handleSectionChange('dashboard')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={responsive.getResponsiveIconSize()} color="#374151" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.menuButton, responsive.getResponsiveButtonStyles()]}
              onPress={handleSidebarToggle}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={responsive.getResponsiveIconSize()} color="#374151" />
            </TouchableOpacity>
          )}

          <View style={styles.appTitleContainer}>
            <View style={styles.appIcon}>
              <Logo size="small" />
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={[styles.appTitle, { fontSize: Math.max(responsive.getResponsiveFontSize(22), 18) }]} numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.8}>
                {getSectionTitle()}
              </Text>
              {activeSection !== 'dashboard' && (
                <Text style={[styles.appSubtitle, { fontSize: responsive.getResponsiveFontSize(12) }]} numberOfLines={1}>
                  {getSectionSubtitle()}
                </Text>
              )}
            </View>
          </View>

                    <View style={styles.headerRight}>
            <NotificationDropdown onSectionChange={handleSectionChange} />
          </View>
        </View>
      </View>

      {/* Sidebar */}
      <Sidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Breadcrumb Navigation */}
      {activeSection !== 'dashboard' && (
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => handleSectionChange('dashboard')}>
            <Text style={styles.breadcrumbItem}>Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>/</Text>
          <Text style={styles.breadcrumbCurrent}>
            {getSectionTitle()}
          </Text>
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#1c69ff']}
            tintColor="#1c69ff"
          />
        }
      >
        {renderSectionContent()}
      </ScrollView>

      {/* Floating Action Button */}
      {activeSection !== 'dashboard' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleSectionChange('dashboard')}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Header Styles
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
    padding: 0,
    paddingHorizontal: 4,
  },
  menuButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginRight: 4,
  },
  appTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    marginLeft: 4,
    marginRight: 8,
  },
  appIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    flexShrink: 0,
  },
  titleTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    minWidth: 0,
    paddingRight: 4,
  },
  appTitle: {
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "left",
    flexShrink: 0,
    includeFontPadding: false,
    letterSpacing: 0.2,
  },
  appSubtitle: {
    color: "#6b7280",
    marginTop: 2,
    textAlign: "left",
    flexShrink: 0,
    includeFontPadding: false,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 4,
  },

  // Dashboard Sections
  dashboardSections: {
    padding: 20,
    gap: 16,
    paddingTop: 8,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    gap: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },

  // Breadcrumb Navigation
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  breadcrumbItem: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#9ca3af',
    marginHorizontal: 8,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1c69ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },



});
