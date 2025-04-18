import { logoutAccount } from "@/constants/config";
import { EmergencyRequestManager } from "@/utils/code/async/reqInfo";
import { UserStorage } from "@/utils/code/async/saveInfo";
import Button from "@/utils/components/buttons/button";
import MenuDivider from "@/utils/components/buttons/MenuDivider";
import AlertModal from "@/utils/components/modals/Alert";
import AlertChooseModal from "@/utils/components/modals/AlertChoose";
import { ThemedText } from "@/utils/components/themeUI/ThemedText";
import { ThemedView } from "@/utils/components/themeUI/ThemedView";
import { ActivityLoader } from "@/utils/components/view/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React from "react";
import { useColorScheme, View, StyleSheet, SafeAreaView, Image, ScrollView} from "react-native";

const profile = require('@/assets/images/arko_icon.png');

interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
}

const Menu = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [isLoading, setIsLoading] = React.useState(false)
    const [backAlert, setBackAlert] = React.useState<AlertState>({
        visible: false,
        message: "Are you sure you want to log out?",
        icon: "help",
        iconColor: "danger"
    });

    const [successAlert, setSuccessAlert] = React.useState<AlertState>({
        visible: false,
        message: "You have been successfully logged out",
        icon: "checkmark-circle",
        iconColor: "success"
    });

    const [alert, setAlert] = React.useState<AlertState>({
        visible: false,
        message: "You have been successfully logged out",
        icon: "alert-circle",
        iconColor: "danger"
    });

    const handleLogoutPress = async() => {
        setBackAlert((prev) => ({...prev, visible: true}));
    };

    const handleBackConfirm = async () => {
        setBackAlert((prev) => ({ ...prev, visible: false }));
        try {
            setIsLoading(true)
            const token = await UserStorage.getAuthToken();
            if (!token) {
                console.warn("No token found, proceeding with logout");
            } else {
                const response = await fetch(logoutAccount, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if(!response.ok){
                    const errorData = await response.json().catch(() => ({}));
                    setAlert({
                        visible: true,
                        message: `Error. ${errorData.message || 'Server Error'}. Status: ${errorData.status}`,
                        icon: "cloud-offline",
                        iconColor: "danger"
                    });
                    return;
                }
                
                const data = await response.json()
                console.log(data)
                if(data.status === 200){
                    
                    setSuccessAlert((prev) => ({ ...prev, visible: true }));
                } else{
                    setAlert({
                        visible: true,
                        message: "Something went wrong. " + (data.message || ""),
                        icon: "alert-circle",
                        iconColor: "danger"
                    })
                }
            }
        } catch (error: any) {
            setAlert({
                visible: true,
                message: "Something went wrong. " + (error.message || ""),
                icon: "alert-circle",
                iconColor: "danger"
            })
        } finally{
            setIsLoading(false)
        }
    };


    const handleBackCancel = () => {
        setBackAlert((prev) => ({...prev, visible: false}));
    };

    const handleSuccessConfirm = async () => {
        setSuccessAlert((prev) => ({...prev, visible: false}));
        await UserStorage.clearUserData();
        await EmergencyRequestManager.clearAllData();
        router.replace("/auth/login");
    };

    // Function to fetch user data
    const [userData, setUserData] = React.useState<{firstName: string} | null>(null);

    React.useEffect(() => {
        fetchUserData();
        const intervalId = setInterval(fetchUserData, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await UserStorage.getUserData();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return(
        <SafeAreaView style={[style.container, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6'}]}>
            <View style={{flex: 1}}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, padding: 0, margin: 0, }} 
                showsVerticalScrollIndicator={false} 
                keyboardShouldPersistTaps="handled"
            >
            <View style={style.profileSection}>
                <Image 
                    style={style.profilePic}
                    source={userData?.image ? { uri: userData.image } : profile}
                />
                <ThemedText type="defaultSemiBold" style={style.profileName}>
                    {userData?.firstName || 'Loading...'}
                </ThemedText>
            </View>
            <View style={style.grp}>
                <View style={style.divider}>
                    <ThemedText type='fade'>Profile Settings</ThemedText>
                </View>
                <MenuDivider title="Edit Profile" icon_name="person" onPress={() => {router.navigate("/main/profile/")}}/>
            </View>
            <View style={style.grp}>
                <View style={style.divider}>
                    <ThemedText type='fade'>Privacy Settings</ThemedText>
                </View>
                <MenuDivider title="Change Password" icon_name="key" onPress={() => {router.navigate("/main/changepass/")}}/>
                <MenuDivider title="Change Email" icon_name="mail" onPress={() => {router.navigate("/main/changeemail/")}}/>
            </View>
            <View style={style.grp}>
                <View style={style.divider}>
                    <ThemedText type='fade'>About App</ThemedText>
                </View>
                <MenuDivider title="About ARKO" icon_name="information" onPress={() => {router.navigate("/main/about/")}}/>
                <MenuDivider title="Privacy Policy" icon_name="shield-checkmark" onPress={() => {router.navigate("/main/about/privacy")}}/>
                <MenuDivider title="Terms and Conditions" icon_name="document-text" onPress={() => {router.navigate("/main/about/terms")}}/>
            </View>
            <View style={style.grp}>
                <View style={style.divider}>
                    <ThemedText type='fade'>Account Settings</ThemedText>
                </View>
                <MenuDivider title="Log Out" icon_name="log-out" onPress={handleLogoutPress}/>
            </View>

            <AlertChooseModal
                visible={backAlert.visible}
                onConfirm={handleBackConfirm}
                onCancel={handleBackCancel}
                message={backAlert.message}
                icon={backAlert.icon}
                iconColor={backAlert.iconColor}
            />

            <AlertModal
                visible={successAlert.visible}
                message={successAlert.message}
                icon={successAlert.icon}
                iconColor={successAlert.iconColor}
                onConfirm={handleSuccessConfirm}
            />

            <AlertModal
                visible={alert.visible}
                message={alert.message}
                icon={alert.icon}
                iconColor={alert.iconColor}
                onConfirm={() => setAlert((prev) => ({...prev, visible: false}))}
            />
            </ScrollView>
            {isLoading && <ActivityLoader fullscreen text="Logging Out"/>}
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },
    grp:{
        marginBottom: 10,
    },
    divider:{
        margin: 10,
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    profileName: {
        fontSize: 22,
        textAlign: "center"
    }
})

export default Menu;