import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, BackHandler, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import Input from '@/utils/components/textbox/input';
import Button from '@/utils/components/buttons/button';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import { useFocusEffect } from '@react-navigation/native';
import AlertModal from '@/utils/components/modals/Alert';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetPassword } from '@/constants/config';
import { UserStorage } from '@/utils/code/async/saveInfo';
import { ActivityLoader } from '@/utils/components/view/loading';

const ArkoIcon = require('../../../assets/images/appImg/arko-logo.png');

const ChangePassword = () =>{

    const router = useRouter();
    const colorScheme = useColorScheme();

    const screenHeight = Dimensions.get('window').height;
    
    // ALERTS
    const [backAlert, setBackAlert] = React.useState({
        visible: false,
        message: "Are you sure you want to go back?",
        icon: "help",
        iconColor: "danger"
    });

    const [resetAlert, setResetAlert] = React.useState({
        visible: false,
        message: "",
        icon: "",
        iconColor: ""
    });

    // Handle back alert responses
    const handleBackConfirm = () => {
        setBackAlert(prev => ({ ...prev, visible: false }));
        router.back(); // Navigate back
    };

    const handleBackCancel = () => {
        setBackAlert(prev => ({ ...prev, visible: false }));
    };
    
    // HARDWARE BACK
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

    const [inputs, setInputs] = React.useState({
        password: "",
        confirm_password: "",
    });
    const [isLoading, setIsLoading] = React.useState(false)

    const [error, setError] = React.useState({
        password: "",
        confirm_password: "",
    });

    const handleOnChange = (text: string, input: string) => {
        setInputs(prevState => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError(prevState => ({ ...prevState, [input]: text }));
    };

    const validatePassword = (password: string): boolean => {
        const minLength = 8;
        const hasNumber = /\d/.test(password);

        if (password.length < minLength) {
            handleError("Password must be at least 8 characters", "password");
            return false;
        }
        
        if (!hasNumber) {
            handleError(
                "Password must contain at least one number!",
                "password"
            );
            return false;
        }

        handleError("", "password");
        return true;
    };


    // Check Textboxes
    const checkAuth = () =>{
        let isValid = true

        setError({password: "",confirm_password: "",});

        if (!inputs.password) {
            handleError("Password is required", "password");
            isValid = false;
        } else if (!validatePassword(inputs.password)) {
            isValid = false;
        }

        if(!inputs.confirm_password){
            handleError("Confirm Password is required", "confirm_password")
            isValid = false
        } else{
            handleError("", "confirm_password")

        }

        if(inputs.password != inputs.confirm_password){
            handleError("Password does not match", "confirm_password")
            isValid = false
        } else{
            handleError("", "confirm_password")
            isValid = true
        }

        return isValid;
    }

    // Add this function to handle reset password results
    const handleChangePass = async () => {
        if (checkAuth()) {
            try {
                setIsLoading(true);
                const forgotOTP = await AsyncStorage.getItem("forgotOTP")
                const userEmail : any = await UserStorage.getUserData()
                // Replace with your actual API call
                const response = await fetch(resetPassword, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: inputs.password,
                        password_confirmation: inputs.confirm_password,
                        otp: forgotOTP,
                        email: userEmail.email
                    }),
                });

                if(!response.ok){
                    const errorData = await response.json().catch(() => ({}));
                    setResetAlert({
                        visible: true,
                        message: `Reset password error. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`,
                        icon: "cloud-offline",
                        iconColor: "danger"
                    });
                    return;
                }

                const data = await response.json()
                console.log(data)
                if (data.status === 200) {
                    await AsyncStorage.removeItem("forgotOTP")
                    setResetAlert({
                        visible: true,
                        message: "Password has been successfully reset! You can now login with your new password.",
                        icon: "checkmark-circle",
                        iconColor: "success"
                    });
                }else {
                    setResetAlert({
                        visible: true,
                        message: "Failed to reset password. Please try again later. " + (data.message || ""),
                        icon: "alert-circle",
                        iconColor: "danger"
                    });
                }
            } catch (error) {
                setResetAlert({
                    visible: true,
                    message: error instanceof Error 
                        ? error.message 
                        : "An error occurred while resetting your password. Please try again.",
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

        // Add this handler for closing the alert
    const handleChangePassAlert = () => {
        setResetAlert(prev => ({ ...prev, visible: false }));
        if (resetAlert.iconColor === "success") {
            router.replace("/main/tabs/");
        }
    };

    
    return(
        <GestureHandlerRootView  style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <SafeAreaView style={[style.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6'}] }>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={style.top}>

                        <View style={style.logocontainer}>
                            <Image source={ArkoIcon} style={style.logo}/>
                        </View>

                    </View>
                    <View style={style.middle}>
                        <View style={style.msg}>
                            <ThemedText type="fade">
                            Please enter your new password. We recommend that you choose a strong password that includes a mix of uppercase and lowercase letters, numbers, and special characters for enhanced security.
                            </ThemedText>
                        </View>
                        <View style={style.form}>
                            <View style={style.input}>
                                <Input label="Password" iconName='key-outline' password onChangeText={(text) => handleOnChange(text, "password")} error={error.password}/>
                            </View>
                            <View style={style.input}>
                                <Input label="Confirm Password" iconName='key-outline' password onChangeText={(text) => handleOnChange(text, "confirm_password")} error={error.confirm_password}/>
                            </View>
                        </View>

                        <View style={style.btn}>
                            <Button title="Update New Password" onPress={handleChangePass}/>
                        </View>
                    
                    </View>
                    </ScrollView>
                    <AlertModal
                        visible={resetAlert.visible}
                        onConfirm={handleChangePassAlert}
                        message={resetAlert.message}
                        icon={resetAlert.icon}
                        iconColor={resetAlert.iconColor}
                    />

                    <AlertChooseModal
                        visible={backAlert.visible}
                        onConfirm={handleBackConfirm}
                        onCancel={handleBackCancel}
                        message={backAlert.message}
                        icon={backAlert.icon}
                        iconColor={backAlert.iconColor}
                    />
                    {isLoading && <ActivityLoader text='Please wait...' fullscreen />}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}

const style = StyleSheet.create({
    container:{
        paddingHorizontal: 20,
        flex: 1,
        alignContent: "center",
    },
    top:{
        marginTop: 5,
    },
    logocontainer:{
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    logo:{
        height: 175,
        width: 175,
    },
    title:{
        margin: 10,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    middle:{
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 20,
    },
    form:{
        marginVertical: 10,
    },
    input:{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    msg:{
        marginVertical: 15,
        marginHorizontal: 10,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignContent: "center",
    },
    btn:{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },

});

export default ChangePassword;