// FollowUp Service - Updated for Backend Controller API
import axios from '../../legacy/api/axios';
import { API_ENDPOINTS } from './api.endpoints';

export class FollowUpService {
  /**
   * Get all follow-ups for a company
   * @param {number|string} companyId 
   * @returns {Promise<Object>} API response
   */
  static async getAllFollowUps(companyId) {
    try {
      const response = await axios.get(`/api/${companyId}/followups`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load follow-ups'
      };
    }
  }

  /**
   * Get follow-up by ID
   * @param {number|string} companyId 
   * @param {number|string} followUpId 
   * @returns {Promise<Object>} API response
   */
  static async getFollowUpById(companyId, followUpId) {
    try {
      const response = await axios.get(`/api/${companyId}/followups/${followUpId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load follow-up'
      };
    }
  }

  /**
   * Get today's follow-ups for a company
   * @param {number|string} companyId 
   * @returns {Promise<Object>} API response
   */
  static async getTodayFollowUps(companyId) {
    try {
      console.log('📞 FollowUpService: Making request to:', `/api/${companyId}/followups/today`);
      const response = await axios.get(`/api/${companyId}/followups/today`);
      
      console.log('📞 FollowUpService: Raw API response:', response);
      console.log('📞 FollowUpService: Response data:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ FollowUpService: Error occurred:', error);
      console.error('❌ FollowUpService: Error response:', error.response?.data);
      console.error('❌ FollowUpService: Error status:', error.response?.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load today\'s follow-ups'
      };
    }
  }

  /**
   * Get follow-ups by lead ID
   * @param {number|string} companyId 
   * @param {number|string} leadId 
   * @returns {Promise<Object>} API response
   */
  static async getFollowUpsByLeadId(companyId, leadId) {
    try {
      const response = await axios.get(`/api/${companyId}/followups/lead/${leadId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load follow-ups for lead'
      };
    }
  }

  /**
   * Create new follow-up
   * @param {number|string} companyId 
   * @param {Object} followUpData 
   * @returns {Promise<Object>} API response
   */
  static async createFollowUp(companyId, followUpData) {
    try {
      console.log('🔗 FollowUpService: Making request to:', `/api/${companyId}/followups`);
      console.log('🔗 FollowUpService: Request payload:', followUpData);
      
      const response = await axios.post(`/api/${companyId}/followups`, followUpData);
      
      console.log('✅ FollowUpService: Response received:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Follow-up created successfully'
      };
    } catch (error) {
      console.error('❌ FollowUpService: Error occurred:', error);
      console.error('❌ FollowUpService: Error response:', error.response?.data);
      console.error('❌ FollowUpService: Error status:', error.response?.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create follow-up'
      };
    }
  }

  /**
   * Update follow-up
   * @param {number|string} companyId 
   * @param {Object} followUpData 
   * @returns {Promise<Object>} API response
   */
  static async updateFollowUp(companyId, followUpData) {
    try {
      const response = await axios.put(`/api/${companyId}/followups`, followUpData);
      return {
        success: true,
        data: response.data,
        message: 'Follow-up updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update follow-up'
      };
    }
  }

  /**
   * Delete follow-up
   * @param {number|string} companyId 
   * @param {number|string} followUpId 
   * @returns {Promise<Object>} API response
   */
  static async deleteFollowUp(companyId, followUpId) {
    try {
      await axios.delete(`/api/${companyId}/followups/${followUpId}`);
      return {
        success: true,
        message: 'Follow-up deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete follow-up'
      };
    }
  }
}
