import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActiveAttendanceCard from '../occasion/ActiveOccasionCard';
import NextOccasionCard from '../occasion/NextOccasionCard';
import TimelineOccasionCard from '../occasion/TimelineOccasionCard';
import ActivityComponent from '../activity/ActivityComponent';
import { Theme } from '../../styles/theme';

const MainTab = ({ occasions, occasionInstances, userAttendances, userActiveAttendances, fetchData }) => {
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
            setTimeout(() => setRefreshing(false), 100);
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
            style={Theme.globalStyles.container}
        >
            {refreshing && <ActivityIndicator size="large" color={Theme.colors.myblue} />}
            {activeAttendances.length > 0 ? (
                activeAttendances.map(attendance => {
                    const occasion = occasions.find(occ => occ._id === attendance.occasionId);
                    return (
                        <ActiveAttendanceCard key={attendance.occasionId} attendance={attendance} occasion={occasion} onRefresh={onRefresh} />
                    );
                })
            ) : (
                <NextOccasionCard occasions={occasionInstances} onRefresh={onRefresh} />
            )}
            <TimelineOccasionCard occasions={occasionInstances} />


            <ActivityComponent occasions={occasions} attendances={userAttendances} />


        </ScrollView>
    );
};

export default MainTab;

