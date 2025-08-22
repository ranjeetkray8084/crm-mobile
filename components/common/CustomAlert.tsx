import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { useEffect, useRef } from 'react';

interface CustomAlertProps {
  message: string | null;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      // Animate in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message, scaleAnim, opacityAnim]);

  if (!message) return null;

  return (
    <Modal
      visible={!!message}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center p-4">
        <Animated.View
          className="bg-white rounded-2xl shadow-lg px-6 py-5 w-[90%] max-w-[320px] items-center"
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <Text className="text-base font-medium text-gray-800 text-center mb-4 leading-6">{message}</Text>
          <TouchableOpacity
            className="bg-blue-600 px-5 py-2 rounded-lg min-w-[80px] items-center"
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-medium">OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
