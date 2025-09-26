// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../shared/contexts/AuthContext';
import { useResponsive } from '../core/hooks/useResponsive';
import { useNavigationHistory } from '../core/hooks/useNavigationHistory';
import Sidebar from './common/Sidebar';
import NotificationDropdown from './common/NotificationDropdown';
import DashboardStats from './dashboard/DashboardStats';
import NotificationsSection from './notifications/NotificationsSection';
import UserSection from './users/UserSection';
import AdminSection from './admins/AdminSection';
import DirectorsSection from './directors/DirectorsSection';
import AccountSection from './users/AccountSection';
import Logo from "./common/Logo";



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
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  // Use navigation history hook for better navigation management
  const { 
    currentSection: activeSection, 
    navigateToSection: setActiveSection, 
    goBack 
  } = useNavigationHistory('dashboard');
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('SmartProCare');

  // Dashboard initialization
  useEffect(() => {
    const initializeDashboard = () => {
      console.log('🔧 Dashboard: Initializing...');
      console.log('🔧 Dashboard: Auth state:', { isAuthenticated, authLoading, user: !!user });
      
      if (authLoading) {
        console.log('🔧 Dashboard: Auth still loading, waiting...');
        return;
      }
      
      if (!isAuthenticated || !user) {
        console.log('🔧 Dashboard: User not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      try {
        const finalUserId = user.userId || user.id || '';
        const finalUserRole = user.role || '';
        const finalCompanyId = user.companyId || '';
        
        // More lenient check - only redirect if critical data is missing
        if (!finalUserId || !finalUserRole) {
          console.log('🔧 Dashboard: Critical user data missing, redirecting to login');
          router.replace('/login');
          return;
        }
        
        // Set user data
        setUserRole(finalUserRole);
        setUserName(user.name || '');
        setUserId(finalUserId);
        setCompanyId(finalCompanyId || ''); // Allow empty companyId for now
        if (user.companyName) {
          setCompanyName(user.companyName);
        }
        
        console.log('🔧 Dashboard: Initialization complete', {
          userRole: finalUserRole,
          userName: user.name,
          userId: finalUserId,
          companyId: finalCompanyId
        });
        
        setIsInitializing(false);
      } catch (err) {
        console.error('🔧 Dashboard: Initialization error:', err);
        router.replace('/login');
      }
    };

    // Add a small delay to ensure auth context is fully available
    const timer = setTimeout(initializeDashboard, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, authLoading, user, router]);

  // Simplified functions to avoid Hermes issues
  const handleSidebarToggle = () => {
    setShowSidebar(prev => !prev);
  };

  const handleSectionChange = (section: string) => {
    console.log('🎯 Dashboard: handleSectionChange called with section:', section);
    console.log('🎯 Dashboard: Current section before change:', activeSection);
    console.log('🎯 Dashboard: About to navigate to:', section);
    
    // Use navigateToSection to properly update navigation history
    setActiveSection(section);
    setShowSidebar(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Show loading state while initializing
  if (authLoading || isInitializing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1c69ff" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle case when user is not available after loading
  if (!user || !isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Redirecting to login...</Text>
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
      case 'viewDirectors':
        return 'Directors Management';
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
      case 'viewDirectors':
        return 'View all directors';
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
    // Role-based access control using local state
    const currentUserRole = userRole || user?.role;
    
    switch (activeSection) {
      case 'notifications':
        return (
          <View style={styles.dashboardSections}>
            <NotificationsSection onSectionChange={handleSectionChange} />
          </View>
        );
      case 'users':
      case 'viewUsers':
        // Only ADMIN, DIRECTOR, and DEVELOPER can access user management
        if (currentUserRole === 'ADMIN' || currentUserRole === 'DIRECTOR' || currentUserRole === 'DEVELOPER') {
          return <UserSection />;
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to access user management.
                </Text>
              </View>
            </View>
          );
        }
      case 'viewAdmins':
        // Only DIRECTOR and DEVELOPER can access admin management
        if (currentUserRole === 'DIRECTOR' || currentUserRole === 'DEVELOPER') {
          return <AdminSection />;
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to access admin management.
                </Text>
              </View>
            </View>
          );
        }
      case 'viewDirectors':
        // Only DEVELOPER can access director management
        if (currentUserRole === 'DEVELOPER') {
          return <DirectorsSection />;
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to access director management.
                </Text>
              </View>
            </View>
          );
        }
      case 'addCompany':
        // Only DEVELOPER can add companies
        if (currentUserRole === 'DEVELOPER') {
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
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to add companies.
                </Text>
              </View>
            </View>
          );
        }
      case 'viewCompany':
        // Only DEVELOPER can view all companies
        if (currentUserRole === 'DEVELOPER') {
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
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to view company management.
                </Text>
              </View>
            </View>
          );
        }
      case 'addAdmin':
        // Only DEVELOPER can add admins
        if (currentUserRole === 'DEVELOPER') {
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
        } else {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Access Denied</Text>
                <Text style={styles.sectionDescription}>
                  You don't have permission to add admins or users.
                </Text>
              </View>
            </View>
          );
        }
      case 'account':
        return <AccountSection />;
      default:
        // Show Default Dashboard Content
        console.log('🔧 Dashboard: Rendering DashboardStats with props:', {
          userRole,
          userId,
          companyId,
          userName,
          companyName
        });
        
        // Only render DashboardStats if we have the required user data
        if (!userRole || !userId) {
          return (
            <View style={styles.dashboardSections}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Loading Dashboard...</Text>
                <Text style={styles.sectionDescription}>
                  Please wait while we load your dashboard data.
                </Text>
              </View>
            </View>
          );
        }
        
        return (
          <>
            {/* Dashboard Stats Cards */}
            <DashboardStats 
              userRole={userRole}
              userId={userId}
              companyId={companyId}
            />
          </>
        );
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
        userRole={userRole}
        companyName={companyName}
        userName={userName}
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
