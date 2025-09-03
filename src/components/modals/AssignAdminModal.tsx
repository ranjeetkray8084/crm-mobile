import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmins } from '../../core/hooks/useAdmins';
import { useAuth } from '../../shared/contexts/AuthContext';
import { customAlert } from '../../core/utils/alertUtils';

interface User {
  userId: string;
  name: string;
  email: string;
}

interface AssignAdminModalProps {
  user: User;
  isVisible: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  user,
  isVisible,
  onClose,
  onAssigned,
}) => {
  const { user: currentUser } = useAuth();
  const { admins, loading, assignAdmin } = useAdmins(
    currentUser?.companyId,
    currentUser?.role,
    currentUser?.userId || currentUser?.id
  );
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!selectedAdminId) {
      customAlert('⚠️ Please select an admin.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await assignAdmin(user.userId, selectedAdminId);
      if (result.success) {
        customAlert('✅ Admin assigned successfully');
        onAssigned(); // Notify parent to reload
        onClose(); // Close modal
        setSelectedAdminId(''); // Reset selection
      } else {
        customAlert('❌ Failed to assign admin');
      }
    } catch (error) {
      customAlert('❌ Failed to assign admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAdminId(''); // Reset selection
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Assign Admin</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Assigning admin to:</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Admin Selection */}
          <View style={styles.selectionContainer}>
            <Text style={styles.label}>Select Admin:</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading admins...</Text>
              </View>
            ) : admins.length === 0 ? (
              <View style={styles.noAdminsContainer}>
                <Ionicons name="warning" size={24} color="#EF4444" />
                <Text style={styles.noAdminsText}>
                  No admins found. Please check if there are any admin users in your company.
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.adminList} showsVerticalScrollIndicator={false}>
                {admins.map((admin) => (
                  <TouchableOpacity
                    key={admin.userId}
                    style={[
                      styles.adminOption,
                      selectedAdminId === admin.userId && styles.selectedAdminOption,
                    ]}
                    onPress={() => setSelectedAdminId(admin.userId)}
                  >
                    <View style={styles.adminInfo}>
                      <Text style={[
                        styles.adminName,
                        selectedAdminId === admin.userId && styles.selectedAdminName,
                      ]}>
                        {admin.name}
                      </Text>
                      <Text style={[
                        styles.adminEmail,
                        selectedAdminId === admin.userId && styles.selectedAdminEmail,
                      ]}>
                        {admin.email}
                      </Text>
                    </View>
                    {selectedAdminId === admin.userId && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.assignButton,
                (!selectedAdminId || submitting) && styles.assignButtonDisabled,
              ]}
              onPress={handleAssign}
              disabled={!selectedAdminId || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="person-add" size={16} color="white" />
                  <Text style={styles.assignButtonText}>Assign</Text>
                </>
              )}
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  userInfo: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectionContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  noAdminsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  noAdminsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    lineHeight: 20,
  },
  adminList: {
    maxHeight: 200,
  },
  adminOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  selectedAdminOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedAdminName: {
    color: '#065F46',
  },
  adminEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedAdminEmail: {
    color: '#047857',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  assignButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    gap: 8,
  },
  assignButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default AssignAdminModal;
