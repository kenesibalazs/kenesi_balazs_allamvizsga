import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Header, SafeAreaWrapper } from '../components/common';
import { SmallDataCard } from '../components/common';
import { Theme } from '../styles/theme';

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

            <View style={styles.profileCard}>
                <Image
                    source={{ uri: 'https://assets.codepen.io/285131/hat-man.png' }}
                    style={styles.userImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userType}>{userData.type}</Text>
                    <Text style={styles.neptunCode}>Neptun Code: {userData.neptunCode}</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <SmallDataCard
                    leading={{ iconName: "school-outline" }}
                    label="UNIVERSITY"
                    data={[{
                        value: userData.universityId && typeof userData.universityId === "object" && "name" in userData.universityId
                            ? userData.universityId.name
                            : "Unknown University",

                        onPressFunction: () => {
                            console.log("University clicked:", userData.universityId);
                        }
                    }]}
                />

                <SmallDataCard
                    leading={{ iconName: "book-outline" }}
                    label="MAJORS"
                    data={
                        (userData.majors ?? []).length > 0
                            ? userData.majors.map((major) => ({
                                value: major?.name || "Unknown Major",
                                onPressFunction: () => console.log("Major clicked:", major),
                            }))
                            : [{ value: "No majors assigned" }]
                    }
                    showWarning={userData.majors.length === 0}
                    warningMessage="Please update you majors"
                    warningFunction={() => alert("Redirecting to major settings...")}
                />

                <SmallDataCard
                    leading={{ iconName: "people-outline" }}
                    label="GROUPS"
                    data={
                        (userData.groups ?? []).length > 0
                            ? userData.groups.map((group) => ({
                                value: group?.name || "Unknown Group",
                                onPressFunction: () => console.log("Group clicked:", group),
                            }))
                            : [{ value: "No groups assigned" }]
                    }
                    showWarning={userData.groups.length === 0}
                    warningMessage="Please update you groups"
                    warningFunction={() => alert("Redirecting to group settings...")}
                />


               

            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: Theme.padding.medium,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: Theme.borderRadius.full,
        marginRight: Theme.padding.medium,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize:  Theme.fontSize.large,
        color: Theme.colors.text.main,
        fontFamily: Theme.fonts.extraBold,
    },
    userType: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
    },
    neptunCode: {
        fontSize: Theme.fontSize.medium,
        color: Theme.colors.text.light,
        fontFamily: Theme.fonts.regular,
    },
    contentContainer: {
        padding: Theme.padding.medium
    },

    logoutButton: {
        marginTop: 30,
        backgroundColor: '#D9534F',
        padding: Theme.padding.medium,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
