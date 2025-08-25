import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ViewRemarksModalProps {
  isVisible: boolean;
  onClose: () => void;
  remarks: any[];
  noteId: number;
}

const ViewRemarksModal: React.FC<ViewRemarksModalProps> = ({
  isVisible,
  onClose,
  remarks,
  noteId,
}) => {
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'Unknown';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString();
    } catch {
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
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Note Remarks</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {remarks.length === 0 ? (
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
              
              {remarks.map((remark, index) => (
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  closeFooterButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1c69ff',
    alignItems: 'center',
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default ViewRemarksModal;
