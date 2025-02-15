/* eslint-disable */
import React, { useState } from 'react';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import { generateOccasionInstances } from "../utils/occasionUtils";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { Occasion } from "../types/apiTypes";

const TimetableScreen = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const { occasions } = useTimetableData();

    const timetableStartHour = 0;
    const timetableEndHour = 24;
    const hourHeight = 60;

    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");
    const [activeSlot, setActiveSlot] = useState<string | null>(null);

    const occasionInstances = generateOccasionInstances(occasions);

    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const openModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedOccasion(null);
        setSelectedDate(null);
    };

    return (
        <SafeAreaView style={styles.timetableContainer}>
            <View style={styles.timetableContainerNavigation}>

                <Text style={styles.monthLabel}>
                    {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </Text>

                <TouchableOpacity onPress={goToPreviousDay} style={styles.navigationButton}>
                    <Text style={styles.navigationButtonText}>{'<'}</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={goToNextDay} style={styles.navigationButton}>
                    <Text style={styles.navigationButtonText}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.timetableHeader}>
                <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>
                        {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
                    </Text>
                    <Text style={styles.dayNumber}>
                        {currentDate.toLocaleDateString("en-US", { day: "numeric" })}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.timetableBodyWrapper}>
                <View style={styles.timetableBody}>
                    <View style={styles.timeColumn}>
                        {Array.from({ length: timetableEndHour - timetableStartHour }).map((_, i) => (
                            <Text key={i} style={styles.timeLabel}>
                                {`${timetableStartHour + i}:00`}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>


                        <View style={styles.dayColumn}>
                            {occasionInstances
                                .filter((instance) => instance.date.toDateString() === currentDate.toDateString())
                                .map((instance, idx) => {
                                    const startTime = new Date(instance.date);
                                    const startHour = startTime.getHours();
                                    const startMinute = startTime.getMinutes();

                                    const endTime = new Date(instance.endDate);
                                    const endHour = endTime.getHours();
                                    const endMinute = endTime.getMinutes();

                                    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                                    const height = (durationInMinutes / 60) * hourHeight;

                                    return (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.occasion,
                                                {
                                                    top: (startHour - timetableStartHour) * hourHeight + (startMinute / 60) * hourHeight,
                                                    height: height,
                                                },
                                            ]}
                                        >
                                            <View style={styles.occasionDetails}>
                                                <Text>{instance.occasion.subjectId}</Text>
                                                <Text>{instance.occasion.startTime} - {instance.occasion.endTime}</Text>
                                                <Text>{instance.occasion.classroomId}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    timetableContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e3e3e3',
    },
    timetableContainerNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    navigationButton: {
        padding: 10,
        backgroundColor: '#f4f6f8',
        borderRadius: 8,
    },
    navigationButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    monthLabel: {
        fontWeight: '600',
        fontSize: 20,
    },
    timetableHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    dayHeader: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f4f6f8',
        margin: 8,
        borderRadius: 16,
    },
    dayName: {
        fontSize: 12,
    },
    dayNumber: {
        fontSize: 24,
    },
    timetableBodyWrapper: {
        flex: 1,
    },
    timetableBody: {
        flexDirection: 'row',
    },
    timeColumn: {
        width: 50,
        paddingRight: 5,
    },
    timeLabel: {
        height: 60,
        textAlign: 'center',
        fontSize: 12,
    },
    daysGrid: {
        flex: 1,
        flexDirection: 'row',
    },
    dayColumn: {
        flex: 1,
        position: 'relative',
        borderLeftWidth: 1,
        borderLeftColor: '#f6f6f6',
    },
    occasion: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: '#f5f7fa',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3e3e3',
    },
    occasionDetails: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        textAlign: 'left',
    },
});

export default TimetableScreen;