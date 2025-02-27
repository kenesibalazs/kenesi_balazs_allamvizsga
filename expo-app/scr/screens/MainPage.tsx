/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getAuthHeaders } from '../api/client';
import MyModule from '../../modules/my-module';
import { useVerifySignature } from '../hooks/useVerifySignature';

const MainPage = () => {
    const { userData, logout } = useAuth();
    const [message, setMessage] = useState('Message from backend');
    const [signature, setSignature] = useState<string | null>(null);
    const { isValid, loading, error, checkSignature } = useVerifySignature();

    if (!userData) {
        return <Text>Loading user data...</Text>;
    }

    const handleSignMessage = async () => {
        try {
            console.log(MyModule);
            const signedMessage = await MyModule.signMessage(message);
            setSignature(signedMessage);
            console.log('Signature:', signedMessage);
        } catch (error) {
            console.error('Error signing message:', error);
        }

        console.log(userData);
    };

    const handleVerifySignature = async () => {
        if (!signature) {
            console.error('❌ No signature available for verification');
            return;
        }
    
       
    

        await checkSignature(userData.publicKey, message, signature);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.welcomeText}>Hi, {userData.name}!</Text>
            {userData.occasionIds && userData.occasionIds.map((occasionId) => (
                <Text key={occasionId}>{occasionId}</Text>
            ))}
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Logout
            </Button>

            <View style={styles.container}>
                <Text>Message: {message}</Text>
                <Button onPress={handleSignMessage}>Sign Message</Button>
                {signature && <Text>Signature: {signature}</Text>}
                {signature && <Button onPress={handleVerifySignature} disabled={loading}>
                    {loading ? "Verifying..." : "Verify Signature"}
                </Button>}
                {isValid !== null && (
                    <Text style={styles.verificationText}>
                        {isValid ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}
                    </Text>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    verificationText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default MainPage;