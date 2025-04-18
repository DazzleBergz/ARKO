import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/utils/components/buttons/button';
import Input from '@/utils/components/textbox/input';

import { ref, get, child, onValue, set } from 'firebase/database';
import { database } from '@/constants/firebase';
import CryptoJS, { SHA256 } from "crypto-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import AlertModal from '@/utils/components/modals/Alert';
import NetworkAlert from '@/utils/code/server/netinfo';
import { UserStorage } from '@/utils/code/async/saveInfo';
import { loginAccount, userInfos, userProfile } from '@/constants/config';
import { ActivityLoader } from '@/utils/components/view/loading';

const ArkoIcon = require('../../assets/images/appImg/arko-logo.png');

const LoginScreen = () =>{
    
    const router = useRouter();
    const colorScheme = useColorScheme();

    //input behaviors
    const [inputs, setInputs] = React.useState({ username: "", password: "" });
    const [errors, setErrors] = React.useState({ username: "", password: "" });
    const handleOnChange = (text: string, input: string) => {
        setInputs((prevState) => ({ ...prevState, [input]: text.trim() }));
    };
    const handleError = (text: string | null, input: string) => {
        setErrors((prevState) => ({ ...prevState, [input]: text }));
    };

    //validate components
    const CheckFields = async() => {
        let isValid = true

        if(!inputs.username){
            handleError("Username is required!", "username")
            isValid = false
        } else{
            handleError("", "username")
            isValid = true
        }

        if(!inputs.password){
            handleError("Password is required", "password")
            isValid = false
        } else{
            handleError("", "password")
            isValid = true
        }

        return isValid;
    }

    //reset inputs once logged in
    const LoginSuccess = () =>{
        setInputs({username: "", password: "",})
        router.replace("/main/tabs/")
    }

    // attempts
    const [attemptCount, setAttemptCount] = React.useState(0);
    const MAX_ATTEMPTS = 3;

    // Alert MODAL
    const [alertModal, setAlertModal] = React.useState(false);
    const [alertIcon, setAlertIcon] = React.useState<any>("");
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertIconColor, setAlertIconColor] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Modal Behavior
    const [isLoginSuccessful, setIsLoginSuccessful] = React.useState(false);
    const handleAlertClose = () => {
        setAlertModal(false);
        if (isLoginSuccessful) {
            LoginSuccess();
            setAttemptCount(0);
        }
    }

    //validate from server
    const Validation = async () =>{
        
        const isValid = await CheckFields();
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        let userID;
        let email;
        try {
            if(isValid) {
                setIsLoading(true)
                const response = await fetch(loginAccount, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: inputs.username, password: inputs.password }),
                });

                if(!response.ok){
                    const errorData = await response.json().catch(() => ({}));
                    setAlertIcon("alert-circle");
                    setAlertMsg(`Error. ${errorData.message || 'Server Error'}.\nError Code: ${errorData.status}`);
                    setAlertIconColor("danger");
                    setAlertModal(true);
                    return;
                }
                
                
                const data = await response.json()
                console.log(data)
                if(data.status === 200){
                    userID = data.user_id
                    email = data.email
                    const userData = await fetch(userInfos + `/${userID}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const info = await userData.json();

                    //image
                   
                    info.data.email = email;
                    info.data.image = `${userProfile}/${userID}`
                    console.log(info.data.image)
                    await UserStorage.saveUserData(info.data, data.token);

                    setAlertIcon("checkmark-circle");
                    setAlertMsg("Log in successfully");
                    setAlertIconColor("success");
                    setAlertModal(true);
                    setIsLoginSuccessful(true);

                } else if(data.status === 403){
                    setAlertIcon("alert-circle");
                    setAlertMsg(`You've already login in another device. Please log out.`);
                    setAlertIconColor("danger");
                    setAlertModal(true);
                }
                else {
                    if (newAttemptCount >= MAX_ATTEMPTS) {
                        setBtnDisable(true);
                        setAlertIcon("alert-circle");
                        setAlertMsg(`Maximum attempts reached. Please try again after 30 seconds.`);
                        setAlertIconColor("danger");
                    } else {
                        setAlertIcon("alert-circle");
                        setAlertMsg(`Incorrect username or password. ${MAX_ATTEMPTS - newAttemptCount} attempts remaining`);
                        setAlertIconColor("danger");
                    }
                    setAlertModal(true);
                    setIsLoginSuccessful(false);
                }
            }
        } catch (error: any) {
            console.log(error)
            setAlertIcon("alert-circle");
            setAlertMsg("Something went wrong. " + (error.message || ""));
            setAlertIconColor("danger");
            setAlertModal(true);
        } finally{
            setIsLoading(false)
        }

    }

    // timers
    const [btnDisable, setBtnDisable] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(30);
    React.useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (btnDisable && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setBtnDisable(false);
            setTimeLeft(30);
            setAttemptCount(0);  // Reset attempt count
        }
        return () => clearInterval(timer);
    }, [btnDisable, timeLeft]);

    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[style.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6'}] }>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={style.top}>
                        <View style={style.logocontainer}>
                            <Image source={ArkoIcon} style={style.logo}/>
                        </View>
                    </View>
                    <View style={style.middle}>
                        <View style={style.form}>
                            <View style={style.input}>
                                <Input label="Username" iconName='person-outline'  onChangeText={(text) => handleOnChange(text, "username")} error={errors.username}/>
                            </View>
                            <View style={style.input}>
                                <Input label="Password" iconName='key-outline' password onChangeText={(text) => handleOnChange(text, "password")} error={errors.password}/>
                            </View>
                        </View>
                        <View style={style.forgotlink}>
                            <TouchableOpacity onPress={() => {router.replace("/auth/forgot_1")}}>
                                <ThemedText style={{color: "#277CA5", fontSize: 14,}}>Forgot Password?</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <View style={style.btn}>
                            <Button title={btnDisable ? `Try again in ${timeLeft}s` : "Login"} onPress={Validation} disabled={btnDisable}/>
                        </View>

                        <View style={style.dividerContainer}>
                            <View style={style.divider} />
                            <Text style={style.dividerText}>OR</Text>
                            <View style={style.divider} />
                        </View>

                        <View style={style.create}>
                            <ThemedText>Don't have an account? </ThemedText>
                                <TouchableOpacity onPress={() => router.replace("/auth/signup_1")}>
                                    <ThemedText type='fade' style={style.createAccountText}>Sign Up</ThemedText>
                                </TouchableOpacity>
                        </View>

                    </View>

                        <View style={style.termsContainer}>
                        <View style={style.termsDivide}>
                            <ThemedText style={style.termsText}>
                                By signing in, you agree to our{'\n'}
                            </ThemedText>
                        </View>
                        <View style={style.termsDivide}>
                            <TouchableOpacity  onPress={() => router.push('/main/about/terms')}>
                                <ThemedText style={style.termsLink}>Terms of Service</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={style.termsText}> and </ThemedText>
                            <TouchableOpacity onPress={() => router.push('/main/about/privacy')}>
                                <ThemedText style={style.termsLink}>Privacy Policy</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                

                {/* ALERT MODALS / SNACKBARS */}

                <AlertModal visible={alertModal} onConfirm={handleAlertClose} icon={alertIcon} iconColor={alertIconColor} message={alertMsg}/>
                {isLoading && <ActivityLoader fullscreen text='Logging In' />}
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

const style = StyleSheet.create({
    container:{
        paddingHorizontal: 20,
        paddingVertical: 25,
        flex: 1,
        alignContent: "center",
    },
    top:{
        marginTop: 30,
        marginBottom: 10,
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
        marginTop: 30,
    },
    form:{
        marginVertical: 10,
    },
    input:{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 13,
    },
    forgotlink:{
        marginTop: 3,
        marginBottom: 15,
        marginHorizontal: 10,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignContent: "center",
        fontSize: 12,
    },
    btn:{
        justifyContent: "center",
        alignItems: "center",
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 10,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#B3B4BA',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#B3B4BA',
        fontFamily: "CeraPro"
    },
    create:{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    createAccountText: {
        color: '#277CA5',
        textDecorationLine: 'underline',
        fontFamily: "CeraPro"
    },
    termsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto', // Push to bottom
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: "auto",
    },
    termsDivide:{
        flexDirection: "row",
        marginBottom: -10,
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: "CeraPro",
        textAlignVertical: "center",
        lineHeight: 16
    },
    termsLink: {
        color: '#277CA5',
        textDecorationLine: 'underline',
        fontSize: 12,
        fontFamily: "CeraPro"
    },
});

export default LoginScreen;