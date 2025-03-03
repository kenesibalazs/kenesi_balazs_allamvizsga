/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import NextOccasionCard from "../components/NextOccasionCard";
import ActiveAttendanceCard from '../components/ActiveOccasionCard';

import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useTimetableData } from '../hooks/useTimetableData';
import { useAuth } from '../context/AuthContext';
import MyModule from '../../modules/my-module';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { generateOccasionInstances } from '../utils/occasionUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import useAttendance from '../hooks/useAttendance';
import { User } from '../types/apiTypes';


const MainPage = () => {
    const { userData, logout } = useAuth();
    const [message, setMessage] = useState('Message from backend');
    const { occasions } = useTimetableData();
    const [signature, setSignature] = useState<string | null>(null);
    const { isValid, loading, error, checkSignature } = useVerifySignature();
    const { studentsActiveAttendances, fetchStudentActiveAttendances } = useAttendance();

    const [refresh, setRefresh] = useState<boolean>(false)

    const hasLogged = useRef(false);


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

        console.log(studentsActiveAttendances)
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
            <ScrollView contentContainerStyle={styles.container}>

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


                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.nextClassContainer}>


                    <View style={styles.nextClassHeader}>
                        <Text style={styles.nextClassTitle}>Next Class</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {studentsActiveAttendances?.length > 0 ? (
                        studentsActiveAttendances.map((attendance) => {
                            const occasion = occasions.find((occ) => occ._id === attendance.occasionId);
                            return (
                                <View key={attendance._id}>
                                    <ActiveAttendanceCard attendance={attendance} occasion={occasion} />
                                </View>
                            );
                        })
                    ) : (
                        <NextOccasionCard occasions={occasionInstances} />
                    )}



                </View>




                <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                    Logout
                </Button>


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
                        <Text style={styles.verificationText}>
                            {isValid ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}
                        </Text>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        padding: 16,
    },


    /// welcome text

    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    icon: {
        width: 54,
        height: 54,
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


    /// search bar


    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },

    searchIcon: {
        marginRight: 8,
    },

    searchInput: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },



    // next class

    nextClassContainer: {
        marginTop: 20,
    },

    nextClassHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    nextClassTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#007AFF',
    },

    classCard: {
        overflow: 'hidden',
        borderRadius: 32,
        marginTop: 8,
    },

    gradientContainer: {
        borderRadius: 32,
    },


    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


    classsHeaderIcon: {
        backgroundColor: '#AFD2E9',
        padding: 12,
        fontSize: 24,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 16,
    },

    activeBadge: {
        backgroundColor: '#9ECE9A',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        marginTop: 4,
    },

    activeBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    cardContent: {
        paddingHorizontal: 16,
        paddingVertical: 4,
    },

    classTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        color: 'white',

    },

    classTime: {
        fontSize: 14,
        color: 'white',
    },

    classRoom: {
        fontSize: 14,
        color: 'white',
        marginBottom: 8,
    },

    teacherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    teacherImage: {
        width: 32,
        height: 32,
        borderRadius: 100,
        marginRight: 8,
    },

    teacherName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },

    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        position: 'absolute',
        right: 16,
        bottom: 16,
    },

    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
    },



    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff4444',
    },
    signatureContainer: {
        marginTop: 20,
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