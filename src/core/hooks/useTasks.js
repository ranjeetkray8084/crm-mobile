// useTasks Hook - Mobile-optimized version for React Native/Expo
import { useState, useEffect, useCallback } from 'react';
import { TaskService } from '../services/task.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTasks = (companyId, userId, userRole) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user info from AsyncStorage
  const getUserInfo = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('crm_user');
      const tokenData = await AsyncStorage.getItem('crm_token');
      
      if (!userData || !tokenData) {
        return null;
      }
      
      const user = JSON.parse(userData);
      return {
        companyId: companyId || user.companyId,
        userId: userId || user.userId || user.id,
        role: userRole || user.role,
        token: tokenData
      };
    } catch (error) {
      console.warn('Failed to get user info from storage:', error);
      return null;
    }
  }, [companyId, userId, userRole]);

  const fetchTasks = useCallback(async () => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      setError('Company ID is missing or user not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (userInfo.role === 'DIRECTOR') {
        result = await TaskService.getTasksByCompany(userInfo.companyId);
      } else if (userInfo.role === 'ADMIN') {
        result = await TaskService.getTasksVisibleToAdmin(userInfo.companyId, userInfo.userId);
      } else {
        result = await TaskService.getTasksByUser(userInfo.companyId, userInfo.userId);
      }

      if (result.success) {
        const tasksData = result.data || [];
        setTasks(tasksData);
      } else {
        setError(result.error);
        console.error('❌ ' + result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to fetch tasks: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      console.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  const createTask = useCallback(async (taskData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await TaskService.createTask(taskData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the tasks list
        await fetchTasks();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to create task: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchTasks]);

  const updateTask = useCallback(async (taskId, updateData) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await TaskService.updateTask(taskId, updateData, userInfo.companyId);
      
      if (result.success) {
        // Refresh the tasks list
        await fetchTasks();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to update task: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchTasks]);

  const deleteTask = useCallback(async (taskId) => {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.companyId) {
      throw new Error('Company ID is missing or user not authenticated.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await TaskService.deleteTask(taskId, userInfo.companyId);
      
      if (result.success) {
        // Refresh the tasks list
        await fetchTasks();
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = `Failed to delete task: ${err.response?.data?.message || err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo, fetchTasks]);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
