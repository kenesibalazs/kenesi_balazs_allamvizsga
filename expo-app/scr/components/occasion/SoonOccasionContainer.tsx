import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



import { SoonOccasionContainerProps, Occasion } from '../../types';



const SoonOccasionContainer: React.FC<SoonOccasionContainerProps> = ({ occasions }) => {
    const [displayableOccasions, setDisplayableOccasions] = useState<Occasion[]>([]);

    useEffect(() => {
        if (occasions.length === 0) return;

        const today = new Date().toDateString();
        const filteredOccasions = occasions
            .filter(occasion => occasion.date.toDateString() === today)
            .map(occasion => occasion.occasion);

        setDisplayableOccasions(filteredOccasions);
    }, [occasions]);

    return (
        <View>
            <Text style={styles.sectionLabel}>Soon</Text>
            <ScrollView style={styles.container} horizontal showsHorizontalScrollIndicator={false}>
                {displayableOccasions.length > 0 ? (
                    displayableOccasions.map((occasion, index) => (
                        <View 
                            key={index}
                            style={styles.occasionCard}
                        >
                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={16} color="#fff" />
                                <Text style={styles.occasionTime}>
                                    {occasion.startTime} - {occasion.endTime}
                                </Text>
                            </View>
                            <Text style={styles.occasionTitle}>
                                {typeof occasion.subjectId === 'object' ? occasion.subjectId.name : 'Unknown Subject'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noOccasionText}>No upcoming occasions today.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingVertical: 4,
        paddingLeft: 16,
    },
    sectionLabel: {
        fontSize: 22,
        fontWeight: '700',
        paddingHorizontal: 16,
        color: '#333',
    },
    occasionCard: {
        marginBottom: 10,
        minWidth: 260,
        height: 120,
        marginRight: 16,
        borderRadius: 24,
        padding: 16,
        justifyContent: 'space-between',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: "flex-start",
        gap: 8,
    },
    occasionTime: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    occasionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    noOccasionText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SoonOccasionContainer;
