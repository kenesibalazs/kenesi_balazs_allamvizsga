import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTimetableData } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { generateOccasionInstances } from "../utils/occasionUtils";
import { Occasion } from '../types/apiTypes';
//import TimetableModal from '../components/modals/TimetableModal';
import { Header, SafeAreaWrapper } from '../components/common';
import { Theme } from '../styles/theme';

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
        <SafeAreaWrapper>

            <Header
                title="Timetabel"
            />


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

            {/* <TimetableModal
                modalVisible={modalVisible}
                instance={selectedInstance}
                closeModal={closeModal}
            /> */}

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
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.bold
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
        backgroundColor: Theme.colors.myblue,
        color: Theme.colors.textLight,
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
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 12,
        alignItems: 'center',
        padding: 10,
        paddingVertical: 1,
        borderRightWidth: 0.5,
        borderRightColor: Theme.colors.background,

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


});

export default TimetableScreen;
