import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { Header, SafeAreaWrapper, ExtendableDataCard } from '../components/common';
import { useTimetableData } from '../hooks';
import { groupBySubjectId } from '../utils';
import { Occasion } from '../types/apiTypes';
import { OccasionHistoryNavigateProps } from '../types/navigationTypes';

import { Theme } from "../styles/theme";


const HistoryScreen: React.FC = () => {
    const { occasions } = useTimetableData();
    const navigation = useNavigation<OccasionHistoryNavigateProps>();

    const groupedOccasions = groupBySubjectId(occasions);

    const onOccasionPress = (occasion: Occasion) => {
        navigation.navigate("OccasionHistory", { occasion });
    };

    return (
        <SafeAreaWrapper>
            <Header title="History" />
            <View style={styles.container}>
                <Text style={styles.activeLabel}>{'Subjects'.toUpperCase()}</Text>
                {Object.keys(groupedOccasions).map((subjectId) => {
                    const subjectOccasions = groupedOccasions[subjectId];
                    const subject = subjectOccasions[0].subjectId;

                    return (
                        <>
                            <ExtendableDataCard
                                key={subjectId}
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
                                                onOccasionPress(occasion)
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

    activeLabel: {
        fontSize: Theme.fontSize.large,
        marginBottom: Theme.margin.small,
        fontFamily: Theme.fonts.bold,
        color: Theme.colors.textLight,
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
