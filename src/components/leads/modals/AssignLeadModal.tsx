import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../../../core/hooks/useUsers';

interface AssignLeadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAssign: (leadId: string, userId: string, userName: string) => void;
  leadId: string;
  companyId: string;
  userRole: string;
  currentUserId: string;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isVisible,
  onClose,
  onAssign,
  leadId,
  companyId,
  userRole,
  currentUserId
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const { users, loading } = useUsers(companyId);

  // Filter users based on role permissions
  const getAvailableUsers = () => {
    if (!users) return [];
    
    if (userRole === 'DIRECTOR') {
      // Director can assign to ADMIN and USER roles
      return users.filter(user => 
        user.role === 'ADMIN' || user.role === 'USER'
      );
    } else if (userRole === 'ADMIN') {
      // Admin can assign only to USER role
      return users.filter(user => user.role === 'USER');
    }
    
    return [];
  };

  const availableUsers = getAvailableUsers();

  const handleAssign = () => {
    if (selectedUserId && selectedUserName) {
      onAssign(leadId, selectedUserId, selectedUserName);
    }
  };

  const handleUserSelect = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  useEffect(() => {
    if (!isVisible) {
      setSelectedUserId('');
      setSelectedUserName('');
    }
  }, [isVisible]);

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
            <Text style={styles.title}>Assign Lead</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a user to assign this lead to:
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : availableUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No users available for assignment</Text>
            </View>
          ) : (
            <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
              {availableUsers.map((user) => {
                const userId = user.userId?.toString() || user.id?.toString();
                const isSelected = selectedUserId === userId;
                
                return (
                  <TouchableOpacity
                    key={userId}
                    style={[styles.userItem, isSelected && styles.userItemSelected]}
                    onPress={() => handleUserSelect(userId, user.name)}
                  >
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userInitial}>
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userRole}>{user.role}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.assignButton,
                !selectedUserId && styles.assignButtonDisabled
              ]}
              onPress={handleAssign}
              disabled={!selectedUserId}
            >
              <Text style={styles.assignButtonText}>Assign Lead</Text>
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
  usersList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 8,
  },
  userItemSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  assignButton: {
    backgroundColor: '#10b981',
  },
  assignButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default AssignLeadModal;
