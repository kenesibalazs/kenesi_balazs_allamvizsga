import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Occasion, User } from '../../types/apiTypes';
import useAttendance from '../../hooks/useAttendance';
import { useAuth } from '../../context/AuthContext';
import { countOccurrences, getDayLabel, getTimeDifference } from '../../utils/occasionUtils';
import { startAttendanceSession } from '../../utils/attendanceUtils';
import useUsers from '../../hooks/useUsers';
import { Theme } from '../../styles/theme';
import LottieView from 'lottie-react-native';

interface NextOccasionProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
    onRefresh: () => void;
}

const NextOccasionCard: React.FC<NextOccasionProps> = ({ occasions, onRefresh }) => {
    const [displayOccasion, setDisplayOccasion] = useState<NextOccasionProps['occasions'][0] | null>(null);
    const [occurrenceLabel, setOccurrenceLabel] = useState<number>();
    const [dayLabel, setDayLabel] = useState<string>('');
    const [attendingPeople, setAttendingPeople] = useState<string[]>([]);
    const [nextOrOngoingLabel, setNextOrOngoingLabel] = useState<string>('');
    const [timeLabel, setTimeLabel] = useState<string>('');
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const [loopAnimation, setLoopAnimation] = useState(false);
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
            onRefresh();
        }
    };




    if (!displayOccasion) return null;

    if (displayOccasion.date.toDateString() === new Date().toDateString()) {
        return (
            <Text style={styles.nextOrOngoingLabel}>No occasion for today 😞</Text>
        )
    } else if (userData) {
        return (

            <View style={Theme.globalStyles.dataCcontainer}>
                <Text style={styles.nextOrOngoingLabel}>{nextOrOngoingLabel.toUpperCase()}</Text>
                <View style={styles.occasionCardContainer}>


                    <View>

                        <LottieView
                            source={
                                userData.type === "TEACHER"
                                    ? require('../../../assets/animations/presentStudent.json')
                                    : require('../../../assets/animations/presentStudent.json')
                            }
                            autoPlay
                            style={styles.animation}
                        />
                        <Text style={styles.activeBadgeText}>{"Not Started Yet".toUpperCase()}</Text>

                        <Text style={styles.classTitle}>
                            {typeof displayOccasion.occasion.subjectId === 'object' ? displayOccasion.occasion.subjectId.name : 'Unknown Subject'}
                        </Text>
                        <View style={{ flexDirection: 'column', }}>
                            <Text style={styles.occurrenceLabel}>Module {occurrenceLabel}</Text>

                            <Text style={styles.infoText}>
                                {typeof displayOccasion.occasion.classroomId === 'object' ? displayOccasion.occasion.classroomId.name : 'Unknown Classroom'}
                            </Text>

                        </View>
                        <View style={styles.teacherContainer}>
                            <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.teacherImage} />
                            <View style={{ flexDirection: 'column', gap: 5 }}>
                                <Text style={styles.teacherName}>
                                    {typeof displayOccasion.occasion.teacherId === 'object' ? displayOccasion.occasion.teacherId.name : "Unknown Teacher"}
                                </Text>
                                <Text style={styles.classTime}>{dayLabel}, {displayOccasion.occasion.startTime} - {displayOccasion.occasion.endTime}</Text>


                            </View>
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

                </View>

            </View>
        )
    }
};

const styles = StyleSheet.create({

    nextOrOngoingLabel: {
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

    occurrenceLabel: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        marginBottom: Theme.margin.extraSmall,
        fontFamily: Theme.fonts.regular,

    },
    classTime: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        marginBottom: Theme.margin.extraSmall,
        fontFamily: Theme.fonts.regular,

    },
    infoText: {
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
        width: 45,
        height: 45,
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    startButton: {
        backgroundColor: 'rgba(0, 139, 248, 0.8)',
    },
    buttonText: {
        color: Theme.colors.textLight,
        fontSize: Theme.fontSize.medium,
        fontFamily: Theme.fonts.regular,
    },

    animation: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 150,
        height: 125,
    },

});

export default NextOccasionCard;