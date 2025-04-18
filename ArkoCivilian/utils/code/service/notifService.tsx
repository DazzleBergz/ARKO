// notificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set up notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Initialize notification channels
export const initializeNotifications = async () => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default Channel',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
};

// Request permissions
export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
        // Channel should be already set up in initializeNotifications
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        return (await Notifications.requestPermissionsAsync()).status === 'granted';
    }
    return true;
};

// Trigger notification
export const triggerNotification = async (title, body) => {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) return false;

    await Notifications.scheduleNotificationAsync({
        content: {
        title,
        body,
        sound: true,
        },
        trigger: null, // Instant notification
    });
    
    return true;
};