import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { Theme } from '../../styles/theme';
import { Occasion, Attendance } from '../../types/apiTypes';
import { useAuth } from "../../context/AuthContext";
import useAttendance from "../../hooks/useAttendance";
import { calculateTotalActiveHours, calculatePresence } from "../../utils/activityUtils";


interface ActivityItem {
    id: string;
    title: string;
    value: string;
    height: number;
}

const activityData: ActivityItem[] = [
    { id: '1', title: 'Total Hours Attended', value: '45 hrs', height: 150 },
    { id: '2', title: 'Sessions Attended', value: 'Science Fair', height: 150 },

];

interface ActivityComponentProps {
    occasions: Occasion[];
    attendances: Attendance[]
}

const ActivityComponent: React.FC<ActivityComponentProps> = ({ occasions, attendances }) => {

    const { userData } = useAuth();
    const [totalHours, setTotalHours] = useState('0 hrs');
    const [attendanceRatio, setAttendanceRatio] = useState('0/0');



    console.log("Raw attendances received:", attendances);

    // Ensure attendances is an array
    const convertedAttendances = Array.isArray(attendances) ? attendances : [];
    console.log("Converted attendances:", convertedAttendances);


    useEffect(() => {
        if (userData && userData._id) {
            const total = calculateTotalActiveHours(userData._id, attendances);
            setTotalHours(`${Math.floor(total)} hrs`);

            const ratio = calculatePresence(userData._id, attendances);
            setAttendanceRatio(ratio);
        }
    }, [attendances, userData]);

    activityData[0].value = totalHours;
    activityData[1].value = attendanceRatio;

    return (
        <>
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
                        <Text style={styles.value}>{item.value}</Text>
                    </TouchableOpacity>
                )}
            />

        </>

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
