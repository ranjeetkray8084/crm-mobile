import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, RefreshControl, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FollowUpService } from '../../../core/services/followup.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
  phone: string;
}

interface FollowUp {
  followupId: string;
  followupDate: string;
  note: string;
  nextFollowup?: string;
  lead?: {
    leadId: string;
  };
}

interface ViewFollowUpsModalProps {
  isVisible: boolean;
  onClose: () => void;
  lead: Lead | null;
  companyId?: string;
}

const ViewFollowUpsModal: React.FC<ViewFollowUpsModalProps> = ({
  isVisible,
  onClose,
  lead,
  companyId
}) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  
  const hasLoadedRef = useRef(false);
  const currentLeadIdRef = useRef<string | null>(null);

  // Animation for spinner
  useEffect(() => {
    if (loading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Get companyId from AsyncStorage if not provided
  const getCurrentCompanyId = async (): Promise<string | null> => {
    if (companyId) return companyId;
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      return user.companyId || null;
    } catch (error) {
      console.error('Error getting company ID:', error);
      return null;
    }
  };

  // Load follow-ups
  const loadFollowUps = async () => {
    const currentCompanyId = await getCurrentCompanyId();
    if (!currentCompanyId) {
      setError('Company ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await FollowUpService.getAllFollowUps(currentCompanyId);
      if (result.success) {
        setFollowUps(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  // Refresh follow-ups
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFollowUps();
    setRefreshing(false);
  };

  useEffect(() => {
    const leadId = lead?.leadId || lead?.id;
    
    if (isVisible && lead && (!hasLoadedRef.current || currentLeadIdRef.current !== leadId)) {
      hasLoadedRef.current = true;
      currentLeadIdRef.current = leadId;
      loadFollowUps();
    }
    
    if (!isVisible) {
      hasLoadedRef.current = false;
      currentLeadIdRef.current = null;
      setError(null);
    }
  }, [isVisible, lead?.leadId || lead?.id]);

  const handleDeleteFollowUp = async (followUpId: string) => {
    Alert.alert(
      'Delete Follow-up',
      'Are you sure you want to delete this follow-up?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentCompanyId = await getCurrentCompanyId();
            if (!currentCompanyId) {
              setError('Company ID is required');
              return;
            }

            setLoading(true);
            try {
              const result = await FollowUpService.deleteFollowUp(currentCompanyId, followUpId);
              if (result.success) {
                await loadFollowUps(); // Reload follow-ups
              } else {
                setError(result.error);
              }
            } catch (error) {
              setError('Failed to delete follow-up');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const clearError = () => {
    setError(null);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Filter follow-ups for this specific lead
  const leadFollowUps = followUps.filter(fu => {
    const fuLeadId = fu.lead?.leadId;
    const currentLeadId = lead?.leadId || lead?.id;
    return fuLeadId === currentLeadId;
  }).sort((a, b) => new Date(b.followupDate || 0).getTime() - new Date(a.followupDate || 0).getTime());

  if (!lead) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="calendar" size={20} color="#3b82f6" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Follow-ups</Text>
                <Text style={styles.subtitle}>
                  {lead?.name ? `for ${lead.name}` : 'for this lead'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                onPress={clearError}
                style={styles.dismissButton}
              >
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Follow-ups List */}
            <View>
              <Text style={styles.sectionTitle}>
                Follow-up History ({leadFollowUps.length})
              </Text>

              {loading && leadFollowUps.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
                  <Text style={styles.loadingText}>Loading follow-ups...</Text>
                </View>
              ) : leadFollowUps.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar" size={48} color="#9ca3af" />
                  <Text style={styles.emptyTitle}>No follow-ups found</Text>
                  <Text style={styles.emptySubtitle}>Add your first follow-up to get started.</Text>
                </View>
              ) : (
                <View style={styles.followUpsList}>
                  {leadFollowUps.map((followUp) => (
                    <View key={followUp.followupId} style={styles.followUpCard}>
                      <View style={styles.followUpContent}>
                        <View style={styles.followUpHeader}>
                          <Text style={styles.followUpDate}>
                            {formatDateTime(followUp.followupDate)}
                          </Text>
                        </View>
                        
                        <Text style={styles.followUpNote}>{followUp.note}</Text>
                        
                        {followUp.nextFollowup && (
                          <View style={styles.nextFollowUp}>
                            <Ionicons name="time" size={14} color="#6b7280" />
                            <Text style={styles.nextFollowUpText}>
                              Next: {formatDateTime(followUp.nextFollowup)}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.followUpActions}>
                        <TouchableOpacity
                          onPress={() => handleDeleteFollowUp(followUp.followupId)}
                          style={styles.deleteButton}
                        >
                          <Ionicons name="trash" size={16} color="#6b7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  dismissButton: {
    marginTop: 8,
  },
  dismissButtonText: {
    fontSize: 12,
    color: '#dc2626',
    textDecorationLine: 'underline',
  },
  content: {
    padding: 20,
    maxHeight: 500,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  spinner: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderTopColor: 'transparent',
    borderRadius: 16,
    marginBottom: 8,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  followUpsList: {
    gap: 16,
  },
  followUpCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  followUpContent: {
    flex: 1,
  },
  followUpHeader: {
    marginBottom: 8,
  },
  followUpDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  followUpNote: {
    color: '#1e293b',
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  nextFollowUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextFollowUpText: {
    fontSize: 12,
    color: '#6b7280',
  },
  followUpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  deleteButton: {
    padding: 4,
  },
});

export default ViewFollowUpsModal;
