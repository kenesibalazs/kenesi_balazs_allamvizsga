import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Attendance, Occasion } from '../../types/apiTypes';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import useAttendance from '../../hooks/useAttendance'
import AndroidNfcReaderModal from '../modals/AndroidNfcReaderModal';

import { ActiveAttendanceNavigateProps, OccasionInfoNavigateProps } from '../../types/navigationTypes';

interface ActiveAttendanceCardProps {
    attendance: Attendance;
    occasion?: Occasion;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActiveAttendanceCard: React.FC<ActiveAttendanceCardProps> = ({ attendance, occasion, setRefresh }) => {
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
                            setRefresh((prev) => !prev);
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


    return (
        <View style={styles.container}>
            <Text style={styles.activeLabel}>{'Active Occasion'.toUpperCase()}</Text>

            <View style={styles.occasionCardContainer}>

                <View>
                    <Text style={styles.activeBadgeText}>{'Active'.toUpperCase()}</Text>
                    <Text style={styles.classTitle}>
                        {typeof occasion?.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                    </Text>
                    <Text style={styles.timeElapsed}>{timeElapsed}</Text>
                    <Text style={styles.classRoom}>
                        {typeof occasion.classroomId === 'object' ? occasion.classroomId.name : 'Unknown Classroom'}
                    </Text>
                    <View style={styles.teacherContainer}>
                        <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.teacherImage} />
                        <Text style={styles.teacherName}>
                            {typeof occasion?.teacherId === 'object' ? occasion.teacherId.name : 'Unknown Teacher'}
                        </Text>
                    </View>
                </View>
                {userData.type === "STUDENT" && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleJoinPress}>
                            <Text style={styles.buttonText}>Join</Text>
                            <Ionicons name="log-in-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {userData.type === "TEACHER" && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.endButton]} onPress={() => handleEndPress(attendance)}>
                            <Text style={styles.buttonText}>End</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleWatchPress}>
                            <Text style={styles.buttonText}>Watch</Text>
                            <Ionicons name="eye-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                <AndroidNfcReaderModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    attendanceId={attendance._id}

                />


            </View>
        </View>
    );
};

import { Theme } from "../../styles/theme";

const styles = StyleSheet.create({
    container: {
        padding: Theme.padding.medium,
    },

    activeLabel: {
        fontSize: Theme.fontSize.large,
        marginBottom: Theme.margin.medium,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.textLight,
    },

    occasionCardContainer: {
        borderRadius: Theme.borderRadius.extraLarge,
        padding: Theme.padding.medium,
        backgroundColor: Theme.colors.primary,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
    },

    activeBadgeText: {
        fontSize: Theme.fontSize.small,
        color: Theme.colors.accent,
        marginBottom: Theme.margin.small,
        fontFamily: Theme.fonts.regular,
    },
    classTitle: {
        fontSize: Theme.fontSize.extraLarge,
        fontFamily: Theme.fonts.extraBold,
        color: Theme.colors.textLight,
        marginBottom: Theme.margin.small,
    },
    timeElapsed: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        marginBottom: Theme.margin.extraSmall,
        fontFamily: Theme.fonts.regular,
    },
    classRoom: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        marginBottom: Theme.margin.medium,
        fontFamily: Theme.fonts.regular,
    },
    teacherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Theme.margin.small,

    },
    teacherImage: {
        width: 32,
        height: 32,
        borderRadius: Theme.borderRadius.full,
        marginRight: Theme.margin.small,
    },
    teacherName: {
        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.textLight,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: Theme.borderRadius.large,
        backgroundColor: Theme.colors.myblue,
    },

    endButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 32,

    },

    buttonText: {
        color: Theme.colors.textLight,
        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.regular,
        marginRight: 6,
    },
});

export default ActiveAttendanceCard;
