import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EmergencyRequest {
    id: string;
    timestamp: number;
    emergencyType: string;
    locationType?: string;
    address: string;
    description: string;
    status: 'pending' | 'completed' | 'cancelled';
}

export interface RecentActivity {
    type: string;
    timestamp: string;
    icon: string;
    status: 'cancelled' | 'completed';
}

export const EMERGENCY_TYPES = {
    medical_emergency: 'Medical Emergency',
    rescue_evacuation: 'Rescue & Evacuation',
    medical_supplies: 'Request Medical Supplies',
    food: 'Request Relief Supplies',
    urgent_rescue: 'Urgent Rescue'
} as const;

export class EmergencyRequestManager {
    private static ACTIVE_REQUEST_KEY = '@emergency_request:active';
    private static RECENT_ACTIVITIES_KEY = '@emergency_request:recent';

    static getEmergencyTypeLabel(value: keyof typeof EMERGENCY_TYPES): string {
        return EMERGENCY_TYPES[value] || value;
    }

    static async hasActiveRequest(): Promise<boolean> {
        try {
            const activeRequest = await AsyncStorage.getItem(this.ACTIVE_REQUEST_KEY);
            return activeRequest !== null;
        } catch (error) {
            console.error('Error checking active request:', error);
            return false;
        }
    }

    static async getActiveRequest(): Promise<EmergencyRequest | null> {
        try {
            const activeRequest = await AsyncStorage.getItem(this.ACTIVE_REQUEST_KEY);
            return activeRequest ? JSON.parse(activeRequest) : null;
        } catch (error) {
            console.error('Error fetching active request:', error);
            return null;
        }
    }

    static async submitRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp' | 'status'>): Promise<EmergencyRequest> {
        try {
            const hasActive = await this.hasActiveRequest();
            if (hasActive) {
                throw new Error('Active request already exists');
            }

            const newRequest: EmergencyRequest = {
                ...request,
                id: `req_${Date.now()}`,
                timestamp: Date.now(),
                status: 'pending'
            };

            await AsyncStorage.setItem(this.ACTIVE_REQUEST_KEY, JSON.stringify(newRequest));
            return newRequest;
        } catch (error) {
            console.error('Error submitting request:', error);
            throw error;
        }
    }

    static async submitSOSRequest(address: string): Promise<EmergencyRequest> {
        return this.submitRequest({
            emergencyType: 'urgent_rescue',
            address,
            description: 'Emergency SOS Request - Urgent Rescue Needed'
        });
    }

    static async cancelRequest(): Promise<void> {
        try {
            const activeRequest = await this.getActiveRequest();
            if (activeRequest) {
                await this.addToRecentActivity({
                    type: this.getEmergencyTypeLabel(activeRequest.emergencyType as keyof typeof EMERGENCY_TYPES),
                    timestamp: new Date().toLocaleString(),
                    icon: 'close-circle',
                    status: 'cancelled'
                });
            }
            await AsyncStorage.removeItem(this.ACTIVE_REQUEST_KEY);
        } catch (error) {
            console.error('Error cancelling request:', error);
            throw error;
        }
    }

    static async getRecentActivities(): Promise<RecentActivity[]> {
        try {
            const activities = await AsyncStorage.getItem(this.RECENT_ACTIVITIES_KEY);
            return activities ? JSON.parse(activities) : [];
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            return [];
        }
    }

    private static async addToRecentActivity(activity: RecentActivity): Promise<void> {
        try {
            const activities = await this.getRecentActivities();
            activities.unshift(activity);
            await AsyncStorage.setItem(this.RECENT_ACTIVITIES_KEY, JSON.stringify(activities));
        } catch (error) {
            console.error('Error adding to recent activity:', error);
            throw error;
        }
    }

    static async completeRequest(): Promise<void> {
        try {
            const activeRequest = await this.getActiveRequest();
            if (activeRequest) {
                await this.addToRecentActivity({
                    type: this.getEmergencyTypeLabel(activeRequest.emergencyType as keyof typeof EMERGENCY_TYPES),
                    timestamp: new Date().toLocaleString(),
                    icon: 'checkmark-circle',
                    status: 'completed'
                });
            }
            await AsyncStorage.removeItem(this.ACTIVE_REQUEST_KEY);
        } catch (error) {
            console.error('Error completing request:', error);
            throw error;
        }
    }
    static async clearAllData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.ACTIVE_REQUEST_KEY);
            await AsyncStorage.removeItem(this.RECENT_ACTIVITIES_KEY);
        } catch (error) {
            console.error('Error clearing emergency request data:', error);
            throw error;
        }
    }
}