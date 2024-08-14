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

    const [error, setError] = useState<string | null>(null);



    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData?.name}! {userData?.type}</Text>

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
