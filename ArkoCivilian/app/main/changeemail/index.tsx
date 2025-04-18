import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, BackHandler, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import Input from '@/utils/components/textbox/input';
import Button from '@/utils/components/buttons/button';
import OTPInput from '@/utils/components/textbox/otpInput';
import OTPButton from '@/utils/components/buttons/otpbutton';
import AlertModal from '@/utils/components/modals/Alert';
import AlertChooseModal from '@/utils/components/modals/AlertChoose';
import { useFocusEffect } from '@react-navigation/native';
import { changeEmail, requestEmail, verifyEmail } from '@/constants/config';
import { UserStorage } from '@/utils/code/async/saveInfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityLoader } from '@/utils/components/view/loading';

const ArkoIcon = require('../../../assets/images/appImg/arko-logo.png');

interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
}

const ChangeEmail = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    
    const [inputs, setInputs] = React.useState({
        old_email: "",
        new_email: "",
        OTPCode: "",
    });

    const [error, setError] = React.useState({
        old_email: "",
        new_email: "",
        OTPCode: "",
    });

    const [otpBtnTxt, setOTPBtnTxt] = React.useState("Send Code");
    const [otpBtn, setOTPBtn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false)

    const [otpAlert, setOTPAlert] = React.useState<AlertState>({
        visible: false,
        message: "",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const [changeEmailAlert, setChangeEmailAlert] = React.useState<AlertState>({
        visible: false,
        message: "",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const handleOnChange = (text: string, input: string) => {
        setInputs(prevState => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError(prevState => ({ ...prevState, [input]: text }));
    };

    const OTPCodeBtn = () => {
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

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const sendCode = async () => {
        if (!inputs.old_email) {
            handleError("Please enter your old email address", "old_email");
            return;
        }

        if (!validateEmail(inputs.old_email)) {
            handleError("Please enter a valid old email address", "old_email");
            return;
        }

        if (!inputs.new_email) {
            handleError("Please enter your new email address", "new_email");
            return;
        }

        if (!validateEmail(inputs.new_email)) {
            handleError("Please enter a valid new email address", "new_email");
            return;
        }

        handleError("", "old_email");
        handleError("", "new_email");

        try {
            // Add your API call here
            setIsLoading(true)
            const userData = await UserStorage.getUserData()
            const response = await fetch(requestEmail, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${userData?.token}`,
                    },
                body: JSON.stringify({  
                    old_email: inputs.old_email,
                    new_email: inputs.new_email,
                    user_id: userData?.userId
                })
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setOTPAlert({
                    visible: true,
                    message: `Error sending OTP. ${errorData.message || 'Server Error'}. Status: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            // if (!response.ok) throw new Error('Failed to send OTP');\
            const data = await response.json()
            if(data.status === 200){
                setOTPAlert({
                    visible: true,
                    message: "The One-Time Pin code has been sent to your new email",
                    icon: "checkmark-circle",
                    iconColor: "success"
                });
            } else {
                setOTPAlert({
                    visible: true,
                    message: "Failed to send OTP code: " + (data.message || ""),
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }

            
        } catch (error) {
            setOTPAlert({
                visible: true,
                message: "Failed to send verification code. Please try again.",
                icon: "alert-circle",
                iconColor: "danger"
            });
        } finally{
            setIsLoading(false)
        }
    };

    const handleOTPAlert = () => {
        setOTPAlert(prev => ({ ...prev, visible: false }));
        if (otpAlert.iconColor === "success") {
            OTPCodeBtn();
        }
    };

    const handleChangeEmailAlert = () => {
        setChangeEmailAlert(prev => ({ ...prev, visible: false }));
        if (changeEmailAlert.iconColor === "success") {
            router.back();
        }
    };

    const verifyAndChangeEmail = async () => {
        if (!inputs.old_email) {
            handleError("Please enter your old email address", "old_email");
            return;
        }

        if (!inputs.new_email) {
            handleError("Please enter your new email address", "new_email");
            return;
        }

        if (!inputs.OTPCode) {
            handleError("Please enter the OTP code", "OTPCode");
            return;
        }

        if (inputs.OTPCode.length !== 6) {
            handleError("Please enter a valid 6-digit OTP code", "OTPCode");
            return;
        }

        handleError("", "old_email");
        handleError("", "new_email");
        handleError("", "OTPCode");

        try {
            // Add your API call here
            const userData = await UserStorage.getUserData()
            const response = await fetch(verifyEmail, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userData?.token}`,
                },
                body: JSON.stringify({ 
                    user_id: userData?.userId,
                    new_email: inputs.new_email,
                    otp: inputs.OTPCode 
                })
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setOTPAlert({
                    visible: true,
                    message: `Change email Error. ${errorData.message || 'Server Error'}.\nError Code:: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            const data = await response.json();
            console.log(data)
            if(data.status === 200){
                const change = await fetch(changeEmail, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${userData?.token}`,
                    },
                    body: JSON.stringify({ 
                        user_id: userData?.userId,
                        new_email: inputs.new_email,
                        otp: inputs.OTPCode 
                    })
                });

                const feedback = await change.json();
                
                if(feedback.status === 200){

                    await UserStorage.updateUserData({
                        email: inputs.new_email
                    });
                    
                    setChangeEmailAlert({
                        visible: true,
                        message: "Email address has been successfully updated",
                        icon: "checkmark-circle",
                        iconColor: "success"
                    });
                } else{
                    setChangeEmailAlert({
                        visible: true,
                        message: "Failed to update email: " + (feedback.message || ""),
                        icon: "alert-circle",
                        iconColor: "danger"
                    });
                }
            
            } else{
                setChangeEmailAlert({
                    visible: true,
                    message: "Failed to verify email: " + (data.message || ""),
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }
        } catch (error) {
            setChangeEmailAlert({
                visible: true,
                message: "Failed to verify OTP. Please check the code and try again.",
                icon: "close-circle",
                iconColor: "danger"
            });
        }
    };

    const [backAlert, setBackAlert] = React.useState({
        visible: false,
        message: "Are you sure you want to go back?",
        icon: "help",
        iconColor: "danger"
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

    return(
        <GestureHandlerRootView style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <SafeAreaView style={[style.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6'}] }>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 }} 
                        showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps="handled">
                    <View style={style.top}>
                        <View style={style.logocontainer}>
                            <Image source={ArkoIcon} style={style.logo}/>
                        </View>
                    </View>
                    <View style={style.middle}>
                        <View style={style.msg}>
                            <ThemedText type="fade">
                                Please provide your old and new email addresses. Make sure the new email is valid and accessible, as you will receive a verification code there.
                            </ThemedText>
                        </View>
                        <View style={style.form}>
                            <View style={style.input}>
                                <Input 
                                    label="Old Email Address" 
                                    iconName='mail-outline'
                                    onChangeText={(text) => handleOnChange(text, "old_email")}
                                    error={error.old_email}
                                />
                            </View>
                            <View style={style.input}>
                                <Input 
                                    label="New Email Address" 
                                    iconName='mail-outline'
                                    onChangeText={(text) => handleOnChange(text, "new_email")}
                                    error={error.new_email}
                                />
                            </View>
                            <View style={style.otp}>
                                <OTPInput 
                                    label='OTP Code' 
                                    iconName="keypad"
                                    onChangeText={(text) => handleOnChange(text, "OTPCode")}
                                    error={error.OTPCode}
                                />
                                <OTPButton 
                                    title={otpBtnTxt} 
                                    type="secondary"
                                    onPress={sendCode}
                                    disabled={otpBtn}
                                />
                            </View>
                        </View>

                        <View style={style.btn}>
                            <Button title="Verify Email Address" onPress={verifyAndChangeEmail}/>
                        </View>
                    </View>

                    <AlertModal
                        visible={otpAlert.visible}
                        onConfirm={handleOTPAlert}
                        message={otpAlert.message}
                        icon={otpAlert.icon}
                        iconColor={otpAlert.iconColor}
                    />

                    <AlertModal
                        visible={changeEmailAlert.visible}
                        onConfirm={handleChangeEmailAlert}
                        message={changeEmailAlert.message}
                        icon={changeEmailAlert.icon}
                        iconColor={changeEmailAlert.iconColor}
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
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

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
        marginVertical: 13,
    },
    otp:{
        flexDirection: "row",
        marginVertical: 13, // Same as the input margin
        justifyContent: "space-evenly"
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

export default ChangeEmail;