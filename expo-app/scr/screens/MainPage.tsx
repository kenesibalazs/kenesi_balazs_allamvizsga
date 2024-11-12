import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';
import Toast from 'react-native-toast-message';

interface AttendanceTableData {
    key: string;
    name: string;
    startDate: string;
    endDate: string | null;
}

const MainPage = () => {
    const { userData, logout } = useAuth();
    const { attendances, loading: loadingAttendance, error: errorAttendance, fetchAttendancesByGroupId, addStudentToAttendance } = useAttendance();
    
    const [attendanceData, setAttendanceData] = useState<AttendanceTableData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userData?.groups?.length) {
            userData.groups.forEach(groupId => fetchAttendancesByGroupId(groupId));
        }
    }, [fetchAttendancesByGroupId, userData?.groups]);

    useEffect(() => {
        if (attendances) {
            const formattedAttendances: AttendanceTableData[] = attendances.map(attendance => ({
                key: attendance._id,  
                name: attendance.name,
                startDate: attendance.startDate,
                endDate: attendance.endDate || null,
            }));
            setAttendanceData(formattedAttendances);
        }
    }, [attendances]);

    const handleJoin = async (record: AttendanceTableData) => {
        if (!userData?.id) {
            // Handle case where userData is not available
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'User is not logged in.',
            });
            return;
        }

        try {
            await addStudentToAttendance(record.key, userData.id as string);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Joined successfully!',
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: `Failed to join: ${error.message}`,
            });
        }
    };

    const renderAttendanceItem = ({ item }: { item: AttendanceTableData }) => (
        <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Content>
                <Paragraph>Start Date: {item.startDate}</Paragraph>
                <Paragraph>End Date: {item.endDate ? item.endDate : 'Ongoing'}</Paragraph>
                {!item.endDate && (
                    <Button 
                        mode="contained" 
                        onPress={() => handleJoin(item)}
                        style={styles.joinButton}
                    >
                        Join
                    </Button>
                )}
            </Card.Content>
        </Card>
    );

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!userData) {
       
        return <Text>Loading user data...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}! 
                {userData.occasionIds.map((occasionId) => (
                    <Text key={occasionId}>{occasionId}</Text>
                    
                ))}
            </Text>

            <FlatList
                data={attendanceData}
                renderItem={renderAttendanceItem}
                keyExtractor={item => item.key}
                contentContainerStyle={styles.list}
                refreshing={loadingAttendance}
                onRefresh={() => {
                    if (userData.groups) {
                        userData.groups.forEach(groupId => fetchAttendancesByGroupId(groupId));
                    }
                }}
            />

            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
    },
    card: {
        marginBottom: 20,
    },
    joinButton: {
        marginTop: 10,
    },
    logoutButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default MainPage;
