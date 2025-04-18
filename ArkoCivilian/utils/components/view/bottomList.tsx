import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/utils/components/themeUI/ThemedText';
import { useColorScheme } from 'react-native';
import Input from '../textbox/input';

const BoatListBottomSheet = ({ bottomSheetRef, snapPoints, boats, onBoatPress, index = -1, onClose }) => {
    const colorScheme = useColorScheme();
    const [searchTerm, setSearchTerm] = useState('');

    // Sort and filter boats
    const processedBoats = boats
        .filter((boat : any) => 
            // Filter by name or address
            (boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             boat.details?.address?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        // Sort by distance (closest first)
        .sort((a : any, b : any) => {
            const distanceA = parseFloat(a.details?.distanceFromUser || Infinity);
            const distanceB = parseFloat(b.details?.distanceFromUser || Infinity);
            return distanceA - distanceB;
        });

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
                    <ThemedText type="subtitle">Available Boats</ThemedText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#151718'} />
                    </TouchableOpacity>
                </View>

                {/* Search and Filter Controls */}
                <View style={styles.filterContainer}>
                    <View style={styles.searchInputContainer}>
                        <Input iconName="search" placeholder='Search ARKO' value={searchTerm} onChangeText={setSearchTerm}/>
                    </View>
                </View>

                {/* Boat List */}
                <ScrollView 
                    contentContainerStyle={styles.boatList} 
                    style={styles.scrollView} 
                    nestedScrollEnabled
                >
                    {processedBoats.length === 0 ? (
                        <ThemedText style={styles.empty} type="subtitle"><Ionicons style={styles.emptyIcon} name='information-circle' size={24}/> No ARKO found</ThemedText>
                    ) : (
                        processedBoats.map((boat : any) => (
                            <TouchableOpacity 
                                key={boat.id} 
                                style={styles.boatItem}
                                onPress={() => onBoatPress(boat.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.boatIconContainer}>
                                    <Ionicons name="boat" style={styles.boatIcon} />
                                    {boat.isOnline && <View style={styles.onlineIndicator} />}
                                </View>
                                <View style={styles.boatInfo}>
                                    <ThemedText style={styles.boatName}>{boat.name}</ThemedText>
                                    <ThemedText type="fade" style={styles.boatStatus}>
                                        • {`${boat.details?.distanceFromUser} distance`}, Last updated: {boat.details.lastUpdate}
                                    </ThemedText>
                                    <ThemedText type="fade" style={styles.boatLocation}>
                                        {boat.details.address || 'Location unavailable'}
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" style={styles.arrowIcon} />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
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
    scrollView: {
        flexGrow: 1,
    },
    boatList: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    boatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    boatIconContainer: {
        position: 'relative',
        marginRight: 12,
    },
    boatIcon: {
        fontSize: 24,
        color: "#277CA5",
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    boatInfo: {
        flex: 1,
    },
    boatName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    boatStatus: {
        fontSize: 12,
        marginTop: 2,
    },
    boatLocation: {
        fontSize: 12,
        marginTop: 2,
    },
    arrowIcon: {
        fontSize: 20,
        color: "#277CA5",
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    searchInputContainer: {
        flex: 1,
        paddingHorizontal: 12,
        marginRight: 8,
        alignItems: 'center',
    }, 
    empty:{
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        flexDirection: 'row', 
    },
    emptyIcon:{
        marginRight: 8,
        top: -5,
    }
});

export default BoatListBottomSheet;