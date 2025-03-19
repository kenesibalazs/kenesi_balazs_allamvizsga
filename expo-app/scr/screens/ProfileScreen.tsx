import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Header, SafeAreaWrapper } from '../components/common';
import { SmallDataCard, UserProfileCard } from '../components/common';
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
            <Header title="My Profile" />

            <UserProfileCard 
                name={userData.name}
                type={userData.type}
                neptunCode={userData.neptunCode}
            />
          

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
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

            {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity> */}
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({

    container: {
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
