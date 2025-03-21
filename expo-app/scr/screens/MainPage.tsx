import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, useWindowDimensions, Text} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';
import { generateOccasionInstances } from '../utils/occasionUtils';
import Main from '../components/tabs/MainTab';
import PastTab from '../components/tabs/PastTab';
import CustomTabBar from '../components/tabs/CustomTabBar';
import { Header, SafeAreaWrapper } from '../components/common';

const MainPage: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();

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
        { key: 'main', title: 'Activity Feed' },
        { key: 'past', title: 'Past' },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'main':
                return (
                    <Main
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
        <SafeAreaWrapper>
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
                    style={{ backgroundColor: '#141414' }}
                />


            </View>
        </SafeAreaWrapper>
    );
};

export default MainPage;
