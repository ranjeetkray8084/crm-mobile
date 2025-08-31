import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: number;
  content: string;
  typeStr?: string;
  status?: string;
  priority?: string;
  userId: number;
  [key: string]: any;
}

interface ViewRemarksModalProps {
  isVisible: boolean;
  onClose: () => void;
  note: Note;
  onGetRemarks: (noteId: number) => Promise<any>;
}

const ViewRemarksModal: React.FC<ViewRemarksModalProps> = ({
  isVisible,
  onClose,
  note,
  onGetRemarks,
}) => {
  const [remarks, setRemarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get noteId from the note object
  const noteId = note?.id;

  // Early return if not visible or no note
  if (!isVisible || !note || !noteId) {
    return null;
  }

  // Fetch remarks when modal opens
  useEffect(() => {
    let isMounted = true;
    
    if (isVisible && noteId) {
      const fetchRemarks = async () => {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        
        try {
          const result = await onGetRemarks(noteId);
          
          if (!isMounted) return;
          
          if (result.success) {
            setRemarks(result.data || []);
          } else {
            setError(result.error || 'Failed to load remarks');
          }
        } catch (err: any) {
          if (!isMounted) return;
          
          console.error('ViewRemarksModal: Error fetching remarks:', err);
          setError('Failed to load remarks');
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      
      fetchRemarks();
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isVisible, noteId]);

  const sortedRemarks = [...remarks].sort((a, b) => {
    try {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    } catch (error) {
      console.warn('Error sorting remarks by date:', error);
      return 0;
    }
  });

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getUserDisplayName = (remark: any) => {
    if (remark.userName) return remark.userName;
    if (remark.user?.name) return remark.user.name;
    if (remark.user?.username) return remark.user.username;
    return `User ${remark.userId}`;
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Remarks for: <Text style={styles.noteContent}>
                {note.content ? (note.content.length > 30 ? note.content.substring(0, 30) + '...' : note.content) : 'Note'}
              </Text>
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingState}>
                <Text style={styles.loadingText}>Loading remarks...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorState}>
                <Ionicons name="alert-circle" size={64} color="#ef4444" />
                <Text style={styles.errorStateTitle}>Error Loading Remarks</Text>
                <Text style={styles.errorStateSubtitle}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => {
                  const fetchRemarks = async () => {
                    setLoading(true);
                    setError(null);
                    
                    try {
                      console.log('ViewRemarksModal: Calling onGetRemarks with noteId:', noteId);
                      const result = await onGetRemarks(noteId);
                      console.log('ViewRemarksModal: Received result:', result);
                      
                      if (result.success) {
                        setRemarks(result.data || []);
                        console.log('ViewRemarksModal: Set remarks:', result.data || []);
                      } else {
                        setError(result.error || 'Failed to load remarks');
                      }
                    } catch (err: any) {
                      console.error('ViewRemarksModal: Error fetching remarks:', err);
                      setError('Failed to load remarks');
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchRemarks();
                }}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : remarks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyStateTitle}>No Remarks Yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  This note doesn't have any remarks yet. Add the first one!
                </Text>
              </View>
            ) : (
              <View style={styles.remarksContainer}>
                <Text style={styles.remarksCount}>
                  {remarks.length} remark{remarks.length !== 1 ? 's' : ''}
                </Text>
                
                {sortedRemarks.map((remark, index) => (
                  <View key={remark.id || index} style={styles.remarkCard}>
                    <View style={styles.remarkHeader}>
                      <View style={styles.userInfo}>
                        <Ionicons name="person-circle" size={20} color="#6b7280" />
                        <Text style={styles.userName}>
                          {getUserDisplayName(remark)}
                        </Text>
                      </View>
                      <Text style={styles.remarkDate}>
                        {formatDateTime(remark.createdAt)}
                      </Text>
                    </View>
                    
                    <Text style={styles.remarkContent}>
                      {remark.remark || remark.content || 'No content'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeFooterButton}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
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
  noteContent: {
    color: '#3b82f6',
    fontWeight: '500',
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
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  remarksContainer: {
    gap: 16,
  },
  remarksCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  remarkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  remarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  remarkDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  remarkContent: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  closeFooterButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default ViewRemarksModal;
