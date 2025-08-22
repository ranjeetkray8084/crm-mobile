import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Pressable,
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
    <View className="relative" style={style}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleToggle}
        className={`p-1.5 rounded-lg bg-transparent ${open ? 'bg-gray-100' : ''}`}
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
        <Pressable className="flex-1 bg-black/50" onPress={closeMenu}>
          <View 
            className="absolute bg-white rounded-xl shadow-lg min-w-[180px] border border-gray-200"
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
            }}
          >
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                  index === 0 ? 'rounded-t-xl' : ''
                } ${
                  index === actions.length - 1 ? 'border-b-0 rounded-b-xl' : ''
                } ${
                  action.danger ? 'bg-red-50' : ''
                }`}
                onPress={() => handleAction(action.onClick)}
                activeOpacity={0.7}
              >
                {action.icon && (
                  <Ionicons
                    name={action.icon as any}
                    size={16}
                    color={action.danger ? '#ef4444' : '#6b7280'}
                    className="mr-3 w-4"
                  />
                )}
                <Text className={`text-sm font-medium text-gray-700 flex-1 ${
                  action.danger ? 'text-red-600' : ''
                }`}>
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
