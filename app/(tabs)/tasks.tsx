import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/shared/contexts/AuthContext';
import { useTasks } from '../../src/core/hooks/useTasks';
import TaskCard from '../../src/components/tasks/TaskCard';
import TaskUploadForm from '../../src/components/tasks/TaskUploadForm';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';
import { useRouter, useFocusEffect } from 'expo-router';

export default function TasksScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role || 'USER';

  const {
    tasks,
    filteredTasks,
    loading,
    error,
    loadTasksByRole,
    deleteTask,
    assignTask,
    unassignTask,
    updateTaskStatus,
    uploadExcelFile,
    downloadExcelFile,
    canManageTask,
    isTaskAssignedToUser,
    refreshTasks,
    clearError
  } = useTasks(companyId, userId, role);

  useEffect(() => {
    if (companyId && userId && role) {
      loadTasksByRole();
    }
  }, [companyId, userId, role, loadTasksByRole]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  // Reset showUploadForm when screen comes back into focus
  useFocusEffect(
    React.useCallback(() => {
      setShowUploadForm(false);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const handleAddAction = (actionId: string) => {
    try {
      console.log('TasksScreen: handleAddAction called with actionId:', actionId);
      
      let targetRoute: string;
      
      switch (actionId) {
        case 'User':
          targetRoute = '/add?action=User';
          break;
        case 'Lead':
          targetRoute = '/add?action=Lead';
          break;
        case 'Properties':
          targetRoute = '/add?action=Properties';
          break;
        case 'Notes':
          targetRoute = '/add?action=Notes';
          break;
        case 'Task':
          targetRoute = '/add?action=Task';
          break;
        default:
          targetRoute = '/add';
          break;
      }

      router.push(targetRoute);
    } catch (error) {
      console.error('TasksScreen: handleAddAction error:', error);
    }
  };

  const handleOpen = (taskId: string) => {
    // For now, just show an alert. You can implement a preview modal later
    Alert.alert('Preview Task', `Opening task: ${taskId}`);
  };

  const handleDownload = async (taskId: string) => {
    try {
      const result = await downloadExcelFile(taskId);
      if (result.success) {
        Alert.alert('Success', 'File downloaded successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to download file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download file');
    }
  };

  const handleAssign = (taskId: string) => {
    // For now, just show an alert. You can implement a user selection modal later
    Alert.alert('Assign Task', `Assigning task: ${taskId}`);
  };

  const handleUnassign = async (taskId: string) => {
    try {
      const result = await unassignTask(taskId);
      if (result.success) {
        Alert.alert('Success', 'Task unassigned successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to unassign task');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to unassign task');
    }
  };

  const handleDelete = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteTask(taskId);
              if (result.success) {
                Alert.alert('Success', 'Task deleted successfully!');
              } else {
                Alert.alert('Error', result.error || 'Failed to delete task');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        }
      ]
    );
  };

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.success) {
        Alert.alert('Success', 'Task status updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to update task status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleUpload = async (taskData: any) => {
    try {
      const result = await uploadExcelFile(taskData);
      if (result.success) {
        setShowUploadForm(false);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: 'Upload failed' };
    }
  };

  if (!companyId || !userId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Authentication Required</Text>
          <Text style={styles.errorText}>
            Please log in to access tasks
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TabScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Ionicons name="list-outline" size={28} color="#1c69ff" />
              <Text style={styles.title}>Task Management</Text>
            </View>
            
          </View>
        
        {!showUploadForm && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredTasks.length}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredTasks.filter(t => t.status === 'NEW').length}
              </Text>
              <Text style={styles.statLabel}>New</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredTasks.filter(t => t.status === 'UNDER_PROCESS').length}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredTasks.filter(t => t.status === 'COMPLETED').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}
      </View>

      {/* Upload Form */}
      {showUploadForm && (
        <View style={styles.uploadContainer}>
          <TaskUploadForm onUpload={handleUpload} loading={loading} />
        </View>
      )}

      {/* Tasks List */}
      <ScrollView
        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass-outline" size={32} color="#6b7280" />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptyText}>
              {tasks.length === 0 ? 'Upload your first task to get started' : 'Try adjusting your filters'}
            </Text>
            {tasks.length === 0 && (
              <TouchableOpacity
                style={styles.uploadFirstButton}
                onPress={() => setShowUploadForm(true)}
              >
                <Ionicons name="cloud-upload" size={20} color="#fff" />
                <Text style={styles.uploadFirstButtonText}>Upload First Task</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={handleOpen}
              onDownload={handleDownload}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              role={role}
              canManageTask={canManageTask}
              isTaskAssignedToUser={isTaskAssignedToUser}
            />
          ))
        )}
      </ScrollView>
      
      {/* Floating Action Button */}
    
      </View>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#1c69ff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c69ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  uploadContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadFirstButton: {
    backgroundColor: '#1c69ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  uploadFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
