import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/shared/contexts/AuthContext';

export default function LoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backendMessage, setBackendMessage] = useState('');

  const router = useRouter();
  const { login, sendOtp, verifyOtp, resetPasswordWithOtp } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // 🔍 DEBUG: Check formData before login
    console.log('=== LOGIN DEBUG ===');
    console.log('FormData object:', formData);
    console.log('Email:', formData.email);
    console.log('Password:', formData.password);
    console.log('Password type:', typeof formData.password);
    console.log('Password length:', formData.password?.length);
    
    setIsLoading(true);
    setBackendMessage('');
    
    try {
      console.log('Calling useAuth.login with:', formData);
      const result = await login(formData);
      console.log('useAuth.login result:', result);
      
      if (result && result.success) {
        // Show success message
        const message = result.message || 'Login successful!';
        setBackendMessage(message);
        
        // Navigate to main app after successful login
        console.log('Login successful, navigating to main app...');
        router.replace('/(tabs)');
      } else {
        const errorMsg = result?.error || 'Login failed. Please check your credentials.';
        setBackendMessage(errorMsg);
        
        // Show more specific error messages based on status code
        let alertMessage = errorMsg;
        if (result?.statusCode === 401) {
          alertMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (result?.statusCode === 403) {
          alertMessage = 'Account is deactivated or locked. Please contact support.';
        } else if (result?.statusCode === 404) {
          alertMessage = 'User account not found. Please check your email address.';
        } else if (result?.statusCode === 500) {
          alertMessage = 'Server error. Please try again later or contact support.';
        }
        
        Alert.alert('Login Failed', alertMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
      
      setBackendMessage(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otpEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoadingOtp(true);
    try {
      const result = await sendOtp(otpEmail);
      
      if (result.success) {
        Alert.alert('Success', 'OTP sent to your email');
        setShowForgotPassword(true);
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    setIsLoadingOtp(true);
    try {
      const result = await verifyOtp(otpEmail, otp);
      
      if (result.success && result.valid) {
        Alert.alert('Success', 'OTP verified! Please enter new password');
        setShowForgotPassword(false);
      } else {
        Alert.alert('Error', result.error || 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'OTP verification failed');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoadingOtp(true);
    try {
      const result = await resetPasswordWithOtp(otpEmail, newPassword);
      
      if (result.success) {
        Alert.alert('Success', 'Password reset successfully! Please login with new password');
        setShowForgotPassword(false);
        setOtpEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', result.error || 'Password reset failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Password reset failed');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onBlur={() => {
            console.log('Password input onBlur, final value:', formData.password);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setShowForgotPassword(true)}
        style={styles.forgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Backend Message Display */}
      {backendMessage ? (
        <View style={[
          styles.messageContainer,
          backendMessage.includes('successful') ? styles.successMessage : styles.errorMessage
        ]}>
          <Text style={styles.messageText}>
            {backendMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive OTP</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={otpEmail}
          onChangeText={setOtpEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoadingOtp && styles.loginButtonDisabled]}
        onPress={handleSendOtp}
        disabled={isLoadingOtp}
      >
        {isLoadingOtp ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowForgotPassword(false)}
        style={styles.backToLogin}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOtpForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Check your email for OTP code</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="OTP Code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoadingOtp && styles.loginButtonDisabled]}
        onPress={handleVerifyOtp}
        disabled={isLoadingOtp}
      >
        {isLoadingOtp ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowForgotPassword(false)}
        style={styles.backToLogin}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoadingOtp && styles.loginButtonDisabled]}
        onPress={handleResetPassword}
        disabled={isLoadingOtp}
      >
        {isLoadingOtp ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowForgotPassword(false)}
        style={styles.backToLogin}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="business-outline" size={60} color="#1c69ff" />
            </View>
            <Text style={styles.appName}>LEADS TRACKER</Text>
            <Text style={styles.appTagline}>Track Leads, Close Faster</Text>
          </View>

          {/* Form */}
          {!showForgotPassword && renderLoginForm()}
          {showForgotPassword && !otp && !newPassword && renderForgotPasswordForm()}
          {showForgotPassword && otp && !newPassword && renderOtpForm()}
          {showForgotPassword && otp && newPassword && renderNewPasswordForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c69ff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: '#64748b',
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1e293b',
  },
  eyeIcon: {
    padding: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1c69ff',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1c69ff',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1c69ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  messageContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  messageText: {
    color: '#065f46',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
