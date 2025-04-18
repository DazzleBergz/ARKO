import * as React from 'react';
import { 
    TouchableOpacity, 
    View, 
    Text, 
    StyleSheet, 
    KeyboardAvoidingView, 
    ScrollView, 
    SafeAreaView, 
    BackHandler 
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import Button from '@/utils/components/buttons/button';
import Input from '@/utils/components/textbox/input';
import Select from '@/utils/components/textbox/select';
import SelectBday from '@/utils/components/textbox/selectBday';
import Phone from '@/utils/components/textbox/phone';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import TempUserStorageService from '@/utils/code/async/temp';

const SignUp_P1 = () => {
  // Router and theme
    const router = useRouter();
    const colorScheme = useColorScheme();
  
  // Form state
    const [selectedGender, setSelectedGender] = React.useState("");
    const [birthDate, setBirthdate] = React.useState({ day: 0, month: 0, year: 0 });
  
    const gender = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    const [inputs, setInputs] = React.useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        birthdate: birthDate,
        phone: "",
    });

    const [error, setError] = React.useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        birthdate: "",
        phone: "",
    });
  
  // Alert modal state
    const [alertModal, setAlertModal] = React.useState(false);
    const [alertIcon, setAlertIcon] = React.useState<any>("");
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertIconColor, setAlertIconColor] = React.useState("");
    const [isBackAlert, setIsBackAlert] = React.useState(false);
    
    // Input handlers
    const handleOnChange = (text: string, input: string) => {
        setInputs((prevState) => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError((prevState) => ({ ...prevState, [input]: text }));
    };

    const handleOnChangeGender = (value: string) => {
        setSelectedGender(value);
        setInputs((prevState) => ({ ...prevState, gender: String(value) }));
    };

    const handleBirthDate = (value: any) => {
        setBirthdate(value);
        setInputs((prevState) => ({ ...prevState, birthdate: value }));
    };

    // Validation function
    const validateFields = () => {
        let isValid = true;
        
        // First name validation
        if (!inputs.first_name) {
            handleError("First name is required!", "first_name");
            isValid = false;
        } else {
            handleError("", "first_name");
        }

        // Last name validation
        if (!inputs.last_name) {
            handleError("Last name is required", "last_name");
            isValid = false;
        } else {
            handleError("", "last_name");
        }

        // Gender validation
        if (!inputs.gender) {
            handleError("Gender is required", "gender");
            isValid = false;
        } else {
            handleError("", "gender");
        }

        // Birth date validation
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

        return isValid;
    };

  // Flow functions
    const handleValidateAndProceed = async () => {
        const isValid = validateFields();

        if (isValid) {
            setAlertIcon("help");
            setAlertMsg("Are you sure you want to proceed?");
            setAlertIconColor("danger");
            setAlertModal(true);
        }
    };

  // Store user data to temporary storage and navigate to next page
    const saveToTempStorageAndNavigate = async () => {
        try {
            // Format birthdate as string
            const formattedBirthdate = `${inputs.birthdate.year}-${inputs.birthdate.month.toString().padStart(2, '0')}-${inputs.birthdate.day.toString().padStart(2, '0')}`;
            console.log(formattedBirthdate)
            // Prepare user data for storage
            const userData = {
                f_name: inputs.first_name,
                m_name: inputs.middle_name || "",
                l_name: inputs.last_name,
                house_no: "",
                street: "",
                city: "",
                contact_no: inputs.phone,
                gender: inputs.gender,
                birth_Date: formattedBirthdate,
            };
      
            // Save to temporary storage
            const success = await TempUserStorageService.saveTemporaryUserInfo(userData);
      
            if (success) {
                console.log("User data saved to temporary storage");
                router.replace("/auth/signup_2");
            } else {
                // Handle storage error
                setAlertIcon("alert-circle");
                setAlertMsg("Failed to save your information. Please try again.");
                setAlertIconColor("danger");
                setAlertModal(true);
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            // Show error alert
            setAlertIcon("alert-circle");
            setAlertMsg("An error occurred. Please try again.");
            setAlertIconColor("danger");
            setAlertModal(true);
        }
    };

  // Alert handlers
    const handleAlertConfirm = async() => {
        setAlertModal(false);
        if (isBackAlert) {
            router.back();
            await TempUserStorageService.clearTemporaryUserInfo()
        } else {
            saveToTempStorageAndNavigate();
        }
            setIsBackAlert(false);
    };
  
    const handleAlertClose = () => {
        setAlertModal(false);
        setIsBackAlert(false);
    };
  
  // Hardware back button handler
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
                            <ThemedText type='title'>Get Started</ThemedText>
                            <ThemedText type='fade'>Please fill out your personal info.</ThemedText>
                            </View>
                        
                        <View style={styles.middle}>
                            <View style={styles.form}>
                                <View style={styles.input}>
                                <Input 
                                    label="First Name" 
                                    iconName='person-outline' 
                                    onChangeText={(text) => handleOnChange(text, "first_name")} 
                                    error={error.first_name}
                                />
                                </View>
                                
                                <View style={styles.input}>
                                <Input 
                                    label="Middle Name (Optional)" 
                                    iconName='person-outline' 
                                    onChangeText={(text) => handleOnChange(text, "middle_name")} 
                                />
                                </View>

                                <View style={styles.input}>
                                <Input 
                                    label="Last Name" 
                                    iconName='person-outline' 
                                    onChangeText={(text) => handleOnChange(text, "last_name")} 
                                    error={error.last_name}
                                />
                                </View>

                                <View style={styles.input}>
                                <Select 
                                    iconName="male-female-outline" 
                                    items={gender} 
                                    label='Gender' 
                                    value={selectedGender} 
                                    setValue={handleOnChangeGender} 
                                    error={error.gender}
                                />
                                </View>

                                <View style={styles.input}>
                                <SelectBday 
                                    value={birthDate} 
                                    setValue={(newDate) => handleBirthDate(newDate)} 
                                    error={error.birthdate} 
                                />
                                </View>

                                <View style={styles.input}>
                                <Phone 
                                    label="Phone Number" 
                                    iconName='call-outline' 
                                    onChangeText={(text) => handleOnChange(text, "phone")} 
                                    error={error.phone}
                                />
                                </View>
                            </View>

                        <View style={styles.btn}>
                            <Button title="Create an Account" onPress={handleValidateAndProceed} />
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
    },
    form: {
        // Form container
    },
    input: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 13,
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
});

export default SignUp_P1;