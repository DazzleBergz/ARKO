import React from 'react';
import { 
  StyleSheet, 
  useColorScheme, 
  SafeAreaView, 
  View, 
  Image, 
  ScrollView,
  Linking,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';

// Components
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { ThemedView } from '@/utils/components/themeUI/ThemedView';
import MenuDivider from '@/utils/components/buttons/MenuDivider';
import { supportEmail } from '@/constants/config';

const logo = require('@/assets/images/arko_icon.png');

const AboutARKO = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const openWebsite = () => {
        Linking.openURL('https://arkovessel.com');
    };

    const contactSupport = () => {
        Linking.openURL(`mailto:${supportEmail}`);
    };

    const handlePrivacyPolicy = () => {
        router.navigate("/main/about/privacy");
    };

    const handleTermsOfService = () => {
        router.navigate("/main/about/terms");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6' }]}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
            >
                {/* Logo and App Name */}
                <View style={styles.headerSection}>
                    <Image 
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <ThemedText type="defaultSemiBold" style={styles.appName}>ARKO</ThemedText>
                    <ThemedText type="fade" style={styles.version}>Version 1.0.0</ThemedText>
                </View>

                {/* App Description */}
                <ThemedView style={styles.card}>
                    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Our Mission</ThemedText>
                    <ThemedText style={styles.cardText}>
                        ARKO is designed to provide immediate emergency assistance when you need it most. Our platform connects you with emergency services, medical professionals, and relief operations to ensure help reaches you quickly and efficiently.
                    </ThemedText>
                </ThemedView>

                {/* Key Features */}
                <ThemedView style={styles.card}>
                    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Key Features</ThemedText>
                    <View style={styles.featureItem}>
                        <ThemedText type="defaultSemiBold">• SOS Emergency Requests</ThemedText>
                        <ThemedText style={styles.featureText}>
                        Send immediate distress signals with your location for rapid response
                        </ThemedText>
                    </View>
                    <View style={styles.featureItem}>
                        <ThemedText type="defaultSemiBold">• Medical Assistance</ThemedText>
                        <ThemedText style={styles.featureText}>
                        Connect with medical professionals for emergency health situations
                        </ThemedText>
                    </View>
                    <View style={styles.featureItem}>
                        <ThemedText type="defaultSemiBold">• Rescue & Evacuation</ThemedText>
                        <ThemedText style={styles.featureText}>
                        Request evacuation services during natural disasters or emergencies
                        </ThemedText>
                    </View>
                    <View style={styles.featureItem}>
                        <ThemedText type="defaultSemiBold">• Relief Supplies</ThemedText>
                        <ThemedText style={styles.featureText}>
                        Request essential supplies during crisis situations
                        </ThemedText>
                    </View>
                </ThemedView>

                {/* How It Works */}
                <ThemedView style={styles.card}>
                    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>How It Works</ThemedText>
                    <ThemedText style={styles.cardText}>
                        1. Create a request specifying your emergency type{'\n'}
                        2. Share your location (automatically or manually){'\n'}
                        3. Add relevant details and optional images{'\n'}
                        4. Submit your request to alert emergency responders{'\n'}
                        5. Track the status of your request in real-time
                    </ThemedText>
                </ThemedView>

                {/* Contact & Links */}
                <View style={styles.grp}>
                    <View style={styles.divider}>
                        <ThemedText type='fade'>Information</ThemedText>
                    </View>
                    <MenuDivider title="Privacy Policy" icon_name="shield-checkmark" onPress={handlePrivacyPolicy} />
                    <MenuDivider title="Terms and Conditions" icon_name="document-text" onPress={handleTermsOfService} />
                </View>

                <View style={styles.grp}>
                    <View style={styles.divider}>
                        <ThemedText type='fade'>Contact Us</ThemedText>
                    </View>
                    <MenuDivider title="Support" icon_name="mail" onPress={contactSupport} />
                </View>

                {/* Copyright Notice */}
                <View style={styles.footer}>
                    <ThemedText type="fade" style={styles.copyright}>
                        © {new Date().getFullYear()} ARKO. All rights reserved.
                    </ThemedText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    headerSection: {
        alignItems: 'center',
        marginVertical: 24,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    appName: {
        fontSize: 24,
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        marginBottom: 10,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
    },
    featureItem: {
        marginBottom: 10,
    },
    featureText: {
        fontSize: 14,
        paddingLeft: 16,
        marginTop: 2,
    },
    grp: {
        marginBottom: 16,
    },
    divider: {
        margin: 10,
    },
    footer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    copyright: {
        fontSize: 12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});

export default AboutARKO;