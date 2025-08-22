import React, { useState, useEffect, useRef } from 'react';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [flipIn, setFlipIn] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const { login } = useAuth();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Start animations
    const timer1 = setTimeout(() => setFadeIn(true), 100);
    const timer2 = setTimeout(() => setSlideIn(true), 300);
    const timer3 = setTimeout(() => setFlipIn(true), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login({ email: email.trim(), password }, 'dummy-token');
      
      if (result.success) {
        // Login successful, router will handle navigation
        console.log('Login successful');
      } else {
        setError(result.error || 'Login failed');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleSimpleLogin = () => {
    router.push('/auth/login-simple');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
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
              ref={emailInputRef}
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorContainer, { 
              transform: [{ translateX: shake ? -10 : 0 }]
            }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { opacity: flipIn ? 1 : 0 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Alternative Login */}
          <TouchableOpacity
            style={styles.simpleLoginButton}
            onPress={handleSimpleLogin}
          >
            <Text style={styles.simpleLoginText}>Use Simple Login (Testing)</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { opacity: fadeIn ? 1 : 0 }]}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.footerLink}>Contact your administrator</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c69ff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#1c69ff',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  simpleLoginButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  simpleLoginText: {
    fontSize: 14,
    color: '#1c69ff',
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerLink: {
    color: '#1c69ff',
    fontWeight: '500',
  },
});
