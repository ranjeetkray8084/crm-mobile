import { API_ENDPOINTS } from './api.endpoints';
import axios from '../../legacy/api/axios';

export class TaskService {
  // ✅ Get all tasks by company
  static async getAllTasksByCompany(companyId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET_ALL, {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch tasks' };
    }
  }

  // ✅ Admin task list
  static async getAllTasksForAdmin(adminId, companyId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET_ADMIN_ALL, {
        params: { adminId, companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch admin tasks' };
    }
  }

  // ✅ Assigned tasks to a user
  static async getAssignedTasks(companyId, userId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET_ASSIGNED, {
        params: { companyId, userId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch assigned tasks' };
    }
  }

  // ✅ Tasks uploaded by a user
  static async getTasksUploadedByUser(userId, companyId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET_UPLOADED, {
        params: { uploadedById: userId, companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch uploaded tasks' };
    }
  }

  // ✅ Delete a task
  static async deleteTask(taskId, companyId) {
    try {
      const response = await axios.delete(API_ENDPOINTS.TASKS.DELETE(taskId), {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete task' };
    }
  }

  // ✅ Delete single column (matching backend implementation)
  static async deleteColumn(taskId, companyId, colIndex) {
    try {
      const response = await axios.delete(API_ENDPOINTS.TASKS.DELETE_COLUMN(taskId), {
        params: { companyId, colIndex }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete column' };
    }
  }

  // ✅ Update a specific Excel cell
  static async updateCell(taskId, companyId, row, col, newValue) {
    try {
      // Backend expects query parameters only
      const response = await axios.patch(API_ENDPOINTS.TASKS.UPDATE_CELL(taskId), null, {
        params: {
          companyId,
          row,
          col,
          newValue
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update cell' };
    }
  }

  // ✅ Preview Excel
  static async previewExcel(taskId, companyId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.PREVIEW(taskId), {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to preview Excel' };
    }
  }

  // ✅ Add new row to Excel
  static async addNewRow(taskId, companyId) {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS.ADD_ROW(taskId), null, {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add new row' };
    }
  }

  // ✅ Add new column to Excel
  static async addNewColumn(taskId, companyId) {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS.ADD_COLUMN(taskId), null, {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add new column' };
    }
  }

  // ✅ Delete selected columns from Excel
  static async deleteSelectedColumns(taskId, companyId, columnIndices) {
    try {
      // Delete columns one by one (backend doesn't support bulk delete)
      const deletePromises = columnIndices.map(colIndex => 
        this.deleteColumn(taskId, companyId, colIndex)
      );
      
      const results = await Promise.all(deletePromises);
      const hasError = results.some(result => !result.success);
      
      if (hasError) {
        return { success: false, error: 'Some columns failed to delete' };
      }
      
      return { success: true, data: 'Columns deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete selected columns' };
    }
  }

  // ✅ Undo last action
  static async undoLastAction(taskId, companyId) {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS.UNDO(taskId), null, {
        params: { companyId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to undo last action' };
    }
  }

  // ✅ Download Excel file
  static async downloadFile(taskId, companyId) {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.DOWNLOAD(taskId), {
        params: { companyId },
        responseType: 'blob'
      });
      
      // For React Native, we need to handle the blob differently
      // Convert blob to base64 using a different approach
      try {
        // Try to use FileReader if available (web)
        if (typeof FileReader !== 'undefined') {
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onload = () => {
              const base64Data = reader.result.split(',')[1];
              resolve({ success: true, data: base64Data, fileName: `task_${taskId}.xlsx` });
            };
            reader.onerror = () => {
              reject({ success: false, error: 'Failed to read file data' });
            };
            reader.readAsDataURL(response.data);
          });
        } else {
          // For React Native, try to get the data directly
          if (response.data && typeof response.data === 'string') {
            // If it's already a string, it might be base64
            return { success: true, data: response.data, fileName: `task_${taskId}.xlsx` };
          } else if (response.data && response.data.arrayBuffer) {
            // Try to convert the blob data
            const arrayBuffer = await response.data.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Use a polyfill for btoa if not available
            let base64Data;
            if (typeof btoa !== 'undefined') {
              base64Data = btoa(String.fromCharCode(...uint8Array));
            } else {
              // Simple base64 polyfill for React Native
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              let result = '';
              for (let i = 0; i < uint8Array.length; i += 3) {
                const chunk = (uint8Array[i] << 16) | (uint8Array[i + 1] << 8) | uint8Array[i + 2];
                result += chars[(chunk >> 18) & 63];
                result += chars[(chunk >> 12) & 63];
                result += chars[(chunk >> 6) & 63];
                result += chars[chunk & 63];
              }
              base64Data = result;
            }
            
            return { success: true, data: base64Data, fileName: `task_${taskId}.xlsx` };
          } else {
            return { success: false, error: 'Unexpected data format received from server' };
          }
        }
      } catch (conversionError) {
        return { success: false, error: 'Failed to convert file data: ' + conversionError.message };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to download file: ' + error.message };
    }
  }

  // ✅ Upload Excel file
  static async uploadExcelFile(taskData) {
    try {
      if (!taskData.file) {
        return { success: false, error: 'No file provided' };
      }

      if (!taskData.companyId) {
        return { success: false, error: 'Company ID is required' };
      }

      if (!taskData.uploadedBy) {
        return { success: false, error: 'Uploader ID is required' };
      }

      const formData = new FormData();
      formData.append('file', taskData.file);
      formData.append('title', taskData.title);
      formData.append('companyId', taskData.companyId.toString());
      formData.append('uploadedBy', taskData.uploadedBy.toString());

      const response = await axios.post(API_ENDPOINTS.TASKS.UPLOAD, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout for file uploads
      });

      return { success: true, data: response.data };
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data || 
                           `Server error: ${error.response.status}`;
        return { success: false, error: errorMessage };
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, error: 'Network error: Unable to reach server' };
      } else {
        // Something else happened
        return { success: false, error: error.message || 'Upload failed' };
      }
    }
  }

  // ✅ Assign/Unassign a task
  static async assignTask(taskId, companyId, userId = null) {
    try {
      const params = { companyId };
      
      if (userId !== null && userId !== undefined) {
        params.userId = userId;
      }
      
      const response = await axios.put(API_ENDPOINTS.TASKS.ASSIGN(taskId), null, {
        params
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to assign/unassign task' };
    }
  }

  // ✅ Update task status
  static async updateTaskStatus(taskId, companyId, status) {
    try {
      const response = await axios.put(API_ENDPOINTS.TASKS.UPDATE_STATUS(taskId), null, {
        params: { companyId, status }
      });
      
      // Check if the response indicates success
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: `Backend returned status ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update task status' };
    }
  }
}

export default TaskService;