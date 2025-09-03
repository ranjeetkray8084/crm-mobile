import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Profile Picture Storage Utilities
 * Handles storing and retrieving profile pictures in AsyncStorage
 */

export const ProfilePictureUtils = {
  /**
   * Store profile picture URL in AsyncStorage
   * @param {string} userId - User ID
   * @param {string} imageUrl - Image URL or base64 data
   */
  storeProfilePicture: async (userId, imageUrl) => {
    try {
      const key = `avatar_${userId}`;
      await AsyncStorage.setItem(key, imageUrl);
      console.log('🔧 Profile picture stored in AsyncStorage for user:', userId);
      return true;
    } catch (error) {
      console.error('🔧 Error storing profile picture:', error);
      return false;
    }
  },

  /**
   * Get profile picture URL from AsyncStorage
   * @param {string} userId - User ID
   * @returns {string|null} - Image URL or null if not found
   */
  getProfilePicture: async (userId) => {
    try {
      const key = `avatar_${userId}`;
      const imageUrl = await AsyncStorage.getItem(key);
      console.log('🔧 Profile picture retrieved from AsyncStorage for user:', userId);
      return imageUrl;
    } catch (error) {
      console.error('🔧 Error retrieving profile picture:', error);
      return null;
    }
  },

  /**
   * Remove profile picture from AsyncStorage
   * @param {string} userId - User ID
   */
  removeProfilePicture: async (userId) => {
    try {
      const key = `avatar_${userId}`;
      await AsyncStorage.removeItem(key);
      console.log('🔧 Profile picture removed from AsyncStorage for user:', userId);
      return true;
    } catch (error) {
      console.error('🔧 Error removing profile picture:', error);
      return false;
    }
  },

  /**
   * Clear all profile pictures from AsyncStorage
   */
  clearAllProfilePictures: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const avatarKeys = keys.filter(key => key.startsWith('avatar_'));
      if (avatarKeys.length > 0) {
        await AsyncStorage.multiRemove(avatarKeys);
        console.log('🔧 All profile pictures cleared from AsyncStorage');
      }
      return true;
    } catch (error) {
      console.error('🔧 Error clearing profile pictures:', error);
      return false;
    }
  },

  /**
   * Get profile picture with fallback
   * @param {string} userId - User ID
   * @param {string} fallbackUrl - Fallback image URL
   * @returns {string} - Image URL or fallback
   */
  getProfilePictureWithFallback: async (userId, fallbackUrl = null) => {
    const storedImage = await ProfilePictureUtils.getProfilePicture(userId);
    return storedImage || fallbackUrl;
  },

  /**
   * Update user data in AsyncStorage with new profile picture
   * @param {string} userId - User ID
   * @param {string} imageUrl - New image URL
   * @param {Object} userData - Updated user data
   */
  updateUserWithProfilePicture: async (userId, imageUrl, userData) => {
    try {
      // Store the profile picture
      await ProfilePictureUtils.storeProfilePicture(userId, imageUrl);
      
      // Update user data if provided
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('🔧 User data updated in AsyncStorage');
      }
      
      return true;
    } catch (error) {
      console.error('🔧 Error updating user with profile picture:', error);
      return false;
    }
  }
};

export default ProfilePictureUtils;
