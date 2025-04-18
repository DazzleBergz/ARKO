import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  BackHandler,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Components
import Button from '@/utils/components/buttons/button';
import Input from '@/utils/components/textbox/input';
import RichInput from '@/utils/components/textbox/richInput';
import Select from '@/utils/components/textbox/select';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import AlertModal from '@/utils/components/modals/Alert';
import ImageInput from '@/utils/components/textbox/imageInput';

// Utils and Constants
import { UserStorage } from '@/utils/code/async/saveInfo';
import { emergencyRequest, userRequests } from '@/constants/config';
import { accentColorDark, accentColorLight, locationStatus, primaryColor, secondaryColor, selectRequestLocaitonBtn, warning } from '@/constants/Colors';
import MapTypeModal from '@/utils/components/modals/mapType';
import AlertSnack from '@/utils/components/snackbar/alertSnack';
import {PaperProvider } from 'react-native-paper';
import IconButton from '@/utils/components/buttons/iconBtn';
import { ActivityLoader } from '@/utils/components/view/loading';
import useLongPolling from '@/hooks/notifLongPolling';

// Constants
const MAX_IMAGES = 3; // Changed from 3 to 1
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Types
interface RequestData {
    id: string;
    timestamp: number;
    emergencyType: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    description: string;
    status: 'pending' | 'completed' | 'cancelled';
}

interface FormInputs {
    emergencyType: string;
    description: string;
    number: string;
}

interface FormErrors {
    emergencyType: string | null;
    location: string | null;
    number: number | null;
}

interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
    onClose?: () => void;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const Request = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const locStatus = locationStatus[colorScheme || 'light'];
  
    // State Management
    const [images, setImages] = useState<any[]>([]);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [selectedEmergencyType, setSelectedEmergencyType] = useState("");
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [manualCoordinates, setManualCoordinates] = useState<Coordinates | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [useManualLocation, setUseManualLocation] = useState(false);
    const [loadingText, setLoadingText] = useState<any>('')
    const [mapTypeModalVisible, setMapTypeModalVisible] = React.useState(false);
    const { data: notifications, loading, error, refetch } = useLongPolling();
    const [alertSnack, setAlertSnack] = React.useState(false);
    const [alertSnackMsg, setAlertSnackMsg] = React.useState("");
    const [mapType, setMapType] = React.useState<any>("standard")
    const handleMapTypeChange = (type: 'standard' | 'satellite' | 'terrain') => {
        setMapType(type);
        setAlertSnackMsg(`Map type has been changed to ${type}.`);
        setAlertSnack(true);
    };
    
    // Form state
    const [inputs, setInputs] = useState<FormInputs>({
        emergencyType: "",
        description: "",
        number: "",
    });

    const [errors, setErrors] = useState<FormErrors>({
        emergencyType: null,
        location: null,
        number: null,
    });

    // Alert modal state
    const [verificationAlert, setVerificationAlert] = useState<AlertState>({
        visible: false,
        message: '',
        icon: '',
        iconColor: '',
    });

    // Emergency type options
    const emergencyTypes = [
        { label: 'Urgent Emergency Request (SOS)', value: 'SOS' },
        { label: 'Medical Emergency', value: 'Medical Emergency' },
        { label: 'Rescue & Evacuation', value: 'Rescue & Evacuation' },
        { label: 'Request Medical Supplies', value: 'Request Medical Supplies' },
        { label: 'Request Relief Supplies', value: 'Request Relief Supplies' },
    ];

    // Check for active requests
    useEffect(() => {
        const checkActiveRequest = async () => {
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
                    setVerificationAlert({
                        visible: true,
                        message: `Error fetching data. ${errorData.message || 'Server Error'}. Status: ${errorData.status}`,
                        icon: "cloud-offline",
                        iconColor: "danger"
                    });
                    return;
                }

                const data = await response.json();
                if(data.feedback === 200){
                    const hasOngoingRequest = data.data.some((item: { status: string; }) => item.status === 'Ongoing' || item.status === 'En Route');
    
                    if (hasOngoingRequest) {
                        setHasActiveRequest(true)
                        setVerificationAlert({
                            visible: true,
                            message: "You already have an active request. Please wait for it to be completed or cancel it before submitting a new request.",
                            icon: "time",
                            iconColor: "warning",
                            onClose: () => router.back()
                        });
                    }             
                }
            } catch (error) {
                console.error('Error checking active request:', error);
            }
        };

        checkActiveRequest();
    }, []); 

    // Get user location
    useEffect(() => {
        const fetchLocation = async () => {
            setIsLoading(true);
            setLoadingText('Please wait...')
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                handleError('Permission to access location was denied', 'location');
                setIsLoading(false);
                return;
            }

            try {
                let currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                    maximumAge: 10000
                });
                setLocation(currentLocation);
                // Initialize manual coordinates with the detected location
                setManualCoordinates({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                });
                handleError(null, 'location');
            } catch (err: any) {
                setErrorMsg('Failed to get location. Please try again.');
                handleError('Failed to get location. Please try again.', 'location');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Handle back button press
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (mapModalVisible) {
                    setMapModalVisible(false);
                    return true;
                }
                if (verificationAlert.visible) {
                    handleAlertClose();
                    return true;
                }
                router.back();
                return true;
            });

            return () => backHandler.remove();
        }, [verificationAlert.visible, mapModalVisible, router])
    );

    // Form handlers
    const handleOnChange = (text: string, input: string) => {
        setInputs(prevState => ({ ...prevState, [input]: text.trim() }));
    };
  
    const handleError = (text: string | null, input: string) => {
        setErrors(prevState => ({ ...prevState, [input]: text }));
    };

    const handleOnEmergencyType = (value: string) => {
        setSelectedEmergencyType(value);
        setInputs(prevState => ({ ...prevState, emergencyType: value }));
        handleError(null, "emergencyType");
    };

    // Alert handlers
    const handleAlertClose = () => {
        setVerificationAlert(prev => ({ ...prev, visible: false }));
        if (verificationAlert.onClose) {
            // Add a small delay to ensure modal is closed before navigation
            setTimeout(() => {
                verificationAlert.onClose?.();
            }, 100);
        }
    };

    // Map Modal handlers
    const openMapModal = () => {
        setMapModalVisible(true);
    };

    const closeMapModal = () => {
        setMapModalVisible(false);
    };

    const confirmLocation = () => {
        setUseManualLocation(true);
        closeMapModal();
    };

    const handleMapPress = (e: any) => {
        setManualCoordinates({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
        });
    };

    const toggleLocationMethod = () => {
        setUseManualLocation(!useManualLocation);
    };

    // Form validation
    const validate = () => {
        let isValid = true;
        
        if (!inputs.emergencyType) {
            handleError("Please select emergency type", "emergencyType");
            isValid = false;
        }
        
        if (Number(inputs.number) > 20) {
            handleError("Please enter a valid number", "number");
            isValid = false;
        }

        // Check if we have either automatic or manual location
        const hasValidLocation = useManualLocation ? !!manualCoordinates : !!location;
        
        if (!hasValidLocation) {
            handleError("Location is required. Please enable location services or set location manually.", "location");
            isValid = false;
        }

        
        
        return isValid;
    };

    // Form submission
    const handleSubmit = async () => {
        if (hasActiveRequest) {
            setVerificationAlert({
                visible: true,
                message: "You already have an active request. Please wait for it to be completed or cancel it.",
                icon: "time",
                iconColor: "warning",
                onClose: () => router.back(),
            });
            return;
        }
        
        if (validate()) {
            setIsLoading(true);
            setLoadingText('Sending request. \nPlease wait...')
            try {
                const userData = await UserStorage.getUserData();
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');

                const formData = new FormData();
                
                // Determine which coordinates to use
                const coordinatesToUse = useManualLocation && manualCoordinates 
                    ? manualCoordinates
                    : (location ? location.coords : null);

                if (!coordinatesToUse) {
                    throw new Error("No valid location found.");
                }
                
                // Add text data
                formData.append('pinned_by', userData?.userId || '');
                formData.append('latitude', String(coordinatesToUse.latitude));
                formData.append('longitude', String(coordinatesToUse.longitude));
                formData.append('description', inputs.description || "");
                formData.append('type', inputs.emergencyType);
                formData.append('number', inputs.number || '');
            
                if (images && images.length > 0) {
                    images.forEach((image, index) => {
                        // Get uri from the image object
                        const imageUri = image.uri || image;
                        const fileName = `ARKO_${userData?.userId}_${month}-${day}-${year}_${hours}-${minutes}_image_${index + 1}.jpg`;
                        const match = /\.(\w+)$/.exec(fileName);
                        const type = match ? `image/${match[1]}` : 'image/jpeg';
                        
                        // Using the same format that works in Profile.tsx
                        formData.append(`image_${index + 1}`, {
                            uri: imageUri,
                            name: fileName,
                            type: type
                        });
                    });
                }

                const response = await fetch(emergencyRequest, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${userData?.token}`,
                    },
                    body: formData,
                });
                console.log(formData)
                console.log(response)

                if(!response.ok){
                    const errorData = await response.json().catch(() => ({}));
                    console.log(errorData)
                    setVerificationAlert({
                        visible: true,
                        message: `Server Error. ${errorData.message || 'Server Error'}. Status: ${errorData.status}`,
                        icon: "cloud-offline",
                        iconColor: "danger"
                    });
                    return;
                }
                const data = await response.json();
                
                if (data.feedback === 201) {            
                    await refetch()   
                    setVerificationAlert({
                        visible: true,
                        message: "Your request has been sent successfully",
                        icon: "checkmark-circle",
                        iconColor: "success",
                        onClose: () => router.back()
                    });
                } else {
                    setVerificationAlert({
                        visible: true,
                        message: "Error: " + (data.message || "Unknown error"),
                        icon: "alert-circle",
                        iconColor: "danger"
                    });
                }
            } catch (error: any) {
                if(error.message === 'Network request failed'){
                    setVerificationAlert({
                        visible: true,
                        message: "Device is offline. " + (error.message || ""),
                        icon: "cloud-offline",
                        iconColor: "danger"
                    });
                } else {
                    setVerificationAlert({
                        visible: true,
                        message: "Something went wrong. Please try again. " + (error.message || ""),
                        icon: "alert-circle",
                        iconColor: "danger"
                    });
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setVerificationAlert({
                visible: true,
                message: "Please fill all required fields",
                icon: "alert-circle",
                iconColor: "danger"
            });
        }
    };

    const seeUserLocation = () => {
    // Use manualCoordinates if available, otherwise fall back to location.coords
    const targetCoords = manualCoordinates || (location?.coords);
        
        if (targetCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: targetCoords.latitude,
                longitude: targetCoords.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }, 1000);
        }
    };



    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <SafeAreaView style={[styles.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#f6f6f6'}]}>
                    <PaperProvider>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 }} 
                        showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps="handled"
                    >
                        <ThemedText style={styles.description}>
                            Please select the type of emergency assistance you need. Your location will be used to pinpoint and deliver service to your exact location.
                        </ThemedText>

                        {/* Emergency Type Selection */}
                        <View style={styles.formSection}>
                            <View style={styles.labelContainer}>
                                <ThemedText>
                                Select emergency type <Text style={styles.required}>*</Text>
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <Select 
                                    iconName="medical"
                                    items={emergencyTypes} 
                                    label='Emergency Type'
                                    value={selectedEmergencyType}
                                    setValue={handleOnEmergencyType}
                                    error={errors.emergencyType}
                                />
                            </View>
                        </View>

                        {/* Number of People */}
                        <View style={styles.formSection}>
                            <View style={styles.labelContainer}>
                                <ThemedText>
                                Number of people
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <Input 
                                    iconName='person'
                                    label='No. of people'
                                    onChangeText={(text) => handleOnChange(text, "number")}
                                    error={errors.number}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        {/* Location Options */}
                        <View style={styles.formSection}>
                            <View style={styles.labelContainer}>
                                <ThemedText>
                                    Location <Text style={styles.required}>*</Text>
                                </ThemedText>
                            </View>
                            
                            {/* Location Method Toggle */}
                            <View style={styles.locationToggleContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.locationToggleButton, 
                                        !useManualLocation && styles.locationToggleActive
                                    ]}
                                    onPress={() => setUseManualLocation(false)}
                                >
                                    <ThemedText style={!useManualLocation ? styles.locationToggleTextActive : styles.locationToggleTextInactive}>
                                        Auto Detect
                                    </ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[
                                        styles.locationToggleButton, 
                                        useManualLocation && styles.locationToggleActive
                                    ]}
                                    onPress={() => setUseManualLocation(true)}
                                >
                                    <ThemedText style={useManualLocation ? styles.locationToggleTextActive : styles.locationToggleTextInactive}>
                                        Set on Map
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>

                            {/* Auto Location Status */}
                            {!useManualLocation && (
                                <View style={[styles.locationStatus, {backgroundColor: locStatus.background }]}>
                                    <ThemedText style={[
                                        styles.locationStatusText, 
                                        { color: location ? 'green' : (isLoading ? 'orange' : 'red') }
                                    ]}>
                                        {isLoading ? 'Getting your location...' : 
                                        (location ? 'Location acquired successfully' : (errorMsg || 'Location not available'))}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Manual Location (Map Preview) */}
                            {useManualLocation && (
                                <View style={styles.mapPreviewContainer}>
                                    {manualCoordinates ? (
                                        <>
                                            <View style={styles.mapPreview}>
                                                <MapView
                                                    provider={PROVIDER_GOOGLE}
                                                    style={styles.smallMap}
                                                    initialRegion={{
                                                        latitude: manualCoordinates.latitude,
                                                        longitude: manualCoordinates.longitude,
                                                        latitudeDelta: 0.005,
                                                        longitudeDelta: 0.005,
                                                    }}
                                                    scrollEnabled={false}
                                                    zoomEnabled={false}
                                                >
                                                    <Marker
                                                        coordinate={{
                                                            latitude: manualCoordinates.latitude,
                                                            longitude: manualCoordinates.longitude,
                                                        }}
                                                    />
                                                </MapView>
                                            </View>
                                            <ThemedText style={styles.locationText}>
                                                Lat: {manualCoordinates.latitude.toFixed(6)}, Lng: {manualCoordinates.longitude.toFixed(6)}
                                            </ThemedText>
                                        </>
                                    ) : (
                                        <ThemedText style={styles.noLocationText}>Getting your current location. Please wait</ThemedText>
                                    )}
                                    <Button onPress={openMapModal} title={manualCoordinates ? 'Change Location' : 'Select Location on Map'} type='secondary' />
                                </View>
                            )}

                            {errors.location ? <ThemedText style={styles.errorText}>{errors.location}</ThemedText> : null}
                        </View>
                        
                        {/* Additional Information */}
                        <View style={styles.formSection}>
                            <View style={styles.labelContainer}>
                                <ThemedText>
                                Additional Info (Optional): 
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <RichInput
                                    label="Additional info"
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Enter additional details about your emergency"
                                    iconName="document-text-outline"
                                    onChangeText={(text) => handleOnChange(text, "description")}
                                />
                            </View>
                        </View>
                        
                        {/* Image Upload */}
                        <View style={styles.formSection}>
                            <View style={styles.labelContainer}>
                                <ThemedText>
                                Picture (Optional):
                                </ThemedText>
                                <ThemedText style={styles.helperText}>
                                    Upload up to {MAX_IMAGES} image (max {MAX_SIZE_MB}MB)
                                </ThemedText>
                            </View>
                            <View style={styles.inputContainer}>
                                <ImageInput 
                                  onImagesChange={setImages} 
                                  maxImages={MAX_IMAGES}
                                  maxSizeBytes={MAX_SIZE_BYTES}
                                />
                            </View>
                            {images.length > 0 && (
                                <ThemedText style={styles.imageCountText}>
                                    {images.length} {images.length === 1 ? 'image' : 'images'} selected
                                </ThemedText>
                            )}
                        </View>
                        
                        {/* Submit Button */}
                        <View style={styles.submitButtonContainer}>
                            <Button 
                                title={isLoading ? "Processing..." : "Send Request"} 
                                onPress={handleSubmit}
                                disabled={isLoading}
                            />
                        </View>

                        {/* Map Modal for Location Selection */}
                        <Modal
                            visible={mapModalVisible}
                            animationType="slide"
                            transparent={false}
                            onRequestClose={closeMapModal}
                        >
                            <SafeAreaView style={styles.mapModalContainer}>
                                
                                <View style={styles.mapHeaderContainer}>
                                    <ThemedText style={styles.mapHeaderText}>Select Location</ThemedText>
                                    <ThemedText style={styles.mapInstructions}>
                                        Tap on the map to place the marker at your emergency location
                                    </ThemedText>
                                    
                                </View>
                                
                                <View style={styles.mapContainer}>
                                    
                                    <MapView
                                        ref={mapRef}
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: manualCoordinates?.latitude || (location?.coords.latitude || 0),
                                            longitude: manualCoordinates?.longitude || (location?.coords.longitude || 0),
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }}
                                        onPress={handleMapPress}
                                        mapType={mapType}
                                    >
                                        
                                        {manualCoordinates && (
                                            <Marker
                                                coordinate={{
                                                    latitude: manualCoordinates.latitude,
                                                    longitude: manualCoordinates.longitude,
                                                }}
                                                draggable
                                                onDragEnd={(e) => {
                                                    setManualCoordinates({
                                                        latitude: e.nativeEvent.coordinate.latitude,
                                                        longitude: e.nativeEvent.coordinate.longitude
                                                    });
                                                }}
                                            />
                                        )}
                                    </MapView>
                                </View>
                                <View style={styles.right}>
                                    <IconButton iconName="locate" onPress={seeUserLocation} />
                                    <IconButton iconName="layers" onPress={() => setMapTypeModalVisible(true)} />
                                </View>
                                <View style={styles.mapControlsContainer}>
                                    {manualCoordinates && (
                                        <View style={[styles.coordinatesContainer, {backgroundColor: locStatus.background}]}>
                                            <ThemedText style={styles.coordinatesText}>
                                                Latitude: {manualCoordinates.latitude.toFixed(6)}
                                            </ThemedText>
                                            <ThemedText style={styles.coordinatesText}>
                                                Longitude: {manualCoordinates.longitude.toFixed(6)}
                                            </ThemedText>
                                        </View>
                                    )}
                                    
                                    <View style={styles.mapButtonsContainer}>
                                        <TouchableOpacity 
                                            style={[styles.mapButton, styles.cancelButton]} 
                                            onPress={closeMapModal}
                                        >
                                            <ThemedText style={styles.mapButtonText}>Cancel</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.mapButton, styles.confirmButton]} 
                                            onPress={confirmLocation}
                                            disabled={!manualCoordinates}
                                        >
                                            <ThemedText style={styles.mapButtonText}>Confirm Location</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>

                        {/* Alert Modal */}
                        <AlertModal 
                            visible={verificationAlert.visible} 
                            onConfirm={handleAlertClose} 
                            icon={verificationAlert.icon} 
                            iconColor={verificationAlert.iconColor} 
                            message={verificationAlert.message}
                        />

                        <MapTypeModal
                            visible={mapTypeModalVisible}
                            onClose={() => setMapTypeModalVisible(false)}
                            onSelectMapType={handleMapTypeChange}
                            currentMapType={mapType}
                        />

                        <AlertSnack visible={alertSnack} message={alertSnackMsg} onDismissSnackBar={() => setAlertSnack(false)} onIconPress={() => setAlertSnack(false)}/>
                        
                    </ScrollView>
                    </PaperProvider>
                    {isLoading && <ActivityLoader fullscreen text={loadingText} />}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    formSection: {
        marginBottom: 15,
    },
    labelContainer: {
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    inputContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    description: {
        fontSize: 16,
        fontFamily: "CeraPro_Bold",
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    submitButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    required: {
        color: 'red',
    },
    locationStatus: {
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    locationStatusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginHorizontal: 10,
    },
    helperText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    imageCountText: {
        fontSize: 12,
        textAlign: 'center',
        color: 'green',
    },
    locationToggleContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    locationToggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: secondaryColor,
        color: accentColorDark,
    },
    locationToggleActive: {
        backgroundColor: primaryColor,
    },
    locationToggleTextInactive:{
        color: 'white',
    },
    locationToggleTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    mapPreviewContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    mapPreview: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    smallMap: {
        width: '100%',
        height: '100%',
    },
    locationText: {
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
    },
    noLocationText: {
        marginVertical: 10,
        fontSize: 14,
        color: warning,
    },
    selectLocationButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#2196F3',
        borderRadius: 8,
    },
    selectLocationButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    mapModalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    mapHeaderContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    mapHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mapInstructions: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: 'gray',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    mapControlsContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    coordinatesContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
    },
    coordinatesText: {
        fontSize: 14,
    },
    mapButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mapButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    mapButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    right:{
        position: 'absolute',
        right: 16,
        top: 130,
        zIndex: 10,
    },
});

export default Request;