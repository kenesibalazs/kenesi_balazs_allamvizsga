import React, { useRef, useState, useEffect } from 'react';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import { generateOccasionInstances } from "../utils/occasionUtils";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Occasion } from '../types/apiTypes';
import TimetableModal from '../components/TimetableModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TimetableScreen = () => {
    const { userData, logout } = useAuth();
    if (!userData) {
        logout();
        return null;
    }

    const { occasions } = useTimetableData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const occasionInstances = generateOccasionInstances(occasions);
    const timetableStartHour = 0, timetableEndHour = 24, hourHeight = 60;

    const goToPreviousDay = () => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    const goToNextDay = () => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));

    const getMondayOfWeek = (offset = 0) => {
        const now = new Date();
        const day = now.getDay() || 7;
        now.setDate(now.getDate() - day + 1 + offset * 7);
        return now;
    };

    const monday = getMondayOfWeek();
    const today = new Date();

    const headerScrollRef = useRef(null);
    const bodyScrollRef = useRef(null);

    const syncScroll = (event, ref) => {
        if (ref.current) {
            ref.current.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<Occasion | null>(null);

    const openModal = (instance: Occasion) => {
        setSelectedInstance(instance);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedInstance(null);
    };



    return (
        <SafeAreaView style={styles.timetableContainer}>

            <View style={styles.headerContainer}>


                <Text style={styles.headerText}>{'timetable'.toLocaleUpperCase()}</Text>

            </View>
            <View style={styles.timetableContainerNavigation}>
                <Text style={styles.monthLabel}>
                    {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </Text>
            </View>

            <View style={styles.headerWrapper}>
                <View style={styles.timeColumnPlaceholder} />
                <ScrollView
                    ref={headerScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(event) => syncScroll(event, bodyScrollRef)}
                >
                    <View style={styles.timetabledayHeader}>
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date(monday);
                            date.setDate(monday.getDate() + i);
                            const isToday = date.toDateString() === today.toDateString();
                            return (
                                <View key={i} style={styles.dayLabel}>
                                    <Text style={isToday ? styles.todayDayLabel : styles.notTodayDayLabel}>
                                        {date.toLocaleDateString("en-US", { weekday: "long" })}
                                    </Text>
                                    <Text style={isToday ? styles.todayLabel : styles.notTodayLabel}>
                                        {date.toLocaleDateString("en-US", { day: "numeric" })}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            <ScrollView style={styles.timetableBodyWrapper}>
                <View style={styles.timetableBody}>
                    <View style={styles.timeColumn}>
                        {Array.from({ length: timetableEndHour - timetableStartHour }).map((_, i) => (
                            <Text key={i} style={styles.timeLabel}>{`${timetableStartHour + i}:00`}</Text>
                        ))}
                    </View>

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={(event) => syncScroll(event, headerScrollRef)}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                                const dayDate = new Date(monday);
                                dayDate.setDate(monday.getDate() + dayIndex);
                                return (
                                    <View key={dayIndex} style={styles.dayColumn}>
                                        {occasionInstances
                                            .filter(instance => instance.date.toDateString() === dayDate.toDateString())
                                            .map((instance, idx) => {
                                                const startTime = new Date(instance.date);
                                                const endTime = new Date(instance.endDate);
                                                const height = ((endTime.getTime() - startTime.getTime()) / (1000 * 60) / 60) * hourHeight;

                                                return (
                                                    <TouchableOpacity key={idx} style={[
                                                        styles.occasion,
                                                        { top: (startTime.getHours() - timetableStartHour) * hourHeight + (startTime.getMinutes() / 60) * hourHeight, height }
                                                    ]}
                                                        onPress={() => openModal(instance.occasion)}>

                                                        <Text style={styles.subjectLabel}> {typeof instance.occasion.subjectId === 'object' ? instance.occasion.subjectId.name : 'Unknown Subject'}</Text>
                                                        <Text style={styles.subjectTimeLabel}>{instance.occasion.startTime} - {instance.occasion.endTime}</Text>
                                                        <Text style={styles.teacherName}>
                                                            {typeof instance.occasion.teacherId === 'object' ? instance.occasion.teacherId.name : 'Unknown Teacher'}
                                                        </Text>
                                                        <Text style={styles.classroomLabel}>{instance.occasion.classroomId}</Text>

                                                    </TouchableOpacity>
                                                );
                                            })}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>

            <TimetableModal
                modalVisible={modalVisible}
                instance={selectedInstance}
                closeModal={closeModal}
            />

        </SafeAreaView>
    );
};

const lightColors = {
    background: 'white',
    text: '#333',
    border: '#e0e0e0',
    highlight: '#4A90E2',
    today: '#D3D3D3',
    accent: '#4CAF50',
};

const darkColors = {
    background: '#181818',
    text: '#E0E0E0',
    border: '#444444',
    highlight: '#1E88E5',
    today: '#616161',
    accent: '#00C853',
};

const currentTheme: 'dark' | 'light' = 'light';

const styles = StyleSheet.create({

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: 12,
        backgroundColor: '#067BC2',

    },

    headerText: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-ExtraBold',
        color: '#fff',
        fontWeight: 900,
        margin: "auto",
    },

    timetableContainer: {
        flex: 1,
        backgroundColor: '#067BC2',
        padding: 16
    },

    timetableContainerNavigation: {
        backgroundColor: '#fff',
        textAlign: 'left',
        paddingHorizontal: 16,
        paddingVertical: 12
    },

    monthLabel: {
        fontWeight: '600',
        fontSize: 15,
        color: 'black',
    },

    headerWrapper: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        zIndex: 10,
    },
    timetabledayHeader: {
        flexDirection: 'row',

    },

    timeColumnPlaceholder: {
        width: 50,
        height: 50
    },

    timetableBodyWrapper: {
        backgroundColor: '#fff',
        flex: 1
    },
    timetableBody: {
        flexDirection: 'row'
    },

    notTodayDayLabel: {
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,
    },

    timeColumn: {
        width: 50,
        paddingRight: 5,
        borderRightWidth: 1,
        borderRightColor: currentTheme === 'light' ? lightColors.border : darkColors.border,
    },
    timeLabel: {
        height: 60,
        textAlign: 'right',
        fontSize: 12,
        color: "#000",
    },
    dayLabel: {
        width: 150,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 12,
        alignItems: 'center',
        padding: 10,
        paddingVertical: 1,
        borderRightWidth: 0.5,
        borderRightColor: currentTheme === 'light' ? lightColors.border : darkColors.border,

    },

    todayDayLabel: {
        fontWeight: '600',
        color: currentTheme === 'light' ? lightColors.highlight : darkColors.highlight,
    },

    todayLabel: {
        textAlign: 'center',
        fontSize: 12,
        alignItems: 'center',
        fontWeight: 500,
        backgroundColor: currentTheme === 'light' ? lightColors.highlight : darkColors.highlight,
        color: 'white',
        padding: 5,
        borderRadius: 1000,
        marginLeft: 5,
    },

    notTodayLabel: {
        marginLeft: 10,
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,
    },

    daysGrid: {
        flex: 1,
        flexDirection: 'row'
    },
    dayColumn: {
        flex: 1,
        width: 150,
        borderRightWidth: 1,
        borderRightColor: '#F2F2F2',
    },
    occasion: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: currentTheme === 'light' ? '#f5f7fa' : '#333333',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: currentTheme === 'light' ? '#e3e3e3' : '#555555',
        color: 'red',
    },

    subjectLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,
    },

    subjectTimeLabel: {
        fontSize: 12,
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,
    },

    classroomLabel: {
        fontSize: 12,
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,
    },

    teacherName: {
        fontSize: 12,
        color: currentTheme === 'light' ? lightColors.text : darkColors.text,

    }
});

export default TimetableScreen;
