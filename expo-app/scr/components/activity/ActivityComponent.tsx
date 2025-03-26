import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';


import { calculateTotalActiveHours, calculatePresencePercentage, totalHoursHeldByTeacher, totalSessionsHeldByTeacher } from "../../utils";
import { ActivityItem, Occasion, Attendance } from '../../types';
import { useAuth } from "../../context/AuthContext";
import { Theme } from '../../styles/theme';




const activityData: ActivityItem[] = [
    { id: '1', title: '', value: '', height: 150 },
    { id: '2', title: '', value: '', height: 150 },

];

interface ActivityComponentProps {
    occasions: Occasion[];
    attendances: Attendance[]
}

const ActivityComponent: React.FC<ActivityComponentProps> = ({ occasions, attendances }) => {

    const { userData } = useAuth();

    if (!userData) {
        return null;
    }

    if (userData && userData.type === "STUDENT") {

        const totalHours = useMemo(() => {
            return userData && userData._id
                ? `${Math.floor(calculateTotalActiveHours(userData._id, attendances))} hrs`
                : '0 hrs';
        }, [attendances, userData]);

        const attendancePercentage = useMemo(() => {
            if (userData && userData._id) {
                const percentage = parseFloat(calculatePresencePercentage(userData._id, attendances).replace('%', ''));
                return percentage;
            }
            return 0;
        }, [attendances, userData]);

        activityData[0].title = 'Total Hours Attended';
        activityData[0].value = totalHours;
        activityData[1].title = 'Sessions Attended';
        activityData[1].value = `${attendancePercentage}%`
    } else {

        const totalHoursHeld = useMemo(() => {
            return userData && userData._id
                ? `${Math.floor(totalHoursHeldByTeacher(userData._id, attendances))} hrs`
                : '0 hrs';
        }, [attendances, userData]);

        const totalSessionHeld = useMemo(() => {
            if (userData && userData._id) {
                const percentage = totalSessionsHeldByTeacher(userData._id, attendances);
                return percentage;
            }
            return 0;
        }, [attendances, userData]);

        activityData[0].title = 'Total Hours Held';
        activityData[0].value = totalHoursHeld;
        activityData[1].title = 'Sessions Held';
        activityData[1].value = `${totalSessionHeld}`

    }



    const getAttendanceColor = (percentage: number): string => {
        if (percentage < 25) {
            return Theme.colors.red;
        } else if (percentage < 50) {
            return Theme.colors.yellow;
        } else if (percentage < 75) {
            return Theme.colors.orange;
        } else {
            return Theme.colors.green;
        }
    };


    return (
        <View style={Theme.globalStyles.dataContainer}>
            <Text style={styles.headerLabel}>{'Semester activities'.toUpperCase()}</Text>
            <MasonryList
                data={activityData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item, i }: { item: ActivityItem; i: number }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            { height: item.height, marginBottom: 12 },
                            parseInt(item.id) % 2 === 1 ? { marginRight: 6 } : { marginLeft: 6 }
                        ]}
                    >
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={[styles.value,]}>{item.value}</Text>
                    </TouchableOpacity>
                )}
            />

        </View>

    );
};

const styles = StyleSheet.create({
    headerLabel: {
        fontSize: Theme.fontSize.large,
        marginBottom: Theme.margin.medium,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.textLight,
    },

    card: {
        backgroundColor: Theme.colors.primaryTransparent,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Theme.borderRadius.large,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,

    },
    title: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.text.light,
        textAlign: 'center',
    },
    value: {
        fontSize: Theme.fontSize.largest,
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default ActivityComponent;
