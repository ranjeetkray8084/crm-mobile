// src/components/Dashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "./common/Sidebar";
import NotificationDropdown from "./common/NotificationDropdown";
import DashboardStats from "./dashboard/DashboardStats";
import DashboardEvents from "./dashboard/DashboardEvents";
import DashboardFollowUps from "./dashboard/DashboardFollowUps";
import NotificationsSection from "./notifications/NotificationsSection";
import { UserSection, AdminSection } from "./index";

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
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Close sidebar when a section is selected
    setShowSidebar(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Add a small delay to show the refresh indicator
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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
        return (
          <View style={styles.dashboardSections}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <Text style={styles.sectionDescription}>
                This section will contain account management options and settings.
              </Text>
            </View>
          </View>
        );
      default:
        // Show Default Dashboard Content
        return (
          <>
            {/* Dashboard Stats Cards */}
            <DashboardStats />

            {/* Today's Events and Follow-ups */}
            <View style={styles.dashboardSections}>
              <DashboardEvents />
              <DashboardFollowUps />
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* StatusBar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Fixed Header - Keep existing header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {(activeSection !== 'dashboard') ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleSectionChange('dashboard')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleSidebarToggle}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#374151" />
            </TouchableOpacity>
          )}

          <View style={styles.appTitleContainer}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>LT</Text>
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={styles.appTitle}>
                {getSectionTitle()}
              </Text>
              {(activeSection !== 'dashboard') && (
                <Text style={styles.appSubtitle}>
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
      {(activeSection !== 'dashboard') && (
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

      {/* Floating Action Button for Quick Navigation */}
      {(activeSection !== 'dashboard') && (
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Header Styles (fixed) - Keep existing styles
  header: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10, // keep above content
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  menuButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  appTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1c69ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#1c69ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  appIconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Dashboard Sections
  dashboardSections: {
    padding: 20,
    paddingTop: 8,
    gap: 16,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
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
});
