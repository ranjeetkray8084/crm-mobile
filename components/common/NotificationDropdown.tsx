import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationDropdown;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
