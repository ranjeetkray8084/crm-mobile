import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationDropdownProps {
  unreadCount?: number;
  onPress?: () => void;
  loading?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  unreadCount = 0,
  onPress,
  loading = false,
}) => {
  const handlePress = () => {
    if (onPress && !loading) {
      onPress();
    }
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className="p-2 rounded-full bg-transparent relative"
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="notifications" 
          size={20} 
          color="#fbbf24" 
        />
        
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 justify-center items-center px-1">
            <Text className="text-white text-xs font-bold text-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationDropdown;
