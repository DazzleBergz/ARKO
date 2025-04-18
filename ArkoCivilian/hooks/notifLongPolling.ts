import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifListen } from '@/constants/config';
import { Platform, InteractionManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { triggerNotification } from '@/utils/code/service/notifService';


// Define the Notification type
export type Notification = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  read: boolean;
  icon?: string;
};

interface UseLongPollingResult {
  data: Notification[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useLongPolling = (interval = 10000): UseLongPollingResult => {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [shouldContinuePolling, setShouldContinuePolling] = useState(true);
  const previousStatus = useRef<string | null>(null);
  
  // Generate a unique ID for notifications     
  const getUniqueId = () => {
    return Date.now().toString();
  };

  const getIconForStatus = (status: string): string => {
    switch (status) {
      case 'En Route': return 'car';
      case 'Completed': return 'checkmark-circle';
      case 'Cancelled': return 'close-circle';
      default: return 'information-circle';
    }
  };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const stranded_id = await AsyncStorage.getItem('USER_STRANDED_ID');

            if (!stranded_id) {
                console.log("No stranded ID found, skipping poll");
                return;
            }
        
            const response = await fetch(notifListen + `/${stranded_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            console.log("Rescue status result:", result);

            // Check if result is null or missing status
            if (!result || !result.status) {
                console.log("No valid status in result, continuing polling");
                return;
            }

            // Execute UI updates after all interactions are complete to avoid jank
            InteractionManager.runAfterInteractions(async () => {
                const currentStatus = result.status;
                
                // Only process status changes
                if (previousStatus.current !== currentStatus) {
                console.log(`Status changed from ${previousStatus.current} to ${currentStatus}`);
                
                // Create a notification object for the UI
                if (currentStatus !== 'Ongoing') {
                    const newNotification: Notification = {
                    id: getUniqueId(),
                    title: 'Rescue Status Update',
                    subtitle: currentStatus,
                    date: new Date().toLocaleString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: 'numeric', minute: '2-digit', hour12: true
                    }),
                    read: false,
                    icon: getIconForStatus(currentStatus)
                    };

                    // Update the notifications list
                    setData(prevData => [newNotification, ...prevData]);
                    
                    // Only send push notification for non-web platforms
                    if (Platform.OS !== 'web') {
                    await triggerNotification(
                        'Rescue Status Update',
                        `Your rescue status is now: ${currentStatus}`
                    );
                    }
                    
                    // Stop polling if we're in a terminal state
                    if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
                    console.log("Terminal state reached, stopping polling");
                    setShouldContinuePolling(false);
                    }
                }
                
                // Always update previous status regardless of notification
                previousStatus.current = currentStatus;
            }
        });
        } catch (err) {
            console.error("Error fetching rescue status:", err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();
        
        // Only set up interval if we should poll
        let intervalId: NodeJS.Timeout | null = null;
        if (shouldContinuePolling) {
        intervalId = setInterval(fetchNotifications, interval);
        }
        
        // Clean up
        return () => {
        if (intervalId) clearInterval(intervalId);
        };
    }, [interval, shouldContinuePolling]);

    return { data, loading, error, refetch: fetchNotifications };
};

export default useLongPolling;