import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';
import TaskAssignmentModal from './TaskAssignmentModal';
import TaskPreviewModal from './TaskPreviewModal';

interface Task {
  id: string;
  title: string;
  status: string;
  uploadDate: string;
  uploadedByName?: string;
  companyId?: string;
  assignedTo?: {
    userId: string;
    name: string;
  };
  uploadedBy?: {
    userId: string;
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  onOpen: (taskId: string) => void;
  onDownload: (taskId: string) => void;
  onAssign: (taskId: string, userId: string) => Promise<void>;
  onUnassign: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusUpdate: (taskId: string, status: string) => void;
  role: string;
  companyId: string;
  currentUserId: string;
  canManageTask: (taskCreatorId: string) => boolean;
  isTaskAssignedToUser: (taskAssigneeId: string) => boolean;
  loading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onOpen,
  onDownload,
  onAssign,
  onUnassign,
  onDelete,
  onStatusUpdate,
  role,
  companyId,
  currentUserId,
  canManageTask,
  isTaskAssignedToUser,
  loading = false
}) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  
  const canManage = canManageTask(task.uploadedBy?.userId || '');
  const isAssigned = isTaskAssignedToUser(task.assignedTo?.userId || '');
  const isAdminOrDirector = role === 'ADMIN' || role === 'DIRECTOR';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return '#f59e0b'; // Yellow (same as crm-frontend)
      case 'UNDER_PROCESS':
        return '#3b82f6'; // Blue (same as crm-frontend)
      case 'COMPLETED':
        return '#10b981'; // Green (same as crm-frontend)
      default:
        return '#6b7280'; // Gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'NEW';
      case 'UNDER_PROCESS':
        return 'UNDER PROCESS';
      case 'COMPLETED':
        return 'COMPLETED';
      default:
        return status || 'NEW';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      Alert.alert(
        'Confirm Status Change',
        `Are you sure you want to mark this task as ${newStatus}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', onPress: () => onStatusUpdate(task.id, newStatus) }
        ]
      );
    } else {
      onStatusUpdate(task.id, newStatus);
    }
  };

  const handleAssignTask = async (taskId: string, userId: string) => {
    try {
      await onAssign(taskId, userId);
      setAssignmentModalVisible(false);
    } catch (error: any) {
      Alert.alert('Assignment Failed', error.message || 'Failed to assign task');
    }
  };

  const openAssignmentModal = () => {
    setAssignmentModalVisible(true);
  };

  const actions = [
    {
      label: 'Preview Task',
      icon: <Ionicons name="eye" size={14} color="#6b7280" />,
      onClick: () => setPreviewModalVisible(true)
    },
    ...(isAssigned || canManage ? [{
      label: 'Download File',
      icon: <Ionicons name="download" size={14} color="#6b7280" />,
      onClick: () => onDownload(task.id)
    }] : []),
    ...(isAdminOrDirector ? [
      task.assignedTo 
        ? {
            label: 'Unassign Task',
            icon: <Ionicons name="person-remove" size={14} color="#6b7280" />,
            onClick: () => onUnassign(task.id)
          }
        : {
            label: 'Assign Task',
            icon: <Ionicons name="person-add" size={14} color="#6b7280" />,
            onClick: () => openAssignmentModal()
          },
      {
        label: 'Delete Task',
        icon: <Ionicons name="trash" size={14} color="#6b7280" />,
        onClick: () => onDelete(task.id),
        danger: true
      }
    ] : [])
  ];

  return (
    <View style={styles.card}>
      {/* Task Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.dateText}>
              {formatDate(task.uploadDate)} by {task.uploadedByName || 'Unknown'}
            </Text>
          </View>
        </View>
        
        {/* Three Dot Menu */}
        <ThreeDotMenu
          item={task}
          actions={actions}
          position="right-0"
        />
      </View>

      {/* Task Details */}
      <View style={styles.details}>
        {/* Assigned To */}
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text style={styles.detailLabel}>Assigned to:</Text>
          <Text style={styles.detailValue}>
            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
          </Text>
        </View>

        {/* Status */}
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailLabel}>Status:</Text>
          <TouchableOpacity
            onPress={() => setStatusModalVisible(true)}
          >
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
              <Text style={styles.statusText}>
                {getStatusText(task.status)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Update Modal */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <Text style={styles.modalSubtitle}>Select new status</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleStatusChange('NEW');
                  setStatusModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>NEW</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleStatusChange('UNDER_PROCESS');
                  setStatusModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>UNDER PROCESS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleStatusChange('COMPLETED');
                  setStatusModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>COMPLETED</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

             {/* Task Assignment Modal */}
       <TaskAssignmentModal
         isVisible={assignmentModalVisible}
         onClose={() => setAssignmentModalVisible(false)}
         onAssign={handleAssignTask}
         taskId={task.id}
         companyId={companyId}
         currentUserRole={role}
         currentUserId={currentUserId}
         loading={loading}
       />

       {/* Task Preview Modal */}
       <TaskPreviewModal
         isVisible={previewModalVisible}
         onClose={() => setPreviewModalVisible(false)}
         taskId={task.id}
         companyId={companyId}
       />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  menuButton: {
    padding: 4,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
});

export default TaskCard;
