import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Theme } from "../../styles/theme";
import { HistoryTableBodyProps } from '../../types'



const HistoryTableBody: React.FC<HistoryTableBodyProps> = ({ participants, sessionsLength, handleBodyScroll }) => (
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.tableBodyContainer}>
            <View style={styles.tableHeaderCellFirst}>
                {Array.from(participants.entries()).map(([name, attendance], index, arr) => {
                    const totalSessions = attendance.length;
                    const presentCount = attendance.filter(status => status === "present").length;
                    return (
                        <View key={index} style={[styles.tableFirstCol, index !== arr.length - 1 && styles.borderBottom]}>
                            <Text style={styles.fixedColumnLabel}>{name}</Text>
                            <Text style={[styles.fixedColumnCount, styles.fixedColumnLabel]}>{`${presentCount}/${totalSessions}`}</Text>
                        </View>
                    );
                })}

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
        width: 180,
        borderRightWidth: 1,
        borderRightColor: Theme.colors.borderColor

    },

    tableFirstCol: {
        flexDirection: "row",
        width: 170,
        height: 50,
        alignItems: "center",
        justifyContent: "space-between",


    },

    fixedColumnLabel: {
        color: Theme.colors.text.light,
    },

    fixedColumnCount: {
        color: Theme.colors.textLight,
        fontSize: 12,
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
