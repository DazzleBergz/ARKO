import * as React from 'react';
import { View, StyleSheet, StatusBar, Alert, BackHandler, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'; // Import the directions component
import * as Location from "expo-location";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';

// Constants
import { checkToken, vesselData, googleAPIKEY, } from '@/constants/config';
import { UserStorage } from '@/utils/code/async/saveInfo';

// Components
import IconButton from '@/utils/components/buttons/iconBtn';
import SOSBtn from '@/utils/components/buttons/SOSBtn';
import AlertSnack from '@/utils/components/snackbar/alertSnack';
import MapTypeModal from '@/utils/components/modals/mapType';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import BoatInfoBottomSheet from '@/utils/components/view/bottomInfo';
import BoatListBottomSheet from '@/utils/components/view/bottomList';
import AlertModal from '@/utils/components/modals/Alert';
import ProximityNotification from '@/utils/components/view/proximity';

const Home = () => { 
    // ================ STATE MANAGEMENT ================
    const colorScheme = useColorScheme();
    const router = useRouter();
    const mapRef = React.useRef<any>(null);
    
    // User location state
    const [location, setLocation] = React.useState<any>(null);
    const [locationSubscription, setLocationSubscription] = React.useState<any>(null);
    
    // Map state
    const [mapType, setMapType] = React.useState<any>("standard");
    const [mapRegion, setMapRegion] = React.useState({
        latitude: 12.8797,   
        longitude: 121.7740,
        latitudeDelta: 5.0,
        longitudeDelta: 5.0,
    });
    const [mapTypeModalVisible, setMapTypeModalVisible] = React.useState(false);
    
    // Boat state
    const [boats, setBoats] = React.useState<any>([]);
    const [selectedBoat, setSelectedBoat] = React.useState<any>(null);
    const [showRoutePolylines, setShowRoutePolylines] = React.useState<{[key: string]: boolean}>({});
    
    // Route state
    const [routeDistance, setRouteDistance] = React.useState("");
    const [routeDuration, setRouteDuration] = React.useState("");
    
    // Bottom sheet refs
    const boatListBottomSheetRef = React.useRef<any>(null);
    const boatInfoBottomSheetRef = React.useRef<any>(null);
    
    // Alert states
    const [alertSnack, setAlertSnack] = React.useState(false);
    const [alertSnackMsg, setAlertSnackMsg] = React.useState("");
    const [exitAlert, setExitAlert] = React.useState({
        visible: false,
        message: "Are you sure you want to exit?",
        icon: "exit",
        iconColor: "danger"
    });
    const [sessionAlert, setSessionAlert] = React.useState({
        visible: false,
        message: "Session Expired. Please login again.",
        icon: "alert-circle",
        iconColor: "danger"
    });

    // ================ HELPER FUNCTIONS ================
    const isValidCoordinate = (latitude: number, longitude: number): boolean => {
        // Check if coordinates are (0,0) or invalid values
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
    
    const calculateDistance = (startLat: number, startLng: number, endLat: number, endLng: number): string => {
        try {
            const distanceInMeters = getDistance(
                { latitude: startLat, longitude: startLng },
                { latitude: endLat, longitude: endLng }
            );
            
            // Convert to kilometers if distance is >= 1000 meters
            if (distanceInMeters >= 1000) {
                return `${(distanceInMeters / 1000).toFixed(2)} km`;
            } else {
                return `${distanceInMeters} m`;
            }
        } catch (error) {
            console.error("Error calculating distance:", error);
            return "Unknown";
        }
    };

    // ================ ROUTE HANDLING FUNCTIONS ================
    const handleRouteReady = (result: any) => {
        // Extract route information from result
        if (result) {
            setRouteDistance(result.distance ? `${result.distance.toFixed(2)} km` : "");
            setRouteDuration(result.duration ? `${Math.round(result.duration)} min` : "");
            
            // Update selected boat with route info
            if (selectedBoat) {
                setSelectedBoat({
                    ...selectedBoat,
                    details: {
                        ...selectedBoat.details,
                        routeDistance: result.distance ? `${result.distance.toFixed(2)} km` : "",
                        routeDuration: result.duration ? `${Math.round(result.duration)} min` : ""
                    }
                });
            }
        }
    };

    const handleRouteError = (error: any) => {
        setAlertSnackMsg("Failed to fetch route directions");
        setAlertSnack(true);
    };

    // ================ AUTHENTICATION FUNCTIONS ================
    const getUserToken = async() => {
        try {
            const userData : any = await UserStorage.getUserData();
            if(!userData) return false;
            
            const response = await fetch(`${checkToken}/${userData.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) return false;

            const data = await response.json();
            return data.status === 200;
        } catch (error) {
            console.error("Token validation error:", error);
            return false;
        }
    };

    const SessionExpired = async() => {
        router.replace("/auth/login");
        await UserStorage.clearUserData();
        await AsyncStorage.removeItem('stranded_id');
        await AsyncStorage.removeItem("USER_LOCATION");
    };

    // ================ LOCATION FUNCTIONS ================
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission denied", "Unable to access location");
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        
        setLocation(coords);
        await AsyncStorage.setItem("USER_LOCATION", JSON.stringify(coords));
        console.log("coords: ", JSON.stringify(coords));
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }, 1000);
        }
    };

    const startLocationUpdates = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission denied", "Unable to track location");
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

    const seeUserLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }, 1000);
        }
    };

    // ================ MAP FUNCTIONS ================
    const handleMapTypeChange = (type: 'standard' | 'satellite' | 'terrain') => {
        setMapType(type);
        setAlertSnackMsg(`Map type has been changed to ${type}.`);
        setAlertSnack(true);
    };

    // ================ BOAT FUNCTIONS ================
    const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const location = reverseGeocode[0];
                return [
                    location.street,
                    location.district,
                    location.city,
                    location.region
                ].filter(Boolean).join(", ");
            }
            return "Unknown location";
        } catch (error) {
            return "Address unavailable";
        }
    };

    const fetchBoatData = async () => {
        try {
            const response = await fetch(vesselData);
            
            if (!response.ok) {
                setAlertSnackMsg("Server cannot be reached. Please try again. " + response.statusText);
                setAlertSnack(true);
            }
            
            const result = await response.json();
            
            if (result.status.code === 200) {
                // Process all vessels in the data array
                const processedBoats = await Promise.all(result.data.map(async (vesselData: any) => {
                    const latitude = parseFloat(vesselData.latitude);
                    const longitude = parseFloat(vesselData.longitude);
                    
                    // If coordinates are null, return null for this boat
                    if (!isValidCoordinate(latitude, longitude)) {
                        return null;
                    }
                    
                    const address = await getAddressFromCoordinates(latitude, longitude);
                    
                    const boatLocation = {
                        latitude,
                        longitude
                    };
                    
                    // Calculate distance from user if location is available
                    let distanceFromUser = "Unknown";
                    if (location && isValidCoordinate(location.latitude, location.longitude)) {
                        distanceFromUser = calculateDistance(
                            location.latitude, 
                            location.longitude, 
                            latitude, 
                            longitude
                        );
                    }
                    
                    const existingBoatIndex = boats.findIndex((b: any) => b.id === vesselData.vessel_id);
                    
                    if (existingBoatIndex >= 0) {
                        const updatedBoats = [...boats];
                        const existingBoat = updatedBoats[existingBoatIndex];
                        
                        // Get last valid trail position
                        const lastTrailPos = existingBoat.trail.length > 0 
                            ? existingBoat.trail[existingBoat.trail.length - 1] 
                            : null;
                            
                        // Check if new position is different from last position
                        const isDifferentPosition = !lastTrailPos || 
                            lastTrailPos.latitude !== boatLocation.latitude || 
                            lastTrailPos.longitude !== boatLocation.longitude;
                            
                        if (isDifferentPosition) {
                            // Create new trail by adding current position to existing trail
                            const newTrail = [...existingBoat.trail, boatLocation].slice(-20);
                            
                            updatedBoats[existingBoatIndex] = {
                                ...existingBoat,
                                currentLocation: boatLocation,
                                trail: newTrail,
                                details: {
                                    ...existingBoat.details,
                                    address,
                                    lastUpdate: new Date().toLocaleTimeString(),
                                    distanceFromUser
                                }
                            };
                            
                            return updatedBoats[existingBoatIndex];
                        }
                        
                        return null;
                    } else {
                        // Create new boat object   
                        const newBoat = {
                            id: vesselData.vessel_id,
                            name: vesselData.vessel_name,
                            isOnline: true,
                            currentLocation: boatLocation,
                            trail: [boatLocation], // Initialize trail with current position
                            details: {
                                address,
                                lastUpdate: new Date().toLocaleTimeString(),
                                distanceFromUser
                            }
                        };
                        
                        return newBoat;
                    }
                }));
                
                // Filter out null values and update boats state
                const validBoats = processedBoats.filter(boat => boat !== null);
                
                if (validBoats.length > 0) {
                    setBoats((prevBoats : any) => {
                        // Merge new boats with existing boats
                        const mergedBoats = [...prevBoats];
                        
                        validBoats.forEach(newBoat => {
                            const existingIndex = mergedBoats.findIndex((b: any) => b.id === newBoat.id);
                            
                            if (existingIndex >= 0) {
                                mergedBoats[existingIndex] = newBoat;
                            } else {
                                mergedBoats.push(newBoat);
                            }
                        });
                        
                        return mergedBoats;
                    });
                } else {
                    // If no valid boats, set to empty array
                    setBoats([]);
                }
            } else {
                setAlertSnackMsg("Failed to fetch boat data: " + result.status.message);
                setAlertSnack(true);
            }
        } catch (error : any) {
            setAlertSnackMsg("Failed to fetch boat data: " + error.message);
            setAlertSnack(true);
        }
    };

    const seeAllBoats = () => {
        // Reset route visualization
        setShowRoutePolylines({});
        
        // Filter out boats with (0,0) coordinates
        const validBoats = boats.filter((boat: any) => 
            isValidCoordinate(boat.currentLocation.latitude, boat.currentLocation.longitude)
        );
        
        if (validBoats.length > 0 && mapRef.current) {
            let minLat = location ? location.latitude : validBoats[0].currentLocation.latitude;
            let maxLat = minLat;
            let minLng = location ? location.longitude : validBoats[0].currentLocation.longitude;
            let maxLng = minLng;
            
            validBoats.forEach((boat : any) => {
                minLat = Math.min(minLat, boat.currentLocation.latitude);
                maxLat = Math.max(maxLat, boat.currentLocation.latitude);
                minLng = Math.min(minLng, boat.currentLocation.longitude);
                maxLng = Math.max(maxLng, boat.currentLocation.longitude);
            });
            
            if (location) {
                minLat = Math.min(minLat, location.latitude);
                maxLat = Math.max(maxLat, location.latitude);
                minLng = Math.min(minLng, location.longitude);
                maxLng = Math.max(maxLng, location.longitude);
            }
            
            const latDelta = (maxLat - minLat) * 1.5 || 0.02;
            const lngDelta = (maxLng - minLng) * 1.5 || 0.02;
            
            mapRef.current.animateToRegion({
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2,
                latitudeDelta: Math.max(latDelta, 0.01),
                longitudeDelta: Math.max(lngDelta, 0.01),
            }, 1000);
            
            if(boatInfoBottomSheetRef.current){
                boatInfoBottomSheetRef.current.close();
            }
            
            if (boatListBottomSheetRef.current) {
                boatListBottomSheetRef.current.expand();
            } 
        }else{
            setAlertSnackMsg("No ARKO devices available")
            setAlertSnack(true)
        }
    };

    const navigateToBoat = (boatId : any) => {
        // Reset all route visualizations first
        setShowRoutePolylines({});
        
        // Find boat by ID
        const boat : any = boats.find((b : any) => b.id === boatId);
        
        // Only navigate if boat exists and has valid coordinates
        if (boat && 
            mapRef.current && 
            isValidCoordinate(boat.currentLocation.latitude, boat.currentLocation.longitude)) {
            
            mapRef.current.animateToRegion({
                latitude: boat.currentLocation.latitude,
                longitude: boat.currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
            
            setSelectedBoat(boat);
            
            // Set route to show for this boat
            setShowRoutePolylines(prev => ({
                ...prev,
                [boatId]: true
            }));
            
            if (boatListBottomSheetRef.current) {
                boatListBottomSheetRef.current.close();
            }
            if (boatInfoBottomSheetRef.current) {
                boatInfoBottomSheetRef.current.expand();
            }
        }
    };

    const handleMarkerPress = (boatId : any) => {
        navigateToBoat(boatId);
    };

    // ================ EXIT HANDLING ================
    const handleExitConfirm = () => {
        setExitAlert(prev => ({ ...prev, visible: false }));
        BackHandler.exitApp();
    };

    const handleExitCancel = () => {
        setExitAlert(prev => ({ ...prev, visible: false }));
    };

    // ================ LIFECYCLE HOOKS ================
    React.useEffect(() => {
        getLocation();
        startLocationUpdates();
        fetchBoatData();
        
        const boatDataInterval = setInterval(() => {
            fetchBoatData();
        }, 10000);

        setTimeout(async () => {
            const has_token = await getUserToken();
            if(!has_token){
                setSessionAlert(prev => ({ ...prev, visible: true }));
            }
        }, 1000);

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
            clearInterval(boatDataInterval);
        };
    }, []);

    // Update boat distances when user location changes
    React.useEffect(() => {
        if (location && boats.length > 0) {
            const updatedBoats = boats.map((boat: any) => {
                if (isValidCoordinate(boat.currentLocation.latitude, boat.currentLocation.longitude)) {
                    const distanceFromUser = calculateDistance(
                        location.latitude,
                        location.longitude,
                        boat.currentLocation.latitude,
                        boat.currentLocation.longitude
                    );
                    
                    return {
                        ...boat,
                        details: {
                            ...boat.details,
                            distanceFromUser
                        }
                    };
                }
                return boat;
            });
            
            setBoats(updatedBoats);
            
            // Also update selected boat if there is one
            if (selectedBoat) {
                const updatedSelectedBoat = updatedBoats.find((b: any) => b.id === selectedBoat.id);
                if (updatedSelectedBoat) {
                    setSelectedBoat(updatedSelectedBoat);
                }
            }
        }
    }, [location]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                setExitAlert(prev => ({ ...prev, visible: true }));
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    // Get valid boats for rendering (filter out (0,0) coordinates)
    const validBoats = React.useMemo(() => {
        return boats.filter((boat: any) => 
            boat.isOnline && 
            isValidCoordinate(boat.currentLocation.latitude, boat.currentLocation.longitude)
        );
    }, [boats]);

    // ================ RENDER ================
    return(
        <GestureHandlerRootView style={{flex: 1}}>
            <PaperProvider>
                <SafeAreaView style={[style.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff'}]}>
                    <MapView 
                        style={style.map}
                        region={mapRegion}
                        initialRegion={{
                            latitude: 12.8797,   
                            longitude: 121.7740,
                            latitudeDelta: 5.0,
                            longitudeDelta: 5.0,
                        }}
                        ref={mapRef}
                        mapType={mapType}
                        provider={PROVIDER_GOOGLE} // Add this for Google Maps
                    >
                        {location && (
                            <Marker
                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                                title="Your Location"
                                description="This is where you are"
                                image={require('@/assets/images/marker/user.png')}
                            />
                        )}

                        {validBoats.map((boat : any) => (
                            <React.Fragment key={boat.id}>
                                {/* Boat marker */}
                                <Marker
                                    coordinate={boat.currentLocation}
                                    title={boat.name}
                                    image={require('@/assets/images/marker/virtoslogo.png')}
                                    onPress={() => handleMarkerPress(boat.id)}
                                />
                                
                                {/* Boat trail polyline */}
                                {boat.trail && boat.trail.length >= 2 && (
                                    <Polyline
                                        coordinates={boat.trail}
                                        strokeColor="rgba(39, 124, 165, 0.8)"
                                        strokeWidth={4}
                                        lineCap="round"
                                        lineJoin="round"
                                        lineDashPattern={[5, 5]}
                                    />
                                )}
                                
                                {/* MapViewDirections component for each selected boat */}
                                {location && 
                                 showRoutePolylines[boat.id] && 
                                 isValidCoordinate(location.latitude, location.longitude) && (
                                    <MapViewDirections
                                        origin={{
                                            latitude: location.latitude,
                                            longitude: location.longitude
                                        }}
                                        destination={boat.currentLocation}
                                        apikey={googleAPIKEY}
                                        strokeWidth={9}
                                        strokeColor="rgba(17, 53, 71, 0.8)"
                                        mode="WALKING" // Can be DRIVING, WALKING, BICYCLING or TRANSIT
                                        optimizeWaypoints={true}
                                        precision="high"
                                        timePrecision="now"
                                        onReady={handleRouteReady}
                                        onError={handleRouteError}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </MapView>

                    <View style={btnStyle.right}>
                        <IconButton iconName="locate" onPress={seeUserLocation} />
                        <IconButton iconName="layers" onPress={() => setMapTypeModalVisible(true)} />
                        <IconButton iconName="boat" onPress={seeAllBoats} />
                    </View>

                    <View style={btnStyle.sos}>
                        <SOSBtn 
                            quickSOS={() => {router.navigate("/main/actions/")}} 
                            emergency={() => {router.push("/main/actions/requests")}}
                        />
                    </View>
                    
                </SafeAreaView>

                {/* Modals and Overlays */}
                <AlertSnack 
                    visible={alertSnack} 
                    message={alertSnackMsg} 
                    onDismissSnackBar={() => setAlertSnack(false)} 
                    onIconPress={() => setAlertSnack(false)}
                />

                <MapTypeModal
                    visible={mapTypeModalVisible}
                    onClose={() => setMapTypeModalVisible(false)}
                    onSelectMapType={handleMapTypeChange}
                    currentMapType={mapType}
                />

                <AlertChooseModal
                    visible={exitAlert.visible}
                    onConfirm={handleExitConfirm}
                    onCancel={handleExitCancel}
                    message={exitAlert.message}
                    icon={exitAlert.icon}
                    iconColor={exitAlert.iconColor}
                />
                
                <BoatListBottomSheet
                    bottomSheetRef={boatListBottomSheetRef}
                    snapPoints={['25%', '50%']}
                    boats={validBoats} // Pass only valid boats
                    onBoatPress={navigateToBoat}
                    index={-1}
                    onClose={() => boatListBottomSheetRef.current?.close()}
                />
                
                <BoatInfoBottomSheet
                    bottomSheetRef={boatInfoBottomSheetRef}
                    snapPoints={['25%', '50%']}
                    boat={selectedBoat && isValidCoordinate(
                        selectedBoat.currentLocation.latitude, 
                        selectedBoat.currentLocation.longitude
                    ) ? selectedBoat : null} // Only show valid boats
                    index={-1}
                    onClose={() => {
                        // Clear route when closing info sheet
                        if (selectedBoat) {
                            setShowRoutePolylines(prev => ({
                                ...prev,
                                [selectedBoat.id]: false
                            }));
                        }
                        boatInfoBottomSheetRef.current?.close();
                    }}
                />

                <AlertModal
                    visible={sessionAlert.visible}
                    onConfirm={SessionExpired}
                    message={sessionAlert.message}
                    icon={sessionAlert.icon}
                    iconColor={sessionAlert.iconColor}
                />
            </PaperProvider>
        </GestureHandlerRootView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    pinbtn: {
        position: "absolute",
        top: 75,
        right: 10,
    },
    marker: {
        height: 150,
        width: 150,
    },
    alert: {
        position: "absolute",
        bottom: 20,
    },
    routeInfo: {
        position: "absolute",
        bottom: 80,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 8,
        borderRadius: 8,
        margin: 16,
        alignSelf: "center"
    },
    routeInfoText: {
        fontWeight: "500",
        color: "#333"
    }
});

const btnStyle = StyleSheet.create({
    left: {
        position: "absolute",
        top: 50,
        left: 10,
    },
    right: {
        position: "absolute",
        top: 80,
        right: 10,
    },
    sos: {
        position: "absolute",
        bottom: 0,
        left: -20,
    }
});

export default Home;