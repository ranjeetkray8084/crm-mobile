import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any) => void;
  danger?: boolean;
}

interface ThreeDotMenuProps {
  item: any;
  actions: Action[];
  style?: any;
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ item, actions, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<TouchableOpacity>(null);

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        
        // Calculate position for the menu
        let menuX = pageX;
        let menuY = pageY + height + 5;
        
        // Adjust if menu would go off screen
        if (menuX + 180 > screenWidth) {
          menuX = screenWidth - 190;
        }
        if (menuY + (actions.length * 50) > screenHeight) {
          menuY = pageY - (actions.length * 50) - 5;
        }
        
        setMenuPosition({ x: menuX, y: menuY });
        setIsVisible(true);
      });
    }
  };

  const handleAction = (action: Action) => {
    action.onClick(item);
    setIsVisible(false);
  };

  const closeMenu = () => {
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handlePress}
        style={[styles.button, style]}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <View
            style={[
              styles.menu,
              {
                left: menuPosition.x,
                top: menuPosition.y,
              },
            ]}
          >
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  action.danger && styles.dangerItem,
                ]}
                onPress={() => handleAction(action)}
                activeOpacity={0.7}
              >
                {action.icon && (
                  <View style={styles.iconContainer}>
                    {action.icon}
                  </View>
                )}
                <Text
                  style={[
                    styles.menuText,
                    action.danger && styles.dangerText,
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dangerItem: {
    borderBottomColor: '#FEE2E2',
  },
  iconContainer: {
    marginRight: 12,
    width: 16,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  dangerText: {
    color: '#DC2626',
  },
});

export default ThreeDotMenu;
