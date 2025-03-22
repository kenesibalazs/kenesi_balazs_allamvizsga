import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, RefreshControl, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useAttendance from '../../hooks/useAttendance';
import { useFocusEffect } from '@react-navigation/native';
import ActiveAttendanceCard from '../occasion/ActiveOccasionCard';
import NextOccasionCard from '../occasion/NextOccasionCard';
import TimelineOccasionCard from '../occasion/TimelineOccasionCard';
import ActivityComponent from '../activity/ActivityComponent';

import { Theme } from '../../styles/theme';
const MainTab = ({ occasions, occasionInstances, userAttendances, userActiveAttendances, fetchData }) => {
    const { userData } = useAuth();
    const hasLogged = useRef(false);
    const [refresh, setRefresh] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchData();
            setRefreshKey(prevKey => prevKey + 1); 
        } catch (error) {
            console.error("Refresh Error:", error);
        } finally {
            setTimeout(() => setRefreshing(false), 500);
        }
    }, [fetchData]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchAndUpdate = async () => {
                setRefreshing(true);
                await fetchData();
                if (isActive) setRefreshing(false);
            };
            fetchAndUpdate();

            return () => {
                isActive = false;
            };
        }, [fetchData])
    );


    const activeAttendances = (userActiveAttendances || [])


    return (
        <ScrollView
            key={refreshKey}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {activeAttendances.length > 0 ? (
                activeAttendances.map(attendance => {
                    const occasion = occasions.find(occ => occ._id === attendance.occasionId);
                    return (
                        <View key={attendance.occasionId}>
                            <ActiveAttendanceCard attendance={attendance} occasion={occasion} onRefresh={onRefresh} />
                        </View>
                    );
                })
            ) : (
                <NextOccasionCard occasions={occasionInstances} onRefresh={onRefresh}  />
            )}
            <TimelineOccasionCard occasions={occasionInstances} />

            <View style={styles.container}>
                <ActivityComponent occasions={occasions} attendances={userAttendances} />

            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({

    container: {
        padding: Theme.padding.medium,
    },

})

export default MainTab;

