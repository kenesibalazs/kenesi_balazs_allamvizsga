/*eslint-disable */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

import MyModule from '../../modules/my-module';
import { apiClient } from '../api/client';

const MainPage = () => {
    const { userData, logout } = useAuth();
    const [result, setResult] = useState('');

    if (!userData) {
        return <Text>Loading user data...</Text>;
    }

    const testSignature = async () => {
        try {
            const testString = "test"; 
            const signature = await MyModule.signDataWithSecureEnclave(testString); 
            console.log('Signature:', signature);

            const response = await apiClient.post('/verify-signature', {
                message: testString,
                signature: signature,
                publicKey: userData.publickey,
            });

            setResult(response.data.message); 
        } catch (error: any) {
            console.error("Signature test failed:", error.message || error);
            setResult("Failed to verify signature: " + (error.message || error));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}!</Text>
            {userData.occasionIds && userData.occasionIds.map((occasionId) => (
                <Text key={occasionId}>{occasionId}</Text>
            ))}
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>

            <View>
                <Button onPress={testSignature}>Test Signature</Button>
                <Text>{result}</Text>
            </View>
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