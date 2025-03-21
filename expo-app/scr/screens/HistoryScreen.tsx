import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useVerifySignature } from '../hooks/useVerifySignature';
import { useAuth } from '../context/AuthContext';
import { Header, SafeAreaWrapper, SmallDataCard, ExtendableDataCard } from '../components/common';
import { useTimetableData } from '../hooks/useTimetableData';
import { Theme } from "../styles/theme";
import { Occasion } from '../types/apiTypes';

const HistoryScreen: React.FC = () => {
    const { occasions } = useTimetableData();
    const { userData, logout } = useAuth();
    const { isValid, loading, error, checkSignature } = useVerifySignature();

    // Grouping occasions by subjectId
    const groupBySubjectId = (occasions: Occasion[]) => {
        return occasions.reduce((acc: any, occasion: Occasion) => {
            const subjectId = typeof occasion.subjectId === 'string' ? occasion.subjectId : occasion.subjectId._id; // Use subjectId._id for grouping
            if (!acc[subjectId]) {
                acc[subjectId] = [];
            }
            acc[subjectId].push(occasion);
            return acc;
        }, {});
    };

    // Grouped occasions by subjectId
    const groupedOccasions = groupBySubjectId(occasions);

    // State to track expanded subjects
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

    // Toggle function to expand/collapse subjects
    const toggleSubject = (subjectId: string) => {
        setExpandedSubject(prev => (prev === subjectId ? null : subjectId));
    };

    return (
        <SafeAreaWrapper>
            <Header title="History" />
            <View style={styles.container}>
                {Object.keys(groupedOccasions).map((subjectId) => {
                    const subjectOccasions = groupedOccasions[subjectId];
                    const subject = subjectOccasions[0].subjectId;

                    return (

                        <>
                            <ExtendableDataCard
                                data={[
                                    {
                                        subjectId: subjectId,
                                        subjectName: typeof subject === 'string' ? subject : subject.name,
                                        occasions: subjectOccasions.map((occasion) => ({
                                            occasionId: occasion._id,
                                            startTime: occasion.startTime,
                                            endTime: occasion.endTime,
                                            groups: typeof occasion.groupIds === 'string' ? [occasion.groupIds] : occasion.groupIds,
                                            onClickFunction: () => {
                                                console.log(`Occasion ${occasion._id} clicked!`);
                                            },
                                        })),
                                    },
                                ]}
                            />



                        </>
                    );
                })}             
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    subjectContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        borderRadius: 8,
        backgroundColor: Theme.colors.primary,
    },
    subjectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Theme.colors.text.main,
    },
    occasionList: {
        marginTop: 10,
    },
    occasionContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: Theme.colors.borderColor,
        borderRadius: 8,
        backgroundColor: Theme.colors.primary,
    },
    text: {
        color: Theme.colors.text.main,
        fontSize: 14,
        marginBottom: 4,
    },
    commentContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderColor: Theme.colors.borderColor,
    },
    repetitionContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        backgroundColor: Theme.colors.borderColor,
        marginTop: 10,
        marginBottom: 10,
    },

    animation: {
        width: 100,
        height: 100,
    },
});

export default HistoryScreen;
