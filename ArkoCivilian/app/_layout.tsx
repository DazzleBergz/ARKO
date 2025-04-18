import { loadFonts } from "@/utils/font/font";
import React from "react";
import { Alert, BackHandler, Linking, PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from 'expo-router';
import SplashScreen from "@/utils/components/SplashScreen";
import { UserStorage } from "@/utils/code/async/saveInfo";
import { initializeNotifications } from "@/utils/code/service/notifService";

const App = () =>{
    const [appIsReady, setAppIsReady] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [isOnboardingComplete, setIsOnboardingComplete] = React.useState<boolean | null>(null);
    const router = useRouter();

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                let locationPermission = await Location.requestForegroundPermissionsAsync();
                
                if (locationPermission.status !== 'granted') {
                    const retry = await new Promise((resolve) => {
                        Alert.alert(
                            'Location Permission Required',
                            'This app needs access to your location to show your position on the map. Would you like to grant permission?',
                            [
                                { text: 'No', onPress: () => resolve(false), style: 'cancel' },
                                { text: 'Yes', onPress: () => resolve(true) }
                            ],
                            { cancelable: false }
                        );
                    });
                    
                    if (retry) {
                        locationPermission = await Location.requestForegroundPermissionsAsync();
                        
                        if (locationPermission.status !== 'granted') {
                            throw new Error('Location permission denied after retry');
                        }
                    } else {
                        throw new Error('User declined to retry permission request');
                    }
                }
                
                return true;
            } catch (error) {

                Alert.alert(
                    'Permission Required',
                    'This app requires location permission to function properly. You can grant permission in app settings.',
                    [
                        { 
                            text: 'Exit App', 
                            onPress: () => BackHandler.exitApp(),
                            style: 'cancel'
                        },
                        { 
                            text: 'Open Settings', 
                            onPress: () => {
                                Linking.openSettings();
                            }
                        }
                    ]
                );
                return false;
            }
        }
        return true;
    };

    const initializeApp = async() => {
        try {
            loadFonts();
            // Get stored data in parallel
            await initializeNotifications();

            const [onboardingComplete, userData] = await Promise.all([
                AsyncStorage.getItem("onboardingComplete"),
                UserStorage.getUserData()
            ]);
            
            const permissionsGranted = await requestPermissions();
            if (!permissionsGranted) {
                return;
            }
            
            setAppIsReady(true);
            setLoading(false);

            // Improved token validation with proper error handling
            if (userData) {
                router.replace("/main/tabs/");
            } else if (onboardingComplete) {
                // If no user data but onboarding is complete, go to title page
                router.replace("/onboard/title");
            } else {
                // If neither exists, start with onboarding
                router.replace("/onboard/");
            }
        } catch (e) {
            console.error("App initialization error:", e);
        } finally {
            setAppIsReady(true);
        }
    }

    React.useEffect(() => {
        initializeApp();
    }, [])

    if(!appIsReady || loading){
        return <SplashScreen />;
    }

    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="onboard" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
            <Stack.Screen name="main" options={{ headerBackButtonMenuEnabled: false, headerShown: false }} />
        </Stack>
    );
}

export default App;