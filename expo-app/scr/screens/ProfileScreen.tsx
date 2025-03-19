import React from 'react';
import { View, Text, StyleSheet, Button, ViewStyle, TextStyle, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

import { Header, SafeAreaWrapper } from '../components/common';
import { University } from '../types/apiTypes';

const ProfileScreen: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaWrapper>


            <Header title="Profile" />
            <View style={styles.container}>

                <Text>
                    {userData.name} {userData.type}
                </Text>

                <Text>{userData.neptunCode}</Text>
                <Text>
                    {typeof userData.universityId === "object" ? userData.universityId.name : "Unknown University"}
                </Text>

                {userData.majors.length > 0 ? (
                    userData.majors.map((major) => (
                        <Text key={major._id}>{major.name}</Text>
                    ))
                ) : (
                    <Text>No majors assigned</Text>
                )}

                {userData.groups.length > 0 ? (
                    userData.majors.map((group) => (
                        <Text key={group._id}>{group.name}</Text>
                    ))
                ) : (
                    <Text>No majors assigned</Text>
                )}



                <Button title="Logout" onPress={handleLogout} />
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    safeTop: {
        backgroundColor: "#067BC2",
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default ProfileScreen;
