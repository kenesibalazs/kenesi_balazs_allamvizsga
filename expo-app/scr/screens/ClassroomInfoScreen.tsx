import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ClassroomInfoScreenRouteProp } from '../types/navigationTypes';
import { Header, SmallDataCard, SafeAreaWrapper } from '../components/common';

const ClassroomInfoScreen = () => {
    const route = useRoute<ClassroomInfoScreenRouteProp>();
    const { classroom } = route.params;

    return (
        <SafeAreaWrapper>
            <Header title="Classroom Info" leftIcon="arrow-back" />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <SmallDataCard label="Name" data={[{ value: classroom.name }]} />
            </ScrollView>
        </SafeAreaWrapper>
    );
};

export default ClassroomInfoScreen;