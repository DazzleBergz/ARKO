import * as React from 'react';
import { 
    SafeAreaView, 
    View, 
    StyleSheet, 
    Dimensions, 
    KeyboardAvoidingView, 
    ScrollView, 
    BackHandler
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import Button from '@/utils/components/buttons/button';
import Input from '@/utils/components/textbox/input';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import TempUserStorageService from '@/utils/code/async/temp';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityLoader } from '@/utils/components/view/loading';


const GOOGLE_API_KEY = 'AIzaSyB4WvJnFZB9geCF7deWMTuwDNykvlun2Ps';

const SignUp_P2 = () => {

    const router = useRouter();
    const colorScheme = useColorScheme();
    
    // Map state
    const [region, setRegion] = React.useState({
        latitude: 14.6495,
        longitude: 120.9832,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
    });
    const [userLocation, setUserLocation] = React.useState<null | { latitude: number; longitude: number }>(null);
    
    // Form state
    const [address, setAddress] = React.useState({
        houseNo: '',
        street: '',
        city: '',
        region: '',
        country: '',
    });
    const [error, setError] = React.useState({
        houseNo: "",
        street: "",
        city: "",
    });
  
  // Alert modal state
    const [alertModal, setAlertModal] = React.useState(false);
    const [alertIcon, setAlertIcon] = React.useState<any>("");
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertIconColor, setAlertIconColor] = React.useState("");
    const [fullAddress, setFullAddress] = React.useState<any>("");
    const [isBackAlert, setIsBackAlert] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    // Get user location and address on component mount
    React.useEffect(() => {
        getUserLocation();
    }, []);
  
     // Location handlers
    const fetchAddress = async (latitude: number, longitude: number) => {
        try {
            const result = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (result.length > 0) {
                const {
                formattedAddress,
                district,
                city,
                region,
                country,
                streetNumber
            } = result[0];
            
         
                const addressParts = formattedAddress ? formattedAddress.split(',') : [];
                const houseNo = addressParts.length > 0 ? addressParts[0].trim() : streetNumber || '';
                setAddress({
                    houseNo: houseNo,
                    street: district || '', // Use district as street
                    city: city || '',
                    region: region || '',
                    country: country || '',
                });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const getUserLocation = async () => {
        try {
            setIsLoading(true)
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            
            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });
            setRegion({ 
                ...region,
                latitude,
                longitude,
            });

            fetchAddress(latitude, longitude);
        } catch (error) {
            console.error("Error getting user location:", error);
        } finally{
            setIsLoading(false)
        }
    };
  
    // Input handlers
    const handleError = (text: string | null, input: string) => {
        setError((prevState) => ({ ...prevState, [input]: text }));
    };

    const handleOnChange = (text: string, input: string) => {
        const trimmedText = text.trim();
        setAddress(prevState => ({
            ...prevState,
            [input]: trimmedText
        }));

        // Clear error when user starts typing
        handleError("", input);
    };
  
  // Validation function
    const validateFields = () => {
        let isValid = true;
    
        // House number validation
        if (!address.houseNo) {
            handleError("House no. is required!", "houseNo");
            isValid = false;
        } else {
            handleError("", "houseNo");
        }
        
        // Street validation
        if (!address.street) {
            handleError("Street address is required!", "street");
            isValid = false;
        } else {
            handleError("", "street");
        }
    
        // City validation
        if (!address.city) {
            handleError("City address is required!", "city");
            isValid = false;
        } else {
            handleError("", "city");
        }
    
        return isValid;
    };
  
    // Flow functions
    const handleValidateAndProceed = () => {
        const isValid = validateFields();

        if (isValid) {
            setAlertIcon("help");
            setAlertMsg("Are you sure you want to proceed? Please make sure the address is correct.");
            setAlertIconColor("danger");
            setAlertModal(true);
        }
    };
  
  // Save address to temporary storage and navigate to next page
    const saveAddressToTempStorageAndNavigate = async () => {
        try {
        // Get existing user data from temporary storage
            const userData = await TempUserStorageService.getTemporaryUserInfo();
        
            if (userData) {
                const fullAddress = address.houseNo + ", " + address.street + ", " + address.city + ", " + address.region + ", " + address.country
                console.log(fullAddress)
                // Update with address information
                const updatedUserData = {
                    ...userData,
                    house_no: address.houseNo,
                    street: address.street,
                    city: address.city,
                    formatted_address: fullAddress,
                };
            
                // Save updated data back to temporary storage
                const success = await TempUserStorageService.saveTemporaryUserInfo(updatedUserData);
            
                if (success) {
                    console.log("Address information saved to temporary storage");
                    router.replace("/auth/signup_3");
                } else {
                    // Handle storage error
                    setAlertIcon("alert-circle");
                    setAlertMsg("Failed to save your address information. Please try again.");
                    setAlertIconColor("danger");
                    setAlertModal(true);
                }
            } else {
                // No existing user data found
                setAlertIcon("alert-circle");
                setAlertMsg("Your previous information couldn't be found. Please go back to the first step.");
                setAlertIconColor("danger");
                setAlertModal(true);
            }
        } catch (error) {
            console.error("Error saving address data:", error);
            // Show error alert
            setAlertIcon("alert-circle");
            setAlertMsg("An error occurred. Please try again.");
            setAlertIconColor("danger");
            setAlertModal(true);
        }
    };
  
    // Alert handlers
    const handleAlertConfirm = async () => {
        setAlertModal(false);
        
        if (isBackAlert) {
            router.back();
        } else {
            saveAddressToTempStorageAndNavigate();
        }
    };
  
    const handleAlertClose = () => {
        setAlertModal(false);
    };

    useFocusEffect(
            React.useCallback(() => {
                const onBackPress = () => {
                    setIsBackAlert(true);
                    setAlertIcon("help");
                    setAlertMsg("Are you sure you want to go back?");
                    setAlertIconColor("danger");
                    setAlertModal(true);
                    return true; // Prevents default back action
                };
    
                BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
                return () => {
                    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                };
            }, [])
        );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#f6f6f6' }]}>
                    <ScrollView 
                        style={{ flex: 1 }} 
                        contentContainerStyle={{ flexGrow: 1 }} 
                        showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.top}>
                            <ThemedText type='title'>Address Information</ThemedText>
                        </View>
                        
                        <View style={styles.middle}>
                            <MapView
                                style={styles.map}
                                region={region}
                            >
                                {userLocation && <Marker coordinate={userLocation} />}
                            </MapView>
                        
                        <View style={styles.details}>
                            <View style={styles.detailHead}>
                                <ThemedText>
                                    <Ionicons name="alert-circle" size={16}/> 
                                </ThemedText>
                                <ThemedText> Note:</ThemedText>
                            </View>
                            
                            <ThemedText type='fade'>
                                Our app automatically detects your location, which can be used by our operator in case of an emergency. 
                                Please review and adjust your current address if needed
                            </ThemedText>
                        </View>
                        
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Input 
                                    label="House No." 
                                    iconName='person-outline' 
                                    item={address.houseNo} 
                                    onChangeText={(text) => handleOnChange(text, "houseNo")} 
                                    error={error.houseNo} 
                                />
                            </View>
                            
                            <View style={styles.input}>
                                <Input 
                                    label="Street" 
                                    iconName='locate-outline' 
                                    item={address.street} 
                                    onChangeText={(text) => handleOnChange(text, "street")} 
                                    error={error.street}
                                />
                            </View>

                            <View style={styles.input}>
                                <Input 
                                    label="City" 
                                    iconName='map-outline' 
                                    item={address.city} 
                                    onChangeText={(text) => handleOnChange(text, "city")} 
                                    error={error.city}
                                />
                            </View>
                        </View>

                            <View style={styles.btn}>
                                <Button title="Confirm" onPress={handleValidateAndProceed} />
                            </View>
                        </View>
                    </ScrollView>
                
                    <AlertChooseModal 
                        visible={alertModal} 
                        icon={alertIcon} 
                        iconColor={alertIconColor} 
                        message={alertMsg} 
                        onConfirm={handleAlertConfirm} 
                        onCancel={handleAlertClose} 
                    />

                   {isLoading && <ActivityLoader text='Please wait...' fullscreen />}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        alignContent: "center",
    },
    top: {
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: 25,
    },
    middle: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 20,
    },
    details: {
        flexDirection: "column",
    },
    detailHead: {
        flexDirection: "row",
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    form: {
        marginVertical: 10,
    },
    input: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 13,
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
});

export default SignUp_P2;