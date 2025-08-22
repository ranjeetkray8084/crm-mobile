import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationDropdown } from './index';

interface TopbarProps {
  userName?: string;
  userRole?: string;
  companyName?: string;
  onLogout?: () => void;
  onAddAction?: (action: string) => void;
  onSectionChange?: (section: string) => void;
  onSidebarToggle?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  userName = 'User Name',
  userRole = 'User',
  companyName = 'Company Name',
  onLogout,
  onAddAction,
  onSectionChange,
  onSidebarToggle,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Header Bar */}
      <View style={styles.header}>
        {/* Left: Hamburger Menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onSidebarToggle}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#666666" />
        </TouchableOpacity>

        {/* Center: Logo and App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LT</Text>
          </View>
          <Text style={styles.appName}>LeadsTracker</Text>
        </View>

        {/* Right: Notification Bell */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => onSectionChange?.('ViewNotification')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={24} color="#4785FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Topbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4785FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
  },
});
