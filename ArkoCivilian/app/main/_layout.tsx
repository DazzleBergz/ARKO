import React, { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack } from 'expo-router';
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { vesselData } from '@/constants/config';
import ProximityNotification from '@/utils/components/view/proximity';

const MainLayout = () => {
    const colorScheme = useColorScheme();
    
    // User location state
    const [location, setLocation] = useState<any>(null);
    const [locationSubscription, setLocationSubscription] = useState<any>(null);
    
    // Boat state
    const [boats, setBoats] = useState<any>([]);
    
    // Helper function to check coordinate validity
    const isValidCoordinate = (latitude: number, longitude: number): boolean => {
        return !(
            (latitude === 0 && longitude === 0) || 
            !isFinite(latitude) || 
            !isFinite(longitude) ||
            latitude < -90 || 
            latitude > 90 || 
            longitude < -180 || 
            longitude > 180
        );
    };
    
    // Get current location
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Permission denied", "Unable to access location");
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        
        setLocation(coords);
        await AsyncStorage.setItem("USER_LOCATION", JSON.stringify(coords));
    };
    
    // Start location updates
    const startLocationUpdates = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Permission denied", "Unable to track location");
            return;
        }

        const subscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 1,
            },
            (location) => {
                setLocation(location.coords);
            }
        );

        setLocationSubscription(subscription);
    };
    
    // Fetch boat data
    const fetchBoatData = async () => {
        try {
            const response = await fetch(vesselData);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch boat data: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status.code === 200) {
                // Filter and process valid vessels
                const validBoats = result.data
                    .filter((vessel: any) => {
                        const latitude = parseFloat(vessel.latitude);
                        const longitude = parseFloat(vessel.longitude);
                        return isValidCoordinate(latitude, longitude);
                    })
                    .map((vessel: any) => {
                        return {
                            id: vessel.vessel_id,
                            name: vessel.vessel_name,
                            isOnline: true,
                            currentLocation: {
                                latitude: parseFloat(vessel.latitude),
                                longitude: parseFloat(vessel.longitude)
                            }
                        };
                    });
                
                setBoats(validBoats);
            }
        } catch (error) {
            console.error("Failed to fetch boat data:", error);
        }
    };
    
    // Navigate to boat
    const navigateToBoat = (boatId: number) => {
        // You can implement navigation to the map screen with the selected boat
        // For example:
        // router.push({
        //     pathname: "/main/tabs",
        //     params: { selectedBoatId: boatId }
        // });
        console.log("Navigate to boat:", boatId);
    };
    
    // Component lifecycle
    useEffect(() => {
        getLocation();
        startLocationUpdates();
        fetchBoatData();
        
        const boatDataInterval = setInterval(() => {
            fetchBoatData();
        }, 10000);
        
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
            clearInterval(boatDataInterval);
        };
    }, []);
    
    return (
        <>
            <ProximityNotification
                userLocation={location}
                boats={boats}
                onBoatPress={navigateToBoat}
            />
            <Stack>
                <Stack.Screen name="tabs" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="changeuser" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="changepass" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="changeemail" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="actions" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
                <Stack.Screen name="about" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
            </Stack>
        </>
    );
};

export default MainLayout;