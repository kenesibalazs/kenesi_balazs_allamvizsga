import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Occasion, User } from '../types/apiTypes';
import useAttendance from '../hooks/useAttendance';
import { useAuth } from '../context/AuthContext';
import { countOccurrences, getDayLabel, getTimeDifference } from '../utils/occasionUtils';
import { startAttendanceSession } from '../utils/attendanceUtils';
import useUsers from '../hooks/useUsers';

interface NextOccasionProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const NextOccasionCard: React.FC<NextOccasionProps> = ({ occasions, setRefresh }) => {
    const [displayOccasion, setDisplayOccasion] = useState<NextOccasionProps['occasions'][0] | null>(null);
    const [occurrenceLabel, setOccurrenceLabel] = useState<number>();
    const [dayLabel, setDayLabel] = useState<string>('');
    const [attendingPeople, setAttendingPeople] = useState<string[]>([]);
    const [nextOrOngoingLabel, setNextOrOngoingLabel] = useState<string>('');
    const [timeLabel, setTimeLabel] = useState<string>('');
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const { users, getAllUsers } = useUsers();

    const { userData, logout } = useAuth();
    const { createNewAttendance, loading, error } = useAttendance();

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        if (occasions.length === 0) return;

        const now = new Date();
        let ongoing = occasions.find(occ => now >= new Date(occ.date) && now <= new Date(occ.endDate)) || null;
        let upcoming = occasions.filter(occ => new Date(occ.date) > now).sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] || null;

        const selectedOccasion = ongoing || upcoming;
        if (!selectedOccasion) return;

        setDisplayOccasion(selectedOccasion);
        setNextOrOngoingLabel(ongoing ? 'Ongoing Occasion' : 'Next Occasion');
        setDayLabel(getDayLabel(selectedOccasion.date));
        setTimeLabel(getTimeDifference(now, ongoing ? selectedOccasion.endDate : selectedOccasion.date));

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLabel(getTimeDifference(new Date(), ongoing ? selectedOccasion.endDate : selectedOccasion.date));
        }, 60000);

        return () => intervalRef.current && clearInterval(intervalRef.current);
    }, [occasions]);

    useEffect(() => {
        if (!displayOccasion) return

        if (displayOccasion && users.length > 0) {
            getUsersWithOccasion(displayOccasion.occasion, users);
        }

        setOccurrenceLabel(countOccurrences(displayOccasion.occasion, new Date()));

    }, [displayOccasion, users]);


    const getUsersWithOccasion = (occasion: Occasion, users: User[]): void => {
        if (!occasion || users.length === 0) {
            console.log("No users or occasion provided.");
            return;
        }
        const matchedUsers = users.filter(user => user.occasionIds?.includes(occasion._id) ?? false);
        setAttendingPeople(matchedUsers.map(user => `${user.name} ${user._id} (${user.neptunCode})`));
    };


    const handleStartClass = async (startedOccasion: Occasion) => {
       
        const isSuccess = await startAttendanceSession(startedOccasion, new Date(), users, createNewAttendance, userData._id);

         if (isSuccess) {
            setRefresh((prev) => !prev);
        }
    };


    if (!displayOccasion) return null;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#868F96', '#596164']} style={styles.gradientContainer}>
                <View style={styles.classHeader}>
                    <Ionicons name="book-outline" size={24} color="#FFF" style={styles.classHeaderIcon} />
                    <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Not Started Yet</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.classTitle}>
                        {typeof displayOccasion.occasion.subjectId === 'object' ? displayOccasion.occasion.subjectId.name : 'Unknown Subject'}
                        <Text style={styles.occurrenceLabel}> • {occurrenceLabel}</Text>
                    </Text>
                    <Text style={styles.classTime}>{dayLabel}, {displayOccasion.occasion.startTime} - {displayOccasion.occasion.endTime}</Text>
                    <Text style={styles.classRoom}>{displayOccasion.occasion.classroomId}</Text>
                    <View style={styles.teacherContainer}>
                        <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.teacherImage} />
                        <Text style={styles.teacherName}>
                            {typeof displayOccasion.occasion.teacherId === 'object' ? displayOccasion.occasion.teacherId.name : "Unknown Teacher"}
                        </Text>
                    </View>

                    {userData.type === "TEACHER" &&
                        (typeof displayOccasion.occasion.teacherId === "string"
                            ? displayOccasion.occasion.teacherId === userData._id
                            : displayOccasion.occasion.teacherId._id === userData._id) && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => console.log("Dismissed")}>
                                    <Text style={styles.buttonText}>Dismiss</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.startButton]} onPress={() => handleStartClass(displayOccasion.occasion)}>
                                    <Text style={styles.buttonText}>Start Class</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    gradientContainer: {
        padding: 16,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    classHeaderIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        marginRight: -16,
    },
    activeBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 600,
    },
    cardContent: {},
    classTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    occurrenceLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    classTime: {
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
        marginBottom: 16,
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    startButton: {
        backgroundColor: 'rgba(0, 139, 248, 0.8)',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default NextOccasionCard;