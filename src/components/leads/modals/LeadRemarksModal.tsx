import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Lead {
  id?: string;
  leadId?: string;
  name: string;
}

interface Remark {
  id: string;
  remark: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

interface LeadRemarksModalProps {
  isVisible: boolean;
  onClose: () => void;
  lead: Lead | null;
  companyId?: string;
  onGetRemarks: (leadId: string) => Promise<any>;
}

const LeadRemarksModal: React.FC<LeadRemarksModalProps> = ({
  isVisible,
  onClose,
  lead,
  companyId,
  onGetRemarks
}) => {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get leadId from the lead object
  const leadId = lead?.id || lead?.leadId;

  // Fetch remarks when modal opens
  useEffect(() => {
    if (isVisible && leadId) {
      console.log('LeadRemarksModal: Fetching remarks for leadId:', leadId);
      fetchRemarks();
    }
  }, [isVisible, leadId, onGetRemarks]);

  const fetchRemarks = async () => {
    if (!leadId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('LeadRemarksModal: Calling onGetRemarks with leadId:', leadId);
      const result = await onGetRemarks(leadId);
      console.log('LeadRemarksModal: Received result:', result);
      if (result.success) {
        setRemarks(result.data || []);
        console.log('LeadRemarksModal: Set remarks:', result.data || []);
      } else {
        setError(result.error || 'Failed to load remarks');
      }
    } catch (err: any) {
      console.error('LeadRemarksModal: Error fetching remarks:', err);
      setError('Failed to load remarks');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible || !lead) {
    return null;
  }

  const sortedRemarks = [...remarks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Remarks for: <Text style={styles.leadNameHighlight}>{lead.name}</Text>
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading remarks...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchRemarks}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : sortedRemarks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No remarks found for this lead.</Text>
                <Text style={styles.emptySubText}>Add the first remark to get started</Text>
              </View>
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {sortedRemarks.map((remark, index) => {
                  const createdDateTime = formatDateTime(remark.createdAt);
                  const createdBy = remark.createdBy?.name || 'Unknown';
                  
                  return (
                    <View key={remark.id || index} style={styles.remarkCard}>
                      <View style={styles.remarkHeader}>
                        <View style={styles.remarkTypeContainer}>
                          <View style={styles.remarkTypeIndicator} />
                          <Text style={styles.remarkTypeText}>General</Text>
                        </View>
                        <Text style={styles.remarkDate}>{createdDateTime}</Text>
                      </View>
                      
                      <Text style={styles.remarkText}>{remark.remark}</Text>
                      
                      <View style={styles.remarkFooter}>
                        <Ionicons name="person" size={14} color="#6b7280" />
                        <Text style={styles.remarkAuthor}>by {createdBy}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
              <Text style={styles.closeFooterButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '95%',
    maxWidth: 450,
    height: '85%',
    minHeight: 450,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  leadNameHighlight: {
    color: '#3b82f6',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    margin: 16,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
  remarkCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  remarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  remarkTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remarkTypeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280',
    marginRight: 6,
  },
  remarkTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
  },
  remarkDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  remarkText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 12,
  },
  remarkFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remarkAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'flex-end',
  },
  closeFooterButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeFooterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LeadRemarksModal;
