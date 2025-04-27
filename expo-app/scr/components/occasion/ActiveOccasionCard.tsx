import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

import { ActiveAttendanceNavigateProps, ActiveAttendanceCardProps, Attendance } from '../../types';
import { useAttendance } from '../../hooks'
import { AndroidNfcReaderModal } from '../modals';
import { useAuth } from '../../context/AuthContext';
import { GlobalStyles } from '../../styles/globalStyles';
import { Theme } from '../../styles/theme';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';


const ActiveAttendanceCard: React.FC<ActiveAttendanceCardProps> = ({ attendance, occasion, onRefresh }) => {
    const [timeElapsed, setTimeElapsed] = useState('');
    const { userData, logout } = useAuth();
    const { endAttendance } = useAttendance();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    useEffect(() => {
        if (!attendance?.startTime) return;

        const calculateTimeElapsed = () => {
            const startTime = new Date(attendance.startTime);
            const now = new Date();
            const diffMs = now.getTime() - startTime.getTime();

            if (diffMs < 0) {
                setTimeElapsed('Starting soon');
                return;
            }

            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            setTimeElapsed(
                diffDays > 0
                    ? `Started ${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                    : diffHours > 0
                        ? `Started ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
                        : `Started ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
            );
        };

        calculateTimeElapsed();
        const interval = setInterval(calculateTimeElapsed, 60000);

        return () => clearInterval(interval);
    }, [attendance]);


    const handleJoinPress = async () => {
        if (Platform.OS === 'ios') {
            console.log("Join button pressed on iOS!");
            await NfcManager.start();
            try {
                await NfcManager.requestTechnology(NfcTech.Ndef, {
                    alertMessage: "Hold your iPhone near the NFC tag!"
                });
    
                const tag = await NfcManager.getTag();
                console.log('NFC TAG:', tag);
                Alert.alert('NFC Tag Found', JSON.stringify(tag));
    
                await NfcManager.cancelTechnologyRequest();
            } catch (ex: any) {
                console.warn('NFC Error:', ex);
    
                // ADD THIS BROOOOO 🔥
                if (ex?.message?.includes('NFCReaderSessionInvalidationErrorUserCanceled')) {
                    Alert.alert('NFC', 'NFC session canceled by user.');
                } else if (ex?.message?.includes('NFCReaderSessionInvalidationErrorSessionTimeout')) {
                    Alert.alert('NFC', 'NFC session timed out.');
                } else if (ex?.message?.includes('NFCReaderSessionInvalidationErrorUnsupportedFeature')) {
                    Alert.alert('NFC', 'This device does not support NFC.');
                } else if (ex?.message?.includes('Missing entitlements') || ex?.message?.includes('permission')) {
                    Alert.alert('NFC Permission Error', 'No NFC permission granted! (Maybe app.json missing?)');
                } else {
                    Alert.alert('NFC Error', ex?.message || 'Unknown error');
                }
    
                await NfcManager.cancelTechnologyRequest();
            }
        } else if (Platform.OS === 'android') {
            console.log("Join button pressed on Android!");
            setModalVisible(true);
        }
    };
    const handleEndPress = async (attendance: Attendance) => {
        Alert.alert('End Attendance', 'Are you sure you want to end this attendance session?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        const isSuccess = await endAttendance(attendance._id, userData._id);

                        if (isSuccess) {
                            Alert.alert('Success', 'Attendance session ended successfully.');
                            onRefresh();
                        } else {
                            Alert.alert('Error', 'Failed to end the attendance session.');
                        }
                    } catch (error) {
                        console.error('Error ending attendance:', error);
                        Alert.alert('Error', 'Failed to end the attendance session.');
                    }
                },
            },
        ]);
    };

    const activeAttendanceNavigation = useNavigation<ActiveAttendanceNavigateProps>();

    const handleWatchPress = () => {
        activeAttendanceNavigation.navigate("ActiveAttendance", { attendance });
    };

    if (!occasion) {
        return null;
    }


    const isStudentPresent = attendance.participants.some(
        participant =>
            (typeof participant.userId === "object" ? participant.userId._id : participant.userId) === userData._id &&
            participant.status === "present"
    );

    return (
        <>

            <Text style={GlobalStyles.subtitle}>{'Active Occasion'.toUpperCase()}</Text>
            <Animatable.View animation="fadeInUp" duration={400} style={GlobalStyles.dataContainer}>

                <View style={GlobalStyles.card}>

                    <View>

                        <LottieView
                            source={
                                userData.type === "TEACHER"
                                    ? require('../../../assets/animations/activeTeacher.json')
                                    : isStudentPresent
                                        ? require('../../../assets/animations/presentStudent.json')
                                        : require('../../../assets/animations/activeTeacher.json')
                            }
                            autoPlay
                            style={GlobalStyles.animation}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="flash" size={16} color="#4CAF50" />
                            <Text style={[GlobalStyles.badgeLabel, { color: '#4CAF50' }]}>ACTIVE</Text>
                        </View>
                        <Text style={[GlobalStyles.bigLabel, { marginTop: 8 }]}>
                            {typeof occasion?.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="time-outline" size={16} color={Theme.colors.text.light} />
                            <Text style={GlobalStyles.smallLabel}>{timeElapsed}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="location-outline" size={16} color={Theme.colors.text.light} />
                            <Text style={GlobalStyles.smallLabel}>
                                {typeof occasion.classroomId === 'object' ? occasion.classroomId.name : 'Unknown Classroom'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                            <Ionicons name="people-outline" size={16} color={Theme.colors.text.light} />
                            <Text style={GlobalStyles.smallLabel}>
                                {Array.isArray(occasion.groupIds)
                                    ? occasion.groupIds.map((group: any) => group.name).join(', ')
                                    : 'Unknown Groups'}
                            </Text>
                        </View>


                        <View style={GlobalStyles.nameContainer}>
                            {userData.type === 'STUDENT' ? (
                                <>
                                    {typeof occasion.teacherId === 'object' && occasion.teacherId.profileImage ? (
                                        <Animatable.View animation="fadeInUp" duration={300}>
                                            <Image
                                                source={{ uri: occasion.teacherId.profileImage }}
                                                style={GlobalStyles.mediumProfilePicture}
                                            />
                                        </Animatable.View>
                                    ) : (
                                        <Animatable.View animation="fadeInUp" duration={300}>
                                            <View style={[GlobalStyles.mediumProfilePicture, { backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' }]}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                    {(occasion.teacherId as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </Text>
                                            </View>
                                        </Animatable.View>
                                    )}
                                    <Text style={[GlobalStyles.mediumLabel, { color: Theme.colors.text.light }]}>
                                        {typeof occasion?.teacherId === 'object' ? occasion.teacherId.name : 'Unknown Teacher'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    {attendance.participants.slice(0, 3).map((participant, index) => {
                                        const user = participant.userId;
                                        return typeof user === 'object' && user.profileImage ? (
                                            <Animatable.View animation="fadeInUp" duration={300} key={index}>
                                                <Image
                                                    source={{ uri: user.profileImage }}
                                                    style={[GlobalStyles.mediumProfilePicture, { marginLeft: index === 0 ? 0 : -10 }]}
                                                />
                                            </Animatable.View>
                                        ) : (
                                            <Animatable.View animation="fadeInUp" duration={300} key={index}>
                                                <View
                                                    style={[
                                                        GlobalStyles.mediumProfilePicture,
                                                        {
                                                            marginLeft: index === 0 ? 0 : -18,
                                                            justifyContent: 'center',
                                                            backgroundColor: Theme.colors.primary,
                                                            alignItems: 'center',

                                                        },
                                                    ]}
                                                >
                                                    <Text style={{ color: Theme.colors.text.light, fontFamily: Theme.fonts.extraBold }}>
                                                        {(user as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </Text>
                                                </View>
                                            </Animatable.View>
                                        );
                                    })}
                                    {attendance.participants.length > 3 && (
                                        <Animatable.View animation="fadeInDown" duration={300}>
                                            <View style={[GlobalStyles.mediumProfilePicture, { backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: -18 }]}>
                                                <Text style={{ fontWeight: 'bold', color: Theme.colors.text.light, fontFamily: Theme.fonts.extraBold }}>
                                                    +{attendance.participants.length - 3}
                                                </Text>
                                            </View>
                                        </Animatable.View>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                    <View style={[GlobalStyles.buttonContainer, { gap: 8, justifyContent: 'flex-end' }]}>
                        {userData.type === "STUDENT" ? (
                            isStudentPresent ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    <Text style={[GlobalStyles.mediumLabel, { color: '#4CAF50' }]}>You're already in!</Text>
                                </View>
                            ) : (
                                <TouchableOpacity style={GlobalStyles.defaultButton} onPress={handleJoinPress}>
                                    <Text style={GlobalStyles.mediumLabel}>Join</Text>
                                    <Ionicons name="log-in-outline" size={20} color="white" />
                                </TouchableOpacity>
                            )
                        ) : (
                            <>
                                <TouchableOpacity style={[GlobalStyles.defaultButton, GlobalStyles.endButton]} onPress={() => handleEndPress(attendance)} >
                                    <Text style={GlobalStyles.mediumLabel}>End</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={GlobalStyles.defaultButton} onPress={handleWatchPress}>
                                    <Text style={[GlobalStyles.mediumLabel, { marginRight: 8 }]}>Watch</Text>
                                    <Ionicons name="eye-outline" size={20} color="white" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>



                    <AndroidNfcReaderModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        attendanceId={attendance._id}
                        onRefresh={onRefresh}
                    />


                </View>
            </Animatable.View>

        </>
    );
};

export default ActiveAttendanceCard;
