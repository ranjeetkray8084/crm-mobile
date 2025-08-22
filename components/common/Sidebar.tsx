import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface SidebarProps {
  userRole: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  companyName?: string;
  userName?: string;
  userRoleDisplay?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeSection,
  onSectionChange,
  companyName = 'SmartProCare',
  userName = 'User',
  userRoleDisplay = 'User',
  onClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    const commonItems = [{ id: 'ViewDashboard', label: 'Dashboard', icon: 'bar-chart-outline' }];

    const roleSpecificItems = {
      ADMIN: [
        { id: 'ViewUsers', label: 'Users', icon: 'people-outline' },
        { id: 'ViewLead', label: 'Leads', icon: 'document-text-outline' },
        { id: 'ViewProperty', label: 'Property', icon: 'business-outline' },
        { id: 'ViewNotes', label: 'Notes/Event', icon: 'calendar-outline' },
        { id: 'ViewTask', label: 'Calling Data', icon: 'call-outline' },
        { id: 'ViewAccount', label: 'Account', icon: 'person-outline' },
        { id: 'logout', label: 'Log Out', icon: 'exit-outline', isLogout: true },
      ],
      USER: [
        { id: 'ViewLead', label: 'Leads', icon: 'document-text-outline' },
        { id: 'ViewProperty', label: 'Property', icon: 'business-outline' },
        { id: 'ViewNotes', label: 'Notes/Event', icon: 'calendar-outline' },
        { id: 'ViewTask', label: 'Calling Data', icon: 'call-outline' },
        { id: 'ViewAccount', label: 'Account', icon: 'person-outline' },
        { id: 'logout', label: 'Log Out', icon: 'exit-outline', isLogout: true },
      ],
      DEVELOPER: [
        { id: 'addCompany', label: 'Add Company', icon: 'add-outline' },
        { id: 'ViewCompany', label: 'View Company', icon: 'eye-outline' },
        { id: 'AddAdmin', label: 'Add Admin / Users', icon: 'add-outline' },
        { id: 'ViewAdmins', label: 'View Admin', icon: 'eye-outline' },
        { id: 'ViewDirectors', label: 'View Directors', icon: 'eye-outline' },
        { id: 'ViewUsers', label: 'View Users', icon: 'eye-outline' },
        { id: 'ViewAccount', label: 'Account', icon: 'person-outline' },
        { id: 'logout', label: 'Log Out', icon: 'exit-outline', isLogout: true },
      ],
      DIRECTOR: [
        { id: 'ViewAdmins', label: 'Admins', icon: 'people-outline' },
        { id: 'ViewLead', label: 'Leads', icon: 'document-text-outline' },
        { id: 'ViewProperty', label: 'Property', icon: 'business-outline' },
        { id: 'ViewNotes', label: 'Notes/Event', icon: 'calendar-outline' },
        { id: 'ViewTask', label: 'Calling Data', icon: 'call-outline' },
        { id: 'ViewAccount', label: 'Account', icon: 'person-outline' },
        { id: 'ViewUsers', label: 'Users', icon: 'people-outline' },
        { id: 'logout', label: 'Log Out', icon: 'exit-outline', isLogout: true },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || [])];
  };

  const menuItems = getMenuItems();

  const handleSectionChange = (section: string) => {
    if (section === 'logout') {
      // Show confirmation dialog for logout
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              onSectionChange(section);
              if (onClose) {
                onClose();
              }
            },
          },
        ]
      );
      return;
    }
    
    onSectionChange(section);
    if (onClose) {
      onClose();
    }
  };

  return (
    <View style={[
      styles.container,
      isCollapsed && styles.containerCollapsed
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {!isCollapsed && (
            <View style={styles.headerText}>
              <Text style={styles.appName}>LeadsTracker</Text>
              <Text style={styles.companyName}>(By Smartprocare)</Text>
            </View>
          )}
        </View>
      </View>

      {/* Navigation */}
      <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const isLogout = (item as any).isLogout;

            return (
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  isCollapsed && styles.menuItemCollapsed,
                  isLogout && styles.menuItemLogout
                ]}
                onPress={() => handleSectionChange(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isLogout ? '#ef4444' : (isActive ? '#ffffff' : '#9ca3af')}
                  style={styles.menuIcon}
                />
                {!isCollapsed && (
                  <Text style={[
                    styles.menuText,
                    isActive && styles.menuTextActive,
                    isLogout && styles.menuTextLogout
                  ]}>
                    {item.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer - User Info (Mobile Only) */}
      {onClose && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{userRoleDisplay}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: '#1f2937',
    height: '100%',
    flexDirection: 'column',
  },
  containerCollapsed: {
    width: 64,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexShrink: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: '#9ca3af',
  },
  navigation: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuContainer: {
    paddingVertical: 8,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#374151',
  },
  menuItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  menuItemLogout: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    marginBottom: 4,
  },
  menuIcon: {
    marginRight: 12,
    width: 20,
  },
  menuText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
  },
  menuTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  menuTextLogout: {
    color: '#ef4444',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    flexShrink: 0,
  },
  footerContent: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
