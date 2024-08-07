import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import useAttendance from '../hooks/useAttendance';

const MainPage = () => {
    const { userData, logout } = useAuth();
    const { attendances, error: attendancesError, loading: loadingAttendances, fetchAttendaceByGroupIds } = useAttendance();

    useEffect(() => {
        if (userData?.id && userData?.type === 'STUDENT') {
            fetchAttendaceByGroupIds(userData.groups);
        }
    }, [fetchAttendaceByGroupIds, userData?.id, userData?.type, userData?.groups]);

    if (!userData) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}! {userData.type}</Text>
            <View style={styles.majorsContainer}>
                {userData.majors.map((major, index) => (
                    <Text key={index} style={styles.majorText}>{major}</Text>
                ))}
            </View>
            <Card style={styles.card}>
                <Card.Title title="No Classes Started" />
                <Card.Content>
                    <Paragraph>Please come back later</Paragraph>
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
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 20,
        left: 20,
    },
    majorsContainer: {
        marginTop: 20,
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
        width: '90%',
        marginBottom: 20,
    },
});

export default MainPage;
