import React, { useState, useCallback } from "react";
import { 
    View, 
    SafeAreaView, 
    useColorScheme, 
    StyleSheet, 
    ScrollView, 
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/utils/components/themeUI/ThemedText";
import { ThemedView } from "@/utils/components/themeUI/ThemedView";
import { secondaryColor } from '@/constants/Colors';
import NotificationCard from "@/utils/components/view/notif";
import useLongPolling from "@/hooks/notifLongPolling";

const NotificationPage = () => {
    const colorScheme = useColorScheme();
    const { data: notifications, loading, error, refetch } = useLongPolling();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6' }]}>
            <ScrollView 
                contentContainerStyle={[
                styles.contentContainer, 
                notifications.length === 0 && styles.emptyContentContainer
                ]}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[secondaryColor]}
                    tintColor={colorScheme === 'dark' ? '#ffffff' : secondaryColor}
                />
                }
            >
                {notifications.length > 0 ? (
                notifications.map((notification : any, index) => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                        isLastItem={index === notifications.length - 1}
                    />
                ))
                ) : (
                <ThemedView style={styles.emptyContainer}>
                    <Ionicons
                    name="notifications-off-outline"
                    size={24}
                    color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                    />
                    <ThemedText style={styles.emptyText}>
                    No recent notifications. Pull up to refresh
                    </ThemedText>
                </ThemedView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 8,
    },
    emptyContentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        flexDirection: 'row',
        gap: 8
    },
    emptyText: {
        fontSize: 16,
        fontFamily: "CeraPro_Medium",
    },
});

export default NotificationPage;