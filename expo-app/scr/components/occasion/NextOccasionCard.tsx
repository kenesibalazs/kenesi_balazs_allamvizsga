import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { countOccurrences, getDayLabel, getTimeDifference, startAttendanceSession } from '../../utils';
import { NextOccasionProps, Occasion, User } from '../../types';
import { useAttendance, useUsers } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { Theme } from '../../styles/theme';
import { GlobalStyles } from '../../styles/globalStyles';


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
            <Text style={GlobalStyles.subtitle}>No occasion for today 😞</Text>
        )
    } else if (userData) {
        return (
            <>
                <Text style={GlobalStyles.subtitle}>{nextOrOngoingLabel.toUpperCase()}</Text>

                <Animatable.View animation="fadeInUp" duration={400} style={GlobalStyles.dataContainer}>
                    <View style={GlobalStyles.card}>
                        <View>
                            <LottieView
                                source={
                                    userData.type === "TEACHER"
                                        ? require('../../../assets/animations/presentStudent.json')
                                        : require('../../../assets/animations/presentStudent.json')
                                }
                                autoPlay
                                style={GlobalStyles.animation}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Ionicons name="time-outline" size={16} color="#FFA726" />
                                <Text style={[GlobalStyles.badgeLabel, { color: '#FFA726' }]}>NOT STARTED YET</Text>
                            </View>
                            <Text style={GlobalStyles.bigLabel}>
                                {typeof displayOccasion.occasion.subjectId === 'object' ? displayOccasion.occasion.subjectId.name : 'Unknown Subject'}
                            </Text>
                            <View style={{ flexDirection: 'column', }}>
                                <Text style={GlobalStyles.smallLabel}>Module {occurrenceLabel}</Text>

                                <Text style={GlobalStyles.smallLabel}>
                                    {typeof displayOccasion.occasion.classroomId === 'object' ? displayOccasion.occasion.classroomId.name : 'Unknown Classroom'}
                                </Text>

                            </View>
                            <View style={GlobalStyles.nameContainer}>
                                <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={GlobalStyles.mediumProfilePicture} />
                                <View style={{ flexDirection: 'column', gap: 5 }}>
                                    <Text style={GlobalStyles.mediumLabel}>
                                        {typeof displayOccasion.occasion.teacherId === 'object' ? displayOccasion.occasion.teacherId.name : "Unknown Teacher"}
                                    </Text>
                                    <Text style={GlobalStyles.smallLabel}>{dayLabel}, {displayOccasion.occasion.startTime} - {displayOccasion.occasion.endTime}</Text>


                                </View>
                            </View>

                            {userData.type === "TEACHER" &&
                                (typeof displayOccasion.occasion.teacherId === "string"
                                    ? displayOccasion.occasion.teacherId === userData._id
                                    : displayOccasion.occasion.teacherId._id === userData._id) && (
                                    <View style={[GlobalStyles.buttonContainer, { gap: 8, justifyContent: 'flex-end' }]}>
                                        <TouchableOpacity style={[GlobalStyles.defaultButton, GlobalStyles.endButton]} onPress={() => console.log("Dismissed")}>
                                            <Text style={GlobalStyles.mediumLabel}>Dismiss</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={GlobalStyles.defaultButton} onPress={() => handleStartClass(displayOccasion.occasion)}>
                                            <Text style={GlobalStyles.mediumLabel}>Start Class</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                        </View>

                    </View>

                </Animatable.View>

            </>
        )
    }
};

export default NextOccasionCard;