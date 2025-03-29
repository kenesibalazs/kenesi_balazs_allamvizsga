import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { UserInfoScreenRouteProp } from '../types/navigationTypes';
import { Header, SmallDataCard, SafeAreaWrapper, UserProfileCard } from '../components/common';

const UserInfoScreen = () => {
    const route = useRoute<UserInfoScreenRouteProp>();
    const { user } = route.params;

    return (
        // userId, name, type, neptunCode, majors, imageUri 
        <SafeAreaWrapper>
            <Header title="User Info" leftIcon="arrow-back" />
            <UserProfileCard
               userId={user._id}
               name={user.name}
               type={user.type}
               imageUri={user.profileImage}
            />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <SmallDataCard label="Name" data={[{ value: user.name }]} />
            </ScrollView>
        </SafeAreaWrapper>
    );
};

export default UserInfoScreen;