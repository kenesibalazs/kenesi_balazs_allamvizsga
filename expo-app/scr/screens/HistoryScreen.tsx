import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useVerifySignature } from '../hooks/useVerifySignature';
import MyModule from '../../modules/my-module';
import { useAuth } from '../context/AuthContext';
const HistoryScreen: React.FC = () => {
    const { userData, logout } = useAuth();
    const { isValid, loading, error, checkSignature } = useVerifySignature();
    const [message, setMessage] = useState('Message from backend');
    const [signature, setSignature] = useState<string | null>(null);

    const handleSignMessage = async () => {
        try {
            const signedMessage = await MyModule.signMessage(message);
            setSignature(signedMessage);
        } catch (error) {
            console.error('Error signing message:', error);
        }
    };

    const handleVerifySignature = async () => {
        if (!signature) {
            console.error('❌ No signature available for verification');
            return;
        }
        await checkSignature(userData.publicKey, message, signature);
    };

    return (
        <View style={styles.signatureContainer}>
            <Text>Message: {message}</Text>
            {/* <Button onPress={handleSignMessage}>Sign Message</Button>
            {signature && <Text>Signature: {signature}</Text>}
            {signature && (
                <Button onPress={handleVerifySignature} disabled={loading}>
                    {loading ? "Verifying..." : "Verify Signature"}
                </Button>
            )} */}
            {isValid !== null && (
                <Text>{isValid ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}</Text>
            )}
            {error && <Text>{error}</Text>}
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    signatureContainer: {
        padding: 16,
    },
});

export default HistoryScreen;
