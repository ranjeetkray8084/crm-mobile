import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Action {
  label: string;
  onClick: (item: any) => void;
  icon?: string;
  danger?: boolean;
}

interface ThreeDotMenuProps {
  item: any;
  actions: Action[];
  style?: any;
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ item, actions = [], style }) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<TouchableOpacity>(null);

  const handleAction = (callback: (item: any) => void) => {
    if (typeof callback === 'function') {
      callback(item);
    }
    setOpen(false);
  };

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Calculate position for the menu
        const menuX = Math.max(0, Math.min(pageX, screenWidth - 180));
        const menuY = pageY + height + 8;
        
        // If menu would go off bottom, show above button
        const finalY = menuY + (actions.length * 48) > screenHeight ? pageY - 8 : menuY;
        
        setMenuPosition({ x: menuX, y: finalY });
      });
    }
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleToggle}
        style={[
          styles.button,
          open && styles.buttonActive
        ]}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="ellipsis-horizontal" 
          size={16} 
          color={open ? '#374151' : '#6b7280'} 
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <View 
            style={[
              styles.menu,
              {
                left: menuPosition.x,
                top: menuPosition.y,
              }
            ]}
          >
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === 0 && styles.firstMenuItem,
                  index === actions.length - 1 && styles.lastMenuItem,
                  action.danger && styles.dangerMenuItem
                ]}
                onPress={() => handleAction(action.onClick)}
                activeOpacity={0.7}
              >
                {action.icon && (
                  <Ionicons
                    name={action.icon as any}
                    size={16}
                    color={action.danger ? '#ef4444' : '#6b7280'}
                    style={styles.actionIcon}
                  />
                )}
                <Text style={[
                  styles.menuText,
                  action.danger && styles.dangerMenuText
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ThreeDotMenu;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  buttonActive: {
    backgroundColor: '#f3f4f6',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  firstMenuItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dangerMenuItem: {
    backgroundColor: '#fef2f2',
  },
  actionIcon: {
    marginRight: 12,
    width: 16,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  dangerMenuText: {
    color: '#dc2626',
  },
});
