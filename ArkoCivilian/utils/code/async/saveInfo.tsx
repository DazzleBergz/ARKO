import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for better type safety
interface Address {
    houseNo: string;
    street: string;
    city: string;
    formatted_address: any;
}

interface UserData {
    userId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    birthdate: {
        day: string;
        month: string;
        year: string;
    };
    phone: string;
    address: Address;
    email: string;
    image?: string | null; // Can be null or empty
    token: string; // Added token field
}

// Add a separate interface for server data
interface ServerData {
    user_id: string;
    f_name: string;
    m_name?: string;
    l_name: string;
    gender: string;
    email: string;
    birth_date: string;
    contact_no: string;
    house_no: string;
    street: string;
    city: string;
    formatted_address: string;
    image?: string;
}

// Keys for AsyncStorage
const STORAGE_KEYS = {
    USER_DATA: 'user_data',
    AUTH_TOKEN: 'auth_token', // Added token storage key
} as const;

export class UserStorage {
    // Save user data to AsyncStorage
    static async saveUserData(serverData: any, token: string): Promise<void> {
        try {
            const userData: UserData = {
                userId: serverData.user_id,
                firstName: serverData.f_name,
                middleName: serverData.m_name || '',
                lastName: serverData.l_name,
                gender: serverData.gender,
                email: serverData.email,
                birthdate: UserStorage.parseBirthdate(serverData.birth_date),
                phone: serverData.contact_no,
                address: {
                    houseNo: serverData.house_no,
                    street: serverData.street,
                    city: serverData.city,
                    formatted_address: serverData.formatted_address,
                },
                image: serverData.image || null,
                token: token,
            };
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } catch (error) {
            console.error('Error saving user data:', error);
            throw new Error('Failed to save user data');
        }
    }

    // Retrieve user data from AsyncStorage
    static async getUserData(): Promise<UserData | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error retrieving user data:', error);
            throw new Error('Failed to retrieve user data');
        }
    }

    // Retrieve authentication token
    static async getAuthToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error('Error retrieving auth token:', error);
            throw new Error('Failed to retrieve auth token');
        }
    }

    // Clear user data (useful for logout)
    static async clearUserData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error('Error clearing user data:', error);
            throw new Error('Failed to clear user data');
        }
    }

    // Update specific fields in user data
    static async updateUserData(updates: Partial<UserData>): Promise<void> {
        try {
            const currentData = await this.getUserData();
            if (!currentData) {
                throw new Error('No user data found to update');
            }
            
            // Merge the updates with current data
            const updatedData: UserData = { 
                ...currentData, 
                ...updates,
                // Ensure nested objects are properly merged
                address: {
                    ...currentData.address,
                    ...(updates.address || {})
                }
            };
            
            // Save directly to AsyncStorage instead of calling saveUserData
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedData));
            
        } catch (error) {
            console.error('Error updating user data:', error);
            throw new Error('Failed to update user data');
        }
    }

    // Helper function to parse birthdate string (YYYY-MM-DD)
    private static parseBirthdate(dateStr: string) {
        // Add a check for undefined dateStr
        if (!dateStr) {
            return { day: 1, month: 1, year: 1970 }; // Default date if none provided
        }
        const parts = dateStr.split('-');
        // Ensure we have all the parts needed
        if (parts.length !== 3) {
            return { day: 1, month: 1, year: 1970 }; // Default if format is incorrect
        }
        const [year, month, day] = parts.map(Number);
        return { day, month, year };
    }
}