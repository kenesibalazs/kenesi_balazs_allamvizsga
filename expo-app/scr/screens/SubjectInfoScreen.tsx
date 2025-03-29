import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SubjectInfoScreenRouteProp } from '../types/navigationTypes';
import { Header, SmallDataCard, SafeAreaWrapper } from '../components/common';

const SubjectInfoScreen = () => {
    const route = useRoute<SubjectInfoScreenRouteProp>();
    const { subject } = route.params;

    return (
        <SafeAreaWrapper>
            <Header title="Subject Info" leftIcon="arrow-back" />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <SmallDataCard label="Name" data={[{ value: subject.name }]} />
            </ScrollView>
        </SafeAreaWrapper>
    );
};

export default SubjectInfoScreen;