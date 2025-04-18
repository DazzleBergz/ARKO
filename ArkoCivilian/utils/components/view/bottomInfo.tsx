import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { useColorScheme } from 'react-native';

const BoatInfoBottomSheet = ({ bottomSheetRef, snapPoints, boat, index = -1, onClose }) => {
    const colorScheme = useColorScheme();

    if (!boat) return null;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleStyle={[styles.handleStyle, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff'}]}
            handleIndicatorStyle={[styles.handleIndicator, {backgroundColor: colorScheme === 'dark' ? '#fff' : '#151718'}]}
            index={index}
            enablePanDownToClose={true}
        >
            <BottomSheetView style={[styles.contentContainer, {backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff'}]}>
                {/* Header with close button */}
                <View style={styles.header}>
                    <ThemedText type="subtitle">{boat?.name || 'Boat Information'}</ThemedText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#151718'} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.infoContainer}>
                    {/* Name */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="boat" style={styles.icon} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <ThemedText style={styles.infoTitle}>Name</ThemedText>
                            <ThemedText type="fade" style={styles.infoSubtitle}>
                                {boat?.name || 'Unknown'}
                            </ThemedText>
                        </View>
                    </View>
                    
                    {/* Coordinates */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="navigate" style={styles.icon} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <ThemedText style={styles.infoTitle}>Coordinates</ThemedText>
                            <ThemedText type="fade" style={styles.infoSubtitle}>
                                Lat: {boat?.currentLocation?.latitude.toFixed(5) || 'N/A'}, 
                                Long: {boat?.currentLocation?.longitude.toFixed(5) || 'N/A'}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Location (Address) */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="location" style={styles.icon} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <ThemedText style={styles.infoTitle}>Location</ThemedText>
                            <ThemedText type="fade" style={styles.infoSubtitle}>
                                {boat?.details?.address || 'Unknown location'}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Runtime */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="analytics" style={styles.icon} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <ThemedText style={styles.infoTitle}>Distance</ThemedText>
                            <ThemedText type="fade" style={styles.infoSubtitle}>
                                {boat.details?.distanceFromUser || 'N/A'}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 4,
    },
    infoContainer: {
        marginVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(39, 124, 165, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
        color: "#277CA5",
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#277CA5",
        marginBottom: 4,
    },
    infoSubtitle: {
        fontSize: 14,
    },
    coordinates: {
        fontSize: 12,
        marginTop: 4,
    },
    handleStyle: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    handleIndicator: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        marginTop: 6,
    },
});

export default BoatInfoBottomSheet;