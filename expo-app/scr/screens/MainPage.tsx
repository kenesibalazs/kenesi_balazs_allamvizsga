/*eslint-disable */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

import MyModule from '../../modules/my-module';


const MainPage = () => {
    const { userData, logout } = useAuth();
    const [publicKey, setPublicKey] = useState<string | null>(null);

    const [message, setMessage] = useState('Message from backend');
    const [signature, setSignature] = useState(null);

    if (!userData) {
        return <Text>Loading user data...</Text>;
    }


    const handleSignMessage = async () => {
        try {

            console.log(MyModule);
            const signedMessage = await MyModule.signMessage(message);
            setSignature(signedMessage);
            console.log('Signature:', signedMessage);
            // Send the signature back to the backend
        } catch (error) {
            console.error('Error signing message:', error);
        }
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
    generateButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    keyContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey'
    },
    publicKeyText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
});

export default MainPage;