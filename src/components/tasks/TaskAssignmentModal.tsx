import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskAssignees } from '../../core/hooks/useTaskAssignees';

interface TaskAssignmentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAssign: (taskId: string, userId: string) => Promise<void>;
  taskId: string;
  companyId: string;
  currentUserRole: string;
  currentUserId: string;
  loading?: boolean;
}

const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isVisible,
  onClose,
  onAssign,
  taskId,
  companyId,
  currentUserRole,
  currentUserId,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  const { users, loading: loadingUsers, error, refreshUsers } = useTaskAssignees(
    companyId,
    currentUserRole,
    currentUserId
  );

  useEffect(() => {
    console.log('TaskAssignmentModal: useEffect triggered', { isVisible, companyId, currentUserId, currentUserRole });
    if (isVisible && companyId) {
      console.log('TaskAssignmentModal: Refreshing users...');
      refreshUsers();
    }
  }, [isVisible, companyId, currentUserId, currentUserRole, refreshUsers]);

  useEffect(() => {
    // Filter users based on search term
    console.log('TaskAssignmentModal: users loaded:', users);
    if (users && users.length > 0) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('TaskAssignmentModal: filtered users:', filtered);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm]);

  const handleAssign = async (userId: string) => {
    try {
      await onAssign(taskId, userId);
      onClose();
    } catch (err: any) {
      Alert.alert('Assignment Failed', err.message || 'Failed to assign task');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#3b82f6'; // Blue
      case 'USER':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  const getRoleBackgroundColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#dbeafe'; // Light blue
      case 'USER':
        return '#d1fae5'; // Light green
      default:
        return '#f3f4f6'; // Light gray
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Assign Task to User</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users by name..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="#9ca3af"
              />
            </View>

                         {/* Error Message */}
             {error && (
               <View style={styles.errorContainer}>
                 <Text style={styles.errorText}>{error}</Text>
               </View>
             )}

           

            {/* User List */}
            <View style={styles.userListContainer}>
              <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
                {loadingUsers ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading users...</Text>
                  </View>
                                 ) : filteredUsers.length === 0 ? (
                   <View style={styles.emptyContainer}>
                     <Text style={styles.emptyText}>
                       {searchTerm ? 'No users found matching your search' : 'No users available for assignment'}
                     </Text>
                     <Text style={[styles.emptyText, { marginTop: 8, fontSize: 12 }]}>
                       Users loaded: {users.length} | Filtered: {filteredUsers.length}
                     </Text>
                   </View>
                ) : (
                  filteredUsers.map((user) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <View style={[
                          styles.userIcon,
                          { backgroundColor: getRoleBackgroundColor(user.role) }
                        ]}>
                          <Ionicons name="person" size={24} color={getRoleColor(user.role)} />
                        </View>
                        <View style={styles.userDetails}>
                          <Text style={styles.userName}>
                            {user.name} ({user.role})
                          </Text>
                            <Text style={styles.userEmail}>
                             {user.email || 'No email provided'}
                           </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[styles.assignButton, loading && styles.assignButtonDisabled]}
                        onPress={() => handleAssign(user.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.assignButtonText}>Assign</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>

            {/* User Count */}
            {!loadingUsers && filteredUsers.length > 0 && (
              <View style={styles.userCountContainer}>
                <Text style={styles.userCountText}>
                  {searchTerm ? (
                    `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`
                  ) : (
                    `${users.length} user${users.length !== 1 ? 's' : ''} available for assignment`
                  )}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButtonFooter} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    flex: 1,
    minHeight: 400,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  debugContainer: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  debugText: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  userListContainer: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    padding: 16,
    flex: 1,
    minHeight: 300,
  },
  userList: {
    flex: 1,
    minHeight: 250,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  assignButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    opacity: 0.5,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  userCountContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  userCountText: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  closeButtonFooter: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TaskAssignmentModal;
