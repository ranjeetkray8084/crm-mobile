import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { sendOtp } = useAuth();

  useEffect(() => {
    // Start animations
    const timer1 = setTimeout(() => setFadeIn(true), 100);
    const timer2 = setTimeout(() => setSlideIn(true), 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await sendOtp(email.trim());
      
      if (result.success) {
        setSuccess('OTP sent successfully! Please check your email.');
        // Navigate to OTP verification screen
        setTimeout(() => {
          router.push('/auth/verify-otp');
        }, 2000);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { opacity: fadeIn ? 1 : 0 }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1c69ff" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>
          </View>
        </View>

        {/* Form */}
        <View style={[styles.formContainer, { 
          opacity: slideIn ? 1 : 0,
          transform: [{ translateY: slideIn ? 0 : 50 }]
        }]}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSendOtp}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Success Message */}
          {success ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          {/* Send OTP Button */}
          <TouchableOpacity
            style={styles.sendOtpButton}
            onPress={handleSendOtp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Sending OTP...</Text>
              </View>
            ) : (
              <Text style={styles.sendOtpButtonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { opacity: fadeIn ? 1 : 0 }]}>
          <Text style={styles.footerText}>
            Remember your password?{' '}
            <Text style={styles.footerLink} onPress={() => router.back()}>
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#d97706',
    fontSize: 14,
    marginLeft: 8,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#34d399',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  successText: {
    color: '#065f46',
    fontSize: 14,
    marginLeft: 8,
  },
  sendOtpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  sendOtpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
