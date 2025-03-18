import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../../context/AuthContext";
import useAttendance from "../../hooks/useAttendance";
import Ionicons from "react-native-vector-icons/Ionicons";

const PastTab = () => {
    const { userData } = useAuth();
    const { stundetsPastAttendances, fetchStundetsPastAttendances, loading, error } = useAttendance();
    const [showAll, setShowAll] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (userData && userData._id) {
            fetchStundetsPastAttendances(userData._id);
        }
    }, [userData]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (userData && userData._id) {
            await fetchStundetsPastAttendances(userData._id);
        }
        setRefreshing(false);
    };

    // Ensure the attendances are an array
    const attendancesArray = Array.isArray(stundetsPastAttendances) ? stundetsPastAttendances : [];

    // Group attendances by date
    const groupedAttendances = attendancesArray.reduce((acc, attendance) => {
        if (!attendance.startTime) return acc;
        const dateKey = new Date(attendance.startTime).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(attendance);
        return acc;
    }, {} as Record<string, typeof attendancesArray>);

    const attendanceEntries = Object.entries(groupedAttendances);
    const visibleEntries = showAll ? attendanceEntries : attendanceEntries.slice(0, 2);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.error}>{error}</Text>}
            
            {!loading && attendanceEntries.length === 0 && (
                <Text style={styles.noData}>No past attendances found.</Text>
            )}

            {attendanceEntries.length > 0 && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>PAST ATTENDANCES</Text>
                        {attendanceEntries.length > 2 && (
                            <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.seeAllButton}>
                                <Text style={styles.seeAllText}>{showAll ? "See less" : "See more"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {visibleEntries.map(([date, attendances]) => (
                        <View key={date} style={styles.dateGroup}>
                            <Text style={styles.dateHeader}>{date.split(" ").slice(1, 3).join("\n")}</Text>
                            <View style={styles.line}></View>
                            <View style={styles.attendanceContainer}>
                                {attendances.map((attendance, index) => {
                                    let subjectName = "Unknown Subject";
                                    if (attendance.subjectId) {
                                        if (typeof attendance.subjectId === "object" && attendance.subjectId.name) {
                                            subjectName = attendance.subjectId.name;
                                        } else if (typeof attendance.subjectId === "string") {
                                            subjectName = `Subject ID: ${attendance.subjectId}`;
                                        }
                                    }

                                    const userParticipant = attendance.participants?.find(
                                        (p) => p.userId && typeof p.userId === "object" && p.userId._id === userData?._id
                                    );
                                    const status = userParticipant?.status || "Unknown";
                                    const statusColor = status === "Present" ? "green" : status === "Absent" ? "red" : "#555";

                                    return (
                                        <View key={index} style={styles.attendanceCard}>
                                            <View>
                                                <Text style={styles.attendanceTime}>
                                                    {new Date(attendance.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                                                    {attendance.endTime ? new Date(attendance.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Ongoing"}
                                                </Text>
                                                <Text style={styles.attendanceTitle}>{subjectName}</Text>
                                                <Text style={[styles.status, { color: statusColor }]}>Your Status: {status}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.arrowButton}>
                                                <Ionicons name="chevron-forward-outline" size={16} color="#A9A9A9" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    seeAllButton: {
        alignItems: "center",
        padding: 8,
    },
    seeAllText: {
        color: "#2196F3",
        fontSize: 14,
        fontWeight: "500",
    },
    dateGroup: {
        flexDirection: "row",
        backgroundColor: "rgba(6, 123, 194, 0.1)",
        marginBottom: 10,
        borderRadius: 12,
        alignItems: "center",
        padding: 8,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "black",
        width: 50,
        marginHorizontal: 8,
    },
    line: {
        height: "90%",
        width: 1,
        backgroundColor: "#A9A9A9",
        marginVertical: "auto",
    },
    attendanceContainer: {
        flex: 1,
    },
    attendanceCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        width: "100%",
        borderRadius: 16,
    },
    attendanceTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "black",
    },
    attendanceTime: {
        fontSize: 13,
        color: "#2196F3",
        fontWeight: "400",
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
    arrowButton: {
        alignItems: "center",
        paddingVertical: 8,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginVertical: 10,
    },
    noData: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginTop: 20,
    },
});

export default PastTab;
