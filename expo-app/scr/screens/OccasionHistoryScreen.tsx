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
                <View style={styles.occasionOverview}>
                    <SmallDataCard
                        leading={{ iconName: "book-outline" }}
                        label="Subject"
                        data={[{ value: typeof occasion.subjectId === "string" ? occasion.subjectId : occasion.subjectId?.name || "N/A" }]}
                    />
                    <SmallDataCard
                        leading={{ iconName: "person-outline" }}
                        label="Teacher"
                        data={[{ value: typeof occasion.teacherId === "string" ? occasion.teacherId : occasion.teacherId?.name || "N/A" }]}
                    />
                    <SmallDataCard
                        leading={{ iconName: "people-outline" }}
                        label="Group"
                        data={[
                            {
                                value: Array.isArray(occasion.groupIds)
                                    ? occasion.groupIds.map(g => typeof g === "string" ? g : g.name).join(", ")
                                    : "N/A"
                            }
                        ]}
                    />


                </View>
            </View>


            <View style={styles.participantsTabel}>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {occasionsAttendances === null ? (
                    <Text style={{ textAlign: 'center', color: Theme.colors.text.main, padding: 16 }}>
                        No attendances found for this occasion.
                    </Text>
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

        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Theme.padding.medium,
    },
    errorText: {
        color: "red",
        fontFamily: Theme.fonts.bold,
        fontSize: Theme.fontSize.medium,
        textAlign: 'center',
    },
    table: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Theme.colors.borderColor,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    occasionOverview: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    participantsTabel: {
        flex: 1,
        marginTop: 16,
    },
});

export default OccasionHistoryScreen;
