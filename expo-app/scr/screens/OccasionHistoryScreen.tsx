import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { OccasionHistoryScreenRouteProp } from "../types/navigationTypes";
import { Theme } from "../styles/theme";
import { Header, SafeAreaWrapper } from "../components/common";
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAttendance from "../hooks/useAttendance";

const OccasionHistoryScreen: React.FC = () => {
    const route = useRoute<OccasionHistoryScreenRouteProp>();
    const occasion = route.params.occasion;
    const { fetchAttendancesByOccasionId, occasionsAttendances, loading, error } = useAttendance();

    const [sessions, setSessions] = useState<{ month: string; day: string; }[]>([]);

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
        }
    }, [occasionsAttendances]);

    const handleHeaderScroll = (event) => {
        if (bodyScrollRef.current) {
            bodyScrollRef.current.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
        }
    };

    const handleBodyScroll = (event) => {
        if (headerScrollRef.current) {
            headerScrollRef.current.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
        }
    };

    return (
        <SafeAreaWrapper>
            <Header title="History" />

            <View style={styles.container}>
                <View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {occasionsAttendances === null ? (
                        <Text>No attendances found for this occasion.</Text>
                    ) : (

                        <View style={styles.table}>

                            <View style={styles.tabelHeaderContaine}>
                                <View style={styles.tableHeaderCellFirst}>
                                    <Text style={styles.participantsText}>
                                        Participants
                                    </Text>
                                </View>

                                <ScrollView
                                    horizontal
                                    ref={headerScrollRef}
                                    onScroll={handleHeaderScroll}
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {sessions.map((session, index) => (
                                        <View key={index} style={styles.tableHeaderCell}>
                                            <Text style={styles.monthText}>{session.month}</Text>
                                            <Text style={styles.dayText}>{session.day}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={styles.tablaeCellContainer}>
                                    <View>
                                        {Array.from(participants.entries()).map(([name], index) => (
                                            <View key={index} style={styles.tableRow}>
                                                <Text style={styles.fixedColumn}>{name}</Text>
                                            </View>
                                        ))}


                                    </View>

                                    <ScrollView
                                        horizontal
                                        onScroll={handleBodyScroll}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        <View>
                                            {Array.from(participants.entries()).map(([name, attendance], index) => (
                                                <View key={index} style={styles.tableRow}>
                                                    {attendance.map((status, sessionIndex) => (
                                                        <View
                                                            key={sessionIndex}
                                                            style={[
                                                                styles.tableCell,
                                                                status === "absent" ? styles.absent :
                                                                    status === "present" ? styles.present :
                                                                        status === "" ? styles.empty : styles.default
                                                            ]}
                                                        >
                                                            {status === "absent" ? (
                                                                <Ionicons name="close-circle-outline" size={20} color={Theme.colors.red} />
                                                            ) : status === "present" ? (
                                                                <Ionicons name="checkmark-circle-outline" size={20} color={Theme.colors.green} />
                                                            ) : (
                                                                <Ionicons name="help-circle-outline" size={20} color={Theme.colors.yellow} />
                                                            )}
                                                        </View>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>

                                </View>
                            </ScrollView>

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
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: Theme.colors.textLight,
    },

    errorText: {
        color: "red",
        marginTop: 16,
    },

   

    table: {
        height: 600,
        backgroundColor: "transparent",

    },

    tabelHeaderContaine: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },

    tableHeaderCellFirst: {
        width: 150,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Theme.borderRadius.inbetween,
        backgroundColor: Theme.colors.primary,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,


    },

    tableHeaderCell: {
        width: 55,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Theme.margin.extraSmall,
        borderRadius: Theme.borderRadius.inbetween,
        backgroundColor: Theme.colors.primary,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,

    },
    monthText: {
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
        textAlign: "center",
    },
    dayText: {
        fontSize: Theme.fontSize.extraExtraLarge,
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        textAlign: "center",
    },
    participantsText: {

        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        textAlign: "center",
    },

    tablaeCellContainer: {
        flexDirection: 'row',
    },
    tableCell: {
        width: 55,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Theme.margin.extraSmall,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: Theme.padding.small,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",

    },

    fixedColumn: {
        width: 150,
        height: 40,
        paddingVertical: 12,
        textAlign: "center",
        justifyContent: 'center',
        color: "#fff",
    },

    absent: {
        alignItems: "center",
        borderRadius: Theme.borderRadius.inbetween,
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(255, 0, 0, 0.2)",

    },

    present: {
        alignItems: "center",
        borderRadius: Theme.borderRadius.inbetween,
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(0, 255, 0, 0.2)",
    },

    empty: {

        alignItems: "center",
        borderRadius: Theme.borderRadius.inbetween,
        backgroundColor: "rgba(255, 255, 0, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 0, 0.2)",

    },

    default: {

    },



});

export default OccasionHistoryScreen;
