// TermsAndConditions.tsx
import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  BackHandler,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { ThemedView } from '@/utils/components/themeUI/ThemedView';
import { supportEmail } from '@/constants/config';
const logo = require('@/assets/images/arko_icon.png');

const { width } = Dimensions.get('window');

const TermsAndConditions = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </View>
                <ThemedText type="med" style={styles.title}>Terms & Conditions</ThemedText>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>1. Acceptance of Terms</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        By accessing or using ARKO, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the application.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>2. Use of the App</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        ARKO is intended to help users during emergency situations by providing location-based rescue services. You agree to use the app responsibly and not to misuse the service or submit false reports.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>3. Account Responsibilities</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>4. Intellectual Property</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        All content, trademarks, and code in this app are the property of the ARKO project team or its licensors. You may not copy, distribute, or modify any part of the app without permission.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>5. Limitation of Liability</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        ARKO is provided on an "as-is" basis. We are not liable for any damages resulting from the use or inability to use the app, including emergency service delays or failures.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>6. Changes to Terms</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We reserve the right to modify these Terms at any time. Continued use of the app means you accept the updated terms.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={[styles.section, styles.lastSection]}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>7. Contact Us</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        If you have any questions about these Terms, please contact us at:
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
        flex: 1 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.1)'
    },
    headerTitle: {
        fontSize: 18,
        textAlign: 'center'
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    scrollContainer: { 
        flexGrow: 1, 
        padding: 20
    },
    headerSection: { 
        alignItems: 'center',
        marginBottom: 24
    },
    logo: { 
        width: 120, 
        height: 120 
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
        marginBottom: 0 
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12
    },
    contactInfo: { 
        fontSize: 15, 
        lineHeight: 22, 
        marginLeft: 8
    },
});

export default TermsAndConditions;