import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
            <Text>{userData.neptunCode} , {userData.majors}</Text>
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
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 20,
    },


});

export default MainPage;
