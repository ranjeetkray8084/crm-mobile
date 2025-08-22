import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  autoHide = false,
  autoHideDelay = 3000,
}) => {
  const [scale, setScale] = useState(0.9);
  const [opacity, setOpacity] = useState(0);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Show animation
      setScale(1);
      setOpacity(1);
      
      // Auto-hide if enabled
      if (autoHide) {
        autoHideTimerRef.current = setTimeout(() => {
          handleConfirm();
        }, autoHideDelay);
      }
    } else {
      // Hide animation
      setScale(0.9);
      setOpacity(0);
    }

    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [visible, autoHide, autoHideDelay]);

  const handleConfirm = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    onConfirm?.();
  };

  const handleCancel = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    onCancel?.();
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#3b82f6';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#ecfdf5';
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'info':
      default:
        return '#eff6ff';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#d1fae5';
      case 'error':
        return '#fecaca';
      case 'warning':
        return '#fed7aa';
      case 'info':
      default:
        return '#dbeafe';
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleCancel}
    >
      <View style={[styles.overlay, { opacity }]}>
        <View 
          style={[
            styles.alertContainer, 
            { 
              transform: [{ scale }],
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            }
          ]}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getIconName() as any} 
              size={48} 
              color={getIconColor()} 
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 320,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
