import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
    const { userData, logout } = useAuth();
    const [privateKey, setPrivateKey] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrivateKey = async () => {
            const key = await SecureStore.getItemAsync('privateKey');
            setPrivateKey(key);
        };

        fetchPrivateKey();
    }, []);

    if (!userData) {
        return <Text>Loading user data...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}!</Text>
            {userData.occasionIds && userData.occasionIds.map((occasionId) => (
                <Text key={occasionId}>{occasionId}</Text>
            ))}
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>

            {privateKey && (
                <View style={styles.keyContainer}>
                    <Text style={styles.privateKeyText}>Private Key: {privateKey}</Text>
                </View>
            )}
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
    logoutButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    keyContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#000000',
        borderRadius: 5,
    },
    privateKeyText: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        
    },
});

export default MainPage;