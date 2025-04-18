import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the user info type
interface UserInfo {
  f_name: string;
  m_name: string;
  l_name: string;
  house_no: string;
  street: string;
  city: string;
  contact_no: string;
  gender: string;
  birth_Date: string;
  user_id?: string;
  formatted_address?: string;
}

// Keys for AsyncStorage
const TEMP_USER_INFO_KEY = 'temp_user_info';

/**
 * Service to handle temporary storage of user information during signup process
 */
class TempUserStorageService {
  /**
   * Save user information temporarily to AsyncStorage
   * @param userInfo - The user information object to store temporarily
   * @returns Promise resolving to true if successful
   */
  static async saveTemporaryUserInfo(userInfo: UserInfo): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(userInfo);
      await AsyncStorage.setItem(TEMP_USER_INFO_KEY, jsonValue);
      console.log('Temporary user info saved');
      return true;
    } catch (error) {
      console.error('Error saving temporary user info:', error);
      return false;
    }
  }

  /**
   * Retrieve temporary user information from AsyncStorage
   * @returns Promise resolving to UserInfo object or null if not found
   */
  static async getTemporaryUserInfo(): Promise<UserInfo | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(TEMP_USER_INFO_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving temporary user info:', error);
      return null;
    }
  }

  /**
   * Remove temporary user information from AsyncStorage after server save
   * @returns Promise resolving to true if successful
   */
  static async clearTemporaryUserInfo(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(TEMP_USER_INFO_KEY);
      console.log('Temporary user info cleared');
      return true;
    } catch (error) {
      console.error('Error clearing temporary user info:', error);
      return false;
    }
  }

  /**
   * Check if temporary user information exists in AsyncStorage
   * @returns Promise resolving to true if temporary user info exists
   */
  static async hasTemporaryUserInfo(): Promise<boolean> {
    try {
      const info = await AsyncStorage.getItem(TEMP_USER_INFO_KEY);
      return info !== null;
    } catch (error) {
      console.error('Error checking for temporary user info:', error);
      return false;
    }
  }
}

export default TempUserStorageService;