import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/shared/contexts/AuthContext';
import { useTasks } from '../../src/core/hooks/useTasks';
import TaskCard from '../../src/components/tasks/TaskCard';
import TaskUploadForm from '../../src/components/tasks/TaskUploadForm';
import FilterModal from '../../src/components/tasks/FilterModal';
import TaskToolbar from '../../src/components/tasks/TaskToolbar';
import TabScreenWrapper from '../../src/components/common/TabScreenWrapper';
import { useRouter, useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function TasksScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showUploadForm, setShowUploadForm] = useState(true); // Default to true to show form
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role || 'USER';

  // Role-based access control - DEVELOPER users should not see regular tabs
  if (role === 'DEVELOPER') {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="shield-outline" size={48} color="#8b5cf6" />
        <Text style={styles.errorTitle}>Developer Access</Text>
        <Text style={styles.errorMessage}>
          As a developer, you have access to company and user management through the sidebar menu.
        </Text>
      </View>
    );
  }

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
    clearError,
    // Filters
    searchTerm,
    setSearchTerm,
    taskStatus,
    setTaskStatus,
    createdByFilter,
    setCreatedByFilter,
    assignedToFilter,
    setAssignedToFilter
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

  // Keep upload form state when screen comes into focus
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setShowUploadForm(false);
  //   }, [])
  // );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const handleAddAction = (actionId: string) => {
    try {
      console.log('TasksScreen: handleAddAction called with actionId:', actionId);
      
      // Add screen has been removed - show alert instead
      Alert.alert(
        'Feature Unavailable',
        'The Quick Add feature has been removed. Please use the individual section forms instead.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('TasksScreen: handleAddAction error:', error);
    }
  };

  const handleOpen = (taskId: string) => {
    // The TaskPreviewModal is already integrated in TaskCard component
    // This function is called when the preview button is clicked
    // The modal will be shown automatically by the TaskCard component
    console.log('Opening task preview for taskId:', taskId);
  };

  const handleDownload = async (taskId: string) => {
    try {
      // Show loading alert
      Alert.alert('Downloading', 'Please wait while we download your file...', [], { cancelable: false });
      
      const result = await downloadExcelFile(taskId);
      
      if (result.success && result.data) {
        try {
          // Validate the data
          if (result.data.length < 100) {
            throw new Error('Downloaded data seems too small to be a valid Excel file');
          }
          
          // Try to save to Downloads folder first (Android)
          let fileUri;
          try {
            if (Platform.OS === 'android') {
              // Try to save to Downloads folder
              const downloadsDir = FileSystem.documentDirectory + 'Downloads/';
              await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
              fileUri = downloadsDir + result.fileName;
            } else {
              // For iOS, use app documents directory
              fileUri = FileSystem.documentDirectory + result.fileName;
            }
          } catch (dirError) {
            // Fallback to app documents directory
            fileUri = FileSystem.documentDirectory + result.fileName;
          }
          
          // Write the base64 data to the file
          await FileSystem.writeAsStringAsync(fileUri, result.data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Check if sharing is available
          const isAvailable = await Sharing.isAvailableAsync();
          
          if (isAvailable) {
            // Share the file
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              dialogTitle: 'Download Task File',
            });
            
            Alert.alert(
              'Download Successful! 📱', 
              'File has been saved to your phone and is ready to share. You can now:\n\n' +
              '• Save it to your Downloads folder\n' +
              '• Share via email, WhatsApp, etc.\n' +
              '• Open with Excel or other apps'
            );
          } else {
            // If sharing is not available, just show success message
            Alert.alert(
              'Download Successful! 📱', 
              `File has been saved to your phone at:\n${fileUri}\n\n` +
              'You can find it in your phone\'s file manager or app documents folder.'
            );
          }
          
        } catch (fileError: any) {
          Alert.alert('Error', `Failed to save file to device: ${fileError?.message || 'Unknown error'}`);
        }
      } else {
        const errorMessage = result.error || 'Failed to download file';
        Alert.alert('Download Failed', errorMessage);
      }
    } catch (error: any) {
      Alert.alert('Error', `Failed to download file: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleAssign = async (taskId: string, userId: string) => {
    try {
      const result = await assignTask(taskId, userId);
      if (result.success) {
        Alert.alert('Success', 'Task assigned successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to assign task');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to assign task');
    }
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

  const clearFilters = () => {
    setSearchTerm('');
    setTaskStatus('ALL');
    setCreatedByFilter('ALL');
    setAssignedToFilter('ALL');
  };

  // Get available creators and assignees for filter dropdowns
  const availableCreators = React.useMemo(() => {
    const creators = new Map();
    tasks.forEach(task => {
      const creator = task.uploadedBy;
      if (creator && (creator.userId || creator.id)) {
        const userId = creator.userId || creator.id;
        creators.set(userId, {
          id: userId,
          name: creator.name || creator.username || 'Unknown',
          username: creator.username || creator.name || 'Unknown'
        });
      }
    });
    return Array.from(creators.values());
  }, [tasks]);

  const availableAssignees = React.useMemo(() => {
    const assignees = new Map();
    tasks.forEach(task => {
      const assignee = task.assignedTo;
      if (assignee && (assignee.userId || assignee.id)) {
        const userId = assignee.userId || assignee.id;
        assignees.set(userId, {
          id: userId,
          name: assignee.name || assignee.username || 'Unknown',
          username: assignee.username || assignee.name || 'Unknown'
        });
      }
    });
    return Array.from(assignees.values());
  }, [tasks]);

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
        {/* Toolbar */}
        <TaskToolbar
          searchTerm={searchTerm || ''}
          onSearchChange={setSearchTerm}
          onToggleFilters={() => setShowFilterModal(true)}
          tasksCount={filteredTasks.length}
          showFilters={showFilterModal}
        />

        {/* Stats Section */}
        {!showUploadForm && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredTasks.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
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

        {/* Download Info */}
        {!showUploadForm && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>
              📱 Files are downloaded to your PHONE, not your computer. Use the share button to save to Downloads or share via other apps.
            </Text>
          </View>
        )}

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
              companyId={companyId}
              currentUserId={userId}
              canManageTask={canManageTask}
              isTaskAssignedToUser={isTaskAssignedToUser}
              loading={loading}
            />
          ))
        )}
      </ScrollView>
      
      {/* Floating Action Button */}
      {!showUploadForm && (
        <TouchableOpacity
          style={styles.floatingActionButton}
          onPress={() => setShowUploadForm(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
        createdByFilter={createdByFilter}
        setCreatedByFilter={setCreatedByFilter}
        assignedToFilter={assignedToFilter}
        setAssignedToFilter={setAssignedToFilter}
        availableCreators={availableCreators}
        availableAssignees={availableAssignees}
        onClearFilters={clearFilters}
      />

      </View>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  infoContainer: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
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
    backgroundColor: '#f8fafc',
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
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
  floatingActionButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1c69ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
