import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';

const MainPage = () => {
    const { userData, logout } = useAuth();
    const { fetchAttendancesByGroupId, updateAttendanceById } = useAttendance();
    const [studentAttendances, setStudentAttendances] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userData?.type === "STUDENT") {
            console.log('User name:', userData.name);

            if (userData.groups && Array.isArray(userData.groups)) {
                setLoading(true);
                Promise.all(userData.groups.map(groupId => fetchAttendancesByGroupId(groupId)))
                    .then(results => {
                        const allAttendances = results.flat();
                        const uniqueAttendances = Array.from(new Set(allAttendances.map(item => item._id)))
                            .map(id => allAttendances.find(item => item._id === id))
                            .filter(Boolean);

                        setStudentAttendances(uniqueAttendances);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Failed to fetch attendances:', error);
                        setError("Failed to fetch attendances. " + (error as Error).message);
                        setLoading(false);
                    });
            } else {
                console.log('No valid group data found');
                setStudentAttendances([]);
            }
        }
    }, [userData?.groups, userData?.type, fetchAttendancesByGroupId]);

    const handelEnterClass = async (classId: string) => {
        console.log('Enter Class with ID:', classId);

        const studentId = userData?.id;

        if (!studentId) {
            console.error('Student ID is not available');
            return;
        }

        if (userData.type !== "STUDENT") {
            console.error('User is not a student');
            return;
        }

        try {
            await updateAttendanceById(classId, {
                studentIds: [studentId],
            });
            console.log('Attendance updated successfully');
        } catch (error) {
            console.error('Failed to update attendance:', error);
            setError('Failed to enter the class. ' + (error as Error).message);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData?.name}! {userData.type}</Text>
            <View style={styles.majorsContainer}>
                {/* Additional content can go here */}
            </View>
            <Card style={styles.card}>
                <Card.Title title="Attendances" />
                <Card.Content>
                    {studentAttendances.length > 0 ? (
                        <FlatList
                            data={studentAttendances}
                            keyExtractor={(item) => item._id} // Ensure _id is unique
                            renderItem={({ item }) => (
                                <View style={styles.attendanceItem}>
                                    <Text style={styles.attendanceText}>{item.name}</Text>
                                    <Text style={styles.attendanceText}>Start: {item.startDate}</Text>
                                    <Text style={styles.attendanceText}>End: {item.endDate || 'Not ended yet'}</Text>
                                    <Button mode="contained" onPress={() => handelEnterClass(item._id)}>Enter Class</Button>
                                </View>
                            )}
                        />
                    ) : (
                        <Paragraph>No attendances found.</Paragraph>
                    )}
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    majorsContainer: {
        marginBottom: 20,
    },
    majorText: {
        fontSize: 18,
        color: '#333',
    },
    logoutButton: {
        marginTop: 20,
    },
    card: {
        width: '100%',
        marginBottom: 20,
    },
    attendanceItem: {
        marginBottom: 10,
    },
    attendanceText: {
        fontSize: 16,
    },
});

export default MainPage;
