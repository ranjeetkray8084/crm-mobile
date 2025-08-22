import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { userRole } = useAuth();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // You can add navigation logic here if needed
    console.log('Tab pressed:', tab);
  };

  const handleAddAction = (action: string) => {
    // Handle add actions here
    console.log('Add action:', action);
    // You can add navigation logic or other actions based on the action type
    switch (action) {
      case 'User':
        // Navigate to add user screen
        break;
      case 'Lead':
        // Navigate to add lead screen
        break;
      case 'Properties':
        // Navigate to add property screen
        break;
      case 'Notes':
        // Navigate to add notes/event screen
        break;
      case 'Task':
        // Navigate to add calling data screen
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide the default tab bar
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="leads" />
        <Tabs.Screen name="properties" />
        <Tabs.Screen name="tasks" />
        <Tabs.Screen name="profile" />
      </Tabs>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onAddAction={handleAddAction}
        userRole={userRole}
      />
    </>
  );
}
