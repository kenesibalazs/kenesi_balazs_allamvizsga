import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTimetableData } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { generateOccasionInstances } from "../utils/occasionUtils";
import { Occasion } from '../types/apiTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Header, SafeAreaWrapper } from '../components/common';
import { Theme } from '../styles/theme';
import { TimetableModal } from '../components/modals';

const TimetableScreen = () => {
    const { userData, logout } = useAuth();
    if (!userData) {
        logout();
        return null;
    }

    const { occasions } = useTimetableData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTimeOffset, setCurrentTimeOffset] = useState<number | null>(null);
    const occasionInstances = generateOccasionInstances(occasions);
    const timetableStartHour = 0, timetableEndHour = 24, hourHeight = 60;

    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const getMondayOfWeek = (offset = 0) => {
        const now = new Date();
        const day = now.getDay() || 7;
        now.setDate(now.getDate() - day + 1 + offset * 7);
        return now;
    };

    const monday = useMemo(() => {
        const copy = new Date(currentDate);
        const day = copy.getDay() || 7;
        copy.setDate(copy.getDate() - day + 1);
        return copy;
    }, [currentDate]);
    const today = new Date();

    const headerScrollRef = useRef(null);
    const bodyScrollRef = useRef(null);
    const verticalScrollRef = useRef<ScrollView>(null);
    const horizontalScrollRef = useRef<ScrollView>(null);

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

    useEffect(() => {
        const updateCurrentTimeOffset = () => {
            const now = new Date();
            const minutesSinceStart = (now.getHours() * 60 + now.getMinutes());
            const offset = (minutesSinceStart / 60) * hourHeight;

            const isValid = offset >= 0 && offset <= (timetableEndHour - timetableStartHour) * hourHeight;
            setCurrentTimeOffset(isValid ? offset : null);
        };

        updateCurrentTimeOffset();
        const interval = setInterval(updateCurrentTimeOffset, 6000);
        return () => clearInterval(interval);
    }, []);

    const didAutoScrollRef = useRef(false);
    useEffect(() => {
        if (didAutoScrollRef.current || currentTimeOffset === null) return;

        const timeout = setTimeout(() => {
            verticalScrollRef.current?.scrollTo({ y: currentTimeOffset - 100, animated: true });

            const now = new Date();
            const dayIndex = (now.getDay() + 6) % 7;
            horizontalScrollRef.current?.scrollTo({ x: dayIndex * 150 - 50, animated: true });

            didAutoScrollRef.current = true;
        }, 250); // short delay to avoid layout race

        return () => clearTimeout(timeout);
    }, [currentTimeOffset]);

    return (
        <SafeAreaWrapper>

            <Header
                title="Timetable"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Theme.colors.primary }}>
                <TouchableOpacity onPress={goToPreviousDay} style={{ padding: 10 }}>
                    <Ionicons
                        name='chevron-back-outline'
                        size={20}
                        color={Theme.colors.myblue}
                    />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.monthLabel}>
                        {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </Text>
                    {currentDate.toDateString() !== today.toDateString() && (
                        <TouchableOpacity onPress={() => {
                            setCurrentDate(new Date());
                            didAutoScrollRef.current = false;
                        }}>
                            <Text style={{ color: Theme.colors.myblue, fontSize: 12, textDecorationLine: 'underline' }}>
                                Go to Today
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={goToNextDay} style={{ padding: 10 }}>
                <Ionicons
                        name='chevron-forward-outline'
                        size={20}
                        color={Theme.colors.myblue}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.headerWrapper}>
                <ScrollView
                    ref={headerScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(event) => syncScroll(event, bodyScrollRef)}
                >
                    <View style={styles.timeColumnPlaceholder} />

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

            <ScrollView ref={verticalScrollRef} style={styles.timetableBodyWrapper}>
                <View style={styles.timetableBody}>
                    <View style={styles.timeColumn}>
                        {Array.from({ length: timetableEndHour - timetableStartHour }).map((_, i) => (
                            <Text key={i} style={styles.timeLabel}>{`${timetableStartHour + i}:00`}</Text>
                        ))}
                    </View>

                    <ScrollView
                        ref={horizontalScrollRef}
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
                                        {currentTimeOffset !== null &&
                                            dayDate.toDateString() === today.toDateString() &&
                                            monday.toDateString() === getMondayOfWeek().toDateString() && (
                                                <View style={[styles.currentTimeLine, { top: currentTimeOffset }]}>
                                                    <View style={styles.currentTimeBubble}>
                                                        <Text style={styles.currentTimeText}>
                                                            {new Date().toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false
                                                            })}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
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
                                                        <Text style={styles.classroomLabel}>
                                                            {typeof instance.occasion.classroomId === 'object' ? instance.occasion.classroomId.name : 'Unknown Classroom'}
                                                        </Text>

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

        </SafeAreaWrapper>
    );
};



const currentTheme: 'dark' | 'light' = 'light';

const styles = StyleSheet.create({


    safeTop: {
        backgroundColor: Theme.colors.primary,
    },


    timetableContainerNavigation: {
        backgroundColor: Theme.colors.primary,
        textAlign: 'left',
        paddingHorizontal: 16,
        paddingVertical: 12
    },

    monthLabel: {
        fontWeight: '600',
        fontSize: Theme.fontSize.large,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.regular
    },

    headerWrapper: {
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.borderColor,
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
        backgroundColor: Theme.colors.primary,
        flex: 1
    },
    timetableBody: {
        flexDirection: 'row'
    },

    notTodayDayLabel: {
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.regular,
    },

    notTodayLabel: {
        marginLeft: 10,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.regular,
    },

    todayDayLabel: {
        color: Theme.colors.myblue,
        fontFamily: Theme.fonts.extraBold,
    },

    todayLabel: {
        textAlign: 'center',
        fontSize: Theme.fontSize.small,
        alignItems: 'center',
        color: Theme.colors.myblue,
        padding: Theme.padding.extraSmall,
        fontFamily: Theme.fonts.extraBold,
        borderRadius: Theme.borderRadius.full,
        marginLeft: Theme.margin.small,
    },


    timeColumn: {
        backgroundColor: Theme.colors.primary,
        width: 50,
        paddingRight: Theme.padding.extraSmall,
        borderRightWidth: 1,
        borderRightColor: Theme.colors.borderColor,
    },
    timeLabel: {
        height: 60,
        textAlign: 'right',
        fontSize: Theme.fontSize.small,
        fontFamily: Theme.fonts.regular,
        color: Theme.colors.textLight
    },

    dayLabel: {
        width: 150,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: Theme.colors.primaryTransparent,
        borderRadius: Theme.borderRadius.medium,
    },

    daysGrid: {
        flex: 1,
        flexDirection: 'row',

    },
    dayColumn: {
        flex: 1,
        width: 150,
        borderRightWidth: 1,
        borderRightColor: Theme.colors.borderColor,
        backgroundColor: Theme.colors.background,
    },
    occasion: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.borderRadius.large,
        padding: Theme.padding.small,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        overflow: 'hidden',
    },

    subjectLabel: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.bold,
        textAlign: 'center',
        marginBottom: Theme.margin.small
    },

    subjectTimeLabel: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
        marginBottom: Theme.margin.small
    },

    teacherName: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
        marginBottom: Theme.margin.small

    },

    classroomLabel: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
        marginBottom: Theme.margin.small
    },

    currentTimeLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'red',
        zIndex: 5,
    },
    currentTimeBubble: {
        position: 'absolute',
        left: -45,
        top: -9,
        backgroundColor: 'red',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        zIndex: 999,
    },
    currentTimeText: {
        color: 'white',
        fontSize: 12,
        fontFamily: Theme.fonts.bold,
        zIndex: 5,
    },

});

export default TimetableScreen;
