import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    useColorScheme,
    RefreshControl
} from "react-native";
import * as Location from "expo-location";
import { PaperProvider } from "react-native-paper";
import { ThemedText } from "@/utils/components/themeUI/ThemedText";
import CurrentStatusCard from "@/utils/components/cards/currentStatus";
import RecentStatusCard from "@/utils/components/cards/recentStatus";
import { ThemedView } from "@/utils/components/themeUI/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AlertChooseModal from "@/utils/components/modals/AlertChoose";
import { EmergencyRequestManager } from "@/utils/code/async/reqInfo";
import { UserStorage } from "@/utils/code/async/saveInfo";
import AlertModal from "@/utils/components/modals/Alert";
import { updateRequest, userRequests } from "@/constants/config";
import useLongPolling from "@/hooks/notifLongPolling";

interface AlertState {
    visible: boolean;
    message: string;
    icon: string;
    iconColor: string;
    onClose?: () => void;
}

const History = () => {
    const colorScheme = useColorScheme();
    const [recentRequest, setRecentRequests] = useState<any>([]);
    const [currentRequest, setCurrentRequest] = useState<any>(null);
    const [initialLoading, setInitialLoading] = useState<boolean>(true); // Separate initial loading state
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { data: notifications, loading, error, refetch } = useLongPolling();
    const [verificationAlert, setVerificationAlert] = useState<AlertState>({
        visible: false,
        message: '',
        icon: '',
        iconColor: '',
    });
    const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isPollingRef = useRef<boolean>(false);
    const secondaryColor = "#3366FF"; // Adding secondary color for RefreshControl

    //#region Modal
    const [alertModal, setAlertModal] = useState(false);
    const showCancelAlert = () => {
        setAlertModal(true);
    };

    const handleAlertClose = () => {
        setAlertModal(false);
    };

    const handleAlertConfirm = async () => {
        await handleCancelRequest();
        setAlertModal(false);
    };
    //#endregion

    //#region fetch data
    const fetchRequests = async (isRefresh = false) => {
        try {
            // Only show loading indicator on initial load, not during polling or refresh
            if (!isRefresh && !isPollingRef.current) {
                setInitialLoading(true);
            }
            
            const userData : any = await UserStorage.getUserData();
            
            const response = await fetch(`${userRequests}/${userData.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userData?.token}`,
                },
            });
            
            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setVerificationAlert({
                    visible: true,
                    message: `Error fetching requests. ${errorData.message || 'Server Error'}.\nError Code:: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }
            
            const data = await response.json();

            if (data && data.data) {
                const activeRequests = data.data.filter((item: any) => 
                    item.status === 'Ongoing' || item.status === 'En Route'
                );
                setCurrentRequest(activeRequests);
                
                if (activeRequests.length > 0) {
                    await AsyncStorage.setItem("USER_STRANDED_ID", String(activeRequests[0].stranded_id));
                    await refetch();
                }
                
                const recentRequests = data.data.filter((item: any) => 
                    item.status !== 'Ongoing' && item.status !== 'En Route'
                );
                setRecentRequests(recentRequests);
            }

            // Only start long polling if it's not a refresh and not already polling
            if (!isRefresh && !isPollingRef.current) {
                startLongPolling();
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setVerificationAlert({
                visible: true,
                message: 'Error fetching request data. Please try again later.',
                icon: 'warning',
                iconColor: 'red',
            });
        } finally {
            setInitialLoading(false);
            setRefreshing(false);
        }
    };
    //#endregion

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Reset long polling when manually refreshing
        stopLongPolling();
        
        // Immediate fetch without starting the polling cycle
        fetchRequests(true).then(() => {
            // Restart long polling after the refresh completes
            startLongPolling();
        });
    }, []);

    // Function to stop long polling
    const stopLongPolling = useCallback(() => {
        if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = null;
        }
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        isPollingRef.current = false;
    }, []);

    // Function to start long polling
    const startLongPolling = useCallback(() => {
        // Clear any existing polling timers
        stopLongPolling();
        
        // Set flag to indicate polling is active
        isPollingRef.current = true;

        // Set up polling interval (every 3 seconds)
        pollingIntervalRef.current = setInterval(() => {
            fetchRequests(true); // Pass true to indicate it's a polling update
        }, 3000);

        // Set up timer to stop polling after 10 seconds
        pollingTimerRef.current = setTimeout(() => {
            stopLongPolling();
        }, 10000);
    }, []);

    const handleCancelRequest = async () => {
        try {
            const strandedID = currentRequest[0].stranded_id;
            const userData = await UserStorage.getUserData()
            const response = await fetch(`${updateRequest}/${strandedID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userData?.token}`,
                },
                body: JSON.stringify({ 
                    status: "Cancelled",
                    stranded_id: strandedID,
                }),
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                setVerificationAlert({
                    visible: true,
                    message: `Error cancelling request. ${errorData.message || 'Server Error'}.\nError Code:: ${errorData.status}`,
                    icon: "cloud-offline",
                    iconColor: "danger"
                });
                return;
            }

            await AsyncStorage.removeItem("USER_STRANDED_ID");
            const data = await response.json()
            console.log("del: ", data.stranded.status)

            if(data.feedback === 200){
                setCurrentRequest(null);
                setVerificationAlert({
                    visible: true,
                    message: 'Request cancelled successfully',
                    icon: 'checkmark-circle',
                    iconColor: 'success',
                });
                fetchRequests(true);
            } else {
                setVerificationAlert({
                    visible: true,
                    message: 'Failed to cancel request. Please try again. ' + (data.message || ""),
                    icon: 'warning',
                    iconColor: 'red',
                });
                fetchRequests(true);
                return
            }    
        } catch (error) {
            console.error('Error cancelling request:', error);
            setVerificationAlert({
                visible: true,
                message: 'Failed to cancel request. Please try again.',
                icon: 'warning',
                iconColor: 'red',
            });
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchRequests();

        // Cleanup function to clear intervals/timeouts when component unmounts
        return () => {
            stopLongPolling();
        };
    }, []);
    
    // Refresh data when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchRequests();
            return () => {
                // Clean up polling when screen loses focus
                stopLongPolling();
            };
        }, [])
    );

    return (
        <PaperProvider>
            <SafeAreaView style={[styles.container,{backgroundColor: colorScheme === 'dark' ? '#151718' : '#F6F6F6'}]}>
                {initialLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
                        <ThemedText style={styles.loadingText}>Loading requests...</ThemedText>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.contentContainer} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[secondaryColor]}
                            tintColor={colorScheme === 'dark' ? '#ffffff' : secondaryColor}
                        />
                    }>
                        {currentRequest && currentRequest.length > 0 && (
                            <>
                                <ThemedText type="title" style={styles.sectionTitle}>Current Request</ThemedText>
                                <CurrentStatusCard
                                    status={currentRequest[0].status}
                                    requestData={currentRequest[0]}
                                    onCancelRequest={showCancelAlert}
                                    showCancelButton={true}
                                    cardStyle={{ marginHorizontal: 16 }}
                                />
                            </>
                        )}

                        {/* RECENT ACTIVITIES */}
                        <ThemedText type="title" style={styles.recent}>Recent Requests</ThemedText>
                        {recentRequest.length > 0 ? (
                            recentRequest.map((activity: any, index: any) => (
                                <RecentStatusCard
                                    key={index}
                                    activity={activity}
                                    isLastItem={index === recentRequest.length - 1}
                                    cardStyle={{ marginHorizontal: 16 }}
                                />
                            ))
                        ) : (
                            <ThemedView style={styles.emptyContainer}>
                                <Ionicons 
                                    name="information-circle-outline" 
                                    size={24} 
                                    color={colorScheme === 'dark' ? '#ffffff' : '#000000'} 
                                />
                                <ThemedText style={styles.emptyText}>
                                    No recent requests
                                </ThemedText>
                            </ThemedView>
                        )}
                    </ScrollView>
                )}

                <AlertChooseModal 
                    visible={alertModal} 
                    icon="warning" 
                    iconColor="#FF4B4B" 
                    message="Are you sure you want to cancel this request?" 
                    onConfirm={handleAlertConfirm} 
                    onCancel={handleAlertClose} 
                />

                <AlertModal 
                    visible={verificationAlert.visible} 
                    onConfirm={() => setVerificationAlert({...verificationAlert, visible: false})} 
                    icon={verificationAlert.icon} 
                    iconColor={verificationAlert.iconColor} 
                    message={verificationAlert.message}
                />
            </SafeAreaView>
        </PaperProvider>
    );
};

export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "CeraPro_Medium",
    },
    recent:{
        fontFamily: "CeraPro_Bold",
        fontSize: 24,
        marginBottom: 12,
        marginLeft: 12,
    },
    sectionTitle: {
        fontFamily: "CeraPro_Bold",
        fontSize: 24,
        marginBottom: 12,
        marginHorizontal: 16
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        flexDirection: 'row',
        gap: 8
    },
    emptyText: {
        fontSize: 16,
        fontFamily: "CeraPro_Medium",
    }
});