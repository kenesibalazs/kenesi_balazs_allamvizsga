import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Occasion } from '../types/apiTypes';
import useAttendance from '../hooks/useAttendance';
import { useAuth } from '../context/AuthContext';
import { countOccurrences, getDayLabel, getTimeDifference } from '../utils/occasionUtils';

interface NextOccasionProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}

const NextOccasionCard: React.FC<NextOccasionProps> = ({ occasions }) => {
    const [displayOccasion, setDisplayOccasion] = useState<NextOccasionProps['occasions'][0] | null>(null);
    const [occurrenceLabel, setOccurrenceLabel] = useState<number>();
    const [dayLabel, setDayLabel] = useState<string>('');
    const [nextOrOngoingLabel, setNextOrOngoingLabel] = useState<string>('');
    const [timeLabel, setTimeLabel] = useState<string>('');
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const { userData, logout } = useAuth();
    const { createNewAttendance, loading, error } = useAttendance();

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    }, [userData, logout]);

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
        if (!displayOccasion) return;
        setOccurrenceLabel(countOccurrences(displayOccasion.occasion, new Date()));
    }, [displayOccasion]);

    if (!displayOccasion) return null;

    return (
        <View>
            <LinearGradient colors={['#4EB3DE', '#5E94AB']} style={styles.gradientContainer}>
                <View style={styles.classHeader}>
                    <Ionicons name="book-outline" size={20} color="#333" style={styles.classHeaderIcon} />
                    <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Not Started Yet</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.classTitle}>
                        {typeof displayOccasion.occasion.subjectId === 'object' ? displayOccasion.occasion.subjectId.name : 'Unknown Subject'}
                        <Text style={styles.occurrenceLabel}>{occurrenceLabel}</Text>
                    </Text>
                    <Text style={styles.classTime}>{dayLabel}, {displayOccasion.occasion.startTime} - {displayOccasion.occasion.endTime}</Text>
                    <Text style={styles.classRoom}>{displayOccasion.occasion.classroomId}</Text>
                    <View style={styles.teacherContainer}>
                        <Image source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }} style={styles.teacherImage} />
                        <Text style={styles.teacherName}>
                            {typeof displayOccasion.occasion.teacherId == 'object' ? displayOccasion.occasion.teacherId.name : "Unknonw Teacher"}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    classHeaderIcon: {
        backgroundColor: '#AFD2E9',
        padding: 12,
        fontSize: 24,
        borderRadius: 16,
        margin: 16,
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
        padding: 16,
    },
    classTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 4,
        color: 'white',
    },
    occurrenceLabel: {
        fontSize: 12,
        fontWeight: '500',
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
});

export default NextOccasionCard;
