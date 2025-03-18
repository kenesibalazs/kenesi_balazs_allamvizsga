import React from 'react';
import { View, Text, StyleSheet, Button, ViewStyle, TextStyle, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

import { Header, SafeAreaWrapper } from '../components/common';

const ProfileScreen: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaWrapper>
           

            <Header title="Profile" />

            <View style={styles.container}>
                <Text style={styles.text}>Profile Screen</Text>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    safeTop: {
        backgroundColor: "#067BC2",
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default ProfileScreen;
