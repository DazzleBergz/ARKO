import * as React from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, ScrollView, BackHandler } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import Button from '@/utils/components/buttons/button';
import Input from '@/utils/components/textbox/input';
import OTPInput from '@/utils/components/textbox/otpInput';
import OTPButton from '@/utils/components/buttons/otpbutton';
import AlertModal from '@/utils/components/modals/Alert';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import { accountCreateOTP, registerAccount, userInfos, verifyOTP } from '@/constants/config';
import TempUserStorageService from '@/utils/code/async/temp';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityLoader } from '@/utils/components/view/loading';

const SignUp_P3 = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    
    //#region Inputs state
    const [inputs, setInputs] = React.useState({
        username: "",
        password: "",
        confirm_password: "",
        email: "",
        otp_code: "",
    });
    
    // Error state
    const [error, setError] = React.useState({
        username: "",
        password: "",
        confirm_password: "",
        email: "",
        otp_code: "",
    });
    
    // OTP states
    const [otpBtnTxt, setOTPBtnTxt] = React.useState("Send Code");
    const [otpBtn, setOTPBtn] = React.useState(false);
    const [isBackAlert, setIsBackAlert] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    
    // Alert states
    const [otpAlert, setOTPAlert] = React.useState({
        visible: false,
        message: "",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const [confirmationAlert, setConfirmationAlert] = React.useState({
        visible: false,
        message: "Are you sure all the details are correct?",
        icon: "help",
        iconColor: "danger"
    });

    const [resultAlert, setResultAlert] = React.useState({
        visible: false,
        message: "",
        icon: "",
        iconColor: ""
    });
    
    // Input handlers
    const handleOnChange = (text: string, input: string) => {
        setInputs((prevState) => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError((prevState) => ({ ...prevState, [input]: text }));
    };

    // OTP timer function
    const startOTPCountdown = () => {
        let countdown = 60;
        setOTPBtn(true);

        const interval = setInterval(() => {
            if (countdown > 0) {
                setOTPBtnTxt(`Resend in ${countdown}s`);
                countdown -= 1;
            } else {
                clearInterval(interval);
                setOTPBtnTxt("Send Code");
                setOTPBtn(false);
            }
        }, 1000);
    };

    // #endregion

    // Validation function
    const validateInputs = () => {
        let isValid = true;
        
        // Username validation
        if (!inputs.username) {
            handleError("Username is required!", "username");
            isValid = false;
        } else {
            handleError("", "username");
        }

        // Password validation
        if (!inputs.password) {
            handleError("Password is required", "password");
            isValid = false;
        } else if (inputs.password.length < 8 || !/\d/.test(inputs.password)) {
            handleError("Password must be at least 8 characters and include a number", "password");
            isValid = false;
        } else {
            handleError("", "password");
        }

        // Confirm password validation
        if (!inputs.confirm_password) {
            handleError("Confirm Password is required", "confirm_password");
            isValid = false;
        } else if (inputs.password !== inputs.confirm_password) {
            handleError("Password does not match", "confirm_password");
            isValid = false;
        } else {
            handleError("", "confirm_password");
        }

        // Email validation
        if (!inputs.email) {
            handleError("Email is required", "email");
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            handleError("Enter a valid email address", "email");
            isValid = false;
        } else {
            handleError("", "email");
        }

        // OTP validation
        if (!inputs.otp_code) {
            handleError("OTP code is required", "otp_code");
            isValid = false;
        } else {
            handleError("", "otp_code");
        }

        return isValid;
    };

    // API functions
    const sendCode = async () => {
        if (!inputs.email) {
            handleError("Email is required", "email");
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            handleError("Enter a valid email address", "email");
            return;
        }

        handleError("", "email");
        
        try {
            setIsLoading(true)
            const response = await fetch(accountCreateOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: inputs.email }),
            });
            
            const data = await response.json();
            
            if (data.message === "Email is already verified. No OTP sent.") {
                setOTPAlert({
                    visible: true,
                    message: "Email already exists. Please use a different email address.",
                    icon: "close-circle",
                    iconColor: "danger"
                });
            } else if (data.status === 200) {
                setOTPAlert({
                    visible: true,
                    message: "The One-Time Pin code has been sent to your email",
                    icon: "checkmark-circle",
                    iconColor: "success"
                });
            } else {
                setOTPAlert({
                    visible: true,
                    message: data.message + ". " + data.error,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }
        } catch (error: any) {
            setOTPAlert({
                visible: true,
                message: "Failed to send OTP: " + (error.message || "Unknown error"),
                icon: "alert-circle",
                iconColor: "danger"
            });
        } finally{
            setIsLoading(false)
        }
    };

    const createAccount = async () => {
        const tempUserInfo = await TempUserStorageService.getTemporaryUserInfo();
        console.log(tempUserInfo)
        try {
            setIsLoading(true)
            // Step 1: Verify OTP
            const verifyResponse = await fetch(verifyOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: inputs.email, 
                    otp: inputs.otp_code 
                }),
            });
            console.log(verifyResponse)

            if(!verifyResponse.ok){
                const errorData = await verifyResponse.json().catch(() => ({}));
                setResultAlert({
                    visible: true,
                    message: `Error. ${errorData.message || 'Server Error'}.\nError code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }
            
            const verifyData = await verifyResponse.json();
            console.log("verifyData: ", verifyData)
            
            if (!verifyData.verified) {
                setResultAlert({
                    visible: true,
                    message: `OTP verification failed: ` + verifyData.message,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
                return;
            }
            
            // Step 2: Register Account
            const registerResponse = await fetch(registerAccount, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: inputs.username,
                    password: inputs.password,
                    password_confirmation: inputs.confirm_password,
                    email: inputs.email,
                    otp: inputs.otp_code,
                    type: "user",
                }),
            });

            if(!registerResponse.ok){
                const errorData = await registerResponse.json().catch(() => ({}));
                setResultAlert({
                    visible: true,
                    message: `Error. ${errorData.message || 'Server Error'}.\nError code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }
            
            const registerData = await registerResponse.json();
            console.log("register: ", registerData)
            if (registerData.status != 201) {
                setResultAlert({
                    visible: true,
                    message: "Registration failed: " + registerData.message,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
                return;
            }
            
            const userId = registerData.user_id;
            const tempUserInfo = await TempUserStorageService.getTemporaryUserInfo();
            
            // Step 3: Create User Info
            const userInfoResponse = await fetch(userInfos, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id: userId,
                    ...tempUserInfo
                }),
            });

            console.log(userInfoResponse);

            if(!userInfoResponse.ok){
                const errorData = await userInfoResponse.json().catch(() => ({}));
                setResultAlert({
                    visible: true,
                    message: `Error. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            const userInfoData = await userInfoResponse.json();
            console.log("userInfoData: ", userInfoData)
            if (userInfoData.status === 201) {
    
                await TempUserStorageService.clearTemporaryUserInfo();
                setResultAlert({
                    visible: true,
                    message: "Account created successfully!",
                    icon: "checkmark-circle",
                    iconColor: "success"
                });
                
            } else {
                setResultAlert({
                    visible: true,
                    message: "Failed to sign up: " + userInfoData.message,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }
        } catch (error: any) {
            setResultAlert({
                visible: true,
                message: "Account creation failed: " + (error.message || "Unknown error"),
                icon: "alert-circle",
                iconColor: "danger"
            });
        } finally{
            setIsLoading(false)
        }
    };

    //#region UI handlers
    const handleOTPAlert = () => {
        setOTPAlert(prev => ({ ...prev, visible: false }));
        if (otpAlert.iconColor === "success") {
            startOTPCountdown();
        }
    };

    const handleValidate = () => {
        const isValid = validateInputs();
        if (isValid) {
            setConfirmationAlert(prev => ({ ...prev, visible: true }));
        }
    };

    const handleConfirmation = () => {
        setConfirmationAlert(prev => ({ ...prev, visible: false }));
        createAccount();
    };

    const handleConfirmationCancel = () => {
        setConfirmationAlert(prev => ({ ...prev, visible: false }));
    };

    const handleResultAlert = () => {
        setResultAlert(prev => ({ ...prev, visible: false }));
        if (resultAlert.iconColor === "success") {
            router.replace("/auth/login");
        }
    };
    //#endregion
    const [backAlert, setBackAlert] = React.useState({
        visible: false,
        message: "Are you sure you want to go back?",
        icon: "help",
        iconColor: "danger"
    });
    
    const handleBackConfirmation = async () => {
        setBackAlert(prev => ({ ...prev, visible: false }));
        router.back();
    };

    const handleBackCancel = () => {
        setBackAlert(prev => ({ ...prev, visible: false }));
    };

    
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                setBackAlert(prev => ({ ...prev, visible: true }));
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
                <SafeAreaView style={[styles.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#f6f6f6'}]}>
                    <ScrollView 
                        style={{flex: 1}} 
                        contentContainerStyle={{ flexGrow: 1 }}  
                        showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.top}>
                            <ThemedText type='title'>Account Setup</ThemedText>
                            <ThemedText type='fade'>
                                Enter your account details and we will verify your email to finish setting up your account
                            </ThemedText>
                        </View>
                        
                        <View style={styles.middle}>
                            <View style={styles.form}>
                                <View style={styles.input}>
                                    <Input 
                                        label="Username" 
                                        iconName='person-outline' 
                                        onChangeText={(text) => handleOnChange(text, "username")} 
                                        error={error.username}
                                    />
                                </View>
                                
                                <View style={styles.input}>
                                    <Input 
                                        label="Password" 
                                        iconName='key-outline' 
                                        password 
                                        onChangeText={(text) => handleOnChange(text, "password")} 
                                        error={error.password}
                                    />
                                </View>

                                <View style={styles.input}>
                                    <Input 
                                        label="Confirm Password" 
                                        iconName='key-outline' 
                                        password 
                                        onChangeText={(text) => handleOnChange(text, "confirm_password")} 
                                        error={error.confirm_password}
                                    />
                                </View>

                                <View style={styles.input}>
                                    <Input 
                                        label="Email Address" 
                                        iconName='mail-outline' 
                                        onChangeText={(text) => handleOnChange(text, "email")} 
                                        error={error.email}
                                    />
                                </View>

                                <View style={styles.otp}>
                                    <OTPInput 
                                        label="OTP Code" 
                                        iconName='keypad-outline' 
                                        onChangeText={(text) => handleOnChange(text, "otp_code")} 
                                        error={error.otp_code}
                                    />
                                    <OTPButton 
                                        title={otpBtnTxt} 
                                        onPress={sendCode} 
                                        disabled={otpBtn}
                                    />
                                </View>
                            </View>

                            <View style={styles.btn}>
                                <Button title="Create Account" onPress={handleValidate}/>
                            </View>
                        </View>
                    </ScrollView>

                    {isLoading && <ActivityLoader text='Please wait...' fullscreen />}
                </SafeAreaView>
            </KeyboardAvoidingView>
            
            {/* Modals */}
            <AlertModal 
                visible={otpAlert.visible}
                onConfirm={handleOTPAlert}
                message={otpAlert.message}
                icon={otpAlert.icon}
                iconColor={otpAlert.iconColor}
            />
            
            <AlertChooseModal
                visible={confirmationAlert.visible}
                onConfirm={handleConfirmation}
                onCancel={handleConfirmationCancel}
                message={confirmationAlert.message}
                icon={confirmationAlert.icon}
                iconColor={confirmationAlert.iconColor}
            />
            
            <AlertModal
                visible={resultAlert.visible}
                onConfirm={handleResultAlert}
                message={resultAlert.message}
                icon={resultAlert.icon}
                iconColor={resultAlert.iconColor}
            />

            <AlertChooseModal
                visible={backAlert.visible}
                onConfirm={handleBackConfirmation}
                onCancel={handleBackCancel}
                message={backAlert.message}
                icon={backAlert.icon}
                iconColor={backAlert.iconColor}
            />
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
    form: {
        marginVertical: 10,
    },
    input: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 13,
    },
    otp: {
        flexDirection: "row",
        marginVertical: 13,
        justifyContent: "space-evenly"
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
});

export default SignUp_P3;