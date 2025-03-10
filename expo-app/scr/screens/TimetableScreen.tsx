/* eslint-disable */
import React, { useRef, useState } from 'react';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import { generateOccasionInstances } from "../utils/occasionUtils";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Occasion } from "../types/apiTypes";

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

    return (
        <SafeAreaView style={styles.timetableContainer}>
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
                                    <Text style={isToday ? styles.todayDayLabel : null}>{date.toLocaleDateString("en-US", { weekday: "long" })}</Text>
                                    <Text style={isToday ? styles.todayLabel : styles.notTodayLabel}>{date.toLocaleDateString("en-US", { day: "numeric" })}</Text>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            <ScrollView style={styles.timetableBodyWrapper}
            >

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
                        <View>

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
                                                        <View key={idx} style={[
                                                            styles.occasion,
                                                            { top: (startTime.getHours() - timetableStartHour) * hourHeight + (startTime.getMinutes() / 60) * hourHeight, height }
                                                        ]}>
                                                            <Text> {typeof instance.occasion.subjectId === 'object' ? instance.occasion.subjectId.name : 'Unknown Subject'}</Text>
                                                            <Text>{instance.occasion.startTime} - {instance.occasion.endTime}</Text>
                                                            <Text>{instance.occasion.classroomId}</Text>
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    timetableContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16
    },
    timetableContainerNavigation: {
        textAlign: 'left',
        marginLeft: 10
    },

    monthLabel: {
        fontWeight: '600',
        fontSize: 20
    },


    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,            
        borderBottomColor: '#e0e0e0',
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
        flex: 1
    },
    timetableBody: {
        flexDirection: 'row'
    },
    timeColumn: {
        width: 50,
        paddingRight: 5,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',


    },
    timeLabel: {
        height: 60,
        textAlign: 'right',
        fontSize: 12,
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
        borderRightWidth: .5,
        borderRightColor: '#e0e0e0',
    },

    todayDayLabel: {
        fontWeight: 600,
    },

    todayLabel: {
        textAlign: 'center',
        fontSize: 12,
        alignItems: 'center',
        fontWeight: 500,
        backgroundColor: 'black',
        color: 'white',
        padding: 5,
        borderRadius: 1000,
        marginLeft: 5

    },

    notTodayLabel: {
        marginLeft: 10
    },

    daysGrid: {
        flex: 1,
        flexDirection: 'row'
    },
    dayColumn: {
        flex: 1,
        width: 150,

    },
    occasion: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: '#f5f7fa',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3e3e3'
    }
});

export default TimetableScreen;
