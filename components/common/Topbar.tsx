import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
    <View className="bg-background border-b border-border">
      {/* Main Header Bar */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-background">
        {/* Left: Hamburger Menu */}
        <TouchableOpacity
          className="p-2 rounded-lg"
          onPress={onSidebarToggle}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#666666" />
        </TouchableOpacity>

        {/* Center: Logo and App Name */}
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <Text className="text-lg font-bold text-white">LT</Text>
          </View>
          <Text className="text-xl font-bold text-textDark">LeadsTracker</Text>
        </View>

        {/* Right: Notification Bell */}
        <TouchableOpacity
          className="p-2 rounded-lg"
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
