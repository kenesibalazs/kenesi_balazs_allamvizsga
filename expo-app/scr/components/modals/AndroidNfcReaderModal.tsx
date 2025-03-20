import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import MyModule from '../../../modules/my-module/src/MyModule';
import { useVerifySignature } from '../../hooks/useVerifySignature';
import useAttendance from '../../hooks/useAttendance';

NfcManager.start();

interface AndroidNfcReaderModalProps {
    visible: boolean;
    onClose: () => void;
    attendanceId: string;
}

const AndroidNfcReaderModal: React.FC<AndroidNfcReaderModalProps> = ({ visible, onClose, attendanceId }) => {
    const { userData } = useAuth();
    const [nfcMessage, setNfcMessage] = useState('');
    const [signature, setSignature] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { isValid, checkSignature } = useVerifySignature();
    const { setUserPresence } = useAttendance();

    useEffect(() => {
        if (!visible) {
            resetState();
        } else {
            readNfcTag();
        }
    }, [visible]);

    const resetState = () => {
        setNfcMessage('');
        setSignature(null);
        setStatusMessage('');
        setLoading(false);
    };

    const resetNfc = async () => {
        await NfcManager.cancelTechnologyRequest().catch(() => { });
    };

    const readNfcTag = async () => {
        setLoading(true);
        setStatusMessage("Waiting for NFC scan...");

        try {
            await resetNfc();
            await NfcManager.requestTechnology(NfcTech.Ndef);

            const tag = await NfcManager.getTag();
            console.log("📡 NFC Tag Data:", JSON.stringify(tag, null, 2));

            if (tag.ndefMessage) {
                let message = Ndef.text.decodePayload(new Uint8Array(tag.ndefMessage[0].payload));
                console.log("✅ NDEF Text Read:", message);
                setNfcMessage(message);
                setStatusMessage("NFC scanned successfully!");

                try {
                    const signedMessage = await MyModule.signMessage(message);
                    setSignature(signedMessage);
                    console.log('🔏 Signature:', signedMessage);

                    if (signedMessage) {
                        setStatusMessage("Verifying attendance...");
                        const response = await setUserPresence(attendanceId, userData._id, signedMessage);
                        console.log("🎉 User Presence Response:", response);

                        if (response.success) {
                            setStatusMessage("✅ Successfully joined!");
                            setTimeout(onClose, 2000);
                        } else {
                            setStatusMessage("❌ Failed to join. Try again.");
                        }
                    }
                } catch (error) {
                    console.error("🔴 Signature Error:", error);
                    setStatusMessage("❌ Error signing message.");
                }
            } else {
                setStatusMessage("⚠️ No NFC data found.");
            }
        } catch (error) {
            console.error("🚨 NFC Read Error:", error);
            setStatusMessage("❌ NFC scan failed.");
        } finally {
            setLoading(false);
            await resetNfc();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>NFC Attendance</Text>

                    {loading ? (
                        <LottieView
                            source={require('../../../assets/animations/nfc-loft.json')}
                            autoPlay loop style={styles.animation}
                        />
                    ) : (
                        <Ionicons name="checkmark-circle" size={60} color={isValid ? "green" : "gray"} />
                    )}

                    <Text style={styles.statusMessage}>{statusMessage}</Text>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 320,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statusMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
        color: '#333',
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    animation: {
        width: 100,
        height: 100,
    },
});

export default AndroidNfcReaderModal;
