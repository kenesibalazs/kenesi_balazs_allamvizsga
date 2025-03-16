import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Attendance, Occasion } from '../types/apiTypes';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import useAttendance from '../hooks/useAttendance'

interface ActiveAttendanceCardProps {
    attendance: Attendance;
    occasion?: Occasion;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActiveAttendanceCard: React.FC<ActiveAttendanceCardProps> = ({ attendance, occasion, setRefresh }) => {
    const [timeElapsed, setTimeElapsed] = useState('');
    const { userData, logout } = useAuth();
    const { endAttendance } = useAttendance();
    const navigation = useNavigation();



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
            console.log("Join button pressed on Android!");
            Alert.alert("Join Android", "TODOO -> READ DATA NFC FROM RASPBERRY -> SIGND DATA WITH PRIVATE KEY -> JOIN CALSS ");
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


    const handleWatchPress = () => {
        navigation.navigate("ActiveAttendance", { attendance });
    };



      
    if (!occasion) {
        return null;
      }
      

    return (
        <View style={styles.container}>
            <Text style={styles.activeLabel}>{'Active Occasion'.toUpperCase()}</Text>

            <View style={styles.gradientContainer}>
                <View style={styles.classHeader}>
                    <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>{'Active'.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.classTitle}>
                        {typeof occasion?.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                    </Text>
                    <Text style={styles.timeElapsed}>{timeElapsed}</Text>
                    <Text style={styles.classRoom}>{occasion?.classroomId || 'Unknown Classroom'}</Text>
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


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        padding: 16,
    },

    activeLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },

    gradientContainer: {
        borderRadius: 24,
        padding: 16,
        backgroundColor: '#067BC2',
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerIcon:{
        marginRight: 4
    },

    cardContent: {},

    activeBadge: {
       
    },
    activeBadgeText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    classTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    timeElapsed: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    classRoom: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
    },
    teacherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,

    },
    teacherImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    teacherName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
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
        borderRadius: 16,
        backgroundColor: 'rgba(0, 139, 248, 0.8)',
    },

    endButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 32,

    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 6,
    },
});

export default ActiveAttendanceCard;
