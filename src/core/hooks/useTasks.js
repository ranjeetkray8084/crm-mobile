import { useState, useEffect, useCallback, useMemo } from 'react';
import TaskService from '../services/task.service';

export const useTasks = (companyId, userId, role) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdByFilter, setCreatedByFilter] = useState('ALL');
  const [assignedToFilter, setAssignedToFilter] = useState('ALL');

  // --- Role-based Tasks Loader ---
  const loadTasksByRole = useCallback(async () => {
    if (!companyId || !role) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (role === 'DIRECTOR') {
        response = await TaskService.getAllTasksByCompany(companyId);
      } else if (role === 'ADMIN') {
        response = await TaskService.getAllTasksForAdmin(userId, companyId);
      } else if (role === 'USER') {
        response = await TaskService.getAssignedTasks(companyId, userId);
        
        // TEMPORARY: Also get all tasks to compare
        const allTasksResponse = await TaskService.getAllTasksByCompany(companyId);
        if (allTasksResponse?.success) {
          const myAssignedTasks = allTasksResponse.data.filter(task => task.assignedTo?.userId === userId);
          
          // If assigned endpoint returns fewer tasks, use all tasks filtered
          if (myAssignedTasks.length > (response.data?.length || 0)) {
            response = { success: true, data: myAssignedTasks };
          }
        }
      } else {
        response = await TaskService.getAllTasksByCompany(companyId);
      }

      if (response?.success) {
        // Sort tasks: current user's tasks first, then others
        const sortedTasks = sortTasksByCurrentUser(response.data || [], userId);
        setTasks(sortedTasks);
      } else {
        setError(response?.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [companyId, userId, role]);

  // Helper function to sort tasks: current user's tasks first
  const sortTasksByCurrentUser = useCallback((taskList, currentUserId) => {
    if (!currentUserId) return taskList;
    
    return [...taskList].sort((a, b) => {
      const aIsCurrentUser = a.uploadedBy?.userId === currentUserId;
      const bIsCurrentUser = b.uploadedBy?.userId === currentUserId;
      
      if (aIsCurrentUser && !bIsCurrentUser) return -1;
      if (!aIsCurrentUser && bIsCurrentUser) return 1;
      return 0;
    });
  }, []);

  // Get filtered tasks based on createdByFilter and assignedToFilter
  const getFilteredTasks = useCallback(() => {
    let filteredTasks = [...tasks];

    // Created By filter
    if (createdByFilter === 'CURRENT_USER') {
      filteredTasks = filteredTasks.filter(task => {
        const taskCreatorId = task.uploadedBy?.userId || task.uploadedBy;
        return taskCreatorId === userId;
      });
    } else if (createdByFilter !== 'ALL') {
      filteredTasks = filteredTasks.filter(task => {
        const taskCreatorId = task.uploadedBy?.userId || task.uploadedBy;
        return taskCreatorId === parseInt(createdByFilter);
      });
    }

    // Assigned To filter
    if (assignedToFilter === 'CURRENT_USER') {
      filteredTasks = filteredTasks.filter(task => {
        const taskAssigneeId = task.assignedTo?.userId;
        return taskAssigneeId === userId;
      });
    } else if (assignedToFilter === 'UNASSIGNED') {
      filteredTasks = filteredTasks.filter(task => !task.assignedTo?.userId);
    } else if (assignedToFilter !== 'ALL') {
      filteredTasks = filteredTasks.filter(task => {
        const taskAssigneeId = task.assignedTo?.userId;
        return taskAssigneeId === parseInt(assignedToFilter);
      });
    }

    return filteredTasks;
  }, [tasks, createdByFilter, assignedToFilter, userId]);

  // --- Task Operations ---
  const loadAssignedTasks = useCallback(async () => {
    if (!companyId || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await TaskService.getAssignedTasks(companyId, userId);
      if (response?.success) {
        setTasks(response.data || []);
      } else {
        setError(response?.error || 'Failed to load assigned tasks');
      }
    } catch (err) {
      setError('Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  }, [companyId, userId]);

  const loadUploadedTasks = useCallback(async () => {
    if (!companyId || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await TaskService.getUploadedTasks(companyId, userId);
      if (response?.success) {
        setTasks(response.data || []);
      } else {
        setError(response?.error || 'Failed to load uploaded tasks');
      }
    } catch (err) {
      setError('Failed to load uploaded tasks');
    } finally {
      setLoading(false);
    }
  }, [companyId, userId]);

  const refreshTasks = useCallback(async () => {
    if (companyId && role) {
      await loadTasksByRole();
    }
  }, [companyId, role, loadTasksByRole]);

  // Assign/Unassign task
  const assignTask = useCallback(async (taskId, assignedUserId) => {
    if (!companyId) {
      return { success: false, error: 'Company ID is required' };
    }

    try {
      const result = await TaskService.assignTask(taskId, companyId, assignedUserId);
      if (result.success) {
        // Refresh tasks after assignment
        await refreshTasks();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to assign task' };
    }
  }, [companyId, refreshTasks]);

  // Unassign task
  const unassignTask = useCallback(async (taskId) => {
    if (!companyId) {
      return { success: false, error: 'Company ID is required' };
    }

    try {
      // Pass null as userId to unassign the task
      const result = await TaskService.assignTask(taskId, companyId, null);
      if (result.success) {
        // Refresh tasks after unassignment
        await refreshTasks();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to unassign task' };
    }
  }, [companyId, refreshTasks]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    if (!companyId || !role) {
      return { success: false, error: 'Company ID and role are required' };
    }

    try {
      const result = await TaskService.updateTaskStatus(taskId, companyId, newStatus);
      
      if (result.success) {
        // Update local state immediately for live status update
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => {
            if (task.id === taskId) {
              return { ...task, status: newStatus };
            }
            return task;
          });
          return updatedTasks;
        });
      }
      
      return result;
    } catch (err) {
      return { success: false, error: 'Failed to update task status' };
    }
  }, [companyId, role]);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    console.log('useTasks deleteTask called with:', { taskId, companyId });
    
    if (!companyId) {
      console.error('useTasks deleteTask: Missing companyId');
      return { success: false, error: 'Company ID is required' };
    }

    try {
      console.log('useTasks deleteTask: Calling TaskService.deleteTask');
      const result = await TaskService.deleteTask(taskId, companyId);
      console.log('useTasks deleteTask: Result:', result);
      
      if (result.success) {
        // Remove task from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        console.log('useTasks deleteTask: Task removed from local state');
      }
      return result;
    } catch (error) {
      console.error('useTasks deleteTask: Error:', error);
      return { success: false, error: 'Failed to delete task' };
    }
  }, [companyId]);

  // Upload Excel file
  const uploadExcelFile = useCallback(async (taskData) => {
    console.log('useTasks: Upload called with:', {
      title: taskData.title,
      fileName: taskData.file?.name,
      companyId,
      userId
    });

    if (!companyId) {
      console.error('useTasks: Missing companyId');
      return { success: false, error: 'Company ID is required' };
    }

    if (!userId) {
      console.error('useTasks: Missing userId');
      return { success: false, error: 'User ID is required' };
    }

    try {
      const uploadData = {
        ...taskData,
        companyId,
        uploadedBy: userId
      };
      
      console.log('useTasks: Calling TaskService with:', uploadData);
      const result = await TaskService.uploadExcelFile(uploadData);
      
      if (result.success) {
        console.log('useTasks: Upload successful, refreshing tasks');
        // Refresh tasks after upload
        await refreshTasks();
      } else {
        console.error('useTasks: Upload failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('useTasks: Upload error in hook:', error);
      return { success: false, error: 'Failed to upload Excel file' };
    }
  }, [companyId, userId, refreshTasks]);

  // Download Excel file
  const downloadExcelFile = useCallback(async (taskId) => {
    console.log('useTasks downloadExcelFile called with:', { taskId, companyId });
    
    if (!companyId) {
      console.error('useTasks downloadExcelFile: Missing companyId');
      return { success: false, error: 'Company ID is required' };
    }

    try {
      console.log('useTasks downloadExcelFile: Calling TaskService.downloadFile');
      const result = await TaskService.downloadFile(taskId, companyId);
      console.log('useTasks downloadExcelFile: Result:', result);
      return result;
    } catch (error) {
      console.error('useTasks downloadExcelFile: Error:', error);
      return { success: false, error: 'Failed to download Excel file' };
    }
  }, [companyId]);

  // Load tasks when component mounts or dependencies change
  useEffect(() => {
    if (companyId && role) {
      loadTasksByRole();
    }
  }, [companyId, role, loadTasksByRole]);

  // Check if user can manage a task (ADMIN, DIRECTOR, or task creator)
  const canManageTask = useCallback((taskCreatorId) => {
    if (!userId || !role) return false;
    
    // ADMIN and DIRECTOR can manage all tasks
    if (role === 'ADMIN' || role === 'DIRECTOR') return true;
    
    // Task creator can manage their own tasks
    return taskCreatorId === userId;
  }, [userId, role]);

  // Check if task is assigned to current user
  const isTaskAssignedToUser = useCallback((taskAssigneeId) => {
    if (!userId) return false;
    return taskAssigneeId === userId;
  }, [userId]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    createdByFilter,
    setCreatedByFilter,
    assignedToFilter,
    setAssignedToFilter,
    getFilteredTasks,
    loadTasksByRole,
    loadAssignedTasks,
    loadUploadedTasks,
    refreshTasks,
    assignTask,
    unassignTask,
    updateTaskStatus,
    deleteTask,
    uploadExcelFile,
    downloadExcelFile,
    canManageTask,
    isTaskAssignedToUser,
    clearError
  };
};
