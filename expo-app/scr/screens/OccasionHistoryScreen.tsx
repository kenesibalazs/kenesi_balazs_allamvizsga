import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { OccasionHistoryScreenRouteProp } from "../types/navigationTypes";
import { HistoryTableBody, HistoryTableHeader } from '../components/history'
import { Header, SafeAreaWrapper, SmallDataCard } from "../components/common";
import { handleHeaderScroll, handleBodyScroll } from '../utils';
import { Theme } from "../styles/theme";
import { useAttendance } from "../hooks";

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
        const loadAttendances = async () => {
            if (occasion?.attendances?.length > 0) {
                try {
                    await fetchAttendancesByOccasionId(occasion._id);
                } catch (error) {
                    console.error("Failed to fetch attendances:", error);
                }
            }
        };

        loadAttendances();
    }, [occasion, fetchAttendancesByOccasionId]);

    useEffect(() => {
        if (!occasionsAttendances || occasionsAttendances.length === 0) return;

        const sessionDates = occasionsAttendances.map(session => {
            const date = new Date(session.startTime);
            return {
                month: date.toLocaleDateString("en-US", { month: "short" }),
                day: date.toLocaleDateString("en-US", { day: "numeric" })
            };
        });

        const participantsMap = new Map<string, string[]>();

        const attendanceData = occasionsAttendances.map(session => ({
            value: session.participants.filter(p => p.status === "present").length
        }));

        occasionsAttendances.forEach((session, sessionIndex) => {
            session.participants.forEach(participant => {
                const participantName = typeof participant.userId === "object"
                    ? participant.userId.name
                    : "Unknown Participant";

                if (!participantsMap.has(participantName)) {
                    participantsMap.set(participantName, new Array(sessionDates.length).fill(""));
                }

                participantsMap.get(participantName)![sessionIndex] = participant.status;
            });
        });

        setSessions(sessionDates);
        setParticipants(participantsMap);
        setAttendanceCounts(attendanceData);
    }, [occasionsAttendances]);


    return (
        <SafeAreaWrapper>

            <Header
                title="History"
                leftIcon={"arrow-back"}
                onLeftPress={() => navigation.goBack()}

            />


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
        padding: 8,

    },
    errorText: {
        color: "red",
        marginTop: 16,
    },
    table: {
        maxHeight: 590,
        backgroundColor: Theme.colors.primaryTransparent,
        borderWidth: 1,
        borderRadius: Theme.borderRadius.extraLarge,
        borderColor: Theme.colors.borderColor,
        overflow: 'hidden',

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
