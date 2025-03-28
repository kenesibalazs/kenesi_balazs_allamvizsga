import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { ActiveOccasionCard, NextOccasionCard, TimelineOccasionCard } from '../occasion'
import ActivityComponent from '../activity/ActivityComponent';

import { Theme } from '../../styles/theme';

const MainTab = ({ occasions, occasionInstances, userAttendances, userActiveAttendances, fetchData }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state separately

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchData();
        } catch (error) {
            console.error("Refresh Error:", error);
        } finally {
            setRefreshing(false);
        }
    }, [fetchData]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchAndUpdate = async () => {
                setIsLoading(true);
                try {
                    await fetchData();
                } catch (error) {
                    console.error("Fetch Error:", error);
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            };
            fetchAndUpdate();

            return () => {
                isActive = false;
            };
        }, [fetchData])
    );

    const activeAttendances = (userActiveAttendances || []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Theme.colors.myblue}
                />
            }
            style={Theme.globalStyles.container}
        >
            {isLoading && <ActivityIndicator size="large" color={Theme.colors.myblue} />}
            {activeAttendances.length > 0 ? (
                activeAttendances.map(attendance => {
                    const occasion = occasions.find(occ => occ._id === attendance.occasionId);
                    return (

                        <ActiveOccasionCard attendance={attendance} occasion={occasion} onRefresh={onRefresh} />
                    );
                })
            ) : (
                    <NextOccasionCard occasions={occasionInstances} onRefresh={onRefresh} />
            )}
            <Animatable.View animation="fadeInUp" delay={200} duration={400}>
                <TimelineOccasionCard occasions={occasionInstances} />
            </Animatable.View>
            <Animatable.View animation="fadeInUp" delay={300} duration={400}>
                <ActivityComponent occasions={occasions} attendances={userAttendances} />
            </Animatable.View>
        </ScrollView>
    );
};

export default MainTab;
