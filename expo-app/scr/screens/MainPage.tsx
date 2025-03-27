import React, { useState, useEffect, useMemo } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';

import { TabView } from 'react-native-tab-view';
import { useAuth } from '../context/AuthContext';

import { generateOccasionInstances } from '../utils/occasionUtils';
import { Header, SafeAreaWrapper } from '../components/common';
import { Main, CustomTabBar, NoticeTab } from '../components/tabs'
import { useTimetableData } from '../hooks'
import AddCommentModal from './AddCommenScreen';

const MainPage: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions, userAttendances, userActiveAttendances, fetchData, isLoading, error } = useTimetableData();
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
        { key: 'notice', title: 'Class Notices' },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'main':
                return (
                    <Main
                        occasions={occasions}
                        occasionInstances={occasionInstances}
                        userAttendances={userAttendances}
                        userActiveAttendances={userActiveAttendances}
                        fetchData={fetchData}

                    />
                );
            case 'notice':
                return <NoticeTab
                    occasions={occasions}
                />;
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
                    style={styles.tabView}
                />


               
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    tabView: {
        flex: 1,
      
    },
});

export default MainPage;
