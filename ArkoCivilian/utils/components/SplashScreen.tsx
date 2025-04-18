import { Image, View, SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { ThemedView } from "@/utils/components/themeUI/ThemedView";
import DarkIcon from "@/assets/images/logo_dark.png";
import LightIcon from "@/assets/images/logo_light.png";

export default function SplashScreen() {
    const colorScheme = useColorScheme();

    // Determine the logo based on the color scheme
    const logoSource = colorScheme === 'dark' ? DarkIcon : LightIcon;

    return (
        
            <SafeAreaView style={[styles.container, {backgroundColor: colorScheme == 'dark' ? '#151718' : "#F6F6F6"}]}>
                <ThemedView>
                    <Image source={logoSource} style={styles.logo} />
                </ThemedView>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 350, // Adjust the width as needed
        height: 350, // Adjust the height as needed
        resizeMode: 'center', // Ensure the logo fits well
        justifyContent: "center",
        alignSelf: "center"
    },
});
