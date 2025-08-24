import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  title: string;
  status: string;
  uploadDate: string;
  uploadedByName?: string;
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
  onAssign: (taskId: string) => void;
  onUnassign: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusUpdate: (taskId: string, status: string) => void;
  role: string;
  canManageTask: (taskCreatorId: string) => boolean;
  isTaskAssignedToUser: (taskAssigneeId: string) => boolean;
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
  canManageTask,
  isTaskAssignedToUser
}) => {
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
        return '#f59e0b';
      case 'UNDER_PROCESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'NEW';
      case 'UNDER_PROCESS':
        return 'IN PROGRESS';
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

  const showActionMenu = () => {
    const actions = [
      { title: 'Preview Task', onPress: () => onOpen(task.id) },
      ...(isAssigned || canManage ? [
        { title: 'Download File', onPress: () => onDownload(task.id) }
      ] : []),
      ...(isAdminOrDirector ? [
        task.assignedTo 
          ? { title: 'Unassign Task', onPress: () => onUnassign(task.id) }
          : { title: 'Assign Task', onPress: () => onAssign(task.id) },
        { title: 'Delete Task', onPress: () => onDelete(task.id), destructive: true }
      ] : [])
    ];

    Alert.alert(
      'Task Actions',
      'Choose an action',
      actions.map(action => ({
        text: action.title,
        onPress: action.onPress,
        style: action.destructive ? 'destructive' : 'default'
      }))
    );
  };

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
        <TouchableOpacity onPress={showActionMenu} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
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
            onPress={() => {
              Alert.alert(
                'Update Status',
                'Select new status',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'NEW', onPress: () => handleStatusChange('NEW') },
                  { text: 'IN PROGRESS', onPress: () => handleStatusChange('UNDER_PROCESS') },
                  { text: 'COMPLETED', onPress: () => handleStatusChange('COMPLETED') }
                ]
              );
            }}
          >
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
              <Text style={styles.statusText}>
                {getStatusText(task.status)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default TaskCard;
