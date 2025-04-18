import * as React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDistance } from 'geolib';
import { ThemedText } from '../themeUI/ThemedText';

interface ProximityNotificationProps {
    userLocation: {
        latitude: number;
        longitude: number;
    } | null;
    boats: Array<{
        id: number;
        name: string;
        currentLocation: {
        latitude: number;
        longitude: number;
        };
        isOnline: boolean;
    }>;
    onBoatPress?: (boatId: number) => void;
}

// Define the distance thresholds where notifications should trigger
const DISTANCE_THRESHOLDS = [1000, 500, 250, 100, 50];

const ProximityNotification: React.FC<ProximityNotificationProps> = ({
    userLocation,
    boats,
    onBoatPress
}) => {
    // Track notification state for each boat at each distance threshold
    const [notificationStates, setNotificationStates] = React.useState<{
        [boatId: number]: {
            [threshold: number]: boolean;
            outOfRange: boolean;
        }
    }>({});
    
    const [nearbyBoats, setNearbyBoats] = React.useState<Array<{id: number, name: string, distance: number}>>([]);
    const [showNotification, setShowNotification] = React.useState(false);
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get('window');

    // Initialize notification states for new boats
    React.useEffect(() => {
        const newStates = { ...notificationStates };
        
        boats.forEach(boat => {
            if (!newStates[boat.id]) {
                newStates[boat.id] = {
                    1000: false,
                    500: false,
                    250: false,
                    100: false,
                    50: false,
                    outOfRange: true
                };
            }
        });
        
        setNotificationStates(newStates);
    }, [boats]);

    // Check for nearby boats whenever user location or boats update
    React.useEffect(() => {
        if (!userLocation) return;

        const boatsToNotify: Array<{id: number, name: string, distance: number}> = [];
        const updatedStates = { ...notificationStates };
        
        boats.filter(boat => boat.isOnline).forEach(boat => {
            const distance = getDistance(
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: boat.currentLocation.latitude, longitude: boat.currentLocation.longitude }
            );
            
            // Initialize state object for this boat if it doesn't exist
            if (!updatedStates[boat.id]) {
                updatedStates[boat.id] = {
                    1000: false,
                    500: false,
                    250: false,
                    100: false,
                    50: false,
                    outOfRange: true
                };
            }
            
            // Check if boat is beyond the maximum threshold
            if (distance > DISTANCE_THRESHOLDS[0]) {
                // Mark boat as out of range to reset all thresholds when it comes back in range
                updatedStates[boat.id].outOfRange = true;
            } else {
                // Find the smallest threshold that the boat is within
                const currentThreshold = [...DISTANCE_THRESHOLDS].reverse().find(t => distance <= t) || DISTANCE_THRESHOLDS[0];
                
                // If boat was previously out of range or has reached a new closer threshold
                if (updatedStates[boat.id].outOfRange || !updatedStates[boat.id][currentThreshold]) {
                    // Add to notification list
                    boatsToNotify.push({ id: boat.id, name: boat.name, distance });
                    
                    // Mark this threshold as notified
                    updatedStates[boat.id][currentThreshold] = true;
                    
                    // No longer out of range
                    updatedStates[boat.id].outOfRange = false;
                }
            }
        });
        
        setNotificationStates(updatedStates);
        
        // Update the list of boats to show in the notification
        if (boatsToNotify.length > 0) {
            setNearbyBoats(boatsToNotify);
            setShowNotification(true);
            animateNotification(true);
        }
    }, [userLocation, boats]);

    // Animation function
    const animateNotification = (show: boolean) => {
        Animated.timing(animatedValue, {
            toValue: show ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            if (!show) setShowNotification(false);
        });
    };

    // Dismiss notification
    const dismissNotification = () => {
        animateNotification(false);
    };

    // Handle boat selection
    const handleBoatPress = (boatId: number) => {
        if (onBoatPress) {
            onBoatPress(boatId);
            dismissNotification();
        }
    };

    // Don't render anything if there's nothing to show
    if (!showNotification) return null;

    return (
        <Animated.View 
            style={[
                styles.container,
                {
                transform: [
                    {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0]
                    })
                    }
                ],
                opacity: animatedValue
                }
            ]}
        >
            <View style={styles.content}>
                <Ionicons name="alert-circle" size={24} color="#FF9500" style={styles.icon} />
                <View style={styles.textContainer}>
                    <ThemedText style={styles.title}>Vessel Nearby</ThemedText>
                    {nearbyBoats.map(boat => (
                        <View key={boat.id} style={styles.boatItem}>
                            <View style={styles.infoTop}>
                                <ThemedText style={styles.boatName}>{boat.name}</ThemedText>
                                <ThemedText style={styles.distance}>{boat.distance}m away</ThemedText>
                            </View>                            
                        </View>
                        
                    ))}
                </View>
                <TouchableOpacity onPress={dismissNotification} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#777" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        zIndex: 999,
        padding: 10,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    boatItem: {
        flexDirection: 'column',
    },
    infoTop:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },
    infoBottom:{
        flexDirection: "row"
    },
    textBtn:{
        fontSize: 12,
    },
    boatName: {
        fontSize: 14,
    },
    distance: {
        fontSize: 14,
        color: '#555',
    },
    closeButton: {
        padding: 5,
    }
});

export default ProximityNotification;