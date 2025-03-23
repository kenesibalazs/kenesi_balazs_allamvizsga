import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from "../../styles/theme";

interface HistoryTableBodyProps {
    participants: Map<string, string[]>;
    sessionsLength: number;
    handleBodyScroll: (event: any) => void;
}

const HistoryTableBody: React.FC<HistoryTableBodyProps> = ({ participants, sessionsLength, handleBodyScroll }) => (
    <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    >
        <View style={styles.tableCellContainer}>
            <View>
                {Array.from(participants.entries()).map(([name], index) => (
                    <View key={index} style={styles.tableFirstCol}>
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
);

const styles = StyleSheet.create({
    tableCellContainer: {
        flexDirection: 'row',
    },

    tableFirstCol: {
        flexDirection: "row",
        paddingVertical: Theme.padding.extraSmall,
        backgroundColor: 'transparent',
        zIndex: 10,
        overflow: "hidden",
    },


    fixedColumn: {
        width: 150,
        height: 40,
        paddingVertical: 12,
        textAlign: "center",
        justifyContent: 'center',
        color: "#fff",
        // borderRadius: Theme.borderRadius.inbetween,
        // borderWidth: 1,
        // borderColor: Theme.colors.borderColor,
        // backgroundColor: Theme.colors.primary,

    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: Theme.padding.extraSmall,
    },

    tableCell: {
        width: 55,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Theme.margin.extraSmall,
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
    default: {},
});

export default HistoryTableBody;
