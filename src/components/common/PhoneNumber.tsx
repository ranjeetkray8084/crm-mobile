import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhoneNumberProps {
  phoneNumber: string;
  style?: any;
  textStyle?: any;
  showIcon?: boolean;
  iconSize?: number;
  iconColor?: string;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  phoneNumber,
  style,
  textStyle,
  showIcon = false,
  iconSize = 16,
  iconColor = '#6b7280'
}) => {
  const isPhoneNumber = (text: string): boolean => {
    if (!text || text === 'N/A') return false;
    // Remove spaces, dashes, parentheses, and plus signs for validation
    const cleanText = text.replace(/[\s\-\(\)\+]/g, '');
    // Check if it's a valid phone number (7-15 digits)
    return /^\d{7,15}$/.test(cleanText);
  };

  const formatPhoneNumber = (text: string): string => {
    if (!text || text === 'N/A') return text;
    // Remove all non-digit characters except +
    const cleanText = text.replace(/[^\d\+]/g, '');
    // If it doesn't start with +, add country code (assume India +91)
    if (!cleanText.startsWith('+')) {
      return `+91${cleanText}`;
    }
    return cleanText;
  };

  const handlePhoneCall = () => {
    if (!phoneNumber || phoneNumber === 'N/A') {
      Alert.alert('No Phone Number', 'This contact does not have a phone number.');
      return;
    }

    if (!isPhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'The phone number format is not valid.');
      return;
    }

    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    Alert.alert(
      'Make Phone Call',
      `Do you want to call ${formattedNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${formattedNumber}`).catch(err => {
              console.error('❌ Error making call:', err);
              Alert.alert('Error', 'Unable to make call. Please try again.');
            });
          }
        }
      ]
    );
  };

  const isValidPhone = isPhoneNumber(phoneNumber);

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={isValidPhone ? handlePhoneCall : undefined}
      disabled={!isValidPhone}
    >
      {showIcon && isValidPhone && (
        <Ionicons 
          name="call" 
          size={iconSize} 
          color={iconColor} 
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.text, 
        textStyle,
        isValidPhone && styles.clickableText
      ]}>
        {phoneNumber || 'N/A'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: '#374151',
  },
  clickableText: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});

export default PhoneNumber;
