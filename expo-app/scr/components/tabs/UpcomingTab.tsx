import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useAttendance from '../../hooks/useAttendance';
import { useFocusEffect } from '@react-navigation/native';
import ActiveAttendanceCard from '../occasion/ActiveOccasionCard';
import NextOccasionCard from '../occasion/NextOccasionCard';
import TimelineOccasionCard from '../occasion/TimelineOccasionCard';

const UpcomingTab = ({ occasions, occasionInstances }) => {
    const { userData } = useAuth();
    const hasLogged = useRef(false);
    const [refresh, setRefresh] = useState(false);
    

    const { studentsActiveAttendances = [], fetchStudentActiveAttendances, teachersActiveAttendances = [], fetchTeachersActiveAttendance } = useAttendance();

    const fetchAttendances = useCallback(() => {
        if (userData) {
            const fetchFunc = userData.type === "STUDENT" ? fetchStudentActiveAttendances : fetchTeachersActiveAttendance;
            fetchFunc(userData._id);
        }
    }, [userData, fetchStudentActiveAttendances, fetchTeachersActiveAttendance]);

    useFocusEffect(
        useCallback(() => {
            if (!hasLogged.current) {
                fetchAttendances();
                hasLogged.current = true;
            }
        }, [fetchAttendances])
    );

    useFocusEffect(
        useCallback(() => {
            fetchAttendances();
            hasLogged.current = true;
        }, [refresh])
    );

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAttendances();
        setRefreshing(false);
    };
    

    const activeAttendances = userData?.type === "STUDENT" ? (studentsActiveAttendances || []) : (teachersActiveAttendances || []);


    return (
        <ScrollView

            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {activeAttendances.length > 0 ? (
                activeAttendances.map(attendance => {
                    const occasion = occasions.find(occ => occ._id === attendance.occasionId);
                    return (
                        <View key={attendance.occasionId}>
                            <ActiveAttendanceCard attendance={attendance} occasion={occasion} setRefresh={setRefresh} />
                        </View>
                    );
                })
            ) : (
                <NextOccasionCard occasions={occasionInstances} setRefresh={setRefresh} />
            )}
            <TimelineOccasionCard occasions={occasionInstances} />
        </ScrollView>
    );
};

export default UpcomingTab;

