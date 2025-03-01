/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getAuthHeaders } from '../api/client';
import MyModule from '../../modules/my-module';
import { useVerifySignature } from '../hooks/useVerifySignature';

import { LinearGradient } from 'expo-linear-gradient';


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
           
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/register.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.overlay}>
                    <Text style={styles.welcomeText}>Hi, {userData.name}!</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>This is a card content.</Text>
            </View>


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
    },
     imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '130%',
    },

    overlay: {
        position: 'absolute',
        top: 75,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },

    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },

    card: {
        marginTop: -50, 
        height: 200,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, 
        marginHorizontal: 16,
    },

    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
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