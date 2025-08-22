import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function SimpleLoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Login successful! Welcome to Leads Tracker.');
      // Navigate to main app after successful login
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LEADS TRACKER</Text>
        <Text style={styles.subtitle}>Track Leads, Close Faster</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Email</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📧</Text>
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

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Enter your password"
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
              <Text style={styles.eyeIcon}>
                {showPassword ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => Alert.alert('Info', 'Forgot password functionality will be added here')}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1c69ff',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#1c69ff',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c69ff',
    textAlign: 'center',
    marginBottom: 32,
  },
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
    fontSize: 18,
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
  eyeIcon: {
    fontSize: 18,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
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
});
