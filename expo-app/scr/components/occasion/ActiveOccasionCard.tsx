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


    const handleJoinPress = () => {
        if (Platform.OS === 'ios') {
            console.log("Join button pressed on iOS!");
            Alert.alert("Join iOS", "TODOO -> READ DATA NFC FROM RASPBERRY -> SIGND DATA WITH PRIVATE KEY -> JOIN CALSS");
        } else if (Platform.OS === 'android') {
            setModalVisible(true)
            console.log("Join button pressed on Android!");
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
                        <Text style={GlobalStyles.bigLabel}>
                            {typeof occasion?.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                        </Text>
                        <Text style={GlobalStyles.smallLabel}>{timeElapsed}</Text>
                        <Text style={[GlobalStyles.smallLabel, { marginBottom: 12 }]}>
                            {typeof occasion.classroomId === 'object' ? occasion.classroomId.name : 'Unknown Classroom'}
                        </Text>
                        <View style={GlobalStyles.nameContainer}>
                            <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={GlobalStyles.mediumProfilePicture} />
                            <Text style={GlobalStyles.mediumLabel}>
                                {typeof occasion?.teacherId === 'object' ? occasion.teacherId.name : 'Unknown Teacher'}
                            </Text>
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
