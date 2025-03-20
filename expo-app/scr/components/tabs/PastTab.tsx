import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../../context/AuthContext";
import useAttendance from "../../hooks/useAttendance";
import Ionicons from "react-native-vector-icons/Ionicons"
import { SmallDataCard } from "../common";
import { Theme } from "../../styles/theme";

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

    const attendancesArray = Array.isArray(stundetsPastAttendances) ? stundetsPastAttendances : [];

    const groupedAttendances = attendancesArray.reduce((acc, attendance) => {
        if (!attendance.startTime) return acc;
        const dateKey = new Date(attendance.startTime).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(attendance);
        acc[dateKey].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
   
        return acc;
    }, {} as Record<string, typeof attendancesArray>);

    const attendanceEntries = Object.entries(groupedAttendances)
        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()); 

    const visibleEntries = showAll ? attendanceEntries : attendanceEntries.slice(0, 7);

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
                    <View style={styles.header} key={"header"}>
                        <Text style={styles.headerText}>PAST ATTENDANCES</Text>
                        {attendanceEntries.length > 2 && (
                            <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.seeAllButton}>
                                <Text style={styles.seeAllText}>{showAll ? "See less" : "See more"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {visibleEntries.map(([date, attendances], index) => (
                        <>

                            <SmallDataCard
                                key={date}

                                leading={date.split(" ").slice(1, 3).join("\n")}
                                data={attendances.map((attendance) => {
                                    const subjectName = typeof attendance.subjectId === "object" ? attendance.subjectId.name || "Unknown Subject" : "Unknown Subject";
                                    const startTime = new Date(attendance.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                    const endTime = attendance.endTime
                                        ? new Date(attendance.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                        : "Ongoing";

                                    const userParticipant = attendance.participants?.find(
                                        (p) => p.userId && typeof p.userId === "object" && p.userId._id === userData?._id
                                    );
                                    const status = userParticipant?.status || "Unknown";

                                    return {
                                        topLabel: `${startTime} - ${endTime}`,
                                        value: subjectName,
                                        abbsenceLabel: status,
                                        onPressFunction: () => console.log("Card clicked for attendace ID:", attendance._id),
                                    };
                                })}

                                showAbsence={true}
                            />


                        </>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

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
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.bold,
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
