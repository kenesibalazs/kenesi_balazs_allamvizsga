import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OccasionHistoryScreenRouteProp } from "../types/navigationTypes";
import { Theme } from "../styles/theme";
import { Header, SafeAreaWrapper, SmallDataCard } from "../components/common";

import HistoryTableHeader from "../components/history/HistoryTableHeader"
import HistoryTableBody from "../components/history/HistoryTableBody"
import useAttendance from "../hooks/useAttendance";
import { handleHeaderScroll, handleBodyScroll } from "../utils/scrollUtils";
import { Ionicons } from '@expo/vector-icons';

const OccasionHistoryScreen: React.FC = () => {
    const route = useRoute<OccasionHistoryScreenRouteProp>();
    const occasion = route.params.occasion;
    const { fetchAttendancesByOccasionId, occasionsAttendances, loading, error } = useAttendance();
    const navigation = useNavigation();

    const [sessions, setSessions] = useState<{ month: string; day: string }[]>([]);
    const [attendanceCounts, setAttendanceCounts] = useState<{ value: number }[]>([]);

    const [participants, setParticipants] = useState<Map<string, string[]>>(new Map());

    const headerScrollRef = useRef<ScrollView | null>(null);
    const bodyScrollRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        if (occasion?.attendances && occasion.attendances.length > 0) {
            fetchAttendancesByOccasionId(occasion._id);
        }
    }, [occasion]);

    useEffect(() => {
        if (occasionsAttendances && occasionsAttendances.length > 0) {
            const sessionDates = occasionsAttendances.map(session => {
                const date = new Date(session.startTime);
                return {
                    month: date.toLocaleDateString("en-US", { month: "short" }),
                    day: date.toLocaleDateString("en-US", { day: "numeric" })
                };
            });

            const participantsMap = new Map<string, string[]>();

            const attendanceData = occasionsAttendances.map(session => {
                const presentCount = session.participants.filter(p => p.status === "present").length;
                return { value: presentCount };
            });

            occasionsAttendances.forEach((session, sessionIndex) => {
                session.participants.forEach((participant) => {
                    const participantName = typeof participant.userId === "object" ? participant.userId.name : "Unknown Participant";

                    if (!participantsMap.has(participantName)) {
                        participantsMap.set(participantName, new Array(sessionDates.length).fill(""));
                    }

                    participantsMap.get(participantName)![sessionIndex] = participant.status;
                });
            });

            setSessions(sessionDates);
            setParticipants(participantsMap);
            setAttendanceCounts(attendanceData);
        }
    }, [occasionsAttendances]);


    const chartWidth = 340;
    const dynamicSpacing = attendanceCounts.length > 0 ? chartWidth / attendanceCounts.length : 40;


    return (
        <SafeAreaWrapper>

            <Header
                title="History"
                leftIcon={"arrow-back"}
                onLeftPress={() => navigation.goBack()}

            />

            <View style={styles.controlContainer}>
                <View>
                    <Text>{typeof occasion.subjectId === "object" ? occasion.subjectId.name : occasion.subjectId}</Text>
                    <Text>
                        {Array.isArray(occasion.groupIds)
                            ? occasion.groupIds.map(group => (typeof group === "object" ? group.name : group)).join(", ")
                            : occasion.groupIds}
                    </Text>


                </View>
                <View style={styles.controls}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search by name"
                        placeholderTextColor={Theme.colors.text.light}
                    />


                    <TouchableOpacity style={styles.modalButton}>
                        <Ionicons name="swap-vertical-outline" size={18} color={Theme.colors.text.light} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton}>
                        <Ionicons name="funnel-outline" size={18} color={Theme.colors.text.light} />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.container}>




                <View style={styles.participantsTabel}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {occasionsAttendances === null ? (
                        <Text>No attendances found for this occasion.</Text>
                    ) : (
                        <View style={styles.table}>
                            <HistoryTableHeader
                                sessions={sessions}
                                headerScrollRef={headerScrollRef}
                                handleHeaderScroll={(event) => handleHeaderScroll(event, bodyScrollRef)}
                            />
                            <HistoryTableBody
                                participants={participants}
                                sessionsLength={sessions.length}
                                handleBodyScroll={(event) => handleBodyScroll(event, headerScrollRef)}
                            />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        color: "red",
        marginTop: 16,
    },
    table: {
        backgroundColor: "transparent",
    },

    participantsTabel: {
    },


    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    searchBar: {
        backgroundColor: "rgba(2, 2, 2, 0.1)",
        height: 35,
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.bold,
    },

    modalButton: {
        backgroundColor: "rgba(2, 2, 2, 0.1)",
        padding: 8,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        height: 35,
        color: 'black',
    },


    controlContainer: {
        alignItems: "center",
        backgroundColor: Theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,

    },
});

export default OccasionHistoryScreen;
