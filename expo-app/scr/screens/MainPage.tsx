import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, TextInput, PanResponder } from 'react-native';
import NextOccasionCard from "../components/NextOccasionCard";
import ActiveAttendanceCard from '../components/ActiveOccasionCard';
import TimelineOccasionCard from '../components/TimelineOccasionCard';
import SoonOccasionContainer from '../components/SoonOccasionContainer';

import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import MyModule from '../../modules/my-module';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { generateOccasionInstances } from '../utils/occasionUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useAttendance from '../hooks/useAttendance';



const MainPage = () => {
    const { userData, logout } = useAuth();
    const [message, setMessage] = useState('Message from backend');
    const { occasions } = useTimetableData();
    const [signature, setSignature] = useState<string | null>(null);
    const { isValid, loading, error, checkSignature } = useVerifySignature();
    const { studentsActiveAttendances, fetchStudentActiveAttendances } = useAttendance();
    const [activeTab, setActiveTab] = useState('TODAY');

    const [refresh, setRefresh] = useState<boolean>(false);

    const hasLogged = useRef(false);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    const occasionInstances = generateOccasionInstances(occasions);

    useEffect(() => {
        if (userData && userData._id && !hasLogged.current) {
            fetchStudentActiveAttendances(userData._id);
            hasLogged.current = true;
        }

        if (refresh) {
            fetchStudentActiveAttendances(userData._id);
            setRefresh(false);
        }

        console.log(studentsActiveAttendances);
    }, [userData, fetchStudentActiveAttendances, refresh]);


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
        <SafeAreaView style={styles.safeArea}>
            <View
                style={styles.container}
            >

                <View style={styles.welcomeContainer}>
                    <Image
                        source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }}
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.welcomeText}>Welcome,</Text>
                        <Text style={styles.usernameText}>{userData.name}</Text>
                    </View>

                    <TouchableOpacity style={styles.notificationIcon}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('TODAY')}
                        style={[styles.tab, activeTab === 'TODAY' && styles.activeTab]}>
                        <Text style={styles.tabText}>TODAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('TIMELINE')}
                        style={[styles.tab, activeTab === 'TIMELINE' && styles.activeTab]}>
                        <Text style={styles.tabText}>TIMELINE</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {activeTab === 'TODAY' ? (
                        <View style={styles.nextClassContainer}>
                            {studentsActiveAttendances?.length > 0 ? (
                                studentsActiveAttendances.map((attendance) => {
                                    const occasion = occasions.find((occ) => occ._id === attendance.occasionId);
                                    return (
                                        <View key={attendance.occasionId}>
                                            <ActiveAttendanceCard
                                                attendance={attendance}
                                                occasion={occasion}
                                                setRefresh={setRefresh}
                                            />
                                        </View>
                                    );
                                })
                            ) : (
                                <View>
                                    <NextOccasionCard occasions={occasionInstances} setRefresh={setRefresh} />
                                </View>
                            )}

                           
                        </View>
                    ) : (
                        <Text>
                            <TimelineOccasionCard occasions={occasionInstances} />
                        </Text>
                    )}
                </ScrollView>

                <View style={styles.signatureContainer}>
                    <Text>Message: {message}</Text>
                    <Button onPress={handleSignMessage}>Sign Message</Button>
                    {signature && <Text>Signature: {signature}</Text>}
                    {signature && (
                        <Button onPress={handleVerifySignature} disabled={loading}>
                            {loading ? "Verifying..." : "Verify Signature"}
                        </Button>
                    )}
                    {isValid !== null && (
                        <Text>
                            {isValid ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}
                        </Text>
                    )}
                    {error && <Text>{error}</Text>}
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        width: '100%',
    },
    welcomeContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 8,
        borderRadius: 100,
    },
    textContainer: {
        flexDirection: 'column',
    },
    welcomeText: {
        fontSize: 14,
    },
    usernameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    notificationIcon: {
        marginLeft: 'auto',
        padding: 8,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#F8E9E9',
    },
    tabContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
    },
    tabText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
    },
    nextClassContainer: {
       
    },


    signatureContainer: {
        marginTop: 'auto',
    }
});

export default MainPage;
