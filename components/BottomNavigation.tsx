import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  onAddAction?: (action: string) => void;
  userRole?: string;
}

interface TabItemProps {
  icon: string;
  label: string;
  color: string;
  isActive?: boolean;
  onPress?: () => void;
  isCenter?: boolean;
  isToolbarOpen?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, color, isActive, onPress, isCenter, isToolbarOpen }) => (
  <TouchableOpacity 
    className={`items-center justify-center flex-1 py-2 relative ${isCenter ? 'flex-none -mt-5' : ''}`}
    onPress={onPress} 
    activeOpacity={0.7}
  >
    <View className={`justify-center items-center mb-1 shadow-sm ${
      isCenter ? 'w-14 h-14 rounded-full shadow-md' : 'w-11 h-11 rounded-full'
    }`}
    style={{ 
      backgroundColor: isActive ? color : (isCenter ? '#007AFF' : '#f5f5f5'),
      transform: isCenter && isToolbarOpen ? [{ scale: 1.1 }] : [{ scale: 1 }]
    }}>
      <Text className={`${isCenter ? 'text-2xl' : 'text-lg'}`}>
        {icon}
      </Text>
    </View>
    {!isCenter && (
      <Text className={`text-xs text-center mt-0.5 ${isActive ? 'font-semibold' : 'font-normal'}`}
            style={{ color: isActive ? color : '#666' }}>
        {label}
      </Text>
    )}
    {isActive && !isCenter && (
      <View className="absolute -bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
    )}
  </TouchableOpacity>
);

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab = 'Dashboard', 
  onTabPress,
  onAddAction,
  userRole = 'USER'
}) => {
  const [showToolbar, setShowToolbar] = useState(false);

  // Hide bottom navigation for DEVELOPER role
  if (userRole?.toUpperCase() === 'DEVELOPER') {
    return null;
  }

  const getAddOptions = () => {
    switch (userRole.toUpperCase()) {
      case 'ADMIN':
        return [
          { id: 'User', label: 'User' },
          { id: 'Lead', label: 'Lead' },
          { id: 'Properties', label: 'Properties' },
          { id: 'Notes', label: 'Notes/Event' },
          { id: 'Task', label: 'Calling Data' },
        ];
      case 'USER':
        return [
          { id: 'Lead', label: 'Lead' },
          { id: 'Properties', label: 'Properties' },
          { id: 'Notes', label: 'Notes/Event' },
        ];
      case 'DIRECTOR':
        return [
          { id: 'User', label: 'User/Admin' },
          { id: 'Lead', label: 'Lead' },
          { id: 'Properties', label: 'Properties' },
          { id: 'Notes', label: 'Notes/Event' },
          { id: 'Task', label: 'Calling Data' },
        ];
      default:
        return [];
    }
  };

  const addOptions = getAddOptions();

  const handlePlusPress = () => {
    if (addOptions.length > 0) {
      setShowToolbar(!showToolbar);
    } else {
      onTabPress?.('Add');
    }
  };

  const closeToolbar = () => {
    setShowToolbar(false);
  };

  const handleAddAction = (action: string) => {
    onAddAction?.(action);
    setShowToolbar(false);
  };

  const tabs = [
    { 
      icon: '📊', 
      label: 'Dashboard', 
      color: '#007AFF',
      key: 'Dashboard'
    },
    { 
      icon: '👥', 
      label: 'Leads', 
      color: '#34C759',
      key: 'Leads'
    },
    { 
      icon: '➕', 
      label: '', 
      color: '#007AFF',
      key: 'Add',
      isCenter: true
    },
    { 
      icon: '🏢', 
      label: 'Property', 
      color: '#FF9500',
      key: 'Property'
    },
    { 
      icon: '📞', 
      label: 'Calls', 
      color: '#666',
      key: 'Calls'
    },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-5 pt-2">
      {/* Backdrop for toolbar */}
      {showToolbar && (
        <TouchableWithoutFeedback onPress={closeToolbar}>
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-50" />
        </TouchableWithoutFeedback>
      )}

      {/* Toolbar that appears above bottom navigation */}
      {showToolbar && addOptions.length > 0 && (
        <View className="absolute bottom-full left-0 right-0 bg-transparent px-5 pb-4 z-50">
          <View className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-w-[200px] self-center">
            {addOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                className={`px-6 py-4.5 border-b border-gray-100 bg-white ${index === addOptions.length - 1 ? 'border-b-0' : ''}`}
                onPress={() => handleAddAction(option.id)}
                activeOpacity={0.7}
              >
                <Text className="text-base font-medium text-gray-700 text-center">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Arrow indicator pointing to plus button */}
          <View className="absolute bottom-0 left-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white transform -translate-y-2.5 shadow-sm" />
        </View>
      )}

      <View className="flex-row justify-around items-center px-5">
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            color={tab.color}
            isActive={activeTab === tab.key}
            onPress={tab.key === 'Add' ? handlePlusPress : () => onTabPress?.(tab.key)}
            isCenter={tab.isCenter}
            isToolbarOpen={showToolbar}
          />
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;
