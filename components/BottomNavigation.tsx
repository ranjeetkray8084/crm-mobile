import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
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
    style={[
      styles.tabItem,
      isCenter && styles.centerTab
    ]}
    onPress={onPress} 
    activeOpacity={0.7}
  >
    <View style={[
      styles.iconContainer,
      isCenter ? styles.centerIconContainer : styles.regularIconContainer,
      { 
        backgroundColor: isActive ? color : (isCenter ? '#007AFF' : '#f5f5f5'),
        transform: isCenter && isToolbarOpen ? [{ scale: 1.1 }] : [{ scale: 1 }]
      }
    ]}>
      <Text style={[
        styles.iconText,
        isCenter ? styles.centerIconText : styles.regularIconText
      ]}>
        {icon}
      </Text>
    </View>
    {!isCenter && (
      <Text style={[
        styles.tabLabel,
        { color: isActive ? color : '#666' },
        isActive ? styles.activeTabLabel : styles.inactiveTabLabel
      ]}>
        {label}
      </Text>
    )}
    {isActive && !isCenter && (
      <View style={[styles.activeIndicator, { backgroundColor: color }]} />
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
    <View style={styles.container}>
      {/* Backdrop for toolbar */}
      {showToolbar && (
        <TouchableWithoutFeedback onPress={closeToolbar}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Toolbar that appears above bottom navigation */}
      {showToolbar && addOptions.length > 0 && (
        <View style={styles.toolbarContainer}>
          <View style={styles.toolbar}>
            {addOptions.map((option, index) => (
              <TouchableOpacity
                style={[
                  styles.toolbarItem,
                  index === addOptions.length - 1 && styles.lastToolbarItem
                ]}
                onPress={() => handleAddAction(option.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.toolbarText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Arrow indicator pointing to plus button */}
          <View style={styles.toolbarArrow} />
        </View>
      )}

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TabItem
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20,
    paddingTop: 8,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 50,
  },
  toolbarContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 50,
  },
  toolbar: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    minWidth: 200,
    alignSelf: 'center',
  },
  toolbarItem: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  lastToolbarItem: {
    borderBottomWidth: 0,
  },
  toolbarText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  toolbarArrow: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    transform: [{ translateY: 10 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  centerTab: {
    flex: undefined,
    marginTop: -5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regularIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  iconText: {
    fontSize: 20,
  },
  centerIconText: {
    fontSize: 24,
  },
  regularIconText: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  activeTabLabel: {
    fontWeight: '600',
  },
  inactiveTabLabel: {
    fontWeight: '400',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
