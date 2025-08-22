import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { AuthService } from '../../src/core/services/auth.service';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

export default function LoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [deactivatedUserEmail, setDeactivatedUserEmail] = useState('');
  const [isModalBlocking, setIsModalBlocking] = useState(false);
  const { login, isAuthenticated } = useAuth();
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const flipAnim = new Animated.Value(0);

  // Note: Authentication redirect is now handled in app/index.tsx

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Flip animation
  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  // Error auto-hide
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await AuthService.login(formData) as any;

      if (result.success) {
        await login(result.user, result.token);
        router.replace('/(tabs)');
      } else {
        if (result.isDeactivated) {
          setDeactivatedUserEmail(result.userEmail || formData.email);
          setShowDeactivatedModal(true);
          setIsModalBlocking(true);
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsFlipped(true);
  };

  const handleBackToLogin = () => {
    setIsFlipped(false);
  };

  const frontTransform = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backTransform = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
              {/* Mobile Header - Always visible */}
        {!isTablet && (
          <Animated.View 
            style={[
              styles.mobileHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.mobileTitle}>LEADS TRACKER</Text>
            <Text style={styles.mobileSubtitle}>Track Leads, Close Faster</Text>
          </Animated.View>
        )}

      {/* Main Content */}
      <View style={isTablet ? styles.tabletContainer : styles.phoneContainer}>
        {/* Left Section - Desktop/Tablet Only */}
        {isTablet && (
          <Animated.View 
            style={[
              styles.leftSection,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            <Text style={styles.leftTitle}>LEADS TRACKER</Text>
            <Text style={styles.leftSubtitle}>Track Leads, Close Faster</Text>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.leftLogo}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {/* Right Section - Flipable Card */}
        <Animated.View 
          style={[
            styles.rightSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.cardContainer}>
            {/* Front Card - Login Form */}
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                {
                  transform: [{ rotateY: frontTransform }],
                  opacity: isFlipped ? 0 : 1,
                }
              ]}
            >
              {isModalBlocking && (
                <View style={styles.modalBlockingOverlay}>
                  <Text style={styles.modalBlockingIcon}>🔒</Text>
                  <Text style={styles.modalBlockingTitle}>Account Deactivated</Text>
                  <Text style={styles.modalBlockingText}>Please check the modal above for instructions</Text>
                </View>
              )}

              <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>

                {/* Error Message */}
                {error ? (
                  <Animated.View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                ) : null}

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={18} color="#000" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Username"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={18} color="#000" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Password"
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={18} 
                        color="#000" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>

            {/* Back Card - Forgot Password */}
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  transform: [{ rotateY: backTransform }],
                  opacity: isFlipped ? 1 : 0,
                }
              ]}
            >
              <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackToLogin}
                >
                  <Ionicons name="arrow-back" size={20} color="#1c69ff" />
                  <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>

                <Text style={styles.forgotTitle}>Reset Password</Text>
                <Text style={styles.forgotSubtitle}>
                  Enter your email address and we'll send you an OTP to reset your password.
                </Text>

                {/* Error Message for Forgot Password */}
                {error ? (
                  <Animated.View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                ) : null}

                {/* Email Input for Reset */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={18} color="#000" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={() => router.push('/auth/forgot-password')}
                  disabled={isLoading}
                >
                  <Text style={styles.loginButtonText}>Send OTP</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      {/* Deactivated User Modal */}
      {showDeactivatedModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Deactivated</Text>
            <Text style={styles.modalMessage}>
              Your account has been deactivated. Please contact your administrator to reactivate it.
            </Text>
            <Text style={styles.modalEmail}>Account: {deactivatedUserEmail}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowDeactivatedModal(false);
                setIsModalBlocking(false);
              }}
            >
              <Text style={styles.modalButtonText}>OK, I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Mobile Header
  mobileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  mobileTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1c69ff',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  mobileSubtitle: {
    fontSize: 12,
    color: '#1c69ff',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  // Layout Containers
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: height * 0.8,
  },
  phoneContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  // Left Section (Tablet/Desktop)
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
  },
  leftTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1c69ff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  leftSubtitle: {
    fontSize: 14,
    color: '#1c69ff',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 40,
  },
  leftLogo: {
    width: isTablet ? 300 : 200,
    height: isTablet ? 300 : 200,
  },
  // Right Section (Card Container)
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 4,
    paddingVertical: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 500,
    height: isTablet ? 600 : 450,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardContent: {
    padding: isTablet ? 40 : 24,
    paddingTop: isTablet ? 40 : 32,
    flexGrow: 1,
  },
  // Modal Blocking Overlay
  modalBlockingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  modalBlockingIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  modalBlockingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalBlockingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Titles
  welcomeTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#1c69ff',
    textAlign: 'center',
    marginBottom: 32,
  },
  forgotTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: 'bold',
    color: '#1c69ff',
    textAlign: 'center',
    marginBottom: 16,
  },
  forgotSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    color: '#1c69ff',
    marginLeft: 8,
    fontWeight: '500',
  },
  // Error Handling
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Form Elements
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c69ff',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Forgot Password Link
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  // Buttons
  loginButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    maxWidth: 400,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalEmail: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
