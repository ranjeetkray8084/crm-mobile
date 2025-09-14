import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../shared/contexts/AuthContext';
import NotificationService from '../../core/services/NotificationService';
import SimpleTokenService from '../../core/services/SimpleTokenService';
import SimpleDeviceManager from '../../core/utils/SimpleDeviceManager';

const SimplePushTestComponent: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('Ready to test');
    const [deviceInfo, setDeviceInfo] = useState<any>(null);
    const [pushToken, setPushToken] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const notificationService = NotificationService.getInstance();
    const tokenService = SimpleTokenService.getInstance();
    const deviceManager = SimpleDeviceManager.getInstance();

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Get device info
            const info = await deviceManager.getDeviceInfo();
            setDeviceInfo(info);

            // Get current push token
            const token = await tokenService.getCurrentToken();
            setPushToken(token);

            // Check if registered
            const registered = await tokenService.isTokenRegistered();
            setIsRegistered(registered);

            setStatus('Initial data loaded');
        } catch (error) {
            console.error('Error loading initial data:', error);
            setStatus('Error loading initial data');
        }
    };

    const testPermissions = async () => {
        setLoading(true);
        setStatus('Testing permissions...');

        try {
            const granted = await notificationService.requestPermissions();

            if (granted) {
                setStatus('✅ Permissions granted');
                Alert.alert('Success', 'Notification permissions granted!');
            } else {
                setStatus('❌ Permissions denied');
                Alert.alert('Error', 'Notification permissions denied');
            }
        } catch (error) {
            setStatus('❌ Permission test failed');
            Alert.alert('Error', `Permission test failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testTokenGeneration = async () => {
        setLoading(true);
        setStatus('Generating push token...');

        try {
            const token = await notificationService.getPushToken();

            if (token) {
                setPushToken(token);
                setStatus('✅ Push token generated');
                Alert.alert('Success', `Token generated: ${token.substring(0, 30)}...`);
            } else {
                setStatus('❌ Token generation failed');
                Alert.alert('Error', 'Failed to generate push token');
            }
        } catch (error) {
            setStatus('❌ Token generation error');
            Alert.alert('Error', `Token generation failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testTokenRegistration = async () => {
        if (!user || !user.id) {
            Alert.alert('Error', 'User not logged in');
            return;
        }

        if (!pushToken) {
            Alert.alert('Error', 'No push token available. Generate token first.');
            return;
        }

        setLoading(true);
        setStatus('Registering token with backend...');

        try {
            const result = await tokenService.registerToken(user.id, pushToken);

            if (result.success) {
                setIsRegistered(true);
                setStatus('✅ Token registered successfully');
                Alert.alert('Success', 'Push token registered with backend!');
            } else {
                setStatus('❌ Token registration failed');
                Alert.alert('Error', `Registration failed: ${result.error}`);
            }
        } catch (error) {
            setStatus('❌ Registration error');
            Alert.alert('Error', `Registration failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testNotificationSending = async () => {
        if (!user || !user.id) {
            Alert.alert('Error', 'User not logged in');
            return;
        }

        setLoading(true);
        setStatus('Sending test notification...');

        try {
            const result = await tokenService.sendTestNotification();

            if (result.success) {
                setStatus('✅ Test notification sent');
                Alert.alert('Success', 'Test notification sent! Check your device.');
            } else {
                setStatus('❌ Notification sending failed');
                Alert.alert('Error', `Failed to send notification: ${result.error}`);
            }
        } catch (error) {
            setStatus('❌ Notification error');
            Alert.alert('Error', `Notification failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testLocalNotification = async () => {
        setLoading(true);
        setStatus('Sending local notification...');

        try {
            await notificationService.sendImmediateNotification({
                title: '🧪 Local Test',
                body: 'This is a local test notification',
                sound: true,
                priority: 'high'
            });

            setStatus('✅ Local notification sent');
            Alert.alert('Success', 'Local notification sent!');
        } catch (error) {
            setStatus('❌ Local notification failed');
            Alert.alert('Error', `Local notification failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const runFullTest = async () => {
        if (!user || !user.id) {
            Alert.alert('Error', 'User not logged in');
            return;
        }

        setLoading(true);
        setStatus('Running full test sequence...');

        try {
            // Step 1: Request permissions
            setStatus('Step 1: Requesting permissions...');
            const permissionGranted = await notificationService.requestPermissions();

            if (!permissionGranted) {
                throw new Error('Permissions not granted');
            }

            // Step 2: Generate token
            setStatus('Step 2: Generating push token...');
            const token = await notificationService.getPushToken();

            if (!token) {
                throw new Error('Failed to generate token');
            }
            setPushToken(token);

            // Step 3: Register with backend
            setStatus('Step 3: Registering with backend...');
            const registrationResult = await tokenService.registerToken(user.id, token);

            if (!registrationResult.success) {
                throw new Error(registrationResult.error || 'Registration failed');
            }
            setIsRegistered(true);

            // Step 4: Send test notification
            setStatus('Step 4: Sending test notification...');
            const notificationResult = await tokenService.sendTestNotification();

            if (!notificationResult.success) {
                throw new Error(notificationResult.error || 'Notification failed');
            }

            setStatus('✅ Full test completed successfully!');
            Alert.alert('Success', 'Full push notification test completed successfully!');

        } catch (error) {
            setStatus(`❌ Full test failed: ${error}`);
            Alert.alert('Error', `Full test failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const clearTokens = async () => {
        setLoading(true);
        setStatus('Clearing tokens...');

        try {
            if (user && user.id) {
                await tokenService.deactivateCurrentDevice();
            }

            await deviceManager.clearDeviceInfo();

            setPushToken(null);
            setIsRegistered(false);
            setDeviceInfo(null);

            setStatus('✅ Tokens cleared');
            Alert.alert('Success', 'All tokens and device info cleared!');

            // Reload initial data
            await loadInitialData();
        } catch (error) {
            setStatus('❌ Clear tokens failed');
            Alert.alert('Error', `Failed to clear tokens: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>🔔 Simple Push Notification Test</Text>
                <Text style={styles.error}>Please log in to test push notifications</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>🔔 Simple Push Notification Test</Text>

            {/* Status */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={styles.statusText}>{status}</Text>
            </View>

            {/* User Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>User Info:</Text>
                <Text style={styles.infoText}>ID: {user?.id}</Text>
                <Text style={styles.infoText}>Email: {user?.email}</Text>
            </View>

            {/* Device Info */}
            {deviceInfo && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Device Info:</Text>
                    <Text style={styles.infoText}>ID: {deviceInfo.deviceId}</Text>
                    <Text style={styles.infoText}>Name: {deviceInfo.deviceName}</Text>
                    <Text style={styles.infoText}>Platform: {deviceInfo.platform}</Text>
                </View>
            )}

            {/* Push Token Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Push Token:</Text>
                <Text style={styles.infoText}>
                    {pushToken ? `${pushToken.substring(0, 30)}...` : 'Not generated'}
                </Text>
                <Text style={styles.infoText}>
                    Registered: {isRegistered ? '✅ Yes' : '❌ No'}
                </Text>
            </View>

            {/* Test Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={runFullTest}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>🚀 Run Full Test</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={testPermissions}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>🔐 Test Permissions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={testTokenGeneration}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>🎫 Generate Token</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={testTokenRegistration}
                    disabled={loading || !pushToken}
                >
                    <Text style={styles.buttonText}>📝 Register Token</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={testNotificationSending}
                    disabled={loading || !isRegistered}
                >
                    <Text style={styles.buttonText}>🔔 Send Test Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={testLocalNotification}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>📱 Send Local Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.dangerButton]}
                    onPress={clearTokens}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>🗑️ Clear All Tokens</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Testing in progress...</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    statusContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    infoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    secondaryButton: {
        backgroundColor: '#34C759',
    },
    dangerButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    error: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default SimplePushTestComponent;