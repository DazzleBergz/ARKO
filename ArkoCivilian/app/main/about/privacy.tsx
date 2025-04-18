import React from 'react';
import { 
  StyleSheet, 
  useColorScheme, 
  SafeAreaView, 
  View, 
  ScrollView,
  Image,
  BackHandler,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Components
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { ThemedView } from '@/utils/components/themeUI/ThemedView';
import { supportEmail } from '@/constants/config';
const logo = require('@/assets/images/arko_icon.png');

const { width } = Dimensions.get('window');

const PrivacyPolicy = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Handle back button press
    useFocusEffect(
        React.useCallback(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            router.back();
            return true;
        });

        return () => backHandler.remove();
        }, [router])
    );
    
  
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F8F9FA' }]}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Image 
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <ThemedText type="med" style={styles.title}>Privacy Policy</ThemedText>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>1. Introduction</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Welcome to ARKO. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.
                    </ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>2. Information We Collect</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Personal Data:</ThemedText> When you create an account, we collect your name, email address, phone number, and profile picture if provided.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Location Data:</ThemedText> To provide emergency assistance, we collect precise location data when you submit a request. You can provide this automatically or manually.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Emergency Request Data:</ThemedText> Information you provide when submitting emergency requests, including emergency type, description, number of people affected, and any images you upload.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Device Information:</ThemedText> We collect information about your mobile device including the hardware model, operating system and version, unique device identifiers, and mobile network information.
                    </ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>3. How We Use Your Information</ThemedText>
                    <ThemedText style={styles.paragraph}>We use the information we collect to:</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Provide emergency assistance services</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Process and respond to your emergency requests</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Create and maintain your account</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Improve our application and user experience</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Communicate with you about your requests and account</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• Ensure the security of our services</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>4. Sharing Your Information</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We may share your information with:
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Emergency Service Providers:</ThemedText> Your location and request details will be shared with appropriate emergency services to provide assistance.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Service Providers:</ThemedText> We may share your information with third-party vendors who provide services on our behalf.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        <ThemedText type="defaultSemiBold">Legal Requirements:</ThemedText> We may disclose your information when required by law or in response to valid requests by public authorities.
                    </ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>5. Data Security</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>6. Your Privacy Rights</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Depending on your location, you may have certain rights regarding your personal data, including:
                    </ThemedText>
                    <ThemedText style={styles.bulletPoint}>• The right to access your personal data</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• The right to correct inaccurate or incomplete data</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• The right to delete your personal data</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• The right to restrict or object to processing</ThemedText>
                    <ThemedText style={styles.bulletPoint}>• The right to data portability</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={[styles.section, styles.lastSection]}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>7. Contact Us</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at:
                    </ThemedText>
                    <View style={styles.contactContainer}>
                        <Ionicons name="mail-outline" size={18} color={isDark ? '#A0AEC0' : '#4A5568'} />
                        <ThemedText style={styles.contactInfo}>
                            {supportEmail}
                        </ThemedText>
                    </View>
                </ThemedView>
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
        padding: 20,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    section: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        width: width - 40
    },
    lastSection: {
        marginBottom: 40
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 14,
        letterSpacing: 0.2
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 12,
    },
    bulletPoint: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 8,
        marginLeft: 16,
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    contactInfo: {
        fontSize: 15,
        lineHeight: 22,
        marginLeft: 8,
    },
});

export default PrivacyPolicy;