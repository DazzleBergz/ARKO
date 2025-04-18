import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
 // Update this path to match your project structure
import { accentColorDark, accentColorLight, activityIndicator, lightAccent, onboardColors, primaryColor } from '@/constants/Colors';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';

interface MinimalistSpinnerProps {
    size?: 'small' | 'large';
    containerStyle?: ViewStyle;
    text?: string;
    fullscreen?: boolean;
}

export const ActivityLoader: React.FC<MinimalistSpinnerProps> = ({
    size = 'large',
    containerStyle,
    text,
    fullscreen = false,
}) => {
  const colorScheme = useColorScheme()
  const themeColors = activityIndicator[colorScheme || 'light'];

  const spinnerColor = themeColors.activeDot || (colorScheme === 'dark' ? accentColorDark : primaryColor);

    if (fullscreen) {
        return (
            <View style={[styles.fullscreenContainer, containerStyle]}>
                <View style={[styles.spinnerBox]}>
                    <ActivityIndicator size={size} color={spinnerColor} />
                    {text && <ThemedText style={[styles.text, {color: themeColors.text}]}>{text}</ThemedText>}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <ActivityIndicator size={size} color={spinnerColor} />
            {text && <ThemedText style={[styles.text,  {color: themeColors.text}]}>{text}</ThemedText>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
    },
    spinnerBox: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker box for the spinner
        minWidth: 100,
        minHeight: 100,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
});