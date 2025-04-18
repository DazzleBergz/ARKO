import { accentColorDark, accentColorLight, Colors, primaryColor, secondaryColor, TabColors } from '@/constants/Colors';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme, View } from 'react-native';

export default function TabLayout() {

    const colorScheme = useColorScheme();
    const themeColors = TabColors[colorScheme || 'light'];
    const headColors = Colors[colorScheme || 'light'];

    return (
        <Tabs screenOptions={{ 
                tabBarActiveTintColor: themeColors.active,
                tabBarInactiveTintColor: themeColors.inactive,
                tabBarStyle: [style.tabBar, { backgroundColor: themeColors.background, }],
                tabBarItemStyle: style.tabBarItem,
                tabBarLabelStyle: style.tabBarLabel,
                headerStyle: {
                    backgroundColor: headColors.background, 
                },
                headerTitleStyle:{
                    color: headColors.text,
                    
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Location',
                    headerTitleStyle:{ fontFamily: "CeraPro_Bold"},
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="navigate-circle" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                title: 'Requests',
                headerTitleStyle:{
                    fontFamily: "CeraPro_Bold",
                    color: headColors.text
                },
                headerTitleAlign: "left",
                headerLeftContainerStyle:{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center"
                },
                tabBarIcon: ({ color }) => <Ionicons size={28} name="timer" color={color} />,
                headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6',
                        elevation: 4, // for Android
                        shadowColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        }  ,
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#ECEDEE' : '#11181C',
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                title: 'Notification',
                headerTitleStyle:{
                    fontFamily: "CeraPro_Bold",
                    color: headColors.text
                },
                headerTitleAlign: "left",
                tabBarIcon: ({ color }) => <Ionicons size={28} name="notifications" color={color} />,
                headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6',
                        elevation: 4, // for Android
                        shadowColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                    },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#ECEDEE' : '#11181C',
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    headerTitleStyle:{ 
                        fontFamily: "CeraPro_Bold", 
                        color: headColors.text
                    },
                    headerTitleAlign: "left",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="ellipsis-vertical" color={color} />,
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6',
                        elevation: 4, // for Android
                        shadowColor: colorScheme === 'dark' ? '#ffffff' : '#000000', // for iOS
                        shadowOffset: {
                            width: 0,
                            height: 2,
                    },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    },
                    headerTintColor: colorScheme === 'dark' ? '#ECEDEE' : '#46494BFF',
                }}
                
            />
        </Tabs>
    );
}


const style = StyleSheet.create({
    tabBar: {
    },
    tabBarItem: {
        alignContent: "center",
    },
    tabBarLabel: {  
        fontFamily: "CeraPro"
    },
})