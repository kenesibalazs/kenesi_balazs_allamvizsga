import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { useAuth } from '../../context/AuthContext';

NfcManager.start();

import MyModule from '../../../modules/my-module/src/MyModule';
import { useVerifySignature } from '../../hooks/useVerifySignature';
import useAttendance from '../../hooks/useAttendance';


interface AndroidNfcReaderModalProps {
    visible: boolean;
    onClose: () => void;
    attendanceId: string;
}


const AndroidNfcReaderModal: React.FC<AndroidNfcReaderModalProps> = ({ visible, onClose, attendanceId }) => {
    const { userData, logout } = useAuth();
    const [nfcMessage, setNfcMessage] = useState('');
    const [signature, setSignature] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const { isValid, loading, error, checkSignature } = useVerifySignature();
    const { setUserPresence } = useAttendance();

    useEffect(() => {
        if (!visible) {
            setNfcMessage('');
            setSignature(null);
            setIsVerifying(false);
        }
    }, [visible]);

    useEffect(() => {
        const resetNfc = async () => {
            await NfcManager.cancelTechnologyRequest().catch(() => { });
        };

        const readNfcTag = async () => {
            try {
                await resetNfc();
                await NfcManager.requestTechnology(NfcTech.Ndef);

                const tag = await NfcManager.getTag();
                console.log("Full NFC Tag Data:", JSON.stringify(tag, null, 2));

                if (tag.ndefMessage) {
                    let message = Ndef.text.decodePayload(new Uint8Array(tag.ndefMessage[0].payload));
                    console.log("✅ NDEF Text Read:", message);
                    setNfcMessage(message);

                    try {
                        const signedMessage = await MyModule.signMessage(message);
                        setSignature(signedMessage);
                        console.log('Signature:', signedMessage);

                        if (signedMessage) {
                            
                            try{
                                const response = await setUserPresence(attendanceId, userData._id, signedMessage);
                                console.log("User Presence Response:", response);

                            }catch(error){
                                console.error("Error setting user presence:", error);
                            }

                        }
                    } catch (error) {
                        console.error("Signature Error:", error);
                    }
                } else {
                    console.log("⚠️ No NDEF Data Found");
                }
            } catch (error) {
                console.error("🚨 NFC Read Error:", error);
            } finally {
                await resetNfc();
            }
        };

        if (visible) {
            readNfcTag();
        }

        return () => {
            resetNfc();
        };
    }, [visible]);

    const handleVerify = async () => {
        if (!nfcMessage || !signature || isVerifying) return;
        setIsVerifying(true);
        try {
            await checkSignature(userData.publicKey, nfcMessage, signature);
        } catch (error) {
            console.error("Verification Error:", error);
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        if (isValid === true) {
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    }, [isValid]);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>NFC Reader</Text>
                    <Text style={styles.message}>{nfcMessage || 'Tap an NFC tag'}</Text>
                    <Text>{attendanceId}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {signature && <Text>Signature: {signature}</Text>}
                    {!isVerifying && signature && (
                        <TouchableOpacity onPress={handleVerify}>
                            <Text >Verify Signature</Text>
                        </TouchableOpacity>
                    )}
                    {loading && <Text>Verifying...</Text>}
                    {isValid !== null && (
                        <Text style={styles.verificationText}>
                            {isValid ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}
                        </Text>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
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
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    verificationText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default AndroidNfcReaderModal;
