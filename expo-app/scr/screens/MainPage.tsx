import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    Image, TouchableOpacity, useWindowDimensions
} from 'react-native';
import NextOccasionCard from "../components/NextOccasionCard";
import ActiveAttendanceCard from '../components/ActiveOccasionCard';
import TimelineOccasionCard from '../components/TimelineOccasionCard';
import { Button } from 'react-native-paper';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import MyModule from '../../modules/my-module';

import { generateOccasionInstances } from '../utils/occasionUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAttendance from '../hooks/useAttendance';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const UpcomingRoute = ({ studentsActiveAttendances, occasions, setRefresh, occasionInstances }) => {
    if (!studentsActiveAttendances) {
        return <Text>Loading attendances...</Text>;
    }
    return (
        <ScrollView >
            {studentsActiveAttendances.length > 0 ? (
                studentsActiveAttendances.map((attendance) => {
                    const occasion = occasions.find((occ) => occ._id === attendance.occasionId);
                    return (
                        <View key={attendance.occasionId}>
                            <ActiveAttendanceCard
                                attendance={attendance}
                                occasion={occasion}
                                setRefresh={setRefresh}
                            />
                        </View>
                    );
                })
            ) : (
                <View>
                    <NextOccasionCard occasions={occasionInstances} setRefresh={setRefresh} />
                </View>
            )}

            <View>
                <TimelineOccasionCard occasions={occasionInstances} />
            </View>
        </ScrollView>
    );
};

const HistoryRoute: React.FC<{ occasionInstances: any[] }> = ({ occasionInstances }) => (
    <ScrollView>
        <TimelineOccasionCard occasions={occasionInstances} />
    </ScrollView>
);


const renderTabBar = (props) => (
    <TabBar
        {...props}
        style={{
            backgroundColor: '#067BC2',
            fontFamily: 'JetBrainsMono-ExtraBold',
        }}
        indicatorStyle={{ backgroundColor: '#fff', height: 3, borderRadius: 5 }}
        renderLabel={({ route, focused }) => {
            return (
                <Text style={{ color: focused ? '#f1c40f' : '#ccc', fontSize: 16 }}>
                    {route.title}
                </Text>
            );
        }}
        label
        pressColor="rgba(0, 123, 255, 0.1)"
    />
);

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
        { key: 'first', title: 'Upcoming' },
        { key: 'second', title: 'Past' },
    ];

    const renderScene = SceneMap({
        first: () => <UpcomingRoute
            studentsActiveAttendances={studentsActiveAttendances}
            occasions={occasions}
            setRefresh={setRefresh}
            occasionInstances={occasionInstances}
        />,
        second: () => <HistoryRoute occasionInstances={occasionInstances} />,
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.headerContainer}>
                    <TouchableOpacity>
                        <Ionicons style={styles.icon} name="settings" size={18} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>DASHBOARD</Text>
                    <TouchableOpacity>
                        <Ionicons style={styles.icon} name="person" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                    
                    style={styles.tabView}
                />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#067BC2',
    },
    container: {
        flexGrow: 1,
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: 12,
    },
    icon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 6,
        borderRadius: 100,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: '#fff',
        fontWeight: 900,
        margin: "auto",
    },

    tabView: {
        backgroundColor: '#DFF8EB',
    },



});

export default MainPage;
