import React, { useState, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, useWindowDimensions, Text
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';
import { generateOccasionInstances } from '../utils/occasionUtils';

import DashboardHeader from '../components/DashboardHeader';
import UpcomingTab from '../components/UpcomingTab';
import PastTab from '../components/PastTab';
import CustomTabBar from '../components/CustomTabBar';

const MainPage: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const { studentsActiveAttendances, fetchStudentActiveAttendances } = useAttendance();
    const [refresh, setRefresh] = useState<boolean>(false);
    const hasLogged = useRef(false);
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const occasionInstances = generateOccasionInstances(occasions);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    useEffect(() => {
        if (userData && userData._id && !hasLogged.current) {
            fetchStudentActiveAttendances(userData._id);
            hasLogged.current = true;
        }

        if (refresh) {
            fetchStudentActiveAttendances(userData._id);
            setRefresh(false);
        }
    }, [userData, fetchStudentActiveAttendances, refresh]);

    if (!userData) {
        return <Text>Loading user data...</Text>;
    }

    const routes = [
        { key: 'upcoming', title: 'Upcoming' },
        { key: 'past', title: 'Past' },
    ];

    const renderScene = SceneMap({
        upcoming: () => <UpcomingTab
            studentsActiveAttendances={studentsActiveAttendances}
            occasions={occasions}
            setRefresh={setRefresh}
            occasionInstances={occasionInstances}
        />,
        past: () => <PastTab/>,
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#067BC2' }}>
            <View style={{ flexGrow: 1, width: '100%' }}>

                <DashboardHeader />

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={CustomTabBar}
                    style={{ backgroundColor: '#DFF8EB' }}
                />

            </View>
        </SafeAreaView>
    );
};

export default MainPage;
