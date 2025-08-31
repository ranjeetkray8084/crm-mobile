import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/contexts/AuthContext';

interface AddOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface FloatingActionButtonProps {
  onAddAction: (actionId: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FloatingActionButton({ onAddAction }: FloatingActionButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  // Cleanup on unmount to prevent memory leaks and property access issues
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Safe state setter that checks if component is still mounted
  const safeSetShowDropdown = useCallback((value: boolean) => {
    if (isMounted.current) {
      setShowDropdown(value);
    }
  }, []);

  const getAddOptions = (): AddOption[] => {
    const userRole = user?.role?.toUpperCase() || 'USER';
    
    console.log('FloatingActionButton: User role:', userRole);
    console.log('FloatingActionButton: Full user object:', user);
    
    switch (userRole) {
      case 'ADMIN':
        return [
          { id: 'User', label: 'User', icon: 'person-add', color: '#1c69ff' },
          { id: 'Lead', label: 'Lead', icon: 'people', color: '#10b981' },
          { id: 'Properties', label: 'Properties', icon: 'business', color: '#f59e0b' },
          { id: 'Notes', label: 'Notes/Event', icon: 'document-text', color: '#8b5cf6' },
          { id: 'Task', label: 'Calling Data', icon: 'call', color: '#ef4444' },
        ];
      case 'USER':
        return [
          { id: 'Lead', label: 'Lead', icon: 'people', color: '#10b981' },
          { id: 'Properties', label: 'Properties', icon: 'business', color: '#f59e0b' },
          { id: 'Notes', label: 'Notes/Event', icon: 'document-text', color: '#8b5cf6' },
        ];
      case 'DIRECTOR':
        return [
          { id: 'User', label: 'User/Admin', icon: 'person-add', color: '#1c69ff' },
          { id: 'Lead', label: 'Lead', icon: 'people', color: '#10b981' },
          { id: 'Properties', label: 'Properties', icon: 'business', color: '#f59e0b' },
          { id: 'Notes', label: 'Notes/Event', icon: 'document-text', color: '#8b5cf6' },
          { id: 'Task', label: 'Calling Data', icon: 'call', color: '#ef4444' },
        ];
      default:
        console.log('FloatingActionButton: Using default options for role:', userRole);
        return [
          { id: 'Lead', label: 'Lead', icon: 'people', color: '#10b981' },
          { id: 'Properties', label: 'Properties', icon: 'business', color: '#f59e0b' },
          { id: 'Notes', label: 'Notes/Event', icon: 'document-text', color: '#8b5cf6' },
        ];
    }
  };

  const animateRipple = () => {
    rippleScale.setValue(0);
    rippleAnim.setValue(1);
    
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleDropdown = useCallback(() => {
    if (showDropdown) {
      // Close dropdown
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 10,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        safeSetShowDropdown(false);
      });
    } else {
      // Open dropdown
      safeSetShowDropdown(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDropdown, fadeAnim, scaleAnim, translateYAnim, safeSetShowDropdown]);

  const handleOptionPress = useCallback((optionId: string) => {
    try {
      console.log('FloatingActionButton: handleOptionPress called with optionId:', optionId);
      
      // Ensure onAddAction is a valid function
      if (typeof onAddAction === 'function') {
        // Use setTimeout to ensure the callback happens in the next tick
        // This can help avoid Hermes property configuration issues
        setTimeout(() => {
          try {
            if (isMounted.current) {
              onAddAction(optionId);
            }
          } catch (error) {
            console.error('FloatingActionButton: Error in onAddAction callback:', error);
          }
        }, 0);
      } else {
        console.error('FloatingActionButton: onAddAction is not a function');
      }
      
      toggleDropdown();
    } catch (error) {
      console.error('FloatingActionButton: handleOptionPress error:', error);
      // Still try to close the dropdown even if there's an error
      toggleDropdown();
    }
  }, [onAddAction, toggleDropdown]);

  const handleFabPress = () => {
    animateRipple();
    toggleDropdown();
  };

  const addOptions = getAddOptions();

  if (addOptions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { bottom: 100 + Math.max(insets.bottom, 0) }]}>
      {/* Dropdown Menu */}
      {showDropdown && (
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: translateYAnim }
              ],
            },
          ]}
        >
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Add Options</Text>
          </View>
          
          {addOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={styles.dropdownOption}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={16} color="#fff" />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.9}
      >
        {/* Ripple effect */}
        <Animated.View
          style={[
            styles.rippleEffect,
            {
              opacity: rippleAnim,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />
        
        {/* Plus icon with container */}
        <View style={styles.plusIconContainer}>
          <Ionicons name="add" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Above the tab bar
    right: 20, // Positioned on the right side
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981', // Green color like the web version
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  plusIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  rippleEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 28,
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: 70, // Above the FAB
    right: 0, // Aligned to the right edge
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  optionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
