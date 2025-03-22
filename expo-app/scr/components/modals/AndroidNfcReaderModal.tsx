import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import MyModule from '../../../modules/my-module/src/MyModule';
import { useVerifySignature } from '../../hooks/useVerifySignature';
import useAttendance from '../../hooks/useAttendance';
import { Theme } from '../../styles/theme';

NfcManager.start();

interface AndroidNfcReaderModalProps {
    visible: boolean;
    onClose: () => void;
    attendanceId: string;
    onRefresh: () => void;
}


const AndroidNfcReaderModal: React.FC<AndroidNfcReaderModalProps> = ({ visible, onClose, attendanceId, onRefresh }) => {
    const { userData } = useAuth();
    const [nfcMessage, setNfcMessage] = useState('');
    const [signature, setSignature] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const { isValid } = useVerifySignature();
    const { setUserPresence } = useAttendance();

    useEffect(() => {
        if (visible) {
            readNfcTag();
        }
    }, [visible]);

    const resetState = async () => {
        await NfcManager.cancelTechnologyRequest().catch(() => { });
        setNfcMessage('');
        setSignature(null);
        setStatusMessage('');
        setLoading(false);
    };

    const handleClose = async () => {
        await resetState();
        onClose();
    };

    const readNfcTag = async () => {
        setLoading(true);
        setStatusMessage("Waiting for NFC scan...");

        try {
            await NfcManager.cancelTechnologyRequest();
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
                            setIsSuccess(true);
                            setTimeout(() => {
                                onRefresh()
                                handleClose();
                            }, 2000);
                        } else {
                            setIsSuccess(false);
                            setStatusMessage("❌ Failed to join. Try again.");
                            setTimeout(() => {
                                handleClose();
                            }, 1000);
                        }
                    }
                } catch (error) {
                    setIsSuccess(false);
                    console.error("🔴 Signature Error:", error);
                    setStatusMessage("❌ Failed to join. Try again.");
                    setTimeout(() => {
                        handleClose();
                    }, 1000);
                }
            } else {
                setIsSuccess(false);
                setStatusMessage("❌ Failed to join. Try again.");
                setTimeout(() => {
                    handleClose();
                }, 1000);
            }
        } catch (error) {
            setIsSuccess(false);
            console.log("🚨 NFC Read Error:", error);
            setStatusMessage("❌ Failed to join. Try again.");
            setTimeout(() => {
                handleClose();
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>NFC Attendance</Text>

                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color={Theme.colors.textLight} />
                    </TouchableOpacity>

                    {loading ? (
                        <LottieView
                            source={require('../../../assets/animations/nfc-loft.json')}
                            autoPlay loop
                            style={styles.animation}
                        />
                    ) : isSuccess === true ? (
                        <LottieView
                            source={require('../../../assets/animations/success.json')}
                            autoPlay loop
                            style={styles.animation}
                        />
                    ) : isSuccess === false ? (
                        <LottieView
                            source={require('../../../assets/animations/error.json')}
                            autoPlay loop
                            style={styles.animation}
                        />
                    ) : null}

                    <Text style={styles.statusMessage}>{statusMessage}</Text>

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
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.borderRadius.large,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        alignItems: 'center',
    },
    title: {
        fontSize: Theme.fontSize.extraExtraLarge,
        color: Theme.colors.textLight,
        fontFamily: Theme.fonts.extraBold,
        marginBottom: 10,
    },
    statusMessage: {
        fontSize: Theme.fontSize.medium,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
        color: Theme.colors.text.light,
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
        width: 200,
        height: 200,
    },

    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        zIndex: 10,
    },
});

export default AndroidNfcReaderModal;
