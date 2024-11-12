import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import { daysMapping, getWeekDays } from '../utils/dateUtils';
import useOccasions from '../hooks/useOccasions';
import usePeriod from '../hooks/usePeriod';
import useSubject from '../hooks/useSubject';
import { useAuth } from '../context/AuthContext';

const TimetableScreen = () => {
    const { userData, logout } = useAuth();
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const { periods, fetchPeriods } = usePeriod();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!userData) {
        logout();
        return null;
    }

    useEffect(() => {
        const occasionIds = userData.occasionIds.map(id => id.toString());
        fetchOccasionsByIds(occasionIds);
        fetchPeriods();
        fetchAllSubjectsData();
    }, [userData]);

    const handlePreviousDay = () => {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    const handleBackToToday = () => {
        setCurrentDate(new Date()); // Resets to today's date
    };

    const weekDays = getWeekDays(currentDate).filter(date =>
        date.toDateString() === currentDate.toDateString()
    );

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <DataTable style={styles.timetable}>
                    <DataTable.Header style ={styles.tabelHeader}>
                        <DataTable.Title style={styles.startTimeCell}>Period</DataTable.Title>
                        {weekDays.map((date, index) => (
                            <DataTable.Cell key={index}>
                                <View style={styles.dateCell}>
                                    <Text style={{ fontWeight: 'bold' }}>{date.toLocaleDateString('en-US', { weekday: 'long' })}</Text>
                                    <Text style={{ fontSize: 12 }}>{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
                                </View>

                            </DataTable.Cell>
                        ))}
                    </DataTable.Header>

                    {periods.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map(period => (
                        <DataTable.Row key={period._id} style={styles.row}>
                            <DataTable.Cell style={styles.startTimeCell}>{period.starttime}</DataTable.Cell>
                            {weekDays.map((date, index) => {
                                const mappedDay = daysMapping[date.getDay() - 1];
                                const occasion = occasions.find(o => o.dayId === mappedDay?.id && o.timeId === period.id);

                                if (occasion) {
                                    const subject = subjects.find(s => s.timetableId.toString() === occasion?.subjectId.toString());
                                    const subjectName = subject ? subject.name : '';

                                    return (
                                        <DataTable.Cell key={index} style={occasion ? styles.occupied : styles.tableCell}>
                                            <View style={styles.cellContent}>
                                                <Text>{subjectName}</Text>
                                                <Text>{occasion.id}</Text>
                                            </View>
                                        </DataTable.Cell>
                                    );
                                }
                            })}

                        </DataTable.Row>
                    ))}
                </DataTable>

                <View style={styles.tabBar}>
                    <TouchableOpacity style={styles.tabButton} onPress={handlePreviousDay}>
                        <Text style={styles.tabButtonText}>Yesterday</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabButton} onPress={handleBackToToday}>
                        <Text style={styles.tabButtonText}>Back to Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabButton} onPress={handleNextDay}>
                        <Text style={styles.tabButtonText}>Tomorrow</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
    },

    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#d0d0d0',
    },

    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },

    tabButtonText: {
        fontSize: 12,
        color: '#333',
    },

    startTimeCell: {
        flex: .15,
        width: '100%',
        textAlign: 'left',
        paddingVertical: 2,
        paddingHorizontal: 4,
    },

    dateCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    timetable: {
        flex: 1,
        width: '100%',
        borderWidth: 0,
    },

    tabelHeader: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

    row: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

    cellContent: {
        flex: 1,
        justifyContent: 'center',
        
    },

     occupied: {
        backgroundColor: '#cfe9ff',
        flex: 1,
        width: '100%',
        alignSelf: 'stretch',
        color: '#0369a1',
        fontWeight: '500',
        textAlign: 'left',
        fontSize: 14,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderLeftWidth: 4,
        borderColor: '#3b82f6',
    },

    tableCell: {
        backgroundColor: 'white',
        textAlign: 'center',
        width: '100%',
        flex: 1,
    },
});

export default TimetableScreen;
