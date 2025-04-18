import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '../themeUI/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { CardsColors, danger, secondaryColor, success } from '@/constants/Colors';
import { ThemedView } from '../themeUI/ThemedView';

type EmergencyActivity = {
    type: string;
    updated_at: string;
    icon: any;
    status: 'Cancelled' | 'Completed';
};

type RecentStatusCardProps = {
    activity: EmergencyActivity;
    isLastItem?: boolean;
    cardStyle?: object;
};

const RecentStatusCard: React.FC<RecentStatusCardProps> = ({
    activity,
    isLastItem = false,
    cardStyle,
}) => {
    const colorScheme = useColorScheme();
    const themeColors = CardsColors[colorScheme || 'light'];

    const getStatusConfig = (status: EmergencyActivity['status']) => {
        switch (status) {
            case 'Cancelled':
                return {
                    icon: 'close-circle',
                    color: danger,
                    label: 'Request Cancelled'
                };
            case 'Completed':
                return {
                    icon: 'checkmark-circle',
                    color: success,
                    label: 'Request Completed'
                };
            default:
                return {
                    icon: 'information-circle',
                    color: themeColors.color,
                    label: 'Status Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(activity.status);


    return (
        <ThemedView style={[styles.card, cardStyle]}>
            <View style={[styles.activityItem, !isLastItem && styles.borderBottom]}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: `${statusConfig.color}15` }
                ]}>
                    <Ionicons
                        name={statusConfig.icon}
                        size={24} 
                        color={statusConfig.color}
                    />
                </View>
                <View style={styles.activityContent}>
                    <View style={styles.headerContainer}>
                        <ThemedText style={styles.activityTitle}>
                            {activity.type}
                        </ThemedText>
                        <ThemedText style={[styles.statusLabel, { color: statusConfig.color }]}>
                            {statusConfig.label}
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.activityTime, { color: themeColors.color }]}>
                        {new Date(activity.updated_at).toLocaleString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                        })}
                    </ThemedText>
                </View>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
    },
    activityItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContent: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    activityTitle: {
        fontSize: 15,
        fontFamily: "CeraPro_Bold",
    },
    statusLabel: {
        fontSize: 13,
        fontFamily: "CeraPro_Medium",
    },
    activityTime: {
        fontSize: 13,
        fontFamily: "CeraPro_Light",
    },
});

export default RecentStatusCard;