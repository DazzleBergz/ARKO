import { emergencyRequest, userRequests } from '@/constants/config';
import { UserStorage } from '@/utils/code/async/saveInfo';
import AlertModal from '@/utils/components/modals/Alert';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location'
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Animated, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  SafeAreaView, 
  BackHandler 
} from 'react-native';
import { ActivityLoader } from '@/utils/components/view/loading';
import useLongPolling from '@/hooks/notifLongPolling';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_REQUEST_KEY = '@emergency_request:active';

const QuickSOS = () => {
  // Hooks
    const colorScheme = useColorScheme();
    const router = useRouter();
  
    // State variables
    const [hasActiveRequest, setHasActiveRequest] = useState<any>(false);
    const [location, setLocation] = useState<any>(null);
    const [isCountingDown, setIsCountingDown] = useState<any>(false);
    const [countdown, setCountdown] = useState(3);
    const { data: notifications, loading, error, refetch } = useLongPolling();
    // Alert state
    const [alertState, setAlertState] = useState({
        visible: false,
        message: '',
        icon: 'information-circle',
        iconColor: '#4a90e2',
        shouldNavigateAfterClose: false
    });
  
  // Animation refs
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const countdownInterval = useRef<any>(null);
    const [isLocationLoading, setIsLocationLoading] = useState<any>(true);
    const [locationError, setLocationError] = useState<any>(null);

    const [isLoading, setIsLoading] = React.useState(false)
    const [loadingText, setLoadingText] = React.useState('')

    // Effects
    useEffect(() => {
        fetchLocation()
        checkActiveRequest();
    }, []);

  // Check for active emergency requests
    const checkActiveRequest = async () => {
        setIsLoading(true)
        setLoadingText('Fetching active request. Please wait...')
        try {
            const userData = await UserStorage.getUserData()
            const response = await fetch(`${userRequests}/${userData?.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userData?.token}`,
                },
            });
        
            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                showAlert({
                    message: `Error fetching data. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }
            
            const data = await response.json();
            console.log(data)
            if(data.feedback === 200){
                const hasOngoingRequest = data.data.some((item: { status: string; }) => item.status === 'Ongoing' || item.status === 'En Route');
  
                if (hasOngoingRequest) {
                    showAlert({
                    message: 'You already have an active request. Please wait for it to be completed or cancel it before submitting a new request.',
                    icon: 'time',
                    iconColor: 'orange',
                    shouldNavigateAfterClose: true
                    });
                }             
            }
        } catch (error: any) {

            if(error.message === "Network request failed"){
                showAlert({
                    message: 'Error. Please check your internet connection. ' + (error.message || ''),
                    icon: 'cloud-offline',
                    iconColor: 'orange',
                });
            } else {
                showAlert({
                    message: 'Error! ' + (error.message || ''),
                    icon: 'cloud-offline',
                    iconColor: 'orange',
                });
            }
        } finally{
            setIsLoading(false)
        }
    };


    // Handle SOS button press
    const handlePress = () => {
        if (isCountingDown) {
            cancelSOS();
        } else {
            startSOS();
        }
    };

    // Start SOS countdown
    const startSOS = () => {
        setIsCountingDown(true);
        startPulseAnimation();
        
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                clearInterval(countdownInterval.current);
                setIsCountingDown(false);
                pulseAnim.setValue(1);
                setCountdown(3);
                submitEmergencyRequest();
                return 3;
                }
                return prev - 1;
            });
        }, 1000);

        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

  // Cancel SOS countdown
    const cancelSOS = () => {
        clearInterval(countdownInterval.current);
        setIsCountingDown(false);
        setCountdown(3);
        pulseAnim.setValue(1);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

  // Start pulse animation
    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const fetchLocation = async () => {
        try {
            setIsLocationLoading(true);
            
            // First check for permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Location permission is required for emergency services');
                setIsLocationLoading(false);
                return;
            }
            
            // Set up a flag to track if we've already handled the location
            let isHandled = false;
            
            // Set timeout to use stored location after 2 seconds
            const timeoutId = setTimeout(async () => {
                if (isHandled) return;
                isHandled = true;
                
                // Get stored location
                const storedLocationString = await AsyncStorage.getItem("USER_LOCATION");
                console.log(storedLocationString)
                if (storedLocationString) {
                    const storedLocation = JSON.parse(storedLocationString);
                    setLocation(storedLocation);
                } else {
                    setLocationError('Unable to get your location. Please try again.');
                }
                
                setIsLocationLoading(false);
            }, 2000);
            
            // Try to get current location
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 10000
            });
            
            // Clear timeout if we got location before 2 seconds
            clearTimeout(timeoutId);
            
            // Only set location if we haven't already used the stored one
            if (!isHandled) {
                isHandled = true;
                setLocation(currentLocation);
                setIsLocationLoading(false);
            }
        } catch (err) {
            // Handle any other errors
            const storedLocationString = await AsyncStorage.getItem("USER_LOCATION");
            if (storedLocationString) {
                const storedLocation = JSON.parse(storedLocationString);
                setLocation(storedLocation);
            } else {
                setLocationError('Unable to get your location. Please try again.');
            }
            setIsLocationLoading(false);
        }
    };

  // Submit emergency request
    const submitEmergencyRequest = async () => {
        setIsLoading(true)
        setLoadingText('Submitting SOS request. Please wait...')
        if (!location || !location.coords) {
            showAlert({
                message: 'Unable to get your location. Please try again.',
                icon: 'location',
                iconColor: 'red'
            });
            
            // Try to fetch location again
            await fetchLocation();
            
            // If still no location, return
            if (!location || !location.coords) {
                return;
            }
        }
        const userData = await UserStorage.getUserData()
        try {
            const response = await fetch(emergencyRequest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData?.token}`
                },
                body: JSON.stringify({ 
                    pinned_by: userData?.userId, 
                    latitude: String(location?.coords.latitude),
                    longitude: String(location?.coords.longitude),
                    description: '',
                    type: 'SOS',
                    number: '',
                }),
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                showAlert({
                    message: `Error submitting request. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            const data = await response.json()
            console.log(data)
            if(data.feedback === 201){
                //await AsyncStorage.setItem(ACTIVE_REQUEST_KEY, data.created_at)
                await refetch();
                showAlert({
                    message: 'Emergency SOS request has been sent successfully',
                    icon: 'checkmark-circle',
                    iconColor: 'success',
                    shouldNavigateAfterClose: true,
                });
            } else{
                showAlert({
                    message: 'There was a problem submitting your emergency request. Please try again. ' + (data.message || ''),
                    icon: 'alert-circle',
                    iconColor: 'red'
                });
            }

            
        } catch (error: any) {

            if(error.message === "Network request failed"){
                showAlert({
                    message: 'Please check your internet connection. ' + (error.message || ''),
                    icon: 'cloud-offline',
                    iconColor: 'red'
                });
            } else {
                showAlert({
                    message: 'There was a problem submitting your emergency request. Please try again. ' + (error.message || ''),
                    icon: 'cloud-offline',
                    iconColor: 'red'
                });
            }
            
        } finally{
            setIsLoading(false)
        }
    };

  // Handle showing alerts
    const showAlert = ({ message, icon = 'information-circle', iconColor = '#4a90e2', shouldNavigateAfterClose = false }) => {
        setAlertState({
            visible: true,
            message,
            icon,
            iconColor,
            shouldNavigateAfterClose
        });
    };

  // Handle alert close
    const handleAlertClose = () => {
        setAlertState(prev => ({ ...prev, visible: false }));
        
        if (alertState.shouldNavigateAfterClose || alertState.icon === 'checkmark-circle') {
            setTimeout(() => {
                router.back();
            }, 100);
        }
    };

  // Handle back button
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (alertState.visible) {
                handleAlertClose();
                return true;
                }
                router.back();
                return true;
            });

            return () => backHandler.remove();
        }, [alertState.visible])
    );

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff'}]}>
            <ThemedText style={styles.title}>Emergency SOS</ThemedText>
            
            <View style={styles.descriptionContainer}>
                <ThemedText style={styles.description}>
                Press and hold the SOS button if you are stranded in your home due to flooding or need to evacuate due to rising water levels. 
                Your coordinates and home address will be sent to our server and classified as a rescue request.
                </ThemedText>
            </View>
    
            <Animated.View style={[styles.buttonWrapper, {transform: [{ scale: isCountingDown ? pulseAnim : scaleAnim }]}]}>
                <TouchableOpacity 
                    onPress={handlePress} 
                    style={[
                        styles.button, 
                        isCountingDown && styles.buttonPressed,
                        (isLocationLoading || !!locationError) && styles.buttonDisabled
                    ]} 
                    activeOpacity={0.7}
                    disabled={isLocationLoading || !!locationError}
                >
                    <Text style={styles.buttonText}>
                        {isCountingDown ? `${countdown}` : 'SOS'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
    
            {isLocationLoading ? (
                <ThemedText style={styles.statusText}>
                    Getting your location...
                </ThemedText>
            ) : locationError ? (
                <View style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>
                        {locationError}
                    </ThemedText>
                    <TouchableOpacity 
                        onPress={fetchLocation}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : isCountingDown ? (
                <ThemedText style={styles.cancelText}>
                    Tap again to cancel
                </ThemedText>
            ) : null}
            
            <ThemedText style={styles.description}>
                Once activated, a countdown of 3 seconds will begin before sending an alert. Press again to cancel.
            </ThemedText>

            <AlertModal 
                visible={alertState.visible} 
                onConfirm={handleAlertClose} 
                icon={alertState.icon} 
                iconColor={alertState.iconColor} 
                message={alertState.message}
            />

            {isLoading && <ActivityLoader fullscreen text={loadingText}/>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    descriptionContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonWrapper: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginBottom: 40,
    },
    buttonPressed: {
        backgroundColor: '#cc2f26',
    },
    buttonText: {
        color: 'white',
        fontSize: 42,
        fontWeight: '600',
    },
    cancelText: {
        margin: 20,
        color: '#666',
        fontSize: 16,
    },
    retryButton: {
        backgroundColor: '#4a90e2',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#ff8b85', // Lighter red to indicate disabled state
        opacity: 0.7,
    },
    statusText: {
        margin: 20,
        color: '#4a90e2',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        alignItems: 'center',
        margin: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default QuickSOS;