import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, BackHandler, KeyboardAvoidingView, SafeAreaView, PermissionsAndroid, Platform, Alert } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Input from '@/utils/components/textbox/input';
import SelectBday from '@/utils/components/textbox/selectBday';
import EditProfileModal from '@/utils/components/modals/choose';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { primaryColor, secondaryColor } from '@/constants/Colors';
import Select from '@/utils/components/textbox/select';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import AlertModal from '@/utils/components/modals/Alert';
import { UserStorage } from '@/utils/code/async/saveInfo';
import { updateUser } from '@/constants/config';
import { ActivityLoader } from '@/utils/components/view/loading';

interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
}

interface AddressData {
    houseNo: string;
    street: string;
    city: string;
    formatted_address?: string;
}

interface BirthDate {
    day: any;
    month: any;
    year: any;
}

interface UserInputs {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    gender: string;
    birthdate: BirthDate;
    address: AddressData;
}

interface ErrorState {
    firstName: string;  
    middleName: string;
    lastName: string;
    phone: string;
    gender: string;
    birthdate: string;
    houseNo: string;
    street: string;
    city: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const DEFAULT_PROFILE_IMAGE = require('../../../assets/images/appImg/arko-logo.png');

const Profile = () => {
    // Initialize state and hooks
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const router = useRouter();
    const isDarkMode = colorScheme === 'dark';
    
    const [userData, setUserData] = React.useState<any>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState<any>(null);
    const [originalProfileImage, setOriginalProfileImage] = React.useState<any>(null);
    const [isProfileImageChanged, setIsProfileImageChanged] = React.useState(false);
    const [selectedGender, setSelectedGender] = React.useState("");
    
    const initialBirthDate: BirthDate = { day: 0, month: 0, year: 0 };
    const [birthDate, setBirthdate] = React.useState<BirthDate>(initialBirthDate);
    const [isLoading, setIsLoading] = React.useState(false)
    
    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    // Input state management
    const [inputs, setInputs] = React.useState<UserInputs>({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        gender: "",
        birthdate: initialBirthDate,
        address: {
            houseNo: "",
            street: "",
            city: ""
        }
    });

    const [error, setError] = React.useState<ErrorState>({
        firstName: "",  
        middleName: "",
        lastName: "",
        phone: "",
        gender: "",
        birthdate: "",
        houseNo: "",
        street: "",
        city: ""
    });

    // Alert states
    const [saveAlert, setSaveAlert] = React.useState<AlertState>({
        visible: false,
        message: "Are you sure you want to save these changes?",
        icon: "help",
        iconColor: "warning"
    });

    const [resultAlert, setResultAlert] = React.useState<AlertState>({
        visible: false,
        message: "",
        icon: "",
        iconColor: ""
    });

    // Set up header with save button
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSavePress}>
                    <ThemedText style={{ color: secondaryColor }}>
                        SAVE
                    </ThemedText>
                </TouchableOpacity>
            )
        });
    }, [navigation, inputs]);

    // Fetch user data on component mount
    React.useEffect(() => {
        fetchUserData();
    }, []);

    // Input handlers
    const handleOnChange = (text: string, input: string) => {
        setInputs((prevState: any) => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError((prevState) => ({ ...prevState, [input]: text || "" }));
    };

    const handleOnChangeGender = (value: string) => {
        setSelectedGender(value);
        setInputs((prevState) => ({ ...prevState, gender: value }));
    };

    const handleBirthDate = (value: BirthDate) => {
        setBirthdate(value);
        setInputs((prevState) => ({ ...prevState, birthdate: value }));
    };

    // Modal functions
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    
    const requestCameraPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: "Camera Permission",
                            message: "We need access to your camera to take photos.",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (err) {
                    console.error('Camera permission error:', err);
                    return false;
                }
            }
            return true;
        };

    const handleCamera = async () => {
        try {
            const hasPermission = await requestCameraPermission();

            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera access is required to take photos');
                return;
            }

            const result: ImagePickerResponse = await launchCamera({
                mediaType: 'photo',
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.8,
            });

            if (result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri);
                setIsProfileImageChanged(true);
            }
        } catch (error) {
            console.error('Camera launch error:', error);
        }
        toggleModal();
    };

    const handleGallery = async () => {
        try {
            const result: ImagePickerResponse = await launchImageLibrary({
                mediaType: 'photo',
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.8,
            });

            if (result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri);
                setIsProfileImageChanged(true);
            }
        } catch (error) {
            console.error('Gallery launch error:', error);
        }
        toggleModal();
    };

    // Data fetching
    const fetchUserData = async () => {
        try {
            const data = await UserStorage.getUserData();
            let profile = data?.image || null;
            console.log("pic: ",profile)
            console.log(data)
            if (data) {
                setUserData(data);
                setProfileImage(profile);
                setOriginalProfileImage(profile);
                setInputs({
                    firstName: data.firstName || "",
                    middleName: data.middleName || "",
                    lastName: data.lastName || "",
                    phone: data.phone || "",
                    gender: data.gender || "",
                    birthdate: data.birthdate || initialBirthDate,
                    address: {
                        houseNo: data.address?.houseNo || "",
                        street: data.address?.street || "",
                        city: data.address?.city || ""
                    }
                });
                
                if (data.birthdate) {   
                    setBirthdate(data.birthdate);
                }
                if (data.gender) {
                    setSelectedGender(data.gender);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showResultAlert("Failed to load user data. Please try again.", "close-circle", "danger");
        }
    };

    // Form validation
    const validateForm = () => {
        let isValid = true;
        
        // First name validation
        if (!inputs.firstName) {
            handleError("First name is required!", "firstName");
            isValid = false;
        } else {
            handleError("", "firstName");
        }

        // Last name validation
        if (!inputs.lastName) {
            handleError("Last name is required", "lastName");
            isValid = false;
        } else {
            handleError("", "lastName");
        }

        // Gender validation
        if (!inputs.gender) {
            handleError("Gender is required", "gender");
            isValid = false;
        } else {
            handleError("", "gender");
        }

        // Birthdate validation
        if (!inputs.birthdate || !inputs.birthdate.day || !inputs.birthdate.month || !inputs.birthdate.year) {
            handleError("Birth date is required", "birthdate");
            isValid = false;
        } else {
            const today = new Date();
            const selectedDate = new Date(inputs.birthdate.year, inputs.birthdate.month - 1, inputs.birthdate.day);
            
            if (selectedDate > today) {
                handleError("Birth date cannot be in the future", "birthdate");
                isValid = false;
            } else if (inputs.birthdate.year < 1900) {
                handleError("Please enter a valid birth year", "birthdate");
                isValid = false;
            } else {
                handleError("", "birthdate");
            }
        }

        // Phone validation
        if (!inputs.phone) {
            handleError("Phone number is required", "phone");
            isValid = false;
        } else {
            handleError("", "phone");
        }

        // Address validation
        if (!inputs.address.houseNo) {
            handleError("House no. is required!", "houseNo");
            isValid = false;
        } else {
            handleError("", "houseNo");
        }

        if (!inputs.address.street) {
            handleError("Street address is required!", "street");
            isValid = false;
        } else {
            handleError("", "street");
        }

        if (!inputs.address.city) {
            handleError("City address is required!", "city");
            isValid = false;
        } else {
            handleError("", "city");
        }

        return isValid;
    };

    // Alert helpers
    const showResultAlert = (message: string, icon: string, iconColor: string) => {
        setResultAlert({
            visible: true,
            message,
            icon,
            iconColor
        });
    };

    // Save handlers
    const handleSavePress = () => {
        if (validateForm()) {
            setSaveAlert(prev => ({ ...prev, visible: true }));
        }
    };

    const handleSaveConfirm = async () => {
        setSaveAlert(prev => ({ ...prev, visible: false }));
        const user : any = await UserStorage.getUserData();
        const formattedBirthdate = `${inputs.birthdate.year}-${inputs.birthdate.month.toString().padStart(2, '0')}-${inputs.birthdate.day.toString().padStart(2, '0')}`;
        try {
            setIsLoading(true)
            console.log(1)
            // Create form data
            const formData : any = new FormData();
            formData.append("user_id", user.userId);
            formData.append("f_name", inputs.firstName);
            formData.append("m_name", inputs.middleName || "");
            formData.append("l_name", inputs.lastName);
            formData.append("house_no", inputs.address.houseNo || "");
            formData.append("street", inputs.address.street || "");
            formData.append("city", inputs.address.city || "");
            formData.append("contact_no", inputs.phone || "");
            formData.append("gender", inputs.gender || "");
            formData.append("birth_date", formattedBirthdate);

            // Get location data
            let formatted_address = "";
             console.log(2)
            try {
                const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                const { latitude, longitude } = location.coords;
                const result = await Location.reverseGeocodeAsync({ latitude, longitude });
                
                if (result.length > 0) {
                    const { region, country } = result[0];
                    formatted_address = `${inputs.address.houseNo}, ${inputs.address.street}, ${inputs.address.city}, ${region || ""}, ${country || ""}`;
                    formData.append("formatted_address", formatted_address);
                }
            } catch (locationError) {
                console.error('Location error:', locationError);
                // Continue without location data if it fails
            }
            console.log(3)

            // Append image only if it has changed
            if (isProfileImageChanged && profileImage) {
                formData.append("image", {
                    uri: profileImage,
                    name: "profile.jpg",
                    type: "image/jpeg"
                });
                console.log("Uploading new profile image");
            } else {
                console.log("Profile image unchanged, skipping upload");
            }

            // Send update request
            const response = await fetch(`${updateUser}/${user.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData,
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                showResultAlert(
                   `Error saving profile. ${errorData.message || 'Server Error'}.\nError Code:: ${errorData.status}`,
                    "cloud-offline",
                    "danger"
                );
                return;
            }

            const saveResponse = await response.json();
            console.log(saveResponse)
            if (saveResponse.status === 200) {
                console.log(formData)
                // Update local storage
                await UserStorage.updateUserData({
                    firstName: inputs.firstName,
                    middleName: inputs.middleName || '',
                    lastName: inputs.lastName,
                    gender: inputs.gender,
                    birthdate: inputs.birthdate,
                    phone: inputs.phone,
                    address: {
                        houseNo: inputs.address.houseNo || '',
                        street: inputs.address.street || '',
                        city: inputs.address.city || '',
                        formatted_address: formatted_address
                    },
                    image: profileImage || user?.image
                });
                
                // Reset the image change flag after successful update
                setIsProfileImageChanged(false);
                setOriginalProfileImage(profileImage);
                
                showResultAlert("Profile updated successfully!", "checkmark-circle", "success");
            } else {
                showResultAlert(`Failed to update profile info. ${saveResponse.message || ""}`, "alert-circle", "danger");
            }
        } catch (error: any) {
            showResultAlert(`Failed to update profile. Please try again. ${error.message || ""}`, "close-circle", "danger");
            console.log('Profile update error:', error);
        } finally{
            setIsLoading(false)
        }
    };

    const handleSaveCancel = () => {
        setSaveAlert(prev => ({ ...prev, visible: false }));
    };

    const handleResultConfirm = () => {
        setResultAlert(prev => ({ ...prev, visible: false }));
        if (resultAlert.iconColor === "success") {
            router.replace("/main/tabs/");
        }
    };

    return (
        <GestureHandlerRootView>
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: isDarkMode ? '#151718' : '#F6F6F6' }}>
                <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#151718' : '#F6F6F6' }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                   
                        {/* Profile Image Section */}
                        <View style={styles.profilegrp}>
                            <View style={styles.profileContainer}>
                                <Image 
                                    style={[styles.profile]} 
                                    source={profileImage ? { uri: profileImage, cache: 'reload' } : DEFAULT_PROFILE_IMAGE}
                                    defaultSource={DEFAULT_PROFILE_IMAGE}
                                />
                                <View style={styles.btnContainer}>
                                    <TouchableOpacity style={styles.iconBtn} onPress={toggleModal}>
                                        <Ionicons name='pencil' style={styles.icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        
                        {/* Form Fields */}
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Input 
                                    label="First Name" 
                                    iconName='people' 
                                    onChangeText={(text) => handleOnChange(text, "firstName")} 
                                    error={error.firstName}
                                    item={userData?.firstName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input 
                                    label="Middle Name" 
                                    iconName='people' 
                                    onChangeText={(text) => handleOnChange(text, "middleName")} 
                                    item={userData?.middleName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input 
                                    label="Last Name" 
                                    iconName='people' 
                                    onChangeText={(text) => handleOnChange(text, "lastName")} 
                                    error={error.lastName}
                                    item={userData?.lastName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input
                                    label="Contact No." 
                                    iconName='call' 
                                    onChangeText={(text) => handleOnChange(text, "phone")} 
                                    error={error.phone}  
                                    item={userData?.phone}
                                />
                            </View>
                            <View style={styles.input}>
                                <SelectBday 
                                    value={birthDate} 
                                    setValue={handleBirthDate} 
                                    error={error.birthdate} 
                                />
                            </View>
                            <View style={styles.input}>
                                <Select
                                    iconName="male-female-outline" 
                                    items={genderOptions} 
                                    label='Gender' 
                                    value={selectedGender} 
                                    setValue={handleOnChangeGender} 
                                    error={error.gender}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input
                                    label="House No." 
                                    iconName='home' 
                                    onChangeText={(text) => handleOnChange(text, "address.houseNo")} 
                                    error={error.houseNo}  
                                    item={userData?.address?.houseNo}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input
                                    label="Street" 
                                    iconName='home' 
                                    onChangeText={(text) => handleOnChange(text, "address.street")} 
                                    error={error.street}  
                                    item={userData?.address?.street}
                                />
                            </View>
                            <View style={styles.input}>
                                <Input
                                    label="City" 
                                    iconName='home' 
                                    onChangeText={(text) => handleOnChange(text, "address.city")} 
                                    error={error.city}  
                                    item={userData?.address?.city}
                                />
                            </View>
                            
                            {/* Modals */}
                            <EditProfileModal 
                                modalVisible={modalOpen} 
                                onClose={() => setModalOpen(false)} 
                                openCamera={handleCamera} 
                                openGallery={handleGallery}
                            />
                            <AlertChooseModal
                                visible={saveAlert.visible}
                                onConfirm={handleSaveConfirm}
                                onCancel={handleSaveCancel}
                                message={saveAlert.message}
                                icon={saveAlert.icon}
                                iconColor={saveAlert.iconColor}
                            />
                            <AlertModal
                                visible={resultAlert.visible}
                                message={resultAlert.message}
                                icon={resultAlert.icon}
                                iconColor={resultAlert.iconColor}
                                onConfirm={handleResultConfirm}
                            />
                        </View>
                        {isLoading && <ActivityLoader fullscreen text='Updating user info. Please wait...' />}
                    
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
            
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilegrp: {
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    profileContainer: {
        height: 150,
        width: 150,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    profile: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
    },
    btnContainer: {
        position: "absolute",
        bottom: 0,
        right: 5,
    },
    iconBtn: {
        backgroundColor: "#277CA5",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 50,
    },
    icon: {
        color: "#fff",
        fontSize: 24,
    },
    form: {
        marginVertical: 20,
        marginHorizontal: 20,
    },
    input: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
});

export default Profile;