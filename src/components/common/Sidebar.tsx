import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../shared/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ 
  isVisible, 
  onClose, 
  activeSection, 
  onSectionChange 
}: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' }
    ];

    const roleSpecificItems = {
      ADMIN: [
        { id: 'users', label: 'Users Management', icon: 'people-outline' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
        { id: 'account', label: 'Account Settings', icon: 'person-outline' },
      ],
      USER: [
        { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
        { id: 'account', label: 'Account Settings', icon: 'person-outline' },
      ],
      DEVELOPER: [
        { id: 'addCompany', label: 'Add Company', icon: 'add-circle-outline' },
        { id: 'viewCompany', label: 'View Company', icon: 'eye-outline' },
        { id: 'addAdmin', label: 'Add Admin / Users', icon: 'person-add-outline' },
        { id: 'viewAdmins', label: 'View Admin', icon: 'people-outline' },
        { id: 'viewDirectors', label: 'View Directors', icon: 'people-outline' },
        { id: 'viewUsers', label: 'View Users', icon: 'people-outline' },
        { id: 'account', label: 'Account Settings', icon: 'person-outline' },
      ],
      DIRECTOR: [
        { id: 'viewAdmins', label: 'Admins', icon: 'people-outline' },
        { id: 'viewUsers', label: 'Users', icon: 'people-outline' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
        { id: 'account', label: 'Account Settings', icon: 'person-outline' },
      ],
    };

    const userRole = (user?.role || 'USER') as keyof typeof roleSpecificItems;
    return [...commonItems, ...(roleSpecificItems[userRole] || roleSpecificItems.USER)];
  };

  const handleSectionChange = (section: string) => {
    if (section === 'logout') {
      handleLogout();
      return;
    }

    // Only change the section to show content in main area
    onSectionChange(section);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = getMenuItems();

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sidebar} activeOpacity={1} onPress={() => {}}>
          <SafeAreaView style={styles.sidebarContent} edges={['top', 'left', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>LT</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>LeadsTracker</Text>
                  <Text style={styles.subtitle}>(By Smartprocare)</Text>
                </View>
              </View>
            </View>

            {/* Navigation */}
            <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
              <View style={styles.menuItems}>
                {menuItems.map((item) => {
                  const isActive = activeSection === item.id;
                  
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.menuItem, isActive && styles.activeMenuItem]}
                      onPress={() => handleSectionChange(item.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color={isActive ? '#fff' : '#9ca3af'} 
                      />
                      <Text style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Logout Button */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutLabel}>Log Out</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Footer - User Info */}
            <View style={styles.footer}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <Text style={styles.userRole}>{user?.role || 'Role'}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#1f2937',
    flex: 1,
  },
  sidebarContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  navigation: {
    flex: 1,
    padding: 16,
  },
  menuItems: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeMenuItem: {
    backgroundColor: '#374151',
  },
  menuLabel: {
    fontSize: 16,
    color: '#9ca3af',
    marginLeft: 12,
    fontWeight: '500',
  },
  activeMenuLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutLabel: {
    fontSize: 16,
    color: '#ef4444',
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  userRole: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
});
