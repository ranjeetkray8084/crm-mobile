import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
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
    <View className={`w-70 bg-gray-800 h-full flex-col ${isCollapsed ? 'w-16' : ''}`}>
      {/* Header */}
      <View className="p-4 border-b border-gray-700 flex-shrink-0">
        <View className="flex-row items-center gap-3">
          <Image
            source={require('../../assets/images/icon.png')}
            className="w-8 h-8 rounded-2xl flex-shrink-0"
            resizeMode="contain"
          />
          {!isCollapsed && (
            <View className="flex-1 min-w-0">
              <Text className="text-base font-semibold text-white mb-0.5">LeadsTracker</Text>
              <Text className="text-xs text-gray-400">(By Smartprocare)</Text>
            </View>
          )}
        </View>
      </View>

      {/* Navigation */}
      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        <View className="py-2 gap-1">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const isLogout = (item as any).isLogout;

            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center px-3 py-2.5 rounded-lg mb-0.5 ${
                  isActive ? 'bg-gray-700' : ''
                } ${isCollapsed ? 'justify-center px-2' : ''} ${
                  isLogout ? 'bg-gray-800 border border-red-500 rounded-lg mb-0.5' : ''
                }`}
                onPress={() => handleSectionChange(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isLogout ? '#ef4444' : (isActive ? '#ffffff' : '#9ca3af')}
                  className="mr-3 w-5"
                />
                {!isCollapsed && (
                  <Text className={`text-sm text-gray-400 flex-1 ${
                    isActive ? 'text-white font-semibold' : ''
                  } ${isLogout ? 'text-red-500 font-semibold' : ''}`}>
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
        <View className="p-4 border-t border-gray-700 flex-shrink-0">
          <View className="items-center">
            <Text className="text-sm font-medium text-white mb-0.5">{userName}</Text>
            <Text className="text-xs text-gray-400">{userRoleDisplay}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Sidebar;
