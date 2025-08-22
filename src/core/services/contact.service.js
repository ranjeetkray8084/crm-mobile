// Contact Service - Reusable for Web & Mobile
import axios from 'axios';

// Configure base URL
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.26:8082';
axios.defaults.baseURL = BASE_URL;
import { API_ENDPOINTS } from './api.endpoints';

export class ContactService {
  /**
   * Send contact message
   * @param {Object} contactData - { name, email, message }
   * @returns {Promise<Object>} API response
   */
  static async sendContactMessage(contactData) {
    try {
      const response = await axios.post(API_ENDPOINTS.CONTACT.SEND_MESSAGE, contactData);
      return {
        success: true,
        data: response.data,
        message: 'Message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  }
}