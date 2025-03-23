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
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.tableBodyContainer}>
            <View style={styles.tableHeaderCellFirst}>
                {Array.from(participants.entries()).map(([name], index, arr) => (
                    <View key={index} style={[styles.tableFirstCol, index !== arr.length - 1 && styles.borderBottom]}>
                        <Text style={styles.fixedColumnLabel}>{name}</Text>
                    </View>
                ))}

             

            </View>
            <ScrollView horizontal onScroll={handleBodyScroll} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View>
                    {Array.from(participants.entries()).map(([name, attendance], index) => (
                        <View key={index} style={styles.tableRow}>
                            {attendance.map((status, sessionIndex) => (
                                <View key={sessionIndex} style={styles.tableCell}>
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

    tableBodyContainer: {
        flexDirection: 'row',
        padding: 8,

    },

    tableCellContainer: {
        flexDirection: 'row',
    },

    tableHeaderCellFirst: {
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Theme.colors.borderColor

    },

    tableFirstCol: {
        flexDirection: "row",
        width: 130,
        height: 50,
        alignItems: "center",
        justifyContent: "center",


    },

    fixedColumnLabel: {
        color: Theme.colors.text.light,
    },

    tableRow: {
        flexDirection: "row",


    },

    tableCell: {
        width: 60,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Theme.colors.borderColor,


    },


    borderBottom: {

        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.borderColor,
    }
});

export default HistoryTableBody;
