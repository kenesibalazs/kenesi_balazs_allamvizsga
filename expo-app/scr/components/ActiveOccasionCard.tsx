import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Attendance, Occasion } from '../types/apiTypes';

interface ActiveAttendancesCardProps {
    attendance: Attendance;
    occasion?: Occasion;
}

const ActiveAttendanceCard: React.FC<ActiveAttendancesCardProps> = ({ attendance, occasion }) => {
    const [timeElapsed, setTimeElapsed] = useState('');

    useEffect(() => {

        console.log(occasion)

        const calculateTimeElapsed = () => {
            if (!attendance?.startTime) return;
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

            if (diffDays > 0) {
                setTimeElapsed(`Started ${diffDays} day${diffDays > 1 ? 's' : ''} ago`);
            } else if (diffHours > 0) {
                setTimeElapsed(`Started ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`);
            } else {
                setTimeElapsed(`Started ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`);
            }
        };

        calculateTimeElapsed();
        const interval = setInterval(calculateTimeElapsed, 60000);
        return () => clearInterval(interval);
    }, [attendance]);

    return (
        <LinearGradient colors={['#4EB3DE', '#5E94AB']} style={styles.gradientContainer}>
            <View style={styles.classHeader}>
                <Ionicons name="book-outline" size={20} color="#333" style={styles.classHeaderIcon} />
                <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.classTitle}>
                    {typeof occasion.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                </Text>
                <Text style={styles.timeElapsed}>{timeElapsed}</Text>
                <Text style={styles.classRoom}>{occasion?.classroomId}</Text>
                <View style={styles.teacherContainer}>
                    <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.teacherImage} />
                    <Text style={styles.teacherName}>
                        {typeof occasion.teacherId == 'object' ? occasion.teacherId.name : "Unknonw Teacher"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
                <Ionicons name="log-in-outline" size={20} color="white" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        borderRadius: 32,
        paddingBottom: 60,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    classHeaderIcon: {
        backgroundColor: '#AFD2E9',
        padding: 12,
        fontSize: 24,
        borderRadius: 16,
    },
    activeBadge: {
        backgroundColor: 'green',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    activeBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    classTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    timeElapsed: {
        fontSize: 14,
        color: 'white',
        fontStyle: 'italic',
        marginBottom: 8,
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
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 20,
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 16,
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
    },
});

export default ActiveAttendanceCard;
