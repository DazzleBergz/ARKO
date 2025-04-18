import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import OTPInputLong from '@/utils/components/textbox/OTPInputlong';
import Button from '@/utils/components/buttons/button';
import AlertModal from '@/utils/components/modals/Alert';
import OTPInput from '@/utils/components/textbox/otpInput';
import OTPButton from '@/utils/components/buttons/otpbutton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStorage } from '@/utils/code/async/saveInfo';
import { forgotOTP, verifyOTP } from '@/constants/config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityLoader } from '@/utils/components/view/loading';


interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
}
const ArkoIcon = require('../../../assets/images/appImg/arko-logo.png');

const VerifyEmail = () =>{

    const router = useRouter();
    const colorScheme = useColorScheme();

    const [inputs, setInputs] = React.useState({
        OTPCode: "",
    });

    const [error, setError] = React.useState({
        OTPCode: "",
    });

    const [otpModalAlert, setotpModalAlert] = React.useState(false);
    const [otpBtnTxt, setOTPBtnTxt] = React.useState("Send Code");
    const [otpBtn, setOTPBtn] = React.useState(false);
    
    const [otpAlert, setOTPAlert] = React.useState<AlertState>({
        visible: false,
        message: "",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const [verificationAlert, setVerificationAlert] = React.useState<AlertState>({
        visible: false,
        message: "",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const handleOnChange = (text: string, input: string) => {
        setInputs((prevState) => ({ ...prevState, [input]: text.trim() }));
    };

    const handleError = (text: string | null, input: string) => {
        setError((prevState) => ({ ...prevState, [input]: text }));
    };
    const [isLoading, setIsLoading] = React.useState(false)

    const OTPCodeBtn = () => {
        let countdown = 60;
        setotpModalAlert(false);
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

    const sendCode = async () => {
        try {
            setIsLoading(true);
            // Simulate API call to check email existence and send code
            const userEmail : any = await UserStorage.getUserData()
            console.log(userEmail.email)
            const response = await fetch(forgotOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail.email}),
            });

            console.log(response)

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setOTPAlert({
                    visible: true,
                    message: `Error sending OTP. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }
            
            const data = await response.json()
            console.log("change email: ", data)
            
            if(data.status === 200){
                setOTPAlert({
                    visible: true,
                    message: "Verification code has been sent to your email",
                    icon: "checkmark-circle",
                    iconColor: "success"
                });
            } else if(data.message === "Email is already verified. No OTP sent.") {
                setOTPAlert({
                    visible: true,
                    message: "Email already exists. Please use a different email address.",
                    icon: "close-circle",
                    iconColor: "danger"
                }); 
            } else {
                setOTPAlert({
                    visible: true,
                    message: data.message,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }
        } catch (error: any) {
            setOTPAlert({
                visible: true,
                message: "Failed to send verification code. Please try again. " + (error.message || "Unknown error"),
                icon: "alert-circle",
                iconColor: "danger"
            });
        } finally{
            setIsLoading(false);
        }
    };

    const verifyOTPCode = async () => {
        try {
            setIsLoading(true);
            const userEmail : any = await UserStorage.getUserData()
            console.log(userEmail.email)
            const response = await fetch(verifyOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail.email, otp: inputs.OTPCode }),
            });
            
            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setOTPAlert({
                    visible: true,
                    message: `Verify error. ${errorData.message || 'Server Error'}.\nError Code:: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            const data = await response.json()
            console.log("Verify: ", data)
            
            if (data.status === 200) {
                await AsyncStorage.setItem("forgotOTP", inputs.OTPCode)
                setVerificationAlert({
                    visible: true,
                    message: "Email verified successfully!",
                    icon: "checkmark-circle",
                    iconColor: "success"
                });


            } else if(data.status === 422){
                setVerificationAlert({
                    visible: true,
                    message: "Invalid verification code. Please try again.",
                    icon: "close-circle",
                    iconColor: "danger"
                });
            } else{
                setVerificationAlert({
                    visible: true,
                    message: data.message,
                    icon: "alert-circle",
                    iconColor: "danger"
                });
            }
        } catch (error: any) {
            setVerificationAlert({
                visible: true,
                message: "Something went wrong. Please try again. "+ (error.message || ""),
                icon: "alert-circle",
                iconColor: "danger"
            });
        } finally{
            setIsLoading(false);
        }
    };

    const handleOTPAlert = () => {
        setOTPAlert(prev => ({ ...prev, visible: false }));
        if (otpAlert.iconColor === "success") {
            OTPCodeBtn();
        }
    };

    const handleVerificationAlert = () => {
        setVerificationAlert(prev => ({ ...prev, visible: false }));
        if (verificationAlert.iconColor === "success") {
            router.replace("./changePass");
        }
    };

    const Validate = () => {
        if (!inputs.OTPCode) {
            handleError("Please enter the OTP code", "OTPCode");
            return;
        }
        
        if (inputs.OTPCode.length !== 6) {
            handleError("Please enter a valid 6-digit OTP code", "OTPCode");
            return;
        }

        handleError("", "OTPCode");
        verifyOTPCode();
    };
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
                                To change your current password in your account, you need to verify your identity first. Click "Send Verification Code" to receive a One-Time PIN password at your email.
                            </ThemedText>
                        </View>
                        <View style={style.form}>
                            <View style={style.otp}>
                                <OTPInput label="OTP Code" iconName='keypad-outline' onChangeText={(text) => handleOnChange(text, "OTPCode")} error={error.OTPCode}/>
                                <OTPButton title={otpBtnTxt} onPress={sendCode} disabled={otpBtn} type='secondary'/>
                            </View>
                        </View>

                        <View style={style.btn}>
                            <Button title="Verify Email Address" onPress={Validate}/>
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
                        visible={verificationAlert.visible}
                        onConfirm={handleVerificationAlert}
                        message={verificationAlert.message}
                        icon={verificationAlert.icon}
                        iconColor={verificationAlert.iconColor}
                    />
                    </ScrollView>

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
    otp:{
        flexDirection: "row",
        marginVertical: 13, // Same as the input margin
        justifyContent: "space-evenly"
    },
    input:{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
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
    pinCodeContainer:{
        borderColor: "#808080",
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        alignContent: "center"
    },
    activePinCodeContainer:{
        borderColor: '#3377DC'
    },
    forgotlink:{
        marginTop: 3,
        marginHorizontal: 10,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignContent: "center",
    },
});

export default VerifyEmail;