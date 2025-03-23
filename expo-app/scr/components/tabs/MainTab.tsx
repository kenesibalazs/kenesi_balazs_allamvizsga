import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


import { ActiveOccasionCard, NextOccasionCard, TimelineOccasionCard } from '../occasion'
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
                        <ActiveOccasionCard key={attendance.occasionId} attendance={attendance} occasion={occasion} onRefresh={onRefresh} />
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

