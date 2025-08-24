import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface ThreeDotMenuProps {
  item: any;
  actions: Action[];
  position?: string;
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ item, actions, position = 'right-0' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<TouchableOpacity>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: Action) => {
    action.onClick();
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleToggle}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={16} color="#6b7280" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={[styles.menu, { top: menuPosition.y, right: menuPosition.x }]}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  action.danger && styles.dangerItem
                ]}
                onPress={() => handleAction(action)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  {action.icon}
                  <Text style={[
                    styles.menuItemText,
                    action.danger && styles.dangerText
                  ]}>
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  dangerItem: {
    backgroundColor: '#fef2f2',
  },
  dangerText: {
    color: '#dc2626',
  },
});

export default ThreeDotMenu;
