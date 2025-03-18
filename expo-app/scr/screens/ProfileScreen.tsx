import React from 'react';
import { View, Text, StyleSheet, Button, ViewStyle, TextStyle, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

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
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeTop} edges={["top"]}>
                <StatusBar backgroundColor="#067BC2" barStyle="light-content" />
            </SafeAreaView>

            <Header title="Profile" />

            <View style={styles.container}>
                <Text style={styles.text}>Profile Screen</Text>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </SafeAreaProvider>
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
