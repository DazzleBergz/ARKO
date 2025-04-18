import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '../themeUI/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { accentColorLight, CardsColors, danger, lightAccent, primaryColor, secondaryColor, success, warning } from '@/constants/Colors';
import Button from '../buttons/button';

type RequestStatus = 'Ongoing' | 'En Route';

interface RequestData {
    created_at?: string;
    type?: string;
    description?: string;
    number?: string;
    status: string;
}

interface CurrentStatusCardProps {
    status: RequestStatus;
    requestData: RequestData;
    onCancelRequest?: () => void;
    showCancelButton?: boolean;
    cardStyle?: object;
    textColor?: string;
}

const CurrentStatusCard: React.FC<CurrentStatusCardProps> = ({
    status = 'Ongoing',
    requestData,
    onCancelRequest,
    showCancelButton = true,
    cardStyle,
    textColor = lightAccent
}) => {
    const colorScheme = useColorScheme();
    
    const isUrgent = requestData.type?.includes('SOS');

    const getStatusConfig = (status: RequestStatus) => {
        switch (status) {
            case 'Ongoing':
                return {
                    icon: 'alert-circle',
                    color: warning,
                    text: 'Ongoing'
                };
            case 'En Route':
                return {
                    icon: 'alert-circle',
                    color: warning,
                    text: 'En Route'
                };
            default:
                return {
                    icon: 'alert-circle',
                    color: warning,
                    text: 'Ongoing'
                };
        }
    };

    const statusConfig = getStatusConfig(status);

    const renderDetail = (label: string, value?: string) => {
        if (!value) return null;
        return (
            <View style={styles.detailsContainer}>
                <ThemedText style={[styles.detailText, { color: textColor }]}>{label}:</ThemedText>
                <ThemedText style={[styles.details, { color: textColor }]}>{value}</ThemedText>
            </View>
        );
    };

    return (
        <View style={[
            styles.card,
            { backgroundColor: isUrgent ? primaryColor : primaryColor },
            isUrgent && styles.urgentCard,
            cardStyle
        ]}>
            {isUrgent && (
                <View style={styles.urgentBanner}>
                    <Ionicons name="warning" size={16} color="#FFF" />
                    <ThemedText style={styles.urgentText}>EMERGENCY REQUEST</ThemedText>
                </View>
            )}
            
            <View style={[
                styles.cardContent,
                isUrgent && styles.urgentContent
            ]}>
                <View style={styles.statusContainer}>
                    <Ionicons 
                        name={statusConfig.icon} 
                        size={24} 
                        color={isUrgent ? danger : statusConfig.color} 
                    />
                    <ThemedText 
                        style={[
                            styles.statusText, 
                            { color: isUrgent ? danger : statusConfig.color }
                        ]}
                    >
                        {statusConfig.text}
                    </ThemedText>
                </View>

                <View style={styles.detailsWrapper}>
                    {renderDetail(
                    'Date Requested', 
                        new Date(requestData.created_at).toLocaleString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            second: '2-digit', 
                            hour12: true 
                        })
                    )}
                    {renderDetail('Type', requestData.type?.includes('SOS') ? 'Urgent Request SOS' : requestData.type)}
                    {renderDetail('No. of People', requestData.number || "No info")}
                    {renderDetail('Description', requestData.description || "No additional info")}
                </View>

                {showCancelButton && requestData.status === 'Ongoing' && (
                    <View style={styles.btnCancel}>
                        <Button 
                            title="Cancel Request" 
                            type="danger" 
                            onPress={onCancelRequest}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    urgentCard: {
        borderWidth: 2,
        borderColor: danger,
    },
    urgentBanner: {
        backgroundColor: danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        gap: 8,
    },
    urgentText: {
        color: '#FFF',
        fontFamily: "CeraPro_Bold",
        fontSize: 14,
    },
    cardContent: {
        padding: 20,
    },
    urgentContent: {
        backgroundColor: primaryColor,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    statusText: {
        marginLeft: 8,
        fontSize: 18,
        fontFamily: "CeraPro_Bold"
    },
    detailsWrapper: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    detailsContainer: {
        gap: 6,
        flexDirection: "row",
        width: "auto",
        marginBottom: 10
    },
    detailText: {
        fontSize: 14,
        fontFamily: "CeraPro_Bold",
        minWidth: 110,
    },
    details: {
        fontSize: 14,
        flex: 1,
    },
    btnCancel: {
        marginVertical: 10,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    }
});

export default CurrentStatusCard;