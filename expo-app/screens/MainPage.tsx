import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';

export interface AttendanceTableData {
    key: string;
    name: string;
    startDate: string;
    endDate: string;
}

const MainPage = () => {
    const { userData, logout } = useAuth();
    const { attendances, fetchAttendancesByGroupId, addStudentToAttendance } = useAttendance();

    const [studentAttendances, setStudentAttendances] = useState<AttendanceTableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setLoading(true);
                for (const groupId of userData.groups) {
                    await fetchAttendancesByGroupId(groupId);
                }
            } catch (err) {
                setError('Failed to load attendances.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [fetchAttendancesByGroupId, userData.groups]);

    useEffect(() => {
        const formattedAttendances = attendances.map((attendance) => ({
            key: attendance._id,
            name: attendance.name,
            startDate: attendance.startDate,
            endDate: attendance.endDate || 'Not ended yet',
        }));
        setStudentAttendances(formattedAttendances);
    }, [attendances]);

    const handleJoin = async (attendanceId: string) => {
        try {
            await addStudentToAttendance(attendanceId, userData.id as string);
            alert('Joined successfully!');
        } catch (error) {
            console.error('Error in handleJoin:', error);
            alert('Failed to join: ' + (error as Error).message);
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
            <Text style={styles.welcomeText}>Hi, {userData?.name}! {userData?.type}</Text>
            <Card style={styles.card}>
                <Card.Title title="Attendances" />
                <Card.Content>
                    {studentAttendances.length > 0 ? (
                        <FlatList
                            data={studentAttendances}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <View style={styles.attendanceItem}>
                                    <Text style={styles.attendanceText}>{item.name}</Text>
                                    <Text style={styles.attendanceText}>Start: {item.startDate}</Text>
                                    <Text style={styles.attendanceText}>End: {item.endDate}</Text>
                                    {!item.endDate && (
                                        <Button mode="contained" onPress={() => handleJoin(item.key)}>
                                            Join
                                        </Button>
                                    )}
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
    logoutButton: {
        marginTop: 20,
    },
});

export default MainPage;
