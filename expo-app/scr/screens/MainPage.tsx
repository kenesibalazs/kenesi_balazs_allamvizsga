import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View, SafeAreaView, useWindowDimensions, Text
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';
import { generateOccasionInstances } from '../utils/occasionUtils';

import Header from '../components/Header';
import UpcomingTab from '../components/UpcomingTab';
import PastTab from '../components/PastTab';
import CustomTabBar from '../components/CustomTabBar';

const MainPage: React.FC = () => {
    const { userData, logout } = useAuth();
    const hasLogged = useRef(false);
    const { occasions } = useTimetableData();
    const { studentsActiveAttendances, fetchStudentActiveAttendances } = useAttendance();

    const hasFetchedData = useRef(false);
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const occasionInstances = useMemo(() => generateOccasionInstances(occasions), [occasions]);


    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    const routes = [
        { key: 'upcoming', title: 'Upcoming' },
        { key: 'past', title: 'Past' },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'upcoming':
                return (
                    <UpcomingTab
                        occasions={occasions}
                        occasionInstances={occasionInstances}
                    />
                );
            case 'past':
                return <PastTab />;
            default:
                return null;
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#067BC2' }}>
            <View style={{ flexGrow: 1, width: '100%' }}>

                <Header

                    title="Dashboard"
                    leftIcon="settings-outline"
                    onLeftPress={() => console.log("Settings Pressed")}
                    rightIcon="person"
                    onRightPress={() => console.log("Profile Pressed")}
                />

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={CustomTabBar}
                    lazy
                    lazyPreloadDistance={0}
                    style={{ backgroundColor: '#DFF8EB' }}
                />


            </View>
        </SafeAreaView>
    );
};

export default MainPage;
